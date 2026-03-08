// @ts-nocheck
import { NextResponse } from "next/server";

let cache: { data: any; ts: number } = { data: null, ts: 0 };
const TTL = 60 * 60 * 1000;

export async function GET() {
  try {
    if (cache.data && Date.now() - cache.ts < TTL) {
      return NextResponse.json(cache.data);
    }

    const key = process.env.FMP_API_KEY;
    if (!key) return NextResponse.json({ error: "No FMP key" }, { status: 500 });

    const today = new Date().toISOString().split("T")[0];
    const next14 = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];

    const url = `https://financialmodelingprep.com/api/v3/economic_calendar?from=${today}&to=${next14}&apikey=${key}`;
    const res = await fetch(url);
    const raw = await res.json();

    const HIGH_KEYWORDS = [
      "gdp","cpi","federal funds","fomc","non-farm","nonfarm","payroll",
      "retail sales","pce","ppi","unemployment rate","interest rate",
      "consumer price","producer price","core inflation","initial jobless"
    ];

    const events = (Array.isArray(raw) ? raw : [])
      .filter(e => {
        const name = (e.event || "").toLowerCase();
        return HIGH_KEYWORDS.some(k => name.includes(k));
      })
      .map(e => {
        const actual = e.actual != null ? parseFloat(e.actual) : null;
        const estimate = e.estimate != null ? parseFloat(e.estimate) : null;
        let bias = "pending";
        if (actual !== null && estimate !== null) {
          bias = actual > estimate ? "beat" : "miss";
        }
        return {
          date: (e.date || "").split(" ")[0],
          time: e.time || "8:30 AM",
          name: e.event || "",
          actual: e.actual ?? null,
          estimate: e.estimate ?? null,
          previous: e.previous ?? null,
          impact: e.impact || "High",
          bias,
        };
      })
      .filter(e => e.date)
      .slice(0, 20);

    const todayEvents = events.filter(e => e.date === today);
    const upcomingEvents = events.filter(e => e.date > today);
    const result = { today: todayEvents, upcoming: upcomingEvents, fetched: new Date().toISOString(), raw_count: Array.isArray(raw) ? raw.length : 0 };

    cache.data = result;
    cache.ts = Date.now();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
