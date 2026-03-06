import { NextResponse } from "next/server";

function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function calcGamma(S: number, K: number, T: number, r: number, sigma: number): number {
  if (T <= 0 || sigma <= 0 || S <= 0 || K <= 0) return 0;
  try {
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    return normalPDF(d1) / (S * sigma * Math.sqrt(T));
  } catch { return 0; }
}

export async function GET() {
  try {
    const [spotRes, optRes] = await Promise.all([
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1m&range=1d", { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }),
      fetch("https://query1.finance.yahoo.com/v7/finance/options/SPY", { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 0 } }),
    ]);

    const spotData = await spotRes.json();
    const spotResult = spotData?.chart?.result?.[0];
    if (!spotResult) return NextResponse.json({ error: "Market closed or data unavailable", marketClosed: true });

    const spot = spotResult.meta.regularMarketPrice as number;
    const optData = await optRes.json();
    const chain = optData?.optionChain?.result?.[0];
    if (!chain || !chain.options?.[0]) return NextResponse.json({ error: "Options data unavailable — market may be closed", marketClosed: true, spot: parseFloat(spot.toFixed(2)) });

    const expirationDate = chain.expirationDates[0];
    const now = Date.now() / 1000;
    const T = Math.max((expirationDate - now) / (365 * 24 * 3600), 0.003);
    const r = 0.05;
    const calls = chain.options[0].calls || [];
    const puts = chain.options[0].puts || [];

    const gexMap: Record<number, { total: number; calls: number; puts: number }> = {};

    calls.forEach((c: {strike:number;openInterest:number;impliedVolatility:number}) => {
      const K = c.strike; const iv = Math.min(c.impliedVolatility || 0.3, 5); const oi = c.openInterest || 0;
      if (!gexMap[K]) gexMap[K] = { total: 0, calls: 0, puts: 0 };
      const gex = calcGamma(spot, K, T, r, iv) * oi * 100 * spot;
      gexMap[K].calls += gex; gexMap[K].total += gex;
    });

    puts.forEach((p: {strike:number;openInterest:number;impliedVolatility:number}) => {
      const K = p.strike; const iv = Math.min(p.impliedVolatility || 0.3, 5); const oi = p.openInterest || 0;
      if (!gexMap[K]) gexMap[K] = { total: 0, calls: 0, puts: 0 };
      const gex = calcGamma(spot, K, T, r, iv) * oi * 100 * spot;
      gexMap[K].puts -= gex; gexMap[K].total -= gex;
    });

    const strikes = Object.keys(gexMap).map(Number).sort((a, b) => a - b);
    const nearby = strikes.filter(k => k > spot - 30 && k < spot + 30);
    if (nearby.length === 0) return NextResponse.json({ error: "No strikes near spot", marketClosed: true, spot });

    const kingNode = nearby.reduce((best, k) => Math.abs(gexMap[k].total) > Math.abs(gexMap[best].total) ? k : best, nearby[0]);
    const callStrikes = nearby.filter(k => k > spot && gexMap[k].total > 0);
    const callWall = callStrikes.length > 0 ? callStrikes.reduce((best, k) => gexMap[k].total > gexMap[best].total ? k : best, callStrikes[0]) : Math.round(spot + 5);
    const putStrikes = nearby.filter(k => k < spot && gexMap[k].total < 0);
    const putWall = putStrikes.length > 0 ? putStrikes.reduce((best, k) => gexMap[k].total < gexMap[best].total ? k : best, putStrikes[0]) : Math.round(spot - 5);
    const hvl = nearby.reduce((best, k) => Math.abs(gexMap[k].total) < Math.abs(gexMap[best].total) ? k : best, nearby[0]);
    const totalGex = nearby.reduce((sum, k) => sum + gexMap[k].total, 0);
    const chartStrikes = nearby.map(k => ({ strike: k, gex: parseFloat((gexMap[k].total / 1e6).toFixed(2)), callGex: parseFloat((gexMap[k].calls / 1e6).toFixed(2)), putGex: parseFloat((gexMap[k].puts / 1e6).toFixed(2)) }));

    return NextResponse.json({ spot: parseFloat(spot.toFixed(2)), kingNode, callWall, putWall, hvl, totalGexM: parseFloat((totalGex / 1e6).toFixed(1)), netBias: totalGex > 0 ? "LONG GAMMA" : "SHORT GAMMA", chartStrikes, expiry: new Date(expirationDate * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }), marketClosed: false });
  } catch (e) {
    return NextResponse.json({ error: String(e), marketClosed: true }, { status: 200 });
  }
}
