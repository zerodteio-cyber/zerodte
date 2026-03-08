// @ts-nocheck
import { NextResponse } from "next/server";

let cache: { data: any; ts: number } = { data: null, ts: 0 };
const TTL = 30 * 60 * 1000;

export async function GET() {
  try {
    if (cache.data && Date.now() - cache.ts < TTL) {
      return NextResponse.json(cache.data);
    }

    const key = process.env.NEWS_API_KEY;
    if (!key) return NextResponse.json({ error: "No News API key" }, { status: 500 });

    // Tight US financial markets query
    const query = encodeURIComponent('("S&P 500" OR "SPY" OR "Federal Reserve" OR "stock market" OR "Wall Street" OR "CPI" OR "GDP" OR "inflation" OR "interest rates" OR "FOMC" OR "earnings")');
    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&domains=reuters.com,bloomberg.com,cnbc.com,marketwatch.com,wsj.com,ft.com,finance.yahoo.com,investing.com,barrons.com,thestreet.com&apiKey=${key}`;

    const res = await fetch(url);
    const raw = await res.json();

    // Fallback: if domains filter yields nothing, try top headlines
    let articles = raw.articles || [];
    if (articles.length === 0) {
      const fallback = await fetch(`https://newsapi.org/v2/top-headlines?category=business&language=en&country=us&pageSize=8&apiKey=${key}`);
      const fb = await fallback.json();
      articles = fb.articles || [];
    }

    const bearish = ["fall","drop","crash","recession","decline","miss","weak","fear","sell","plunge","tumble","slide","loss","down","cut","layoff","warning"];
    const bullish = ["rise","gain","rally","beat","strong","cut rates","boost","surge","bull","up","high","record","growth","beat","hire","profit"];

    const mapped = articles
      .filter(a => a.title && !a.title.includes("[Removed]"))
      .map(a => ({
        title: a.title,
        source: a.source?.name,
        url: a.url,
        publishedAt: a.publishedAt,
        sentiment: (() => {
          const t = (a.title + " " + (a.description || "")).toLowerCase();
          const b = bearish.filter(w => t.includes(w)).length;
          const u = bullish.filter(w => t.includes(w)).length;
          return b > u ? "bearish" : u > b ? "bullish" : "neutral";
        })(),
      }))
      .slice(0, 8);

    const result = { articles: mapped, fetched: new Date().toISOString() };
    cache.data = result;
    cache.ts = Date.now();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
