// @ts-nocheck
import { NextResponse } from "next/server";

const CACHE: { data: any; ts: number } = { data: null, ts: 0 };
const TTL = 30 * 60 * 1000; // 30 min cache

export async function GET() {
  try {
    if (CACHE.data && Date.now() - CACHE.ts < TTL) {
      return NextResponse.json(CACHE.data);
    }

    const key = process.env.NEWS_API_KEY;
    if (!key) return NextResponse.json({ error: "No News API key" }, { status: 500 });

    const res = await fetch(
      `https://newsapi.org/v2/everything?q=SPY+OR+Federal+Reserve+OR+CPI+OR+GDP+OR+inflation+OR+market&language=en&sortBy=publishedAt&pageSize=8&apiKey=${key}`
    );
    const raw = await res.json();

    const articles = (raw.articles || []).map(a => ({
      title: a.title,
      source: a.source?.name,
      url: a.url,
      publishedAt: a.publishedAt,
      // Simple sentiment: look for bearish/bullish keywords
      sentiment: (() => {
        const t = (a.title || "").toLowerCase();
        const bearish = ["fall","drop","crash","recession","decline","miss","weak","fear","sell","down"];
        const bullish = ["rise","gain","rally","beat","strong","cut","boost","surge","bull","up"];
        const bScore = bearish.filter(w => t.includes(w)).length;
        const uScore = bullish.filter(w => t.includes(w)).length;
        return bScore > uScore ? "bearish" : uScore > bScore ? "bullish" : "neutral";
      })(),
    }));

    const result = { articles, fetched: new Date().toISOString() };
    CACHE.data = result;
    CACHE.ts = Date.now();

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
