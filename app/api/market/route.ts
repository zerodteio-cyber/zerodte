import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [spyRes, vixRes] = await Promise.all([
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1m&range=1d", {
        headers: { "User-Agent": "Mozilla/5.0" },
      }),
      fetch("https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1m&range=1d", {
        headers: { "User-Agent": "Mozilla/5.0" },
      }),
    ]);
    const spyData = await spyRes.json();
    const vixData = await vixRes.json();
    const spy = spyData.chart.result[0].meta.regularMarketPrice;
    const vix = vixData.chart.result[0].meta.regularMarketPrice;
    return NextResponse.json({ spy, vix });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
