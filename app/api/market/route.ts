import { NextResponse } from "next/server";

async function fetchQuote(symbol: string) {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`,
    { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }
  );
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) return null;
  const price = parseFloat(meta.regularMarketPrice.toFixed(2));
  const prev = parseFloat((meta.previousClose || meta.chartPreviousClose || price).toFixed(2));
  const change = parseFloat((price - prev).toFixed(2));
  const changePct = parseFloat(((change / prev) * 100).toFixed(2));
  return { price, prev, change, changePct };
}

export async function GET() {
  try {
    const [spy, qqq, spx, vix] = await Promise.all([
      fetchQuote("SPY"),
      fetchQuote("QQQ"),
      fetchQuote("^GSPC"),
      fetchQuote("^VIX"),
    ]);
    return NextResponse.json({ spy, qqq, spx, vix });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
