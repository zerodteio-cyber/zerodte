// @ts-nocheck
import { NextResponse } from "next/server";

let cache: { data: any; ts: number } = { data: null, ts: 0 };
const TTL = 15 * 60 * 1000; // 15 min cache

export async function GET() {
  try {
    if (cache.data && Date.now() - cache.ts < TTL) {
      return NextResponse.json(cache.data);
    }

    // Fetch news headlines to summarize
    const newsRes = await fetch(`${process.env.NEXT_PUBLIC_URL || "https://zerodte.io"}/api/market-news`);
    const newsData = await newsRes.json();
    const articles = (newsData.articles || []).slice(0, 6);

    // Fetch econ events
    const econRes = await fetch(`${process.env.NEXT_PUBLIC_URL || "https://zerodte.io"}/api/econ-today`);
    const econData = await econRes.json();
    const todayEvents = econData.today || [];
    const upcomingEvents = (econData.upcoming || []).slice(0, 3);

    // Build context for Claude
    const headlineList = articles.map(a => `- ${a.title} (${a.sentiment})`).join("\n");
    const todayEcon = todayEvents.length > 0
      ? todayEvents.map(e => `${e.name} at ${e.time}${e.actual ? ` — Actual: ${e.actual}, Est: ${e.estimate}, ${e.bias.toUpperCase()}` : " — PENDING"}`).join(", ")
      : "No major economic events today.";
    const upcomingEcon = upcomingEvents.map(e => `${e.name} on ${e.date}`).join(", ");

    const prompt = `You are the Quant Analyst for ZeroDTE.io, a 0DTE SPY options trading platform. Your job is to give a concise pre-market or intraday intelligence briefing based on current market headlines and economic data.

Today\'s Economic Events: ${todayEcon}
Upcoming This Week: ${upcomingEcon || "None"}

Latest Market Headlines:
${headlineList}

Write a sharp, concise analyst briefing (3-4 sentences max) covering:
1. Overall market bias right now (bullish/bearish/neutral) and why
2. Any key macro catalyst affecting SPY today
3. One specific thing 0DTE traders should watch

Be direct, clinical, and specific. No fluff. Use trader language. End with a one-line bias statement like "BIAS: BEARISH — watch for puts on failed bounces" or "BIAS: BULLISH — calls favored above VWAP."`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const aiData = await response.json();
    const summary = aiData?.content?.[0]?.text || "Market data loading — check back shortly.";

    // Extract bias line
    const biasMatch = summary.match(/BIAS:\s*([^
]+)/i);
    const bias = biasMatch ? biasMatch[1].trim() : null;
    const biasDir = bias?.toLowerCase().includes("bullish") ? "bullish"
                  : bias?.toLowerCase().includes("bearish") ? "bearish"
                  : "neutral";

    const result = {
      summary,
      bias,
      biasDir,
      headlines: articles.length,
      generatedAt: new Date().toISOString(),
    };

    cache.data = result;
    cache.ts = Date.now();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({
      summary: "Unable to generate summary at this time.",
      bias: null,
      biasDir: "neutral",
      error: String(err),
    }, { status: 500 });
  }
}
