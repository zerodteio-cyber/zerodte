// @ts-nocheck
"use client";
import { useState } from "react";

// ─── PATTERN LIBRARY ──────────────────────────────────────────────────────

const BULL_PATTERNS = [
  { id:"hammer", name:"Hammer", pts:18, strength:"HIGH", desc:"Long lower wick, small body at bottom. Sellers tried to break the level and FAILED.", loc:"King Node / Green Support" },
  { id:"bull_engulf", name:"Bullish Engulfing", pts:17, strength:"HIGH", desc:"Small red candle fully swallowed by large green. Strong reversal.", loc:"Support / King Node" },
  { id:"morning_star", name:"Morning Star", pts:20, strength:"MAX", desc:"3 candles: big red + small doji + big green. Strongest reversal pattern.", loc:"Major Support" },
  { id:"three_soldiers", name:"Three White Soldiers", pts:16, strength:"HIGH", desc:"3 consecutive green candles, higher closes. Magnet walk confirmed.", loc:"Breaking out of base" },
  { id:"piercing", name:"Piercing Line", pts:13, strength:"MEDIUM", desc:"Green candle closes above 50% of prior red. Moderate reversal.", loc:"At Support" },
  { id:"inv_hammer", name:"Inverted Hammer", pts:11, strength:"MEDIUM", desc:"Long upper wick at bottom. Secondary signal — confirm next candle.", loc:"At Support" },
  { id:"vwap_reclaim", name:"VWAP Reclaim ★", pts:19, strength:"MAX", desc:"Price dips below VWAP, immediately reclaims with strong close above. Institutions defending average cost.", loc:"At VWAP" },
  { id:"orb_bull", name:"ORB Breakout ★", pts:17, strength:"HIGH", desc:"Price breaks above Opening Range High (9:30-10AM) with volume. Directional day confirmed.", loc:"Above ORH" },
  { id:"liq_sweep_bull", name:"Liquidity Sweep Bull ★", pts:20, strength:"MAX", desc:"Price spikes BELOW support, sweeps stops, reverses hard above. Shorts trapped. Quant's core read.", loc:"Below Key Support" },
  { id:"failed_breakdown", name:"Failed Breakdown ★", pts:18, strength:"HIGH", desc:"Breaks below support, immediately reclaims in 1-2 candles. Shorts trapped. High probability long.", loc:"At Key Support" },
  { id:"pillow_bounce", name:"Pillow Node Bounce ★", pts:17, strength:"HIGH", desc:"Price tags large positive gamma node below price, wicks through and closes back up. Soft floor confirmed.", loc:"At Pillow Nodes" },
  { id:"base_breakout", name:"Consolidation Breakout ★", pts:15, strength:"HIGH", desc:"30-60min tight range breaks upside. Classic Reverse Rug Phase 5.", loc:"Above Base High" },
  { id:"sd_demand", name:"S&D Demand Reaction ★", pts:16, strength:"HIGH", desc:"Price drops into prior demand zone, wicks through and closes up. Institutional accumulation.", loc:"At Demand Zone" },
];

const BEAR_PATTERNS = [
  { id:"shooting_star", name:"Shooting Star", pts:18, strength:"HIGH", desc:"Long upper wick at TOP of move. Most common 0DTE top pattern. Critical at purple nodes.", loc:"Purple Ceiling / Gamma Wall" },
  { id:"bear_engulf", name:"Bearish Engulfing", pts:17, strength:"HIGH", desc:"Small green fully swallowed by large red candle. Strong reversal signal.", loc:"Resistance / Purple Node" },
  { id:"evening_star", name:"Evening Star", pts:20, strength:"MAX", desc:"3 candles: big green + small doji + big red. Strongest bearish reversal at purple ceiling.", loc:"Major Resistance" },
  { id:"three_crows", name:"Three Black Crows", pts:16, strength:"HIGH", desc:"3 consecutive red candles, lower closes. Add to puts on each new candle.", loc:"Breaking down from resistance" },
  { id:"dark_cloud", name:"Dark Cloud Cover", pts:13, strength:"MEDIUM", desc:"Red opens above prev close, closes below midpoint. Moderate reversal.", loc:"At Resistance" },
  { id:"hanging_man", name:"Hanging Man", pts:11, strength:"MEDIUM", desc:"Hammer shape at TOP. Bearish warning — confirm with next candle.", loc:"At Resistance" },
  { id:"vwap_reject", name:"VWAP Rejection ★", pts:19, strength:"MAX", desc:"Price rallies to DECLINING VWAP, prints shooting star or bearish engulf, reverses hard. Hard block on all longs.", loc:"At Declining VWAP" },
  { id:"gamma_wall_reject", name:"Gamma Wall Rejection ★", pts:19, strength:"MAX", desc:"Price hits massive purple node ($200K+), prints bearish candle, reverses. Nearly impenetrable without catalyst.", loc:"At Gamma Wall" },
  { id:"liq_sweep_bear", name:"Liquidity Sweep Bear ★", pts:20, strength:"MAX", desc:"Price spikes ABOVE resistance, sweeps stops above, reverses hard below. Longs trapped.", loc:"Above Key Resistance" },
  { id:"dead_cat", name:"Dead Cat Bounce ★", pts:17, strength:"HIGH", desc:"Sharp drop → quick recovery spike → no base built → fails again. Quant's 'fake bounce — values not big enough.'", loc:"After sharp drop, at resistance" },
  { id:"bear_flag", name:"Bear Flag ★", pts:16, strength:"HIGH", desc:"Sharp drop, tight upward-sloping consolidation. Break of flag low = puts entry.", loc:"Below breakdown level" },
  { id:"rising_wedge", name:"Rising Wedge Breakdown ★", pts:17, strength:"HIGH", desc:"Higher highs/lows contracting into wedge. Breaks down hard. Fools bulls.", loc:"At resistance / upper wedge" },
  { id:"hns_top", name:"Head & Shoulders Top ★", pts:18, strength:"HIGH", desc:"Classic reversal: L shoulder + head + R shoulder. Break of neckline = puts.", loc:"At neckline break" },
  { id:"triple_top", name:"Triple Top / Distribution ★", pts:17, strength:"HIGH", desc:"3 failed attempts at same resistance. Each rejection = distribution. Puts on 3rd touch.", loc:"At major resistance, 3rd touch" },
  { id:"vix_breakout", name:"VIX Node Breakout ★", pts:20, strength:"MAX", desc:"VIX breaks through its own purple node. Maximum fear. SPY accelerates down. Remove all longs immediately.", loc:"VIX above its purple node" },
  { id:"sd_supply", name:"S&D Supply Reaction ★", pts:16, strength:"HIGH", desc:"Price rallies into prior supply zone, wicks up and closes back down. Institutional distribution.", loc:"At Supply Zone" },
  { id:"orb_bear", name:"ORB Breakdown ★", pts:17, strength:"HIGH", desc:"Price breaks below Opening Range Low with volume. Bearish directional day confirmed. Puts on any bounce.", loc:"Below ORL" },
];

