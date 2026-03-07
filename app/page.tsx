"use client";
import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&family=DM+Serif+Display:ital@0;1&display=swap');
  :root {
    --green: #00ff41; --green-dim: #00cc33; --black: #0a0a0a; --dark: #111111;
    --card: #141414; --border: #1f1f1f; --text: #e8e8e8; --muted: #666; --red: #ff3333;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { background:var(--black); color:var(--text); font-family:'Space Mono',monospace; font-size:14px; overflow-x:hidden; cursor:crosshair; }

  /* NAV */
  .zd-nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:18px 48px; background:rgba(10,10,10,0.95); backdrop-filter:blur(10px); border-bottom:1px solid var(--border); transition:border-color 0.3s; }
  .zd-logo { font-family:'Space Mono',monospace; font-size:13px; font-weight:700; color:var(--green); letter-spacing:0.15em; text-decoration:none; }
  .zd-nav-links { display:flex; gap:40px; list-style:none; align-items:center; }
  .zd-nav-links a { font-size:10px; letter-spacing:0.2em; color:var(--muted); text-decoration:none; text-transform:uppercase; transition:color 0.2s; }
  .zd-nav-links a:hover { color:var(--green); }
  .zd-nav-cta { background:var(--green)!important; color:var(--black)!important; padding:8px 20px!important; font-weight:700!important; letter-spacing:0.15em!important; cursor:pointer; }

  /* HERO */
  .zd-hero { min-height:100vh; display:flex; flex-direction:column; justify-content:center; padding:120px 48px 80px; position:relative; overflow:hidden; max-width:100%; }
  .zd-hero-inner { max-width:1200px; margin:0 auto; position:relative; z-index:1; }
  .zd-hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .zd-grid-bg { position:absolute; inset:0; background-image:linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px); background-size:60px 60px; pointer-events:none; }
  .zd-badge { display:inline-block; font-size:10px; letter-spacing:0.25em; color:var(--green); margin-bottom:28px; text-transform:uppercase; }
  .zd-badge::before { content:'▸ '; }
  .zd-h1 { font-family:'Playfair Display',serif; font-size:clamp(48px,6vw,84px); font-weight:900; line-height:1.0; letter-spacing:-0.02em; color:#fff; margin-bottom:28px; }
  .zd-h1 .accent { color:var(--green); }
  .zd-hero-sub { font-family:'Space Mono',monospace; font-size:13px; color:var(--muted); line-height:1.8; max-width:420px; margin-bottom:48px; font-style:italic; }
  .zd-hero-actions { display:flex; align-items:center; gap:24px; flex-wrap:wrap; }
  .zd-btn-primary { background:var(--green); color:var(--black); border:none; padding:16px 40px; font-family:'Space Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; text-decoration:none; display:inline-block; transition:all 0.15s; }
  .zd-btn-primary:hover { background:#fff; transform:translateY(-2px); }
  .zd-hero-price { font-size:11px; color:var(--muted); letter-spacing:0.1em; }
  .zd-hero-price span { color:var(--green); }

  /* HERO READOUT */
  .zd-readout { background:var(--card); border:1px solid var(--border); padding:32px; }
  .zd-readout-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--border); }
  .zd-readout-label { font-size:10px; letter-spacing:0.2em; color:var(--green); text-transform:uppercase; }
  .zd-live-dot { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--green); }
  .zd-live-dot::before { content:''; width:6px; height:6px; background:var(--green); border-radius:50%; animation:zdpulse 1.5s infinite; }
  @keyframes zdpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .zd-scorecard-row { display:flex; justify-content:space-between; align-items:center; font-size:11px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .zd-scorecard-row .lbl { color:var(--muted); letter-spacing:0.1em; }
  .zd-scorecard-row .val { font-weight:700; }
  .vg { color:var(--green); } .vr { color:var(--red); } .vw { color:#fff; }
  .zd-score-big { display:flex; align-items:center; gap:12px; margin-top:20px; padding:20px; background:rgba(0,255,65,0.05); border:1px solid rgba(0,255,65,0.15); }
  .zd-score-num { font-family:'Playfair Display',serif; font-size:56px; font-weight:900; color:var(--green); line-height:1; }
  .zd-score-info { font-size:10px; color:var(--muted); letter-spacing:0.1em; }
  .zd-score-info strong { color:#fff; display:block; margin-bottom:4px; font-size:12px; }

  /* TICKER */
  .zd-ticker { background:var(--green); padding:10px 0; overflow:hidden; white-space:nowrap; }
  .zd-ticker-content { display:inline-flex; gap:60px; animation:zdticker 30s linear infinite; }
  .zd-ticker-content span { font-family:'Space Mono',monospace; font-size:10px; font-weight:700; color:var(--black); letter-spacing:0.15em; text-transform:uppercase; }
  @keyframes zdticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

  /* STATS */
  .zd-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); }
  .zd-stat { background:var(--card); padding:40px 32px; text-align:center; }
  .zd-stat-num { font-family:'Playfair Display',serif; font-size:48px; font-weight:900; color:var(--green); display:block; line-height:1; margin-bottom:8px; }
  .zd-stat-desc { font-size:10px; color:var(--muted); letter-spacing:0.15em; text-transform:uppercase; }

  /* SECTIONS */
  .zd-section { padding:100px 48px; max-width:1200px; margin:0 auto; }
  .zd-section-full { padding:100px 48px; }
  .zd-section-inner { max-width:1200px; margin:0 auto; }
  .zd-section-label { font-size:10px; letter-spacing:0.3em; color:var(--green); text-transform:uppercase; margin-bottom:20px; display:block; }
  .zd-h2 { font-family:'Playfair Display',serif; font-size:clamp(36px,4vw,56px); font-weight:900; line-height:1.05; color:#fff; margin-bottom:20px; }
  .zd-section-sub { font-size:13px; color:var(--muted); line-height:1.8; max-width:500px; margin-bottom:60px; font-style:italic; }

  /* HOW IT WORKS */
  .zd-steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); }
  .zd-step { background:var(--card); padding:48px 36px; transition:background 0.2s; }
  .zd-step:hover { background:#181818; }
  .zd-step-num { font-family:'Playfair Display',serif; font-size:72px; font-weight:900; color:rgba(0,255,65,0.1); line-height:1; margin-bottom:20px; display:block; }
  .zd-step-title { font-size:14px; font-weight:700; color:#fff; letter-spacing:0.05em; margin-bottom:12px; text-transform:uppercase; }
  .zd-step-desc { font-size:12px; color:var(--muted); line-height:1.8; font-style:italic; }
  .zd-step-tag { display:inline-block; margin-top:20px; font-size:10px; color:var(--green); letter-spacing:0.15em; border:1px solid rgba(0,255,65,0.3); padding:4px 10px; }

  /* FEATURES */
  .zd-features-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); }
  .zd-feature { background:var(--card); padding:48px 40px; border-left:3px solid transparent; transition:all 0.2s; }
  .zd-feature:hover { background:#161616; border-left-color:var(--green); }
  .zd-feature-icon { font-size:28px; margin-bottom:20px; display:block; }
  .zd-feature-title { font-family:'Playfair Display',serif; font-size:24px; font-weight:700; color:#fff; margin-bottom:14px; }
  .zd-feature-desc { font-size:12px; color:var(--muted); line-height:1.9; margin-bottom:24px; font-style:italic; }
  .zd-bullets { list-style:none; display:flex; flex-direction:column; gap:8px; }
  .zd-bullets li { font-size:11px; color:var(--text); letter-spacing:0.05em; padding-left:16px; position:relative; }
  .zd-bullets li::before { content:'▸'; position:absolute; left:0; color:var(--green); }

  /* TRINITY */
  .zd-trinity-layout { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
  .zd-trinity-table { width:100%; border-collapse:collapse; border:1px solid var(--border); }
  .zd-trinity-table th { background:var(--black); font-size:10px; letter-spacing:0.15em; color:var(--green); text-transform:uppercase; padding:14px 18px; text-align:left; border-bottom:1px solid var(--border); }
  .zd-trinity-table td { padding:14px 18px; font-size:11px; color:var(--text); border-bottom:1px solid rgba(255,255,255,0.04); }
  .zd-trinity-table tr:hover td { background:rgba(255,255,255,0.02); }
  .bmax { color:var(--green); font-weight:700; } .bhigh { color:#88ff88; } .blow { color:var(--muted); } .bnone { color:var(--red); }

  /* HEATMAP MOCK */
  .zd-heatmap-card { background:var(--card); border:1px solid var(--border); padding:32px; }
  .zd-heatmap { display:flex; flex-direction:column; gap:4px; margin-bottom:24px; }
  .zd-hm-row { display:flex; align-items:center; gap:10px; }
  .zd-hm-price { width:48px; text-align:right; color:var(--muted); font-size:10px; }
  .zd-hm-bar { height:20px; border-radius:2px; }
  .hm-y { background:#ffdd00; } .hm-g { background:#00aa44; } .hm-t { background:#008888; } .hm-pl { background:#8844aa; } .hm-pd { background:#4400aa; }
  .zd-king-star { font-size:16px; margin-left:6px; animation:zdstar 2s infinite; }
  @keyframes zdstar { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.2)} }
  .zd-hm-current { border-top:1px dashed var(--green); border-bottom:1px dashed var(--green); padding:6px 0; margin:4px 0; }

  /* SESSION */
  .zd-session-grid { display:grid; grid-template-columns:1fr 2fr; gap:1px; background:var(--border); }
  .zd-session-sidebar { background:var(--card); padding:40px 32px; }
  .zd-session-main { background:var(--card); padding:40px; }
  .zd-result-card { background:rgba(0,255,65,0.05); border:1px solid rgba(0,255,65,0.2); padding:24px; margin-top:20px; }
  .zd-result-num { font-family:'Playfair Display',serif; font-size:40px; font-weight:900; color:var(--green); }
  .zd-result-label { font-size:10px; color:var(--muted); letter-spacing:0.15em; text-transform:uppercase; margin-top:4px; }
  .zd-event { display:grid; grid-template-columns:70px 1fr; gap:16px; padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .zd-event-time { font-size:10px; color:var(--green); letter-spacing:0.1em; padding-top:2px; }
  .zd-event-text { font-size:11px; color:var(--text); line-height:1.6; }
  .zd-event-text strong { color:#fff; }
  .eg { color:var(--green); } .er { color:var(--red); }

  /* COMMANDMENTS */
  .zd-cmd-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--border); }
  .zd-cmd { background:var(--card); padding:28px 32px; display:flex; gap:20px; align-items:flex-start; transition:background 0.2s; }
  .zd-cmd:hover { background:#161616; }
  .zd-cmd-num { font-family:'Playfair Display',serif; font-size:32px; font-weight:900; color:rgba(0,255,65,0.25); line-height:1; flex-shrink:0; width:32px; }
  .zd-cmd-text { font-size:12px; color:var(--text); line-height:1.7; }
  .zd-cmd-text strong { color:#fff; display:block; margin-bottom:4px; font-size:13px; }

  /* ANALYSTS */
  .zd-analysts-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); }
  .zd-analyst { background:var(--card); padding:40px 28px; transition:background 0.2s; }
  .zd-analyst:hover { background:#161616; }
  .zd-analyst-handle { font-size:11px; color:var(--green); letter-spacing:0.1em; margin-bottom:8px; }
  .zd-analyst-name { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#fff; margin-bottom:12px; }
  .zd-analyst-desc { font-size:11px; color:var(--muted); line-height:1.7; font-style:italic; margin-bottom:20px; }
  .zd-badge-primary { background:var(--green); color:var(--black); font-weight:700; font-size:9px; letter-spacing:0.15em; padding:4px 10px; display:inline-block; text-transform:uppercase; }
  .zd-badge-secondary { border:1px solid var(--border); color:var(--muted); font-size:9px; letter-spacing:0.15em; padding:4px 10px; display:inline-block; text-transform:uppercase; }

  /* PRICING */
  .zd-pricing-layout { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); max-width:900px; }
  .zd-pricing-card { background:var(--card); padding:56px 48px; }
  .zd-pricing-card.featured { background:#141f14; border:1px solid rgba(0,255,65,0.3); }
  .zd-pricing-tag { font-size:9px; letter-spacing:0.25em; text-transform:uppercase; padding:4px 12px; margin-bottom:32px; display:inline-block; }
  .zd-pricing-tag.green { background:var(--green); color:var(--black); font-weight:700; }
  .zd-pricing-tag.dim { border:1px solid var(--border); color:var(--muted); }
  .zd-price { font-family:'Playfair Display',serif; font-size:64px; font-weight:900; color:#fff; line-height:1; }
  .zd-price-period { font-size:12px; color:var(--muted); letter-spacing:0.1em; margin-bottom:32px; display:block; margin-top:6px; }
  .zd-price-features { list-style:none; display:flex; flex-direction:column; gap:14px; margin-bottom:40px; }
  .zd-price-features li { font-size:12px; color:var(--text); padding-left:18px; position:relative; line-height:1.5; }
  .zd-price-features li::before { content:'✓'; position:absolute; left:0; color:var(--green); font-weight:700; }
  .zd-price-features li.no { color:var(--muted); text-decoration:line-through; }
  .zd-price-features li.no::before { content:'✗'; color:var(--muted); }

  /* WAITLIST FORM */
  .zd-waitlist-form { display:flex; gap:0; max-width:460px; }
  .zd-waitlist-form input { flex:1; background:var(--dark); border:1px solid var(--border); border-right:none; padding:14px 20px; font-family:'Space Mono',monospace; font-size:12px; color:var(--text); outline:none; transition:border-color 0.2s; }
  .zd-waitlist-form input:focus { border-color:var(--green); }
  .zd-waitlist-form input::placeholder { color:var(--muted); }
  .zd-waitlist-form button { background:var(--green); color:var(--black); border:none; padding:14px 24px; font-family:'Space Mono',monospace; font-size:11px; font-weight:700; letter-spacing:0.15em; cursor:pointer; white-space:nowrap; text-transform:uppercase; transition:background 0.2s; }
  .zd-waitlist-form button:hover { background:#fff; }

  /* FAQ */
  .zd-faq { display:flex; flex-direction:column; max-width:800px; border:1px solid var(--border); }
  .zd-faq-item { border-bottom:1px solid var(--border); cursor:pointer; }
  .zd-faq-item:last-child { border-bottom:none; }
  .zd-faq-q { display:flex; justify-content:space-between; align-items:center; padding:24px 28px; font-size:13px; color:#fff; user-select:none; transition:background 0.2s; }
  .zd-faq-q:hover { background:rgba(255,255,255,0.02); }
  .zd-faq-q .arr { color:var(--green); font-size:16px; transition:transform 0.2s; flex-shrink:0; }
  .zd-faq-a { display:none; padding:0 28px 24px; font-size:12px; color:var(--muted); line-height:1.8; font-style:italic; border-top:1px solid var(--border); }
  .zd-faq-item.open .zd-faq-a { display:block; }
  .zd-faq-item.open .arr { transform:rotate(90deg); }
  .zd-faq-item.open .zd-faq-q { color:var(--green); }

  /* CTA */
  .zd-cta { background:var(--green); padding:80px 48px; text-align:center; }
  .zd-cta .zd-h2 { color:var(--black); }
  .zd-cta p { font-size:14px; color:rgba(0,0,0,0.6); margin-bottom:40px; font-style:italic; letter-spacing:0.05em; }
  .zd-btn-dark { background:var(--black); color:var(--green); border:none; padding:18px 52px; font-family:'Space Mono',monospace; font-size:12px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; text-decoration:none; display:inline-block; transition:all 0.15s; }
  .zd-btn-dark:hover { background:#111; transform:translateY(-2px); }

  /* FOOTER */
  .zd-footer { background:var(--black); border-top:1px solid var(--border); padding:60px 48px 40px; }
  .zd-footer-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:60px; margin-bottom:48px; }
  .zd-footer-col h4 { font-size:10px; letter-spacing:0.2em; color:var(--green); text-transform:uppercase; margin-bottom:20px; }
  .zd-footer-col ul { list-style:none; display:flex; flex-direction:column; gap:10px; }
  .zd-footer-col ul a { font-size:11px; color:var(--muted); text-decoration:none; letter-spacing:0.05em; transition:color 0.2s; }
  .zd-footer-col ul a:hover { color:var(--green); }
  .zd-footer-bottom { max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; padding-top:24px; border-top:1px solid var(--border); font-size:10px; color:var(--muted); letter-spacing:0.1em; }
  .zd-disclaimer { font-size:10px; color:rgba(102,102,102,0.6); text-align:center; padding:0 48px 40px; max-width:1200px; margin:0 auto; line-height:1.6; font-style:italic; }

  /* DARK BG SECTIONS */
  .bg-dark { background:var(--dark); }

  /* UTILS */
  .mt-1 { margin-top:8px; } .mt-2 { margin-top:16px; } .mt-3 { margin-top:20px; } .mt-4 { margin-top:24px; } .mt-5 { margin-top:32px; }
  .p-box { padding:24px; } .p-box-lg { padding:32px; }
  .border-green { border:1px solid rgba(0,255,65,0.2); background:rgba(0,255,65,0.05); }
  .border-l-green { border-left:3px solid var(--green); background:rgba(0,255,65,0.03); padding:20px 24px; }
  .text-green { color:var(--green); } .text-red { color:var(--red); } .text-white { color:#fff; } .text-muted { color:var(--muted); }
  .text-xs { font-size:10px; letter-spacing:0.15em; } .text-sm { font-size:12px; } .text-bold { font-weight:700; }
  .serif { font-family:'Playfair Display',serif; }
  .row-sb { display:flex; justify-content:space-between; align-items:center; }
  .col { display:flex; flex-direction:column; gap:12px; }
`;

export default function Home() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleJoin = () => {
    if (email && email.includes("@")) {
      setJoined(true);
      setEmail("");
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
  };

  const faqs = [
    { q: "What is 0DTE trading and do I need experience?", a: "0DTE (zero days to expiration) options expire the same day they're traded. They offer massive leverage and daily opportunities — but they decay to zero by 4PM. This platform is designed for traders who already understand options basics. It's not an intro course. It's an edge layer on top of knowledge you already have." },
    { q: "What exactly is a GEX heatmap?", a: "GEX = Gamma Exposure. It's calculated as Gamma × Open Interest × 100 × Spot Price, giving the dollar amount of hedging dealers must perform at each strike price. Positive GEX (yellow/green) means dealers buy the dip — creating support. Negative GEX (purple) means dealers sell into weakness — creating acceleration zones." },
    { q: "What is the King Node?", a: "The King Node (★) is the single largest gamma position in the entire heatmap — the most powerful gravitational force on price for that day. King Node above price = bullish bias. King Node below price = bearish bias. King Node at price = pinned range. Every analysis starts here." },
    { q: "Is this a signal service? Do you tell me exactly what to trade?", a: "No. This is an intelligence platform. It gives you the AI score, the King Node reading, the analyst consensus, and the full setup context. You make the trade decision. We are not financial advisors. Nothing here is financial advice." },
    { q: "Why no free trial?", a: "The Skylit Framework is a serious methodology built over months of live trading sessions. A free trial attracts traders who aren't serious enough to use it correctly. At $200/month, we filter for traders who understand value. If the price feels steep, this platform isn't for you — and that's intentional." },
    { q: "When does the platform launch?", a: "We're currently in active development and taking waitlist signups. Waitlist members will be first to access at launch pricing. Phase 1 MVP in weeks 1-4, full platform with all intelligence features by week 16. Join the waitlist to lock in early pricing." },
  ];

  const commandments = [
    { rule: "Never trade the open flush (9:30–10:00 AM)", why: "Volume is chaotic. Wait for structure to establish. Open flush = no trade signal." },
    { rule: "Wait for candle CLOSE — never enter on a wick", why: "Wicks are traps. Closes are confirmations. One rule. Zero exceptions." },
    { rule: "Declining VWAP = no long trades. Ever.", why: "Fighting the trend destroys the position. VWAP rejection will trap you every time." },
    { rule: "Check VIX direction before every trade", why: "VIX King Node is a required filter. Non-negotiable. VIX above its purple node = no longs." },
    { rule: "Score must be 65+ to trade, 80+ for full size", why: "Discipline over FOMO. Below threshold = no trade regardless of how obvious it looks." },
    { rule: "Trinity divergence = reduce size 50%", why: "Two markets disagreeing means chop. Protect capital. Size down or stay flat." },
    { rule: "Never hold through geopolitical headlines", why: "Whipsaw in both directions simultaneously. Exit first, assess after VIX stabilizes." },
    { rule: "3:45 PM hard exit — no exceptions", why: "Final 15 minutes is a danger zone. Always flat by 3:45. No hope trades." },
    { rule: "Cross-reference Bobby with Giul before entering", why: "Bobby called long while Giul said caution on 3/5/26. Conflict = no trade. Always." },
    { rule: "Staying flat IS a trade", why: "Protecting capital on low-conviction days is the highest skill. Cash is a position." },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* NAV */}
      <nav className="zd-nav">
        <a href="#" className="zd-logo">ZERODTE.IO</a>
        <ul className="zd-nav-links">
          <li><a href="#" onClick={e => { e.preventDefault(); scrollTo("how-it-works"); }}>System</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); scrollTo("features"); }}>Features</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); scrollTo("trinity"); }}>Trinity</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); scrollTo("pricing"); }}>Pricing</a></li>
          <li><a href="#" className="nav-cta zd-nav-cta" onClick={e => { e.preventDefault(); scrollTo("pricing"); }}>JOIN WAITLIST</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <div className="zd-hero">
        <div className="zd-grid-bg" />
        <div className="zd-hero-inner">
          <div className="zd-hero-grid">
            <div>
              <span className="zd-badge">Now accepting waitlist</span>
              <h1 className="zd-h1">Stop<br />Guessing.<br /><span className="accent">Read the Market</span><br />Like a Machine.</h1>
              <p className="zd-hero-sub">Real-time GEX heatmap analysis, AI-scored trade setups, and King Node intelligence for serious 0DTE SPY traders.</p>
              <div className="zd-hero-actions">
                <a href="#" className="zd-btn-primary" onClick={e => { e.preventDefault(); scrollTo("pricing"); }}>JOIN THE WAITLIST</a>
                <span className="zd-hero-price"><span>$200</span>/month · Serious traders only</span>
              </div>
            </div>
            <div className="zd-readout">
              <div className="zd-readout-header">
                <span className="zd-readout-label">LIVE SCORE CARD</span>
                <span className="zd-live-dot">LIVE</span>
              </div>
              {[
                ["KING NODE", "ABOVE PRICE ↑", "vg"],
                ["VIX DIRECTION", "BULLISH SPY", "vg"],
                ["TRINITY", "ALIGNED ✓", "vw"],
                ["VWAP", "SLOPING UP", "vg"],
                ["CANDLE PATTERN", "HAMMER", "vw"],
                ["TIME OF DAY", "PRIME WINDOW", "vg"],
                ["DAY OF WEEK", "FULL SIZE", "vg"],
                ["SIGNAL", "CALLS ↑", "vg"],
              ].map(([label, value, cls]) => (
                <div key={label} className="zd-scorecard-row">
                  <span className="lbl">{label}</span>
                  <span className={`val ${cls}`}>{value}</span>
                </div>
              ))}
              <div className="zd-score-big">
                <div className="zd-score-num">87</div>
                <div className="zd-score-info">
                  <strong>AI TRADE SCORE</strong>
                  ENTRY: ATM · FULL SIZE<br />TARGET 1: +$2.80 · STOP: $1.20
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="zd-ticker">
        <div className="zd-ticker-content">
          {["GEX HEATMAP ANALYSIS", "★ KING NODE INTELLIGENCE", "AI SCORING ENGINE", "TRINITY ALIGNMENT", "LIVE ANALYST FEED", "VWAP FILTER SYSTEM", "REVERSE RUG DETECTION", "0DTE SPY SIGNALS", "$200/MONTH", "SERIOUS TRADERS ONLY",
            "GEX HEATMAP ANALYSIS", "★ KING NODE INTELLIGENCE", "AI SCORING ENGINE", "TRINITY ALIGNMENT", "LIVE ANALYST FEED", "VWAP FILTER SYSTEM", "REVERSE RUG DETECTION", "0DTE SPY SIGNALS", "$200/MONTH", "SERIOUS TRADERS ONLY"
          ].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* STATS */}
      <div className="bg-dark">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="zd-stats-row">
            {[["6", "Question heatmap checklist"], ["15", "Step entry protocol"], ["9", "AI scoring variables"], ["3", "Trinity instruments tracked"]].map(([n, d]) => (
              <div key={n} className="zd-stat">
                <span className="zd-stat-num">{n}</span>
                <span className="zd-stat-desc">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" className="bg-dark zd-section-full">
        <div className="zd-section-inner">
          <span className="zd-section-label">The System</span>
          <h2 className="zd-h2">Built in the<br /><em style={{ fontStyle: "italic", color: "var(--green)" }}>live market.</em></h2>
          <p className="zd-section-sub">The Skylit Framework is a systematic approach to reading GEX heatmaps, identifying King Nodes, and generating AI-scored trade setups — developed over multiple live 0DTE sessions.</p>
          <div className="zd-steps-grid">
            {[
              { n: "01", title: "Read the Heatmap", desc: "Identify King Node position, analyze above and below price zones, map yellow ladders vs purple ceilings. Run the 6-question checklist in under 30 seconds.", tag: "GEX ANALYSIS" },
              { n: "02", title: "Score the Setup", desc: "The AI scorer combines King Node proximity, Trinity alignment, candlestick pattern, VIX direction, VWAP, node dollar value, time of day, and day-of-week bias into a single 0-100 score.", tag: "AI SCORING" },
              { n: "03", title: "Execute the Trade", desc: "65+ score = trade eligible. 80+ = full size. Strike selection, stop placement, and target nodes are all defined before you enter. No guessing, no hope trades.", tag: "TRADE EXECUTION" },
            ].map(s => (
              <div key={s.n} className="zd-step">
                <span className="zd-step-num">{s.n}</span>
                <div className="zd-step-title">{s.title}</div>
                <p className="zd-step-desc">{s.desc}</p>
                <span className="zd-step-tag">{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="zd-section">
        <span className="zd-section-label">Platform Features</span>
        <h2 className="zd-h2">Everything serious<br />0DTE traders need.</h2>
        <p className="zd-section-sub">Built around the exact framework used in live sessions. No filler. No fluff. Just the edge.</p>
        <div className="zd-features-grid">
          {[
            { icon: "⬛", title: "GEX Heatmap Intelligence", desc: "Live gamma exposure visualization across SPX, SPY, QQQ, and VIX. Color-coded by node strength — from King Node yellow to gamma wall purple.", bullets: ["Real-time King Node identification with distance % indicator", "Color-coded gamma zones: yellow / green / teal / purple", "Node dollar value display ($100K+ = major level)", "Pillow node detection below price", "Air pocket identification for acceleration zones"] },
            { icon: "★", title: "AI Trade Scoring Engine", desc: "Nine-factor scoring algorithm that produces a 0-100 trade confidence score. 65+ to trade. 80+ for full size. No exceptions.", bullets: ["King Node proximity & direction (20% weight)", "Trinity alignment across SPX/SPY/QQQ (15%)", "Candlestick pattern recognition (15%)", "VIX / VIX1D directional filter (15%)", "VWAP slope — declining VWAP blocks all long trades", "Time of day and day-of-week bias adjustments"] },
            { icon: "◈", title: "Candlestick Pattern Library", desc: "Automatic pattern detection on 5-minute SPY chart. Every signal tied to a specific action — no interpretation required.", bullets: ["Hammer & Inverted Hammer at King Nodes", "Bullish / Bearish Engulfing at support/resistance", "Shooting Star at purple ceilings", "Morning Star & Evening Star reversals", "Three White Soldiers & Three Black Crows", "Candle CLOSE rule enforced — no wick traps"] },
            { icon: "◎", title: "Multi-Analyst Consensus Engine", desc: "Live monitoring of Bobby, Giul, Glitch, and Prophitcy. The consensus engine reads signals and flags agreement, caution, or conflict in real time.", bullets: ["All analysts agree = HIGHEST CONVICTION (+full score)", "\"Values not big enough\" auto-reduces score 15 points", "Bobby vs Giul conflict = FLAG, no trade recommendation", "\"Targeting [direction] nodes\" = high conviction signal", "Reverse rug phase detection (Phase 1–6)"] },
          ].map(f => (
            <div key={f.title} className="zd-feature">
              <span className="zd-feature-icon">{f.icon}</span>
              <div className="zd-feature-title">{f.title}</div>
              <p className="zd-feature-desc">{f.desc}</p>
              <ul className="zd-bullets">{f.bullets.map(b => <li key={b}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>

      {/* TRINITY */}
      <div id="trinity" className="bg-dark zd-section-full">
        <div className="zd-section-inner">
          <span className="zd-section-label">Trinity System</span>
          <h2 className="zd-h2">Three instruments.<br />One direction.</h2>
          <p className="zd-section-sub">The highest conviction trades require SPX, SPY, and QQQ King Nodes all pointing the same way. When they diverge, size down or stay flat.</p>
          <div className="zd-trinity-layout">
            <div>
              <table className="zd-trinity-table">
                <thead><tr><th>ALIGNMENT</th><th>CONVICTION</th><th>SIZE</th></tr></thead>
                <tbody>
                  {[
                    ["All 3 Nodes Aligned", <span className="bmax">MAX · 90-100</span>, "Full size"],
                    ["2 of 3 Aligned", <span className="bhigh">HIGH · 70-85</span>, "75% size"],
                    ["1 of 3 Aligned", <span className="blow">LOW · 40-60</span>, "25% or no trade"],
                    ["All 3 Divergent", <span className="bnone">NONE · CHOP</span>, <span className="text-red">NO TRADE</span>],
                    ["SPX vs SPY Split", <span className="bnone">TUG OF WAR</span>, <span className="text-red">50% MAX</span>],
                  ].map(([align, conv, size], i) => (
                    <tr key={i}><td><strong className="text-white">{align}</strong></td><td>{conv}</td><td>{size}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="border-l-green mt-5">
                <div className="text-xs text-green" style={{ marginBottom: 10 }}>VIX KING NODE RULE</div>
                <div className="text-sm" style={{ lineHeight: 1.8, fontStyle: "italic" }}>
                  VIX King Node <strong className="text-white">above</strong> VIX price = fear rising = SPY <strong className="text-red">bearish</strong>.<br />
                  VIX King Node <strong className="text-white">below</strong> VIX price = fear falling = SPY <strong className="text-green">bullish</strong>.<br />
                  Always check VIX before every trade. Non-negotiable.
                </div>
              </div>
            </div>
            <div className="zd-heatmap-card">
              <div className="zd-readout-label" style={{ marginBottom: 20 }}>HEATMAP VISUALIZATION</div>
              <div className="zd-heatmap">
                {[["$592","hm-pd",90,"GAMMA WALL"],["$591","hm-pl",54,""],["$590","hm-y",160,"★ KING NODE"]].map(([p,c,w,label]) => (
                  <div key={p as string} className="zd-hm-row">
                    <span className="zd-hm-price">{p}</span>
                    <div className={`zd-hm-bar ${c}`} style={{ width: w as number }} />
                    {label === "★ KING NODE" && <span className="zd-king-star">★</span>}
                    {label && <span style={{ fontSize: 10, color: c === "hm-y" ? "#ffdd00" : "var(--muted)", fontWeight: c === "hm-y" ? 700 : 400 }}>{label}</span>}
                  </div>
                ))}
                <div className="zd-hm-current">
                  <div className="zd-hm-row">
                    <span className="zd-hm-price text-green">$589</span>
                    <span className="text-green text-bold" style={{ fontSize: 10, marginLeft: 6 }}>◄ CURRENT PRICE</span>
                  </div>
                </div>
                {[["$588","hm-g",80,"PILLOW NODES"],["$587","hm-g",100,""],["$586","hm-t",30,""],["$585","hm-pl",45,""]].map(([p,c,w,label]) => (
                  <div key={p as string} className="zd-hm-row">
                    <span className="zd-hm-price">{p}</span>
                    <div className={`zd-hm-bar ${c}`} style={{ width: w as number }} />
                    {label && <span style={{ fontSize: 10, color: "var(--muted)" }}>{label}</span>}
                  </div>
                ))}
              </div>
              <div className="border-green p-box text-sm" style={{ lineHeight: 1.7 }}>
                King Node at $590 is <strong className="text-green">ABOVE current price</strong> = bullish bias. Pillow nodes at $587-588 create soft floor. Purple gamma wall at $592 is the ceiling. This is a <strong className="text-green">bullish range setup</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SESSION RESULTS */}
      <div id="results" className="zd-section">
        <span className="zd-section-label">Proven In The Live Market</span>
        <h2 className="zd-h2">Session 3/5/26 —<br /><em style={{ color: "var(--green)" }}>Anatomy of a day.</em></h2>
        <p className="zd-section-sub">Three reverse rugs. Framework called every one. Here&apos;s how it played out in real time.</p>
        <div className="zd-session-grid">
          <div className="zd-session-sidebar">
            <div className="text-xs text-green" style={{ marginBottom: 20 }}>DAY RESULTS</div>
            <div className="zd-result-card"><div className="zd-result-num">3</div><div className="zd-result-label">Reverse Rugs Called</div></div>
            <div className="col mt-4">
              {[
                { label: "REVERSE RUG #1", result: "AVOIDED — Values not big enough", color: "var(--red)", border: "var(--border)" },
                { label: "REVERSE RUG #2", result: "CALLS 680 → 683 ✓", color: "var(--green)", border: "var(--border)" },
                { label: "REVERSE RUG #3", result: "CALLS 676 → +$40 SPX ✓", color: "var(--green)", border: "rgba(0,255,65,0.2)", bg: "rgba(0,255,65,0.04)" },
              ].map(r => (
                <div key={r.label} style={{ padding: 16, border: `1px solid ${r.border}`, background: r.bg || "var(--black)" }}>
                  <div className="text-xs" style={{ color: "var(--muted)", marginBottom: 6 }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: r.color, fontWeight: r.bg ? 700 : 400 }}>{r.result}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, fontSize: 11, color: "var(--muted)", lineHeight: 1.7, fontStyle: "italic", borderLeft: "2px solid var(--border)", paddingLeft: 16 }}>
              Pillow nodes at the daily low = highest conviction reverse rug location. The framework identified 679 as a $505K node before entry.
            </div>
          </div>
          <div className="zd-session-main">
            <div className="text-xs text-green" style={{ marginBottom: 20 }}>TIMELINE</div>
            {[
              { t: "9:30 AM", e: <><strong>Open flush to 676.</strong> Massive volume. Framework rule: <span className="er">DO NOT BUY open flushes.</span> Retail traders trapped.</> },
              { t: "9:45 AM", e: <><strong>Bounce to 684 — Reverse Rug #1.</strong> Bobby: <em>&ldquo;Values not big enough.&rdquo;</em> <span className="eg">Framework: AVOID. Score below threshold.</span></> },
              { t: "10:22 AM", e: <><strong>UAE missile headline.</strong> <span className="er">Geopolitical override activated.</span> VIX breaks 22 purple node. All analysis suspended.</> },
              { t: "11:11 AM", e: <>Giul: <em>&ldquo;Lots of downside growing.&rdquo;</em> Air pocket below 678 identified. <span className="er">Bobby/Giul conflict = no trade.</span></> },
              { t: "11:22 AM", e: <><strong>Bobby calls Reverse Rug #2.</strong> 45-min base built. Declining volume confirmed. <span className="eg">Calls at 680. Score: 78/100.</span></> },
              { t: "12:35 PM", e: <><strong>VWAP rejection.</strong> Price crashes 683→677. <span className="er">VWAP filter would have blocked this entry.</span> Critical lesson added.</> },
              { t: "2:26 PM", e: <><strong>Reverse Rug #3.</strong> Bobby: <em>&ldquo;Pillow nodes under SPY.&rdquo;</em> $505K node at 679. <span className="eg">Calls from 676. SPX +$40 by 3:26 PM. Score: 91/100.</span></> },
              { t: "3:45 PM", e: <><strong>Hard exit.</strong> All positions closed. Framework rule: <em>No exceptions. No hope trades.</em> Day closed profitable.</> },
            ].map(ev => (
              <div key={ev.t} className="zd-event">
                <span className="zd-event-time">{ev.t}</span>
                <span className="zd-event-text">{ev.e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMMANDMENTS */}
      <div className="bg-dark zd-section-full">
        <div className="zd-section-inner">
          <span className="zd-section-label">The Rules</span>
          <h2 className="zd-h2">10 Commandments<br />of 0DTE Trading.</h2>
          <p className="zd-section-sub">Every rule earned in the live market. Not theory. Every commandment represents a lesson that cost real money to learn.</p>
          <div className="zd-cmd-grid">
            {commandments.map((c, i) => (
              <div key={i} className="zd-cmd">
                <span className="zd-cmd-num">{i + 1}</span>
                <div className="zd-cmd-text"><strong>{c.rule}</strong>{c.why}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ANALYSTS */}
      <div id="analysts" className="zd-section">
        <span className="zd-section-label">Analyst Intelligence</span>
        <h2 className="zd-h2">Four voices.<br />One consensus.</h2>
        <p className="zd-section-sub">The platform monitors Bobby, Giul, Glitch, and Prophitcy in real time. Agreement means full size. Conflict means stay flat.</p>
        <div className="zd-analysts-grid">
          {[
            { handle: "@FlowbyBobby", name: "Bobby", desc: "Full Trinity analysis, reverse rug calls, educational posts at key moments. Posts when the setup is live — not before.", primary: true },
            { handle: "@SimplyODTE", name: "Giul", desc: "Detailed heatmap reads, cautious approach. Often more accurate than Bobby on risk. Always cross-reference before entry.", primary: true },
            { handle: "@Glitch_Trades", name: "Glitch", desc: "SPY pika levels and short-term entries. Secondary signal used to confirm primary analyst consensus.", primary: false },
            { handle: "@Prophitcy", name: "Prophitcy", desc: "Precise short entries, level calls. Called 6840 short perfectly on 3/5/26. Added to monitoring after that session.", primary: false },
          ].map(a => (
            <div key={a.name} className="zd-analyst">
              <div className="zd-analyst-handle">{a.handle}</div>
              <div className="zd-analyst-name">{a.name}</div>
              <p className="zd-analyst-desc">{a.desc}</p>
              <span className={a.primary ? "zd-badge-primary" : "zd-badge-secondary"}>{a.primary ? "PRIMARY" : "SECONDARY"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" className="bg-dark zd-section-full">
        <div className="zd-section-inner">
          <span className="zd-section-label">Pricing</span>
          <h2 className="zd-h2">One tier.<br />No games.</h2>
          <p className="zd-section-sub">$200/month. No free trials. No freemium tier. No annual discount. This platform is for traders serious enough to pay for an edge.</p>
          <div className="zd-pricing-layout">
            <div className="zd-pricing-card">
              <span className="zd-pricing-tag dim">NOT FOR YOU IF...</span>
              <div className="zd-price" style={{ color: "var(--muted)", fontSize: 40 }}>FREE</div>
              <span className="zd-price-period">Looking for free signals</span>
              <ul className="zd-price-features">
                {["Free trial or freemium tier", "Copy-paste trade alerts", "Guaranteed profits", "No skill required", "Hand-holding"].map(f => <li key={f} className="no">{f}</li>)}
              </ul>
              <span style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>Twitter has free signals. This isn&apos;t that.</span>
            </div>
            <div className="zd-pricing-card featured">
              <span className="zd-pricing-tag green">WAITLIST OPEN</span>
              <div className="zd-price">$200</div>
              <span className="zd-price-period">/month · No trials. No refunds.</span>
              <ul className="zd-price-features">
                {["Live GEX heatmap — SPX, SPY, QQQ, VIX", "Real-time King Node identification", "AI trade score (0-100) per setup", "Candlestick pattern recognition", "Multi-analyst consensus engine", "VWAP overlay + declining VWAP filter", "VIX1D dashboard", "Reverse rug detection system", "Daily session summary + trade log", "Full Skylit Framework documentation"].map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="zd-waitlist-form">
                <input
                  type="email"
                  placeholder={joined ? "You're on the list." : "your@email.com"}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleJoin()}
                />
                <button onClick={handleJoin}>{joined ? "JOINED ✓" : "JOIN →"}</button>
              </div>
              <div style={{ marginTop: 14, fontSize: 10, color: "var(--muted)" }}>Waitlist only. Launch pricing locked. No spam.</div>
            </div>
          </div>
          <p style={{ marginTop: 40, fontSize: 11, color: "var(--muted)", fontStyle: "italic", lineHeight: 1.7, borderLeft: "2px solid var(--border)", paddingLeft: 20, maxWidth: 500 }}>
            Break-even: 1 subscriber. At 10 subscribers: $1,610/month profit. At 25 subscribers: $4,610/month profit. Built on a Mac Mini M2 + Vercel. Running lean. Priced for edge, not mass market.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" className="zd-section">
        <span className="zd-section-label">FAQ</span>
        <h2 className="zd-h2">Common questions.</h2>
        <div className="zd-faq">
          {faqs.map((f, i) => (
            <div key={i} className={`zd-faq-item${openFaq === i ? " open" : ""}`}>
              <div className="zd-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}<span className="arr">▸</span>
              </div>
              <div className="zd-faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="zd-cta">
        <h2 className="zd-h2">Stop guessing.<br />Read the market like a machine.</h2>
        <p>Real-time GEX heatmap · AI scoring · King Node intelligence · $200/month</p>
        <a href="#" className="zd-btn-dark" onClick={e => { e.preventDefault(); scrollTo("pricing"); }}>JOIN THE WAITLIST</a>
        <div style={{ marginTop: 16, fontSize: 11, color: "rgba(0,0,0,0.5)", letterSpacing: "0.1em" }}>
          Serious traders only · No free tier · Launch pricing locked for waitlist
        </div>
      </div>

      {/* FOOTER */}
      <footer className="zd-footer">
        <div className="zd-footer-grid">
          <div>
            <a href="#" className="zd-logo" style={{ display: "block", marginBottom: 16 }}>ZERODTE.IO</a>
            <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.8, fontStyle: "italic", maxWidth: 240 }}>The Skylit Framework. Built in the live market. Tested in real time. March 2026.</p>
          </div>
          {[
            { h: "Platform", links: [["System", "how-it-works"], ["Features", "features"], ["Trinity", "trinity"], ["Analysts", "analysts"]] },
            { h: "Framework", links: [["GEX Explained", ""], ["King Node Rules", ""], ["AI Scoring System", ""], ["10 Commandments", ""]] },
            { h: "Account", links: [["Join Waitlist", "pricing"], ["Dashboard", "/dashboard"], ["Privacy Policy", ""], ["Terms of Service", ""]] },
          ].map(col => (
            <div key={col.h} className="zd-footer-col">
              <h4>{col.h}</h4>
              <ul>{col.links.map(([label, id]) => (
                <li key={label}><a href={id.startsWith("/") ? id : "#"} onClick={e => { if (!id.startsWith("/") && id) { e.preventDefault(); scrollTo(id); } }}>{label}</a></li>
              ))}</ul>
            </div>
          ))}
        </div>
        <div className="zd-footer-bottom">
          <span>© 2026 ZERODTE.IO — All rights reserved</span>
          <span>NOT FINANCIAL ADVICE · FOR EDUCATIONAL PURPOSES ONLY</span>
        </div>
      </footer>
      <p className="zd-disclaimer">
        DISCLAIMER: ZeroDTE.io is not a registered investment advisor. All content is for educational and informational purposes only and does not constitute financial advice. Options trading involves significant risk of loss. Past performance is not indicative of future results. You can lose all of your invested capital. Do not trade with money you cannot afford to lose. Always consult a qualified financial advisor before making any investment decisions.
      </p>
    </>
  );
}