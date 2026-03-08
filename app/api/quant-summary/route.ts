// @ts-nocheck
import { NextResponse } from "next/server";

let cache: { data: any; ts: number } = { data: null, ts: 0 };
const TTL = 15 * 60 * 1000;

export async function GET() {
  try {
    if (cache.data && Date.now() - cache.ts < TTL) {
      return NextResponse.json(cache.data);
    }
    const base = process.env.NEXT_PUBLIC_URL || "https://zerodte.io";
    const [newsRes, econRes] = await Promise.all([
      fetch(`${base}/api/market-news`),
      fetch(`${base}/api/econ-today`),
    ]);
    const newsData = await newsRes.json();
    const econData = await econRes.json();
    const articles = (newsData.articles || []).slice(0, 6);
    const todayEvents = econData.today || [];
    const upcomingEvents = (econData.upcoming || []).slice(0, 3);
    const headlineList = articles.map((a: any) => `- ${a.title} (${a.sentiment})`).join("\n");
    const todayEcon = todayEvents.length > 0
      ? todayEvents.map((e: any) => `${e.name} at ${e.time}${e.actual ? ` — Actual: ${e.actual}, ${e.bias.toUpperCase()}` : " — PENDING"}`).join(", ")
      : "No major economic events today.";
    const upcomingEcon = upcomingEvents.map((e: any) => `${e.name} on ${e.date}`).join(", ");

    const prompt = `You are the Quant Analyst for ZeroDTE.io, a 0DTE SPY options trading platform. Give a concise pre-market or intraday intelligence briefing.

Today's Economic Events: ${todayEcon}
Upcoming This Week: ${upcomingEcon || "None"}

Latest Market Headlines:
${headlineList}

Write a sharp 3-4 sentence analyst briefing covering: (1) overall market bias and why, (2) key macro catalyst affecting SPY today, (3) one specific thing 0DTE traders should watch.

Be direct and clinical. Use trader language. End with exactly this format on its own line: BIAS: [BULLISH/BEARISH/NEUTRAL] — [one line reason]`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 350,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const aiData = await response.json();
    const summary = aiData?.content?.[0]?.text || "Market data loading — check back shortly.";
    const biasMatch = summary.match(/BIAS:\s*(BULLISH|BEARISH|NEUTRAL)/i);
    const biasWord = biasMatch ? biasMatch[1].toUpperCase() : "NEUTRAL";
    const biasDir = biasWord === "BULLISH" ? "bullish" : biasWord === "BEARISH" ? "bearish" : "neutral";
    const result = { summary, bias: biasWord, biasDir, headlines: articles.length, generatedAt: new Date().toISOString() };
    cache.data = result;
    cache.ts = Date.now();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ summary: "Unable to generate summary at this time.", bias: "NEUTRAL", biasDir: "neutral", error: String(err) }, { status: 500 });
  }
}