const NEUT_PATTERNS = [
  { id:"doji", name:"Doji", pts:0, strength:"WAIT", desc:"Open = Close. Pure indecision. Next candle determines direction.", loc:"Any" },
  { id:"spinning", name:"Spinning Top", pts:0, strength:"WAIT", desc:"Short body, equal shadows. Pin day signal — reduce size.", loc:"Any" },
  { id:"inside_bar", name:"Inside Bar", pts:3, strength:"WAIT", desc:"Compression before expansion. Direction of break = trade direction.", loc:"Any" },
];

const NEW_IDS = ["vwap_reclaim","orb_bull","liq_sweep_bull","failed_breakdown","pillow_bounce","base_breakout","sd_demand","vwap_reject","gamma_wall_reject","liq_sweep_bear","dead_cat","bear_flag","rising_wedge","hns_top","triple_top","vix_breakout","sd_supply","orb_bear"];

// ─── SCORING ENGINE ────────────────────────────────────────────────────────

function calcScore(dir: "bull"|"bear", inp: any, pat: any) {
  let total = 0;
  const rows: {l:string;v:string;pts:number}[] = [];
  const rules: string[] = [];
  const blocked: string[] = [];

  // 1. King Node (20pts)
  const kn = inp.king_node;
  if (kn==="above" && dir==="bull")      { total+=20; rows.push({l:"King Node",v:"ABOVE → bullish pull",pts:20}); }
  else if (kn==="below" && dir==="bear") { total+=20; rows.push({l:"King Node",v:"BELOW → bearish pull",pts:20}); }
  else if (kn==="at")                    { rows.push({l:"King Node",v:"AT price → pinned",pts:0}); blocked.push("King Node AT price = range-bound chop. Avoid directional trades."); }
  else                                   { total-=5; rows.push({l:"King Node",v:"Opposing direction",pts:-5}); }

  // 2. Trinity (15pts)
  if (inp.trinity==="all3")  { total+=15; rows.push({l:"Trinity",v:"All 3 aligned → MAX",pts:15}); }
  else if (inp.trinity==="2of3") { total+=11; rows.push({l:"Trinity",v:"2 of 3 → HIGH",pts:11}); }
  else if (inp.trinity==="1of3") { total+=4;  rows.push({l:"Trinity",v:"1 of 3 → LOW",pts:4}); rules.push("Trinity mostly divergent — reduce size to 25%."); }
  else { total-=15; rows.push({l:"Trinity",v:"All divergent → CHOP",pts:-15}); blocked.push("Trinity fully divergent = NO TRADE."); }

  // 3. Pattern (15pts)
  if (pat) {
    const w = Math.round((pat.pts/20)*15);
    total+=w; rows.push({l:"Pattern",v:`${pat.name} (${pat.strength})`,pts:w});
  } else {
    rows.push({l:"Pattern",v:"None selected",pts:0});
  }

  // 4. VIX Direction (15pts)
  const vd = inp.vix_direction;
  if ((vd==="bull"&&dir==="bull")||(vd==="bear"&&dir==="bear")) { total+=15; rows.push({l:"VIX Direction",v:"Confirms direction",pts:15}); }
  else if (vd==="neutral") { total+=7; rows.push({l:"VIX Direction",v:"Neutral",pts:7}); }
  else { total-=15; rows.push({l:"VIX Direction",v:"OPPOSES direction",pts:-15}); blocked.push("VIX opposes trade direction — DISQUALIFIER."); }

  // VIX level
  if (inp.vix_level==="above22" && dir==="bull") { total-=8; rules.push("VIX at 22 node — danger zone. -8 on longs."); }
  if (inp.vix_level==="above24") {
    if (dir==="bull") { total-=20; blocked.push("VIX above 24 = maximum fear mode. NO LONG TRADES."); }
    else { total+=8; rules.push("VIX above 24 = max fear. +8 bonus on puts."); }
  }
  if (inp.vix_broke_node==="yes") {
    if (dir==="bull") { total-=15; blocked.push("VIX broke through its purple node — accelerating fear. No longs."); }
    else { total+=12; rules.push("VIX broke its purple node — momentum fear trade. +12 bonus on puts."); }
  }

  // 5. VWAP (10pts)
  if (inp.vwap==="up"&&dir==="bull")          { total+=10; rows.push({l:"VWAP",v:"Sloping UP → confirms long",pts:10}); }
  else if (inp.vwap==="down"&&dir==="bear")   { total+=10; rows.push({l:"VWAP",v:"Sloping DOWN → confirms short",pts:10}); }
  else if (inp.vwap==="reclaim"&&dir==="bull"){ total+=12; rows.push({l:"VWAP",v:"RECLAIM — +12 institutional",pts:12}); rules.push("VWAP reclaim confirmed. +12 long bonus."); }
  else if (inp.vwap==="flat")                  { total+=5;  rows.push({l:"VWAP",v:"Flat — range day",pts:5}); }
  else if (inp.vwap==="down"&&dir==="bull")   { total-=20; rows.push({l:"VWAP",v:"DECLINING VWAP — BLOCKS longs",pts:-20}); blocked.push("DECLINING VWAP = NO LONG TRADES. Hard rule. -20 applied."); }
  else                                          { total-=5;  rows.push({l:"VWAP",v:"Against direction",pts:-5}); }

  // 6. Node Value (10pts)
  if (inp.node_value==="200k")      { total+=10; rows.push({l:"Node Value",v:"$200K+ Gamma Wall",pts:10}); }
  else if (inp.node_value==="100k") { total+=8;  rows.push({l:"Node Value",v:"$100K-200K Major",pts:8}); }
  else if (inp.node_value==="50k")  { total+=5;  rows.push({l:"Node Value",v:"$50K-100K Moderate",pts:5}); rules.push("Values moderate — Quant warning. Reduce size 50%."); }
  else { rows.push({l:"Node Value",v:"Under $50K — weak",pts:0}); rules.push("Node too small. Not big enough for high conviction."); }

  // 7. Time of Day (10pts)
  if (inp.tod==="prime")      { total+=10; rows.push({l:"Time of Day",v:"10AM-1PM PRIME",pts:10}); }
  else if (inp.tod==="mid")   { total+=5;  rows.push({l:"Time of Day",v:"1-2PM mid session",pts:5}); rules.push("Mid-session: no new entries unless 80+ score."); }
  else if (inp.tod==="late")  { total-=10; rows.push({l:"Time of Day",v:"After 2PM DANGER",pts:-10}); rules.push("After 2PM: no new entries. ATM/ITM only if forced."); }
  else { total-=15; rows.push({l:"Time of Day",v:"9:30-10AM NO TRADE",pts:-15}); blocked.push("NEVER trade the open flush. Wait for structure."); }

  // 8. Day of Week (5pts)
  if (inp.dow==="mon"||inp.dow==="wed") { total+=5;  rows.push({l:"Day of Week",v:"Mon/Wed positive bias",pts:5}); }
  else if (inp.dow==="thu")              { total-=10; rows.push({l:"Day of Week",v:"Thursday NEGATIVE",pts:-10}); rules.push("Thursday: historically losing day. Reduce size 50%."); }
  else                                   { total+=3;  rows.push({l:"Day of Week",v:"Neutral",pts:3}); }

  // 9. Analyst Consensus (5pts)
  if (inp.analyst==="all")         { total+=10; rows.push({l:"Analyst Consensus",v:"All agree +10",pts:10}); }
  else if (inp.analyst==="quant_giul") { total+=5; rows.push({l:"Analyst Consensus",v:"Quant + Giul aligned",pts:5}); }
  else if (inp.analyst==="not_big"){ total-=15; rows.push({l:"Analyst Consensus",v:"Not big enough -15",pts:-15}); blocked.push("Quant: 'values not big enough' — auto -15. No trade."); }
  else if (inp.analyst==="conflict"){ total-=10; rows.push({l:"Analyst Consensus",v:"Quant/Giul conflict -10",pts:-10}); blocked.push("Quant vs Giul conflict = NO TRADE until resolved."); }
  else { rows.push({l:"Analyst Consensus",v:"No data",pts:0}); }

  // BONUSES
  if (inp.orb==="bull"&&dir==="bull")       { total+=5;  rules.push("✅ ORB Breakout above ORH confirmed. +5 bonus."); }
  if (inp.orb==="bear"&&dir==="bear")       { total+=5;  rules.push("✅ ORB Breakdown below ORL confirmed. +5 bonus."); }
  if (inp.flow==="put_surge"&&dir==="bear") { total+=8;  rules.push("✅ Price up + heavy put flow — smart money bearish. +8 bonus."); }
  if (inp.flow==="call_surge"&&dir==="bull"){ total+=8;  rules.push("✅ Price down + heavy call flow — smart money bullish. +8 bonus."); }
  if (inp.structure==="air_below"&&dir==="bear"){ total+=7; rules.push("✅ Air pocket below price — no support. Acceleration zone. +7 bonus."); }
  if (inp.structure==="ladder_above"&&dir==="bull"){ total+=7; rules.push("✅ Node ladder above price — multiple yellows stacked. +7 bonus."); }
  if (inp.pcr==="extreme_put"&&dir==="bear"){ total+=6;  rules.push("✅ Extreme put/call ratio — sentiment confirms bearish. +6 bonus."); }
  if (inp.pcr==="extreme_call"&&dir==="bull"){ total+=6; rules.push("✅ Extreme call sentiment — confirms bullish bias. +6 bonus."); }

  const final = Math.max(0, Math.min(100, total));

  let signal = "NO TRADE";
  let size = "STAY FLAT";
  if (blocked.length>0 && final<50) { signal="BLOCKED"; size="NO TRADE"; }
  else if (final>=80) { signal=dir==="bull"?"CALLS — FULL SIZE":"PUTS — FULL SIZE"; size="100%"; }
  else if (final>=65) { signal=dir==="bull"?"CALLS — 75% SIZE":"PUTS — 75% SIZE"; size="75%"; }
  else if (final>=50) { signal="WAIT — LOW CONVICTION"; size="25% MAX"; }

  let strike = "Wait";
  if (final>=80 && inp.tod==="prime") strike="ATM";
  else if (final>=65 && inp.tod==="prime") strike="1 Strike OTM";
  else if (final>=65) strike="ATM or ITM only";

  return { score:final, signal, size, strike, rows, rules, blocked };
}

