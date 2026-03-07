"use client";
import { useState } from "react";

// ─── COMPLETE PATTERN LIBRARY ──────────────────────────────────────────────

const PATTERNS = {
  bullish: [
    { id: "hammer", name: "Hammer", score: 18, desc: "Long lower wick, small body at bottom. Sellers failed to break the level.", location: "At King Node / Green Support", strength: "HIGH" },
    { id: "bull_engulf", name: "Bullish Engulfing", score: 17, desc: "Small red candle fully swallowed by large green candle.", location: "At Support / King Node", strength: "HIGH" },
    { id: "morning_star", name: "Morning Star", score: 20, desc: "3 candles: large red + small doji body + large green. Strongest reversal.", location: "At Major Support", strength: "MAX" },
    { id: "three_soldiers", name: "Three White Soldiers", score: 16, desc: "3 consecutive green candles with higher closes. Magnet walk confirmed.", location: "Breaking Out of Base", strength: "HIGH" },
    { id: "piercing", name: "Piercing Line", score: 13, desc: "Green candle closes above 50% of previous red candle.", location: "At Support", strength: "MEDIUM" },
    { id: "inv_hammer", name: "Inverted Hammer", score: 11, desc: "Long upper wick at bottom. Secondary signal — confirm with next candle.", location: "At Support", strength: "MEDIUM" },
    // NEW PATTERNS
    { id: "vwap_reclaim", name: "VWAP Reclaim", score: 19, desc: "Price dips below VWAP, immediately reclaims it with a strong close above. Institutions defending average cost.", location: "At VWAP", strength: "MAX" },
    { id: "orb_bull", name: "ORB Breakout (Bull)", score: 17, desc: "Price breaks above the Opening Range High (9:30-10:00 candle range) with volume expansion. Directional day confirmed.", location: "Above ORH", strength: "HIGH" },
    { id: "sd_support", name: "Supply/Demand Support Reaction", score: 16, desc: "Price drops into a prior demand zone (area of prior strong buying), wicks down and closes back up. Institutional accumulation.", location: "At Demand Zone", strength: "HIGH" },
    { id: "liq_sweep_bull", name: "Liquidity Sweep Reversal (Bull)", score: 20, desc: "Price spikes below a key support/stops zone, sweeps the liquidity, then reverses hard back above. One of Bobby's core reads.", location: "Below Key Support", strength: "MAX" },
    { id: "failed_breakdown", name: "Failed Breakdown", score: 18, desc: "Price breaks below support, immediately reclaims it within 1-2 candles. Trap for shorts. Very high probability long.", location: "At Key Support", strength: "HIGH" },
    { id: "base_breakout", name: "Consolidation Base Breakout", score: 15, desc: "30-60 min tight range (spinning tops, low volume) followed by green candle breaking above the base. Classic reverse rug Phase 5.", location: "Above Base High", strength: "HIGH" },
  ],
  bearish: [
    { id: "shooting_star", name: "Shooting Star", score: 18, desc: "Long upper wick at TOP of move. Most common 0DTE top pattern. Critical at purple nodes.", location: "At Purple Ceiling / King Node", strength: "HIGH" },
    { id: "bear_engulf", name: "Bearish Engulfing", score: 17, desc: "Small green fully swallowed by large red candle.", location: "At Resistance / Purple Node", strength: "HIGH" },
    { id: "evening_star", name: "Evening Star", score: 20, desc: "3 candles: large green + small body + large red. Strongest bearish reversal at purple ceiling.", location: "At Major Resistance", strength: "MAX" },
    { id: "three_crows", name: "Three Black Crows", score: 16, desc: "3 consecutive red candles with lower closes. Momentum continuation — add to puts.", location: "Breaking Down from Base", strength: "HIGH" },
    { id: "dark_cloud", name: "Dark Cloud Cover", score: 13, desc: "Red opens above prev close, closes below midpoint.", location: "At Resistance", strength: "MEDIUM" },
    { id: "hanging_man", name: "Hanging Man", score: 11, desc: "Hammer shape at TOP of trend. Bearish warning — watch for confirmation.", location: "At Resistance", strength: "MEDIUM" },
    // NEW PATTERNS
    { id: "vwap_reject", name: "VWAP Rejection / Declining VWAP", score: 19, desc: "Price rallies up to a declining VWAP, prints shooting star or bearish engulf, reverses hard. -20 on all call setups when active.", location: "At Declining VWAP", strength: "MAX" },
    { id: "orb_bear", name: "ORB Breakdown (Bear)", score: 17, desc: "Price breaks below the Opening Range Low with volume. Bearish directional day confirmed. Puts on any bounce.", location: "Below ORL", strength: "HIGH" },
    { id: "sd_resistance", name: "Supply/Demand Resistance Reaction", score: 16, desc: "Price rallies into a prior supply zone (area of prior strong selling), wicks up and closes back down. Institutional distribution.", location: "At Supply Zone", strength: "HIGH" },
    { id: "liq_sweep_bear", name: "Liquidity Sweep Reversal (Bear)", score: 20, desc: "Price spikes above key resistance/stops, sweeps liquidity, reverses hard below. Trap for longs. Puts on the failure.", location: "Above Key Resistance", strength: "MAX" },
    { id: "flow_div_bear", name: "Options Flow Divergence (Bear)", score: 17, desc: "SPY price moving UP but large put buying or unusual bearish flow detected. Smart money disagrees with price action. High conviction short.", location: "At Resistance / Near Highs", strength: "HIGH" },
    { id: "gamma_wall_reject", name: "Gamma Wall Rejection", score: 19, desc: "Price approaches a massive purple node ($200K+), prints bearish candle, reverses. Almost impenetrable without catalyst.", location: "At Gamma Wall", strength: "MAX" },
  ],
  neutral: [
    { id: "doji", name: "Doji", score: 0, desc: "Open = Close. Pure indecision. Wait — next candle determines direction.", location: "Any", strength: "WAIT" },
    { id: "spinning_top", name: "Spinning Top", score: 0, desc: "Short body, equal shadows both sides. Pin day signal — reduce size.", location: "Any", strength: "WAIT" },
    { id: "inside_bar", name: "Inside Bar", score: 5, desc: "Entire candle contained within prior candle's range. Compression before expansion. Direction of break = trade direction.", location: "Any", strength: "WAIT" },
  ],
};

