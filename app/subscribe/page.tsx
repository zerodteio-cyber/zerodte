// @ts-nocheck
"use client";
import { useState } from "react";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Space+Mono:wght@400;700&display=swap');*{margin:0;padding:0;box-sizing:border-box;}body{background:#080808;color:#e5e5e5;font-family:'Space Mono',monospace;min-height:100vh;display:flex;align-items:center;justify-content:center;}.wrap{width:100%;max-width:480px;padding:40px 20px;}.logo{color:#00ff41;font-weight:700;l
npm install stripe

mkdir -p app/subscribe/success app/api/stripe/checkout app/api/stripe/webhook

cat > app/subscribe/page.tsx << 'EOF'
// @ts-nocheck
"use client";
import { useState } from "react";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Space+Mono:wght@400;700&display=swap');*{margin:0;padding:0;box-sizing:border-box;}body{background:#080808;color:#e5e5e5;font-family:'Space Mono',monospace;min-height:100vh;display:flex;align-items:center;justify-content:center;}.wrap{width:100%;max-width:480px;padding:40px 20px;}.logo{color:#00ff41;font-weight:700;letter-spacing:.15em;font-size:12px;text-align:center;margin-bottom:48px;}.card{background:#0a0a0a;border:1px solid #1c1c1c;padding:40px;}.price-tag{text-align:center;margin-bottom:32px;}.price-tag .amount{font-family:'Playfair Display',serif;font-size:64px;font-weight:900;color:#fff;line-height:1;}.price-tag .period{font-size:12px;color:#555;letter-spacing:.1em;margin-top:4px;}.divider{height:1px;background:#1c1c1c;margin:24px 0;}.feature{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;}.feature-dot{width:6px;height:6px;background:#00ff41;border-radius:50%;margin-top:5px;flex-shrink:0;}.feature-text{font-size:12px;color:#aaa;line-height:1.6;}.feature-text strong{color:#fff;}.btn{background:#00ff41;color:#080808;border:none;padding:18px;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;cursor:pointer;width:100%;margin-top:32px;transition:all .15s;}.btn:hover:not(:disabled){background:#fff;}.btn:disabled{background:#1c1c1c;color:#333;cursor:not-allowed;}.fine{font-size:9px;color:#444;text-align:center;margin-top:12px;}.tag{display:inline-block;background:#00ff411a;color:#00ff41;border:1px solid #00ff4133;font-size:9px;letter-spacing:.15em;padding:4px 10px;text-transform:uppercase;margin-bottom:16px;}.title{font-family:'Playfair Display',serif;font-size:28px;font-weight:900;color:#fff;margin-bottom:8px;line-height:1.1;}.title em{font-style:italic;color:#00ff41;}`;

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { setLoading(false); }
  };
  return (<><style dangerouslySetInnerHTML={{ __html: CSS }} /><div className="wrap"><div className="logo">ZERODTE.IO</div><div className="card"><div className="tag">Members Only</div><div className="title">Join <em>ZeroDTE.</em></div><p style={{fontSize:10,color:"#555",marginBottom:24}}>0DTE SPY analytics for serious traders</p><div className="price-tag"><div className="amount">$200</div><div className="period">per month · cancel anytime</div></div><div className="divider"/><div className="feature"><div className="feature-dot"/><div className="feature-text"><strong>Quant Live Trade Chat</strong> — Real-time AI analyst during active trades</div></div><div className="feature"><div className="feature-dot"/><div className="feature-text"><strong>Dual Scan Scorer</strong> — Score calls and puts with 33 patterns</div></div><div className="feature"><div className="feature-dot"/><div className="feature-text"><strong>GEX Dashboard</strong> — Live gamma exposure and Apex Nodes</div></div><div className="feature"><div className="feature-dot"/><div className="feature-text"><strong>Trade Journal</strong> — Track win rate, P&L, equity curve</div></div><button className="btn" onClick={handleSubscribe} disabled={loading}>{loading ? "REDIRECTING..." : "START MEMBERSHIP →"}</button><div className="fine">Powered by Stripe · Cancel anytime</div></div></div></>);
}