// ─── STYLES ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Mono:wght@400;700&display=swap');
:root{--g:#00ff41;--bk:#0a0a0a;--dk:#111;--cd:#141414;--br:#1f1f1f;--tx:#e8e8e8;--mu:#555;--re:#ff3333;--ye:#ffdd00;--pu:#9966cc;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bk);color:var(--tx);font-family:'Space Mono',monospace;font-size:13px;}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 40px;border-bottom:1px solid var(--br);background:rgba(10,10,10,.97);position:sticky;top:0;z-index:100;}
.logo{color:var(--g);font-weight:700;letter-spacing:.15em;font-size:13px;text-decoration:none;}
.navlinks{display:flex;gap:28px;list-style:none;}
.navlinks a{font-size:10px;color:var(--mu);text-decoration:none;letter-spacing:.2em;text-transform:uppercase;transition:color .2s;}
.navlinks a:hover,.navlinks a.on{color:var(--g);}

/* LAYOUT */
.layout{display:grid;grid-template-columns:55% 45%;min-height:calc(100vh - 54px);}
.left{padding:32px 36px;border-right:1px solid var(--br);display:flex;flex-direction:column;gap:20px;}
.right{padding:32px 32px;background:var(--dk);display:flex;flex-direction:column;gap:20px;}

/* HEADER */
.chip{font-size:9px;color:var(--g);letter-spacing:.25em;text-transform:uppercase;margin-bottom:8px;display:block;}
.dot{width:5px;height:5px;background:var(--g);border-radius:50%;animation:dp 1.5s infinite;display:inline-block;margin-right:6px;}
@keyframes dp{0%,100%{opacity:1}50%{opacity:.2}}
h1{font-family:'Playfair Display',serif;font-size:30px;font-weight:900;color:#fff;line-height:1.1;}
.sub{font-size:11px;color:var(--mu);font-style:italic;line-height:1.7;margin-top:6px;}

/* CARD */
.card{background:var(--cd);border:1px solid var(--br);padding:22px;}
.ct{font-size:9px;letter-spacing:.2em;color:var(--g);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:6px;}
.ct::before{content:'';width:2px;height:10px;background:var(--g);display:block;flex-shrink:0;}

/* GRID */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.fld{display:flex;flex-direction:column;gap:5px;}
.fld label{font-size:9px;color:var(--mu);letter-spacing:.15em;text-transform:uppercase;}
.sel{background:var(--dk);border:1px solid var(--br);padding:9px 12px;font-family:'Space Mono',monospace;font-size:11px;color:var(--tx);outline:none;transition:border-color .2s;width:100%;cursor:pointer;}
.sel:focus{border-color:var(--g);}
.sel option{background:#111;}

/* PATTERN TABS */
.ptabs{display:flex;border-bottom:1px solid var(--br);margin-bottom:14px;}
.ptab{padding:9px 18px;font-size:9px;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;border:none;background:none;font-family:'Space Mono',monospace;color:var(--mu);border-bottom:2px solid transparent;transition:all .2s;}
.ptab.tbull{color:var(--g);border-bottom-color:var(--g);}
.ptab.tbear{color:var(--re);border-bottom-color:var(--re);}
.ptab.tneut{color:var(--ye);border-bottom-color:var(--ye);}

.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
.pbtn{background:var(--dk);border:1px solid var(--br);padding:10px 12px;cursor:pointer;text-align:left;font-family:'Space Mono',monospace;transition:all .15s;position:relative;}
.pbtn:hover{border-color:var(--mu);}
.pbtn.sbull{border-color:var(--g);background:rgba(0,255,65,.07);}
.pbtn.sbear{border-color:var(--re);background:rgba(255,51,51,.07);}
.pbtn.sneut{border-color:var(--ye);background:rgba(255,221,0,.07);}
.pname{font-size:10px;color:#fff;font-weight:700;display:block;margin-bottom:3px;line-height:1.3;}
.ploc{font-size:8px;color:var(--mu);}
.ppts{position:absolute;top:7px;right:9px;font-size:9px;font-weight:700;}
.MAX{color:var(--g);} .HIGH{color:#88ff88;} .MEDIUM{color:var(--ye);} .WAIT{color:var(--mu);}
.ntag{background:var(--g);color:var(--bk);font-size:7px;font-weight:700;padding:1px 4px;margin-left:4px;vertical-align:middle;}

/* SELECTED PATTERN DISPLAY */
.psel{padding:14px;border:1px solid var(--br);background:var(--bk);margin-top:10px;display:flex;gap:12px;align-items:flex-start;}
.pbadge{font-size:8px;font-weight:700;letter-spacing:.1em;padding:3px 8px;text-transform:uppercase;flex-shrink:0;margin-top:2px;}
.pselname{font-size:12px;color:#fff;font-weight:700;margin-bottom:4px;}
.pseldesc{font-size:10px;color:var(--mu);line-height:1.6;font-style:italic;}
.pselloc{font-size:9px;color:var(--g);margin-top:5px;}

/* PATTERN SUMMARY BAR */
.pbar{margin-top:10px;padding:10px 14px;background:var(--bk);border:1px solid var(--br);display:flex;gap:24px;font-size:10px;color:var(--mu);}

/* SCAN BUTTON */
.scanbtn{background:var(--g);color:var(--bk);border:none;padding:15px;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;width:100%;transition:all .15s;}
.scanbtn:hover{background:#fff;}
.resetbtn{background:transparent;border:1px solid var(--br);color:var(--mu);padding:10px;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.15em;cursor:pointer;width:100%;text-transform:uppercase;transition:all .2s;margin-top:6px;}
.resetbtn:hover{border-color:var(--g);color:var(--g);}

/* ── RIGHT PANEL ── */
.placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:420px;gap:16px;text-align:center;}
.pico{font-size:56px;opacity:.12;}
.ptxt{font-size:11px;color:var(--mu);line-height:1.8;font-style:italic;max-width:280px;}
.pref{font-size:10px;color:var(--mu);line-height:2.2;margin-top:8px;border:1px solid var(--br);padding:14px 18px;background:var(--cd);text-align:left;width:100%;max-width:280px;}
.pref-title{font-size:9px;color:var(--g);letter-spacing:.2em;margin-bottom:6px;}

/* DUAL SCORE */
.dualtitle{font-size:9px;color:var(--mu);letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px;}
.dual{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.scard{border:1px solid var(--br);padding:22px;position:relative;transition:all .3s;}
.scard.wbull{border-color:var(--g);background:rgba(0,255,65,.03);}
.scard.wbear{border-color:var(--re);background:rgba(255,51,51,.03);}
.scard.loser{opacity:.45;}
.wtag{position:absolute;top:-1px;left:50%;transform:translateX(-50%);font-size:8px;font-weight:700;padding:3px 10px;letter-spacing:.15em;white-space:nowrap;}
.wtag.bull{background:var(--g);color:var(--bk);}
.wtag.bear{background:var(--re);color:#fff;}
.sdir{font-size:9px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px;}
.sdir.bull{color:var(--g);}
.sdir.bear{color:var(--re);}
.bnum{font-family:'Playfair Display',serif;font-size:60px;font-weight:900;line-height:1;}
.bnum.hi{color:var(--g);} .bnum.mi{color:var(--ye);} .bnum.lo{color:var(--re);} .bnum.ze{color:var(--mu);}
.ssig{font-size:10px;font-weight:700;margin-top:8px;letter-spacing:.06em;line-height:1.4;}
.sbar{height:3px;background:var(--br);margin-top:10px;border-radius:2px;}
.sbar-fill{height:100%;border-radius:2px;transition:width .6s ease;}

.bdwn{margin-top:14px;border-top:1px solid var(--br);padding-top:12px;display:flex;flex-direction:column;gap:0;}
.brow{display:flex;justify-content:space-between;align-items:flex-start;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.03);font-size:9px;}
.brow:last-child{border-bottom:none;}
.blbl{color:var(--mu);flex:1;}
.bpts{font-weight:700;min-width:28px;text-align:right;}
.pos{color:var(--g);} .neg{color:var(--re);} .zer{color:var(--mu);}

/* TRADE CARD */
.tcard{background:var(--cd);border:1px solid var(--br);padding:22px;}
.tcard-title{font-size:9px;letter-spacing:.2em;color:var(--g);text-transform:uppercase;margin-bottom:14px;}
.tradebox{padding:18px;}
.tradebox.bull{border:1px solid rgba(0,255,65,.25);background:rgba(0,255,65,.04);}
.tradebox.bear{border:1px solid rgba(255,51,51,.25);background:rgba(255,51,51,.04);}
.tradebox.wait{border:1px solid var(--br);background:var(--bk);}
.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;}
.tlbl{font-size:9px;color:var(--mu);letter-spacing:.12em;text-transform:uppercase;display:block;margin-bottom:3px;}
.tval{font-size:14px;font-weight:700;color:#fff;}

.rules{display:flex;flex-direction:column;gap:6px;margin-top:12px;}
.rule{font-size:10px;padding:8px 12px;line-height:1.5;}
.rule.blk{background:rgba(255,51,51,.08);border-left:2px solid var(--re);color:#ffaaaa;}
.rule.wrn{background:rgba(255,221,0,.06);border-left:2px solid var(--ye);color:#ffffaa;}
.rule.ok{background:rgba(0,255,65,.06);border-left:2px solid var(--g);color:#aaffaa;}

/* COMPARISON BAR */
.compcard{background:var(--cd);border:1px solid var(--br);padding:22px;}
.comp-title{font-size:9px;letter-spacing:.2em;color:var(--g);text-transform:uppercase;margin-bottom:16px;}
.cbar-wrap{display:flex;flex-direction:column;gap:10px;}
.cbar-row{display:flex;align-items:center;gap:12px;}
.cbar-label{font-size:10px;width:44px;letter-spacing:.08em;}
.cbar-track{flex:1;height:22px;background:var(--dk);border:1px solid var(--br);position:relative;overflow:hidden;}
.cbar-fill{position:absolute;left:0;top:0;height:100%;transition:width .6s ease;}
.cbar-score{font-size:16px;font-weight:700;font-family:'Playfair Display',serif;width:36px;text-align:right;}
.verdict{margin-top:14px;font-size:10px;color:var(--mu);font-style:italic;line-height:1.7;border-left:2px solid var(--br);padding-left:12px;}

/* WEIGHTS */
.wgtcard{background:var(--cd);border:1px solid var(--br);padding:18px 22px;}
.wgt-title{font-size:9px;color:var(--g);letter-spacing:.2em;margin-bottom:12px;}
.wgt-row{display:flex;justify-content:space-between;font-size:10px;padding:4px 0;}
.wgt-row span:last-child{color:#fff;}

@media(max-width:1000px){.layout{grid-template-columns:1fr;}.dual{grid-template-columns:1fr 1fr;}}
@media(max-width:640px){.dual{grid-template-columns:1fr;}.pgrid{grid-template-columns:1fr 1fr;}.nav{padding:14px 20px;}.left,.right{padding:20px;}}
`;

// ─── DEFAULTS ─────────────────────────────────────────────────────────────
const DEF = {
  king_node:"above", trinity:"all3", vix_direction:"bull", vix_level:"normal",
  vix_broke_node:"no", vwap:"up", node_value:"100k", tod:"prime",
  dow:"mon", analyst:"quant_giul", orb:"none", flow:"none", structure:"none", pcr:"none",
};

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function ScorerPage() {
  const [inp, setInp] = useState({...DEF});
  const [patTab, setPatTab] = useState<"bull"|"bear"|"neut">("bull");
  const [bullPat, setBullPat] = useState<any>(null);
  const [bearPat, setBearPat] = useState<any>(null);
  const [result, setResult] = useState<{bull:any;bear:any}|null>(null);

  const set = (k:string,v:string) => setInp(p=>({...p,[k]:v}));

  const scan = () => {
    setResult({
      bull: calcScore("bull", inp, bullPat),
      bear: calcScore("bear", inp, bearPat),
    });
  };

  const reset = () => { setInp({...DEF}); setBullPat(null); setBearPat(null); setResult(null); setPatTab("bull"); };

  const winner = result
    ? result.bull.score > result.bear.score ? "bull"
    : result.bear.score > result.bull.score ? "bear"
    : "tie"
    : null;

  const nc = (s:number) => s>=80?"hi":s>=65?"mi":s>=40?"lo":"ze";

  const bestDir = winner && winner!=="tie" ? winner : null;
  const bestR = bestDir && result ? result[bestDir] : null;

  const curPats = patTab==="bull" ? BULL_PATTERNS : patTab==="bear" ? BEAR_PATTERNS : NEUT_PATTERNS;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>

      <nav className="nav">
        <a href="/dashboard" className="logo">ZERODTE.IO</a>
        <ul className="navlinks">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/scorer" className="on">Scorer</a></li>
          <li><a href="/journal">Journal</a></li>
        </ul>
      </nav>

      <div className="layout">

        {/* ── LEFT: INPUTS ── */}
        <div className="left">
          <div>
            <span className="chip"><span className="dot"/>Pattern Intelligence Engine · Dual Scan</span>
            <h1>Both Sides.<br/>Best Edge Wins.</h1>
            <p className="sub">Scores CALLS and PUTS simultaneously using {BULL_PATTERNS.length + BEAR_PATTERNS.length + NEUT_PATTERNS.length} patterns and 9 factors. No directional bias — the data picks the side.</p>
          </div>

          {/* PATTERN LIBRARY */}
          <div className="card">
            <div className="ct">
              Select Patterns
              <span style={{fontSize:9,color:"var(--mu)",marginLeft:4,fontWeight:400}}>pick one bull pattern + one bear pattern</span>
            </div>
            <div className="ptabs">
              {([["bull","🟢 Bullish (Calls)"],["bear","🔴 Bearish (Puts)"],["neut","🟡 Wait"]] as const).map(([t,l])=>(
                <button key={t} className={`ptab ${patTab===t?`t${t}`:""}`} onClick={()=>setPatTab(t)}>{l}
                  {t!=="neut" && <span style={{marginLeft:4,fontSize:8,color:"var(--mu)"}}>({t==="bull"?BULL_PATTERNS.length:BEAR_PATTERNS.length})</span>}
                </button>
              ))}
            </div>

            <div className="pgrid">
              {curPats.map(p=>{
                const isBullSel = bullPat?.id===p.id;
                const isBearSel = bearPat?.id===p.id;
                const cls = isBullSel?"sbull":isBearSel?"sbear":"";
                return (
                  <button key={p.id} className={`pbtn ${cls}`} onClick={()=>{
                    if (patTab==="bull") setBullPat(isBullSel?null:p);
                    else if (patTab==="bear") setBearPat(isBearSel?null:p);
                  }}>
                    <span className={`ppts ${p.strength}`}>{p.strength==="WAIT"?"—":`+${p.pts}`}</span>
                    <span className="pname">{p.name}{NEW_IDS.includes(p.id)&&<span className="ntag">NEW</span>}</span>
                    <span className="ploc">{p.loc}</span>
                  </button>
                );
              })}
            </div>

            {patTab==="bull" && bullPat && (
              <div className="psel">
                <span className="pbadge" style={{background:"var(--g)",color:"var(--bk)"}}>{bullPat.strength}</span>
                <div><div className="pselname">{bullPat.name}</div><div className="pseldesc">{bullPat.desc}</div><div className="pselloc">📍 {bullPat.loc}</div></div>
              </div>
            )}
            {patTab==="bear" && bearPat && (
              <div className="psel">
                <span className="pbadge" style={{background:"var(--re)",color:"#fff"}}>{bearPat.strength}</span>
                <div><div className="pselname">{bearPat.name}</div><div className="pseldesc">{bearPat.desc}</div><div className="pselloc">📍 {bearPat.loc}</div></div>
              </div>
            )}

            {(bullPat||bearPat) && (
              <div className="pbar">
                <span>CALLS: <strong style={{color:bullPat?"var(--g)":"var(--mu)"}}>{bullPat?.name||"none"}</strong></span>
                <span>PUTS: <strong style={{color:bearPat?"var(--re)":"var(--mu)"}}>{bearPat?.name||"none"}</strong></span>
              </div>
            )}
          </div>

          {/* MARKET CONDITIONS */}
          <div className="card">
            <div className="ct">Market Conditions</div>
            <div className="g2">
              <div className="fld"><label>King Node</label>
                <select className="sel" value={inp.king_node} onChange={e=>set("king_node",e.target.value)}>
                  <option value="above">★ Above Price (Bullish pull)</option>
                  <option value="below">★ Below Price (Bearish pull)</option>
                  <option value="at">★ AT Price (Pinned)</option>
                </select>
              </div>
              <div className="fld"><label>Trinity Alignment</label>
                <select className="sel" value={inp.trinity} onChange={e=>set("trinity",e.target.value)}>
                  <option value="all3">All 3 Aligned (MAX)</option>
                  <option value="2of3">2 of 3 Aligned (HIGH)</option>
                  <option value="1of3">1 of 3 (LOW)</option>
                  <option value="div">All Divergent (CHOP)</option>
                </select>
              </div>
              <div className="fld"><label>VIX King Node</label>
                <select className="sel" value={inp.vix_direction} onChange={e=>set("vix_direction",e.target.value)}>
                  <option value="bull">Node Below VIX → SPY Bullish</option>
                  <option value="bear">Node Above VIX → SPY Bearish</option>
                  <option value="neutral">Neutral / Unclear</option>
                </select>
              </div>
              <div className="fld"><label>VIX Level</label>
                <select className="sel" value={inp.vix_level} onChange={e=>set("vix_level",e.target.value)}>
                  <option value="normal">Under 20 (Normal)</option>
                  <option value="above22">At 22 Purple Node ⚠️</option>
                  <option value="above24">Above 24 — MAX FEAR 🔴</option>
                </select>
              </div>
              <div className="fld"><label>VIX Broke Its Node?</label>
                <select className="sel" value={inp.vix_broke_node} onChange={e=>set("vix_broke_node",e.target.value)}>
                  <option value="no">No — holding below</option>
                  <option value="yes">YES — broke through 🚨</option>
                </select>
              </div>
              <div className="fld"><label>VWAP Status</label>
                <select className="sel" value={inp.vwap} onChange={e=>set("vwap",e.target.value)}>
                  <option value="up">Sloping UP (Bullish)</option>
                  <option value="down">Sloping DOWN (Blocks longs)</option>
                  <option value="flat">Flat (Range day)</option>
                  <option value="reclaim">Just reclaimed VWAP (+12 bull)</option>
                </select>
              </div>
            </div>
          </div>

          {/* LEVELS & TIMING */}
          <div className="card">
            <div className="ct">Levels & Timing</div>
            <div className="g2">
              <div className="fld"><label>Node Dollar Value</label>
                <select className="sel" value={inp.node_value} onChange={e=>set("node_value",e.target.value)}>
                  <option value="200k">$200K+ (Gamma Wall)</option>
                  <option value="100k">$100K-200K (Major)</option>
                  <option value="50k">$50K-100K (Moderate)</option>
                  <option value="small">Under $50K (Weak)</option>
                </select>
              </div>
              <div className="fld"><label>Time of Day</label>
                <select className="sel" value={inp.tod} onChange={e=>set("tod",e.target.value)}>
                  <option value="prime">10AM-1PM (PRIME)</option>
                  <option value="mid">1PM-2PM (Mid-session)</option>
                  <option value="late">2PM-3:45PM (Danger zone)</option>
                  <option value="open">9:30-10AM (NO TRADE)</option>
                </select>
              </div>
              <div className="fld"><label>Day of Week</label>
                <select className="sel" value={inp.dow} onChange={e=>set("dow",e.target.value)}>
                  <option value="mon">Monday (Positive bias)</option>
                  <option value="tue">Tuesday (Neutral)</option>
                  <option value="wed">Wednesday (Positive bias)</option>
                  <option value="thu">Thursday — NEGATIVE ⚠️</option>
                  <option value="fri">Friday (Watch pins)</option>
                </select>
              </div>
              <div className="fld"><label>Analyst Consensus</label>
                <select className="sel" value={inp.analyst} onChange={e=>set("analyst",e.target.value)}>
                  <option value="all">All analysts agree (+10)</option>
                  <option value="quant_giul">Quant + Giul aligned</option>
                  <option value="cautious">Giul cautious only</option>
                  <option value="not_big">Quant: "Not big enough" (-15)</option>
                  <option value="conflict">Quant/Giul CONFLICT (-10)</option>
                  <option value="none">No data available</option>
                </select>
              </div>
            </div>
          </div>

          {/* ADVANCED SIGNALS */}
          <div className="card">
            <div className="ct">Advanced Signals <span style={{fontSize:9,color:"var(--g)",marginLeft:4}}>NEW</span></div>
            <div className="g2">
              <div className="fld"><label>ORB Status</label>
                <select className="sel" value={inp.orb} onChange={e=>set("orb",e.target.value)}>
                  <option value="none">Not confirmed / Pre-10AM</option>
                  <option value="bull">Broke above ORH (+5 bull)</option>
                  <option value="bear">Broke below ORL (+5 bear)</option>
                  <option value="inside">Still inside range</option>
                </select>
              </div>
              <div className="fld"><label>Options Flow Divergence</label>
                <select className="sel" value={inp.flow} onChange={e=>set("flow",e.target.value)}>
                  <option value="none">No divergence</option>
                  <option value="put_surge">Price UP + heavy put flow (+8 bear)</option>
                  <option value="call_surge">Price DOWN + heavy call flow (+8 bull)</option>
                </select>
              </div>
              <div className="fld"><label>Structure Above/Below</label>
                <select className="sel" value={inp.structure} onChange={e=>set("structure",e.target.value)}>
                  <option value="none">Normal</option>
                  <option value="ladder_above">Node ladder above price (+7 bull)</option>
                  <option value="air_below">Air pocket below price (+7 bear)</option>
                </select>
              </div>
              <div className="fld"><label>Put/Call Ratio Signal</label>
                <select className="sel" value={inp.pcr} onChange={e=>set("pcr",e.target.value)}>
                  <option value="none">Normal range</option>
                  <option value="extreme_call">Extreme call buying (+6 bull)</option>
                  <option value="extreme_put">Extreme put buying (+6 bear)</option>
                </select>
              </div>
            </div>
          </div>

          <button className="scanbtn" onClick={scan}>SCAN BOTH SIDES → CALLS vs PUTS</button>
          <button className="resetbtn" onClick={reset}>↺ RESET ALL</button>
        </div>

        {/* ── RIGHT: OUTPUT ── */}
        <div className="right">
          {!result ? (
            <div className="placeholder">
              <div className="pico">◎</div>
              <div style={{fontSize:10,color:"var(--g)",letterSpacing:".2em"}}>DUAL SCAN READY</div>
              <div className="ptxt">
                Select a bullish pattern for CALLS and a bearish pattern for PUTS, set your market conditions, then hit Scan Both Sides.<br/><br/>
                Both scores calculated simultaneously — the higher edge side is highlighted.
              </div>
              <div className="pref">
                <div className="pref-title">THRESHOLDS</div>
                <div style={{lineHeight:2.2}}>
                  80–100 → Full size trade<br/>
                  65–79 &nbsp;→ Reduced size (75%)<br/>
                  50–64 &nbsp;→ Low conviction (wait)<br/>
                  0–49 &nbsp;&nbsp;→ Stay flat
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* DUAL SCORE */}
              <div>
                <div className="dualtitle">Scan Results — Calls vs Puts</div>
                <div className="dual">
                  {(["bull","bear"] as const).map(dir=>{
                    const r = result[dir];
                    const isW = winner===dir;
                    const cls = isW ? `w${dir}` : winner!=="tie" ? "loser" : "";
                    return (
                      <div key={dir} className={`scard ${cls}`}>
                        {isW && <div className={`wtag ${dir}`}>▲ HIGHER EDGE</div>}
                        <div className={`sdir ${dir}`}>{dir==="bull"?"🟢 CALLS":"🔴 PUTS"}</div>
                        <div className={`bnum ${nc(r.score)}`}>{r.score}</div>
                        <div className="sbar"><div className="sbar-fill" style={{width:`${r.score}%`,background:r.score>=80?"var(--g)":r.score>=65?"var(--ye)":"var(--re)"}}/></div>
                        <div className="ssig" style={{color:dir==="bull"?"var(--g)":"var(--re)",opacity:r.score>=50?1:0.35}}>{r.signal}</div>
                        <div className="bdwn">
                          {r.rows.map((row:any,i:number)=>(
                            <div key={i} className="brow">
                              <span className="blbl">{row.l}</span>
                              <span className={`bpts ${row.pts>0?"pos":row.pts<0?"neg":"zer"}`}>{row.pts>0?`+${row.pts}`:row.pts||"0"}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COMPARISON BAR */}
              <div className="compcard">
                <div className="comp-title">Side by Side</div>
                <div className="cbar-wrap">
                  {(["bull","bear"] as const).map(dir=>(
                    <div key={dir} className="cbar-row">
                      <span className="cbar-label" style={{color:dir==="bull"?"var(--g)":"var(--re)"}}>{dir==="bull"?"CALLS":"PUTS"}</span>
                      <div className="cbar-track">
                        <div className="cbar-fill" style={{width:`${result[dir].score}%`,background:dir==="bull"?"rgba(0,255,65,.35)":"rgba(255,51,51,.35)"}}/>
                      </div>
                      <span className="cbar-score" style={{color:dir==="bull"?"var(--g)":"var(--re)"}}>{result[dir].score}</span>
                    </div>
                  ))}
                </div>
                <div className="verdict">
                  {winner==="bull" && result.bull.score>=65 && "Calls have higher conviction. If no blockers are active, this is your trade direction."}
                  {winner==="bear" && result.bear.score>=65 && "Puts have higher conviction. If no blockers are active, this is your trade direction."}
                  {winner==="tie" && "Both sides equal. Wait for a clearer read or stay flat."}
                  {winner!=="tie" && winner && result[winner].score<65 && "Neither side hits the 65+ threshold. Stay flat — no trade right now."}
                </div>
              </div>

              {/* BEST TRADE CARD */}
              {bestR && bestR.score>=50 && (
                <div className="tcard">
                  <div className="tcard-title">
                    {bestDir==="bull"?"🟢":"🔴"} {bestDir==="bull"?"Calls Trade Card":"Puts Trade Card"}
                    {bestR.score>=80 && <span style={{marginLeft:8,color:"var(--g)",fontSize:9}}>HIGH CONVICTION</span>}
                    {bestR.score>=65 && bestR.score<80 && <span style={{marginLeft:8,color:"var(--ye)",fontSize:9}}>TRADE ELIGIBLE</span>}
                    {bestR.score<65 && <span style={{marginLeft:8,color:"var(--mu)",fontSize:9}}>LOW CONVICTION</span>}
                  </div>
                  <div className={`tradebox ${bestR.score>=65?(bestDir==="bull"?"bull":"bear"):"wait"}`}>
                    <div className="tgrid">
                      <div><span className="tlbl">Signal</span><span className="tval" style={{color:bestDir==="bull"?"var(--g)":"var(--re)"}}>{bestDir==="bull"?"CALLS ↑":"PUTS ↓"}</span></div>
                      <div><span className="tlbl">Strike</span><span className="tval">{bestR.strike}</span></div>
                      <div><span className="tlbl">Size</span><span className="tval">{bestR.size}</span></div>
                      <div><span className="tlbl">Hard Exit</span><span className="tval">3:45 PM</span></div>
                      <div><span className="tlbl">Bull Pattern</span><span className="tval" style={{fontSize:11}}>{bullPat?.name||"—"}</span></div>
                      <div><span className="tlbl">Bear Pattern</span><span className="tval" style={{fontSize:11}}>{bearPat?.name||"—"}</span></div>
                    </div>
                  </div>

                  {(bestR.blocked.length>0||bestR.rules.length>0) && (
                    <div className="rules">
                      {bestR.blocked.map((r:string,i:number)=>(
                        <div key={i} className="rule blk">🚫 {r}</div>
                      ))}
                      {bestR.rules.map((r:string,i:number)=>(
                        <div key={i} className={`rule ${r.startsWith("✅")?"ok":"wrn"}`}>{r}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SCORING WEIGHTS */}
              <div className="wgtcard">
                <div className="wgt-title">Scoring Weights</div>
                {[["King Node","20pts"],["Trinity","15pts"],["Pattern","15pts"],["VIX Direction","15pts"],["VWAP","10pts"],["Node Value","10pts"],["Time of Day","10pts"],["Day of Week","5pts"],["Analyst Consensus","5pts"]].map(([k,v])=>(
                  <div key={k} className="wgt-row"><span>{k}</span><span>{v}</span></div>
                ))}
              </div>

              <button className="resetbtn" onClick={reset}>↺ NEW SCAN</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
