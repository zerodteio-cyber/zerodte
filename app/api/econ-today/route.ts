// @ts-nocheck
import { NextResponse } from "next/server";

const CACHE: { data: any; ts: number } = { data: null, ts: 0 };
const TTL = 60 * 60 * 1000; // 1 hour cache

export async function GET() {
  try {
    // Return cache if fresh
    if (CACHE.data && Date.now() - CACHE.ts < TTL) {
      return NextResponse.json(CACHE.data);
    }

    const key = process.env.FMP_API_KEY;
    if (!key) return NextResponse.json({ error: "No FMP key" }, { status: 500 });

    // Get today + next 7 days
    const today = new Date().toISOString().split("T")[0];
    const next7 = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/economic_calendar?from=${today}&to=${next7}&apikey=${key}`
    );
    const raw = await res.json();

    // Filter to high-impact events only
    const HIGH_IMPACT_NAMES = [
      "gdp","cpi","federal","fomc","non-farm","nonfarm","payroll",
      "retail sales","pce","ppi","unemployment","interest rate",
      "inflation","consumer price","producer price"
    ];

    const events = (Array.isArray(raw) ? raw : [])
      .filter(e => {
        const name = (e.event || "").toLowerCase();
        return HIGH_IMPACT_NAMES.some(k => name.includes(k));
      })
      .map(e => ({
        date: e.date?.split(" ")[0],
        time: e.date?.split(" ")[1] || "8:30 AM",
        name: e.event,
        actual: e.actual ?? null,
        estimate: e.estimate ?? null,
        previous: e.previous ?? null,
        impact: e.impact || "High",
        // Auto-detect bias from actual vs estimate
        bias: e.actual != null && e.estimate != null
          ? (parseFloat(e.actual) > parseFloat(e.estimate) ? "beat" : "miss")
          : "pending",
      }))
      .slice(0, 20);

    const todayEvents = events.filter(e => e.date === today);
    const upcomingEvents = events.filter(e => e.date > today);

    const result = { today: todayEvents, upcoming: upcomingEvents, fetched: new Date().toISOString() };
    CACHE.data = result;
    CACHE.ts = Date.now();

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
