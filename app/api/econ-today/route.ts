// @ts-nocheck
import { NextResponse } from "next/server";

let cache: { data: any; ts: number } = { data: null, ts: 0 };
const TTL = 60 * 60 * 1000;

// Hardcoded high-impact 2026 calendar — always accurate
const HARDCODED = [
  { date:"2026-03-11", time:"8:30 AM", name:"CPI (Feb)", type:"cpi", impact:"HIGH" },
  { date:"2026-03-12", time:"8:30 AM", name:"PPI (Feb)", type:"ppi", impact:"MED" },
  { date:"2026-03-17", time:"8:30 AM", name:"Retail Sales (Feb)", type:"retail", impact:"MED" },
  { date:"2026-03-18", time:"2:00 PM", name:"FOMC Rate Decision", type:"fed", impact:"HIGH" },
  { date:"2026-03-27", time:"8:30 AM", name:"PCE Inflation (Feb)", type:"pce", impact:"HIGH" },
  { date:"2026-04-03", time:"8:30 AM", name:"NFP (Mar Jobs)", type:"nfp", impact:"HIGH" },
  { date:"2026-04-10", time:"8:30 AM", name:"CPI (Mar)", type:"cpi", impact:"HIGH" },
  { date:"2026-04-15", time:"8:30 AM", name:"Retail Sales (Mar)", type:"retail", impact:"MED" },
  { date:"2026-04-29", time:"8:30 AM", name:"GDP Q1 2026 (Advance)", type:"gdp", impact:"HIGH" },
  { date:"2026-04-29", time:"2:00 PM", name:"FOMC Rate Decision", type:"fed", impact:"HIGH" },
  { date:"2026-04-30", time:"8:30 AM", name:"PCE Inflation (Mar)", type:"pce", impact:"HIGH" },
  { date:"2026-05-08", time:"8:30 AM", name:"NFP (Apr Jobs)", type:"nfp", impact:"HIGH" },
  { date:"2026-05-13", time:"8:30 AM", name:"CPI (Apr)", type:"cpi", impact:"HIGH" },
  { date:"2026-06-05", time:"8:30 AM", name:"NFP (May Jobs)", type:"nfp", impact:"HIGH" },
  { date:"2026-06-10", time:"8:30 AM", name:"CPI (May)", type:"cpi", impact:"HIGH" },
  { date:"2026-06-17", time:"2:00 PM", name:"FOMC Rate Decision", type:"fed", impact:"HIGH" },
  { date:"2026-07-10", time:"8:30 AM", name:"NFP (Jun Jobs)", type:"nfp", impact:"HIGH" },
  { date:"2026-07-14", time:"8:30 AM", name:"CPI (Jun)", type:"cpi", impact:"HIGH" },
  { date:"2026-07-29", time:"8:30 AM", name:"GDP Q2 2026 (Advance)", type:"gdp", impact:"HIGH" },
  { date:"2026-07-29", time:"2:00 PM", name:"FOMC Rate Decision", type:"fed", impact:"HIGH" },
];

async function getActualFromFMP(key: string, today: string) {
  try {
    // Try to get today's actuals from FMP (works on paid tier)
    const url = `https://financialmodelingprep.com/api/v3/economic_calendar?from=${today}&to=${today}&apikey=${key}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return {};
    // Return a map of event name -> {actual, estimate, previous}
    const map: Record<string, any> = {};
    data.forEach((e: any) => {
      if (e.actual != null) {
        map[e.event] = {
          actual: e.actual,
          estimate: e.estimate ?? null,
          previous: e.previous ?? null,
          bias: parseFloat(e.actual) > parseFloat(e.estimate || 0) ? "beat" : "miss",
        };
      }
    });
    return map;
  } catch { return {}; }
}

export async function GET() {
  try {
    if (cache.data && Date.now() - cache.ts < TTL) {
      return NextResponse.json(cache.data);
    }

    const key = process.env.FMP_API_KEY || "";
    const today = new Date().toISOString().split("T")[0];

    // Get any actuals FMP has for today
    const actuals = key ? await getActualFromFMP(key, today) : {};

    // Merge hardcoded calendar with any live actuals
    const events = HARDCODED.map(e => ({
      ...e,
      actual: actuals[e.name]?.actual ?? null,
      estimate: actuals[e.name]?.estimate ?? null,
      previous: actuals[e.name]?.previous ?? null,
      bias: actuals[e.name]?.bias ?? "pending",
    }));

    const todayEvents = events.filter(e => e.date === today);
    const upcomingEvents = events.filter(e => e.date > today);

    const result = {
      today: todayEvents,
      upcoming: upcomingEvents.slice(0, 10),
      fetched: new Date().toISOString(),
      source: "hardcoded+fmp",
    };

    cache.data = result;
    cache.ts = Date.now();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