const SCORING_WEIGHTS = {
  king_node: 20,
  trinity: 15,
  pattern: 15,
  vix: 15,
  vwap: 10,
  node_value: 10,
  time_of_day: 10,
  day_of_week: 5,
  analyst_consensus: 5,
};

// ─── STYLES ────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&display=swap');
  :root { --green:#00ff41; --black:#0a0a0a; --dark:#111; --card:#141414; --border:#1f1f1f; --text:#e8e8e8; --muted:#666; --red:#ff3333; --yellow:#ffdd00; --purple:#8844aa; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--black); color:var(--text); font-family:'Space Mono',monospace; font-size:13px; }

  .sc-nav { display:flex; align-items:center; justify-content:space-between; padding:16px 40px; border-bottom:1px solid var(--border); background:rgba(10,10,10,0.95); position:sticky; top:0; z-index:50; }
  .sc-logo { color:var(--green); font-weight:700; letter-spacing:0.15em; font-size:13px; text-decoration:none; }
  .sc-nav-links { display:flex; gap:32px; list-style:none; }
  .sc-nav-links a { font-size:10px; color:var(--muted); text-decoration:none; letter-spacing:0.2em; text-transform:uppercase; transition:color 0.2s; }
  .sc-nav-links a:hover, .sc-nav-links a.active { color:var(--green); }

  .sc-wrap { max-width:1400px; margin:0 auto; padding:40px; display:grid; grid-template-columns:1fr 420px; gap:32px; align-items:start; }
  .sc-left { display:flex; flex-direction:column; gap:24px; }
  .sc-right { position:sticky; top:80px; }

  .sc-header { margin-bottom:8px; }
  .sc-label { font-size:10px; color:var(--green); letter-spacing:0.25em; text-transform:uppercase; margin-bottom:12px; display:block; }
  .sc-title { font-family:'Playfair Display',serif; font-size:36px; font-weight:900; color:#fff; line-height:1.1; margin-bottom:8px; }
  .sc-sub { font-size:11px; color:var(--muted); font-style:italic; line-height:1.7; }

  .sc-card { background:var(--card); border:1px solid var(--border); padding:28px; }
  .sc-card-title { font-size:10px; letter-spacing:0.2em; color:var(--green); text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
  .sc-card-title::before { content:''; width:3px; height:12px; background:var(--green); display:inline-block; }

  /* INPUTS */
  .sc-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .sc-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  .sc-field { display:flex; flex-direction:column; gap:6px; }
  .sc-field label { font-size:10px; color:var(--muted); letter-spacing:0.15em; text-transform:uppercase; }
  .sc-select, .sc-input { background:var(--dark); border:1px solid var(--border); padding:10px 14px; font-family:'Space Mono',monospace; font-size:11px; color:var(--text); outline:none; transition:border-color 0.2s; width:100%; appearance:none; cursor:pointer; }
  .sc-select:focus, .sc-input:focus { border-color:var(--green); }
  .sc-select option { background:var(--dark); }

  /* PATTERN GRID */
  .sc-patterns { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
  .sc-pattern-btn { background:var(--dark); border:1px solid var(--border); padding:12px 14px; cursor:pointer; transition:all 0.15s; text-align:left; font-family:'Space Mono',monospace; position:relative; }
  .sc-pattern-btn:hover { border-color:var(--muted); }
  .sc-pattern-btn.selected-bull { border-color:var(--green); background:rgba(0,255,65,0.06); }
  .sc-pattern-btn.selected-bear { border-color:var(--red); background:rgba(255,51,51,0.06); }
  .sc-pattern-btn.selected-neutral { border-color:var(--yellow); background:rgba(255,221,0,0.06); }
  .sc-pattern-name { font-size:11px; color:#fff; font-weight:700; display:block; margin-bottom:4px; }
  .sc-pattern-loc { font-size:9px; color:var(--muted); letter-spacing:0.05em; display:block; }
  .sc-pattern-score { position:absolute; top:8px; right:10px; font-size:10px; font-weight:700; }
  .sc-strength-MAX { color:var(--green); }
  .sc-strength-HIGH { color:#88ff88; }
  .sc-strength-MEDIUM { color:var(--yellow); }
  .sc-strength-WAIT { color:var(--muted); }

  .sc-section-tabs { display:flex; gap:0; border-bottom:1px solid var(--border); margin-bottom:16px; }
  .sc-tab { padding:10px 20px; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer; border-bottom:2px solid transparent; color:var(--muted); background:none; border-top:none; border-left:none; border-right:none; font-family:'Space Mono',monospace; transition:all 0.2s; }
  .sc-tab.active-bull { color:var(--green); border-bottom-color:var(--green); }
  .sc-tab.active-bear { color:var(--red); border-bottom-color:var(--red); }
  .sc-tab.active-neutral { color:var(--yellow); border-bottom-color:var(--yellow); }

  /* SCORE DISPLAY */
  .sc-score-card { background:var(--card); border:1px solid var(--border); padding:32px; display:flex; flex-direction:column; gap:0; }
  .sc-score-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid var(--border); }
  .sc-score-num { font-family:'Playfair Display',serif; font-size:80px; font-weight:900; line-height:1; }
  .sc-score-num.high { color:var(--green); }
  .sc-score-num.medium { color:var(--yellow); }
  .sc-score-num.low { color:var(--red); }
  .sc-score-num.none { color:var(--muted); }
  .sc-score-verdict { text-align:right; }
  .sc-verdict-signal { font-size:18px; font-weight:700; letter-spacing:0.1em; margin-bottom:6px; }
  .sc-verdict-sub { font-size:10px; color:var(--muted); letter-spacing:0.1em; }

  .sc-score-rows { display:flex; flex-direction:column; gap:0; }
  .sc-score-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .sc-score-row:last-child { border-bottom:none; }
  .sc-score-row-label { font-size:10px; color:var(--muted); letter-spacing:0.1em; display:flex; align-items:center; gap:8px; }
  .sc-score-row-label .weight { color:rgba(102,102,102,0.5); font-size:9px; }
  .sc-score-row-val { font-size:11px; font-weight:700; }
  .sc-score-row-pts { font-size:10px; color:var(--muted); text-align:right; min-width:48px; }
  .sc-pts-pos { color:var(--green); }
  .sc-pts-neg { color:var(--red); }
  .sc-pts-zero { color:var(--muted); }

  .sc-bar { height:3px; background:var(--border); margin-top:4px; border-radius:2px; overflow:hidden; }
  .sc-bar-fill { height:100%; border-radius:2px; transition:width 0.5s ease; }

  .sc-trade-box { margin-top:20px; padding:20px; border:1px solid rgba(0,255,65,0.2); background:rgba(0,255,65,0.04); }
  .sc-trade-box.bearish { border-color:rgba(255,51,51,0.2); background:rgba(255,51,51,0.04); }
  .sc-trade-box.neutral { border-color:rgba(255,221,0,0.2); background:rgba(255,221,0,0.04); }
  .sc-trade-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; }
  .sc-trade-item label { font-size:9px; color:var(--muted); letter-spacing:0.15em; display:block; margin-bottom:4px; }
  .sc-trade-item span { font-size:13px; font-weight:700; color:#fff; }

  .sc-rules-box { margin-top:16px; padding:16px; border-left:3px solid var(--border); }
  .sc-rules-box.blocked { border-left-color:var(--red); background:rgba(255,51,51,0.04); }
  .sc-rules-box.warning { border-left-color:var(--yellow); background:rgba(255,221,0,0.04); }
  .sc-rules-box.clear { border-left-color:var(--green); background:rgba(0,255,65,0.04); }
  .sc-rule { font-size:11px; color:var(--text); padding:4px 0; display:flex; align-items:flex-start; gap:8px; line-height:1.5; }
  .sc-rule-icon { flex-shrink:0; margin-top:1px; }

  .sc-btn { background:var(--green); color:var(--black); border:none; padding:16px 32px; font-family:'Space Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; width:100%; transition:all 0.15s; margin-top:16px; }
  .sc-btn:hover { background:#fff; }
  .sc-btn:disabled { background:var(--border); color:var(--muted); cursor:not-allowed; }

  .sc-reset { background:transparent; border:1px solid var(--border); color:var(--muted); padding:10px; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:0.15em; cursor:pointer; width:100%; text-transform:uppercase; margin-top:8px; transition:all 0.2s; }
  .sc-reset:hover { border-color:var(--green); color:var(--green); }

  .sc-placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 32px; text-align:center; gap:16px; }
  .sc-placeholder-icon { font-size:48px; opacity:0.2; }
  .sc-placeholder-text { font-size:12px; color:var(--muted); line-height:1.7; font-style:italic; }

  .sc-live-dot { width:6px; height:6px; background:var(--green); border-radius:50%; animation:pulse 1.5s infinite; display:inline-block; margin-right:6px; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .sc-pattern-selected-display { padding:16px; border:1px solid var(--border); background:var(--black); margin-top:12px; display:flex; align-items:flex-start; gap:16px; }
  .sc-pattern-selected-name { font-size:13px; color:#fff; font-weight:700; margin-bottom:6px; }
  .sc-pattern-selected-desc { font-size:11px; color:var(--muted); line-height:1.7; font-style:italic; }
  .sc-pattern-selected-badge { padding:4px 10px; font-size:9px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; flex-shrink:0; }

  .tag-green { background:var(--green); color:var(--black); }
  .tag-red { background:var(--red); color:#fff; }
  .tag-yellow { background:var(--yellow); color:var(--black); }
  .tag-muted { background:var(--border); color:var(--muted); }

  .sc-new-badge { background:var(--green); color:var(--black); font-size:8px; font-weight:700; padding:2px 5px; letter-spacing:0.1em; margin-left:6px; vertical-align:middle; }

  @media (max-width:900px) {
    .sc-wrap { grid-template-columns:1fr; padding:20px; }
    .sc-right { position:static; }
    .sc-patterns { grid-template-columns:repeat(2,1fr); }
    .sc-row, .sc-row-3 { grid-template-columns:1fr; }
  }
`;

// ─── SCORING ENGINE ────────────────────────────────────────────────────────

function calculateScore(inputs: any, selectedPattern: any): { total: number; breakdown: any[]; signal: string; rules: string[]; warnings: string[] } {
  const breakdown: any[] = [];
  const rules: string[] = [];
  const warnings: string[] = [];
  let total = 0;

  // 1. King Node (20%)
  let kingPts = 0;
  const kn = inputs.king_node;
  if (kn === "above" && inputs.direction === "bull") { kingPts = 20; breakdown.push({ label: "King Node", sub: "ABOVE price → bullish pull", pts: 20, max: 20 }); }
  else if (kn === "below" && inputs.direction === "bear") { kingPts = 20; breakdown.push({ label: "King Node", sub: "BELOW price → bearish pull", pts: 20, max: 20 }); }
  else if (kn === "at") { kingPts = 0; breakdown.push({ label: "King Node", sub: "AT price → pinned, no trade", pts: 0, max: 20 }); rules.push("⚠️ King Node AT price = expect range-bound chop. Avoid directional trades."); }
  else { kingPts = -5; breakdown.push({ label: "King Node", sub: "OPPOSING direction", pts: -5, max: 20 }); warnings.push("King Node opposes your trade direction — major red flag."); }
  total += kingPts;

  // 2. Trinity (15%)
  let triPts = 0;
  const tri = inputs.trinity;
  if (tri === "all3") { triPts = 15; breakdown.push({ label: "Trinity", sub: "All 3 aligned → MAX conviction", pts: 15, max: 15 }); }
  else if (tri === "2of3") { triPts = 11; breakdown.push({ label: "Trinity", sub: "2 of 3 aligned → HIGH conviction", pts: 11, max: 15 }); }
  else if (tri === "1of3") { triPts = 4; breakdown.push({ label: "Trinity", sub: "1 of 3 → LOW conviction", pts: 4, max: 15 }); warnings.push("Trinity mostly divergent — reduce size to 25%."); }
  else { triPts = -15; breakdown.push({ label: "Trinity", sub: "All divergent → CHOP", pts: -15, max: 15 }); rules.push("🚫 Trinity fully divergent = NO TRADE. Expect chop in both directions."); }
  total += triPts;

  // 3. Pattern (15%)
  let patPts = 0;
  if (selectedPattern) {
    const weight = Math.round((selectedPattern.score / 20) * 15);
    patPts = weight;
    breakdown.push({ label: "Candle Pattern", sub: `${selectedPattern.name} (${selectedPattern.strength})`, pts: weight, max: 15 });
  } else {
    breakdown.push({ label: "Candle Pattern", sub: "None selected", pts: 0, max: 15 });
  }
  total += patPts;

  // 4. VIX (15%)
  let vixPts = 0;
  const vix = inputs.vix_direction;
  if ((vix === "bull" && inputs.direction === "bull") || (vix === "bear" && inputs.direction === "bear")) {
    vixPts = 15; breakdown.push({ label: "VIX Direction", sub: "Confirms trade direction", pts: 15, max: 15 });
  } else if (vix === "neutral") {
    vixPts = 7; breakdown.push({ label: "VIX Direction", sub: "Neutral / no strong read", pts: 7, max: 15 });
  } else {
    vixPts = -15; breakdown.push({ label: "VIX Direction", sub: "OPPOSES direction", pts: -15, max: 15 });
    rules.push("🚫 VIX opposes your trade — this is a DISQUALIFIER. Do not trade.");
  }
  total += vixPts;

  // 5. VWAP (10%)
  let vwapPts = 0;
  const vwap = inputs.vwap;
  if (vwap === "up" && inputs.direction === "bull") { vwapPts = 10; breakdown.push({ label: "VWAP", sub: "Sloping UP → confirms long", pts: 10, max: 10 }); }
  else if (vwap === "down" && inputs.direction === "bear") { vwapPts = 10; breakdown.push({ label: "VWAP", sub: "Sloping DOWN → confirms short", pts: 10, max: 10 }); }
  else if (vwap === "flat") { vwapPts = 5; breakdown.push({ label: "VWAP", sub: "Flat → range day", pts: 5, max: 10 }); }
  else if (vwap === "down" && inputs.direction === "bull") { vwapPts = -20; breakdown.push({ label: "VWAP", sub: "DECLINING VWAP on long → BLOCKED", pts: -20, max: 10 }); rules.push("🚫 DECLINING VWAP = NO LONG TRADES. This is a hard rule. -20 applied."); }
  else { vwapPts = -5; breakdown.push({ label: "VWAP", sub: "VWAP against direction", pts: -5, max: 10 }); }
  total += vwapPts;

  // 6. Node Dollar Value (10%)
  let nodePts = 0;
  const nv = inputs.node_value;
  if (nv === "200k+") { nodePts = 10; breakdown.push({ label: "Node Dollar Value", sub: "$200K+ — Gamma Wall strength", pts: 10, max: 10 }); }
  else if (nv === "100k") { nodePts = 8; breakdown.push({ label: "Node Dollar Value", sub: "$100K-200K — Major level", pts: 8, max: 10 }); }
  else if (nv === "50k") { nodePts = 5; breakdown.push({ label: "Node Dollar Value", sub: "$50K-100K — Moderate", pts: 5, max: 10 }); warnings.push("Bobby warning: Values not big enough — reduce size 50%."); }
  else { nodePts = 0; breakdown.push({ label: "Node Dollar Value", sub: "Under $50K — weak node", pts: 0, max: 10 }); warnings.push("Node values too small for high conviction trade."); }
  total += nodePts;

  // 7. Time of Day (10%)
  let timePts = 0;
  const tod = inputs.time_of_day;
  if (tod === "prime") { timePts = 10; breakdown.push({ label: "Time of Day", sub: "10AM-1PM → PRIME WINDOW", pts: 10, max: 10 }); }
  else if (tod === "mid") { timePts = 5; breakdown.push({ label: "Time of Day", sub: "1PM-2PM → reduced entries", pts: 5, max: 10 }); warnings.push("Mid-session: no new entries unless high conviction 80+ score."); }
  else if (tod === "late") { timePts = -10; breakdown.push({ label: "Time of Day", sub: "After 2PM → DANGER ZONE", pts: -10, max: 10 }); rules.push("⚠️ After 2PM: no new entries. ATM or ITM only if forced."); }
  else if (tod === "open") { timePts = -15; breakdown.push({ label: "Time of Day", sub: "9:30-10AM → DO NOT TRADE", pts: -15, max: 10 }); rules.push("🚫 NEVER trade the open flush (9:30-10AM). Wait for structure."); }
  total += timePts;

  // 8. Day of Week (5%)
  let dowPts = 0;
  const dow = inputs.day_of_week;
  if (dow === "mon" || dow === "wed") { dowPts = 5; breakdown.push({ label: "Day of Week", sub: "Mon/Wed → statistically positive", pts: 5, max: 5 }); }
  else if (dow === "tue" || dow === "fri") { dowPts = 3; breakdown.push({ label: "Day of Week", sub: "Tue/Fri → neutral", pts: 3, max: 5 }); }
  else { dowPts = -10; breakdown.push({ label: "Day of Week", sub: "Thursday → -10 base", pts: -10, max: 5 }); warnings.push("Thursday: historically losing day. Reduce size 50%. Higher bar to enter."); }
  total += dowPts;

  // 9. Analyst Consensus (5%)
  let anPts = 0;
  const ac = inputs.analyst_consensus;
  if (ac === "all_agree") { anPts = 10; breakdown.push({ label: "Analyst Consensus", sub: "ALL analysts agree → +10 bonus", pts: 10, max: 5 }); }
  else if (ac === "bobby_giul") { anPts = 5; breakdown.push({ label: "Analyst Consensus", sub: "Bobby + Giul aligned", pts: 5, max: 5 }); }
  else if (ac === "not_big_enough") { anPts = -15; breakdown.push({ label: "Analyst Consensus", sub: "\"Values not big enough\" → -15", pts: -15, max: 5 }); rules.push("🚫 Bobby said 'values not big enough' — auto -15 points. No trade."); }
  else if (ac === "conflict") { anPts = -10; breakdown.push({ label: "Analyst Consensus", sub: "Bobby/Giul conflict → FLAG", pts: -10, max: 5 }); rules.push("🚫 Bobby and Giul disagree = NO TRADE until resolved."); }
  else { anPts = 0; breakdown.push({ label: "Analyst Consensus", sub: "No analyst data", pts: 0, max: 5 }); }
  total += anPts;

  // ORB bonus
  if (inputs.orb_status === "broken_bull" && inputs.direction === "bull") { total += 5; rules.push("✅ ORB Breakout confirmed — +5 bonus points. Directional day."); }
  if (inputs.orb_status === "broken_bear" && inputs.direction === "bear") { total += 5; rules.push("✅ ORB Breakdown confirmed — +5 bonus points. Directional day."); }

  // Flow divergence
  if (inputs.flow_divergence === "bear_on_up" && inputs.direction === "bear") { total += 8; rules.push("✅ Options flow divergence: price up but heavy put buying detected — +8 bonus."); }
  if (inputs.flow_divergence === "bull_on_down" && inputs.direction === "bull") { total += 8; rules.push("✅ Options flow divergence: price down but heavy call buying detected — +8 bonus."); }

  const finalScore = Math.max(0, Math.min(100, total));

  let signal = "NO TRADE";
  if (finalScore >= 80) signal = inputs.direction === "bull" ? "CALLS — FULL SIZE" : "PUTS — FULL SIZE";
  else if (finalScore >= 65) signal = inputs.direction === "bull" ? "CALLS — REDUCED SIZE" : "PUTS — REDUCED SIZE";
  else if (finalScore >= 50) signal = "WAIT — LOW CONVICTION";
  else signal = "NO TRADE";

  return { total: finalScore, breakdown, signal, rules, warnings };
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────

const DEFAULT = {
  direction: "bull",
  king_node: "above",
  trinity: "all3",
  vix_direction: "bull",
  vwap: "up",
  node_value: "100k",
  time_of_day: "prime",
  day_of_week: "mon",
  analyst_consensus: "bobby_giul",
  orb_status: "none",
  flow_divergence: "none",
  spy_price: "",
  entry_price: "",
};

export default function ScorerPage() {
  const [inputs, setInputs] = useState({ ...DEFAULT });
  const [selectedPattern, setSelectedPattern] = useState<any>(null);
  const [patternTab, setPatternTab] = useState<"bullish" | "bearish" | "neutral">("bullish");
  const [result, setResult] = useState<any>(null);
  const [scored, setScored] = useState(false);

  const set = (k: string, v: string) => setInputs(prev => ({ ...prev, [k]: v }));

  const handleScore = () => {
    const r = calculateScore(inputs, selectedPattern);
    setResult(r);
    setScored(true);
  };

  const handleReset = () => {
    setInputs({ ...DEFAULT });
    setSelectedPattern(null);
    setResult(null);
    setScored(false);
    setPatternTab("bullish");
  };

  const scoreColor = !result ? "none" : result.total >= 80 ? "high" : result.total >= 65 ? "medium" : result.total >= 50 ? "medium" : "low";
  const signalColor = !result ? "#666" : result.total >= 65 ? (inputs.direction === "bull" ? "var(--green)" : "var(--red)") : "var(--muted)";
  const tradeBoxClass = !result ? "" : result.total >= 65 ? (inputs.direction === "bull" ? "" : "bearish") : "neutral";

  // Strike selector logic
  const getStrike = () => {
    if (!scored) return "—";
    if (result.total >= 80 && inputs.time_of_day === "prime") return "ATM";
    if (result.total >= 65 && inputs.time_of_day === "prime") return "1 Strike OTM";
    if (inputs.time_of_day === "late") return "ATM or ITM only";
    return "Wait for better setup";
  };

  const getSizeRec = () => {
    if (!scored) return "—";
    if (result.total >= 80) return "FULL SIZE";
    if (result.total >= 65) return "75% SIZE";
    if (result.total >= 50) return "25% SIZE";
    return "NO TRADE";
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* NAV */}
      <nav className="sc-nav">
        <a href="/dashboard" className="sc-logo">ZERODTE.IO</a>
        <ul className="sc-nav-links">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/scorer" className="active">Scorer</a></li>
          <li><a href="/journal">Journal</a></li>
        </ul>
      </nav>

      <div className="sc-wrap">
        {/* ── LEFT: INPUTS ── */}
        <div className="sc-left">
          <div className="sc-header">
            <span className="sc-label">
              <span className="sc-live-dot" />
              Pattern Intelligence Engine
            </span>
            <h1 className="sc-title">AI Trade Scorer</h1>
            <p className="sc-sub">9-factor scoring engine. Fill in your current market read and get an instant 0-100 score with full trade card. 65+ to trade. 80+ for full size.</p>
          </div>

          {/* DIRECTION */}
          <div className="sc-card">
            <div className="sc-card-title">Trade Direction</div>
            <div className="sc-row">
              {[["bull", "🟢 CALLS (Bullish)"], ["bear", "🔴 PUTS (Bearish)"]].map(([v, l]) => (
                <button key={v} onClick={() => set("direction", v)} style={{
                  padding: "14px 20px", border: `1px solid ${inputs.direction === v ? (v === "bull" ? "var(--green)" : "var(--red)") : "var(--border)"}`,
                  background: inputs.direction === v ? (v === "bull" ? "rgba(0,255,65,0.08)" : "rgba(255,51,51,0.08)") : "var(--dark)",
                  color: inputs.direction === v ? "#fff" : "var(--muted)", cursor: "pointer", fontFamily: "'Space Mono',monospace",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", transition: "all 0.15s"
                }}>{l}</button>
              ))}
            </div>
          </div>

          {/* PATTERN LIBRARY */}
          <div className="sc-card">
            <div className="sc-card-title">
              Pattern Detection
              <span style={{ fontSize: 9, color: "var(--muted)", marginLeft: 8 }}>{PATTERNS.bullish.length + PATTERNS.bearish.length + PATTERNS.neutral.length} PATTERNS LOADED</span>
            </div>

            <div className="sc-section-tabs">
              {(["bullish", "bearish", "neutral"] as const).map(tab => (
                <button key={tab} className={`sc-tab ${patternTab === tab ? `active-${tab}` : ""}`} onClick={() => setPatternTab(tab)}>
                  {tab === "bullish" ? "🟢 Bullish" : tab === "bearish" ? "🔴 Bearish" : "🟡 Neutral / Wait"}
                  {(tab === "bullish" || tab === "bearish") && <span style={{ marginLeft: 4, fontSize: 9, color: "var(--muted)" }}>({PATTERNS[tab].length})</span>}
                </button>
              ))}
            </div>

            <div className="sc-patterns">
              {PATTERNS[patternTab].map(p => {
                const isNew = ["vwap_reclaim", "orb_bull", "sd_support", "liq_sweep_bull", "failed_breakdown", "base_breakout", "vwap_reject", "orb_bear", "sd_resistance", "liq_sweep_bear", "flow_div_bear", "gamma_wall_reject"].includes(p.id);
                const isSelected = selectedPattern?.id === p.id;
                const selClass = isSelected ? `selected-${patternTab === "neutral" ? "neutral" : patternTab === "bullish" ? "bull" : "bear"}` : "";
                return (
                  <button key={p.id} className={`sc-pattern-btn ${selClass}`} onClick={() => setSelectedPattern(isSelected ? null : p)}>
                    <span className={`sc-pattern-score sc-strength-${p.strength}`}>{p.strength === "WAIT" ? "—" : `+${p.score}`}</span>
                    <span className="sc-pattern-name">
                      {p.name}
                      {isNew && <span className="sc-new-badge">NEW</span>}
                    </span>
                    <span className="sc-pattern-loc">{p.location}</span>
                  </button>
                );
              })}
            </div>

            {selectedPattern && (
              <div className="sc-pattern-selected-display">
                <span className={`sc-pattern-selected-badge ${patternTab === "bullish" ? "tag-green" : patternTab === "bearish" ? "tag-red" : "tag-yellow"}`}>
                  {selectedPattern.strength}
                </span>
                <div>
                  <div className="sc-pattern-selected-name">{selectedPattern.name}</div>
                  <div className="sc-pattern-selected-desc">{selectedPattern.desc}</div>
                  <div style={{ marginTop: 8, fontSize: 10, color: "var(--green)" }}>Location: {selectedPattern.location}</div>
                </div>
              </div>
            )}
          </div>

          {/* MARKET CONDITIONS */}
          <div className="sc-card">
            <div className="sc-card-title">Market Conditions</div>
            <div className="sc-row">
              <div className="sc-field">
                <label>King Node Position</label>
                <select className="sc-select" value={inputs.king_node} onChange={e => set("king_node", e.target.value)}>
                  <option value="above">★ Above Price (Bullish Pull)</option>
                  <option value="below">★ Below Price (Bearish Pull)</option>
                  <option value="at">★ At Price (Pinned)</option>
                </select>
              </div>
              <div className="sc-field">
                <label>Trinity Alignment</label>
                <select className="sc-select" value={inputs.trinity} onChange={e => set("trinity", e.target.value)}>
                  <option value="all3">All 3 Aligned (MAX)</option>
                  <option value="2of3">2 of 3 Aligned (HIGH)</option>
                  <option value="1of3">1 of 3 (LOW)</option>
                  <option value="divergent">All Divergent (CHOP)</option>
                </select>
              </div>
              <div className="sc-field">
                <label>VIX Direction</label>
                <select className="sc-select" value={inputs.vix_direction} onChange={e => set("vix_direction", e.target.value)}>
                  <option value="bull">King Node Below VIX (SPY Bullish)</option>
                  <option value="bear">King Node Above VIX (SPY Bearish)</option>
                  <option value="neutral">Neutral / Unclear</option>
                </select>
              </div>
              <div className="sc-field">
                <label>VWAP Status</label>
                <select className="sc-select" value={inputs.vwap} onChange={e => set("vwap", e.target.value)}>
                  <option value="up">Sloping UP (Bullish)</option>
                  <option value="down">Sloping DOWN (Bearish / blocks longs)</option>
                  <option value="flat">Flat (Range Day)</option>
                  <option value="reclaim">Price just reclaimed VWAP</option>
                </select>
              </div>
            </div>
          </div>

          {/* LEVELS + TIMING */}
          <div className="sc-card">
            <div className="sc-card-title">Levels & Timing</div>
            <div className="sc-row">
              <div className="sc-field">
                <label>Node Dollar Value</label>
                <select className="sc-select" value={inputs.node_value} onChange={e => set("node_value", e.target.value)}>
                  <option value="200k+">$200K+ (Gamma Wall)</option>
                  <option value="100k">$100K-200K (Major Level)</option>
                  <option value="50k">$50K-100K (Moderate)</option>
                  <option value="small">Under $50K (Weak)</option>
                </select>
              </div>
              <div className="sc-field">
                <label>Time of Day</label>
                <select className="sc-select" value={inputs.time_of_day} onChange={e => set("time_of_day", e.target.value)}>
                  <option value="prime">10AM-1PM (PRIME)</option>
                  <option value="mid">1PM-2PM (Mid-session)</option>
                  <option value="late">2PM-3:45PM (Late / Danger)</option>
                  <option value="open">9:30-10AM (OPEN — No Trade)</option>
                </select>
              </div>
              <div className="sc-field">
                <label>Day of Week</label>
                <select className="sc-select" value={inputs.day_of_week} onChange={e => set("day_of_week", e.target.value)}>
                  <option value="mon">Monday (Positive bias)</option>
                  <option value="tue">Tuesday (Neutral)</option>
                  <option value="wed">Wednesday (Positive bias)</option>
                  <option value="thu">Thursday (NEGATIVE — reduce size)</option>
                  <option value="fri">Friday (Watch pin behavior)</option>
                </select>
              </div>
              <div className="sc-field">
                <label>Analyst Consensus</label>
                <select className="sc-select" value={inputs.analyst_consensus} onChange={e => set("analyst_consensus", e.target.value)}>
                  <option value="all_agree">All analysts agree (+10)</option>
                  <option value="bobby_giul">Bobby + Giul aligned</option>
                  <option value="cautious">Giul cautious / Bobby bullish</option>
                  <option value="not_big_enough">Bobby: "Values not big enough" (-15)</option>
                  <option value="conflict">Bobby vs Giul CONFLICT (-10)</option>
                  <option value="none">No analyst data</option>
                </select>
              </div>
            </div>
          </div>

          {/* ADVANCED SIGNALS */}
          <div className="sc-card">
            <div className="sc-card-title">Advanced Signals <span style={{ fontSize: 9, color: "var(--green)", marginLeft: 8 }}>NEW</span></div>
            <div className="sc-row">
              <div className="sc-field">
                <label>Opening Range Breakout</label>
                <select className="sc-select" value={inputs.orb_status} onChange={e => set("orb_status", e.target.value)}>
                  <option value="none">Not confirmed / Pre-10AM</option>
                  <option value="broken_bull">Broken ABOVE ORH (+5 bull)</option>
                  <option value="broken_bear">Broken BELOW ORL (+5 bear)</option>
                  <option value="inside">Still inside range</option>
                </select>
              </div>
              <div className="sc-field">
                <label>Options Flow Divergence</label>
                <select className="sc-select" value={inputs.flow_divergence} onChange={e => set("flow_divergence", e.target.value)}>
                  <option value="none">No divergence</option>
                  <option value="bear_on_up">Price UP + Heavy put buying (+8 bear)</option>
                  <option value="bull_on_down">Price DOWN + Heavy call buying (+8 bull)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SCORE BUTTON */}
          <button className="sc-btn" onClick={handleScore}>
            GENERATE SCORE CARD →
          </button>
        </div>

        {/* ── RIGHT: SCORE OUTPUT ── */}
        <div className="sc-right">
          <div className="sc-score-card">
            {!scored ? (
              <div className="sc-placeholder">
                <div className="sc-placeholder-icon">◎</div>
                <div style={{ fontSize: 10, color: "var(--green)", letterSpacing: "0.2em" }}>AWAITING INPUT</div>
                <div className="sc-placeholder-text">Fill in your market conditions on the left and hit Generate Score Card to get your full trade analysis.</div>
                <div style={{ marginTop: 16, fontSize: 10, color: "var(--muted)", lineHeight: 2 }}>
                  65+ = trade eligible<br />80+ = full size<br />Below 65 = stay flat
                </div>
              </div>
            ) : (
              <>
                <div className="sc-score-top">
                  <div>
                    <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.15em", marginBottom: 8 }}>AI TRADE SCORE</div>
                    <div className={`sc-score-num ${scoreColor}`}>{result.total}</div>
                    <div className="sc-bar" style={{ width: 100, marginTop: 8 }}>
                      <div className="sc-bar-fill" style={{ width: `${result.total}%`, background: result.total >= 80 ? "var(--green)" : result.total >= 65 ? "var(--yellow)" : "var(--red)" }} />
                    </div>
                  </div>
                  <div className="sc-score-verdict">
                    <div className="sc-verdict-signal" style={{ color: signalColor }}>{result.signal}</div>
                    <div className="sc-verdict-sub">STRIKE: {getStrike()}</div>
                    <div className="sc-verdict-sub" style={{ marginTop: 4 }}>SIZE: {getSizeRec()}</div>
                  </div>
                </div>

                {/* BREAKDOWN */}
                <div className="sc-score-rows">
                  {result.breakdown.map((row: any, i: number) => (
                    <div key={i} className="sc-score-row">
                      <div className="sc-score-row-label">
                        {row.label}
                        <span className="weight">{row.sub}</span>
                      </div>
                      <div className={`sc-score-row-pts ${row.pts > 0 ? "sc-pts-pos" : row.pts < 0 ? "sc-pts-neg" : "sc-pts-zero"}`}>
                        {row.pts > 0 ? `+${row.pts}` : row.pts}
                      </div>
                    </div>
                  ))}
                </div>

                {/* TRADE BOX */}
                {result.total >= 65 && (
                  <div className={`sc-trade-box ${tradeBoxClass}`}>
                    <div style={{ fontSize: 10, color: result.total >= 65 ? (inputs.direction === "bull" ? "var(--green)" : "var(--red)") : "var(--yellow)", letterSpacing: "0.15em", marginBottom: 4 }}>
                      {result.total >= 80 ? "HIGH CONVICTION TRADE" : "TRADE ELIGIBLE"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>
                      {selectedPattern ? `${selectedPattern.name} at ${selectedPattern.location}` : "Pattern not selected"}
                    </div>
                    <div className="sc-trade-grid">
                      <div className="sc-trade-item"><label>SIGNAL</label><span style={{ color: inputs.direction === "bull" ? "var(--green)" : "var(--red)" }}>{inputs.direction === "bull" ? "CALLS ↑" : "PUTS ↓"}</span></div>
                      <div className="sc-trade-item"><label>STRIKE</label><span>{getStrike()}</span></div>
                      <div className="sc-trade-item"><label>SIZE</label><span>{getSizeRec()}</span></div>
                      <div className="sc-trade-item"><label>HARD EXIT</label><span>3:45 PM</span></div>
                    </div>
                  </div>
                )}

                {/* WARNINGS */}
                {result.warnings.length > 0 && (
                  <div className="sc-rules-box warning" style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 10, color: "var(--yellow)", letterSpacing: "0.15em", marginBottom: 8 }}>⚠️ WARNINGS</div>
                    {result.warnings.map((w: string, i: number) => (
                      <div key={i} className="sc-rule">{w}</div>
                    ))}
                  </div>
                )}

                {/* RULES */}
                {result.rules.length > 0 && (
                  <div className={`sc-rules-box ${result.rules.some((r: string) => r.startsWith("🚫")) ? "blocked" : result.rules.some((r: string) => r.startsWith("✅")) ? "clear" : "warning"}`} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.15em", marginBottom: 8, color: result.rules.some((r: string) => r.startsWith("🚫")) ? "var(--red)" : "var(--green)" }}>
                      FRAMEWORK RULES TRIGGERED
                    </div>
                    {result.rules.map((r: string, i: number) => (
                      <div key={i} className="sc-rule">{r}</div>
                    ))}
                  </div>
                )}

                <button className="sc-reset" onClick={handleReset}>↺ NEW SCORE CARD</button>
              </>
            )}
          </div>

          {/* QUICK REF */}
          <div style={{ marginTop: 16, padding: "16px 20px", background: "var(--card)", border: "1px solid var(--border)", fontSize: 10, color: "var(--muted)", lineHeight: 2 }}>
            <div style={{ color: "var(--green)", letterSpacing: "0.15em", marginBottom: 8 }}>SCORING WEIGHTS</div>
            {Object.entries(SCORING_WEIGHTS).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{k.replace(/_/g, " ").toUpperCase()}</span>
                <span style={{ color: "#fff" }}>{v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
