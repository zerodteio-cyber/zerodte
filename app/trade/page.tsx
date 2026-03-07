// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from "react";

// ─── QUANT'S COMPLETE SYSTEM PROMPT ──────────────────────────────────────
const QUANT_SYSTEM = `You are Quant (@FlowbyQuant), lead analyst at ZeroDTE.io and creator of the Skylit Framework. You are speaking DIRECTLY to a trader who is currently in an active 0DTE SPY options trade. They are talking to you in real time while the market is moving.

YOUR JOB IS ONE THING: give them the confidence to hold when the thesis is intact, or the clarity to exit when it's not. You are their anchor when the market is noisy.

THE SKYLIT FRAMEWORK — your bible, never violate it:

KING NODE:
- Largest gamma position on the heatmap = strongest price magnet
- King Node ABOVE price = bullish pull, price wants to go up
- King Node BELOW price = bearish pull, price wants to go down  
- King Node AT price = pinned, expect chop, no directional trades

TRINITY:
- SPX + SPY + QQQ must ALL align for maximum conviction
- All 3 aligned = max conviction, hold full size
- 2 of 3 = high conviction, hold 75%
- Divergent = chop, reduce or exit

VIX RULE:
- VIX King Node ABOVE VIX price = fear rising = SPY bearish
- VIX King Node BELOW VIX price = fear falling = SPY bullish
- VIX breaking through its own purple node = maximum fear = get out of longs immediately

VWAP:
- DECLINING VWAP = NEVER hold longs. This is a hard rule, zero exceptions.
- Price reclaiming VWAP = strong bullish signal
- VWAP sloping up = institutional buying, confirms longs

NODE VALUES:
- $200K+ = Gamma Wall, near-impenetrable ceiling/floor
- $100K+ = major level, treat as hard support/resistance
- Under $50K = "values not big enough" — Quant's phrase for weak levels

TIME RULES:
- 10AM-1PM = prime window, this is when you hold
- After 2PM = no new entries, but if in a winning trade, hold to target or 3:45
- Hard exit 3:45PM no exceptions, never hold into close
- Never trade the 9:30AM open flush

TARGET:
- Average winner = 20% on the option contract
- ATM entry when score 80+
- 1 strike OTM at 65-79
- Never chase after 20%+ gap up on entry

REVERSE RUG (the core pattern):
- Real: 30-60min base building, declining volume, then explosive move
- Fake: immediate spike up with no base, "values not big enough"
- 6 phases: accumulation → base → volume dry-up → trigger candle → expansion → target

HOLD vs EXIT logic:
- If King Node unchanged, Trinity still aligned, VWAP still in your favor = HOLD, it's just noise
- If VWAP flips against you = start trimming immediately
- If King Node shifts to oppose your direction = reduce 50% minimum
- If Trinity breaks fully divergent = exit
- If VIX breaks its node on a long trade = exit immediately
- Never let a 20%+ winner turn into a loser

ANALYSTS:
- Giul (@SimplyODTE): always cross-reference her heatmap read before entry. More precise on node values, more cautious on risk.
- Glitch (@Glitch_Trades): SPY pika levels, short-term entries
- Prophitcy (@Prophitcy): precise level calls, added after 3/5/26

YOUR VOICE — this is critical:
- You talk like a trader who's seen thousands of setups, not a chatbot
- Short, direct, confident. 3-5 sentences maximum. Traders don't have time for essays.
- You use phrases like: "thesis is intact", "King Node is still your magnet", "VWAP is your friend right now", "that dip is noise", "the structure hasn't changed", "don't let the market shake you out of a good trade"
- When things are breaking: "that's a red flag", "I'd start trimming here", "the thesis just got weaker", "that changes things for me"
- Always end with a CLEAR VERDICT on its own line: HOLD FULL SIZE / HOLD 75% / SCALE OUT 50% / EXIT NOW
- You are supportive but NEVER sugarcoat. If it's time to exit, say exit.
- Reference their specific situation. Don't give generic advice.
- You care about this trader making money. That means sometimes telling them things they don't want to hear.
- When they're panicking about noise: be their calm. "I see the same thing. King Node hasn't moved. Hold."
- When something real breaks: be direct. "VWAP just flipped. Start trimming."`;

// ─── CSS ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Space+Mono:wght@400;700&display=swap');
:root{
  --g:#00ff41;--bk:#080808;--dk:#0e0e0e;--cd:#131313;
  --br:#1c1c1c;--tx:#e5e5e5;--mu:#4a4a4a;--re:#ff3333;
  --ye:#ffdd00;--dim:#777;
}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;overflow:hidden;}
body{background:var(--bk);color:var(--tx);font-family:'Space Mono',monospace;font-size:13px;}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 36px;border-bottom:1px solid var(--br);background:rgba(8,8,8,.99);position:relative;z-index:10;flex-shrink:0;}
.logo{color:var(--g);font-weight:700;letter-spacing:.15em;font-size:13px;text-decoration:none;}
.navlinks{display:flex;gap:28px;list-style:none;}
.navlinks a{font-size:10px;color:var(--mu);text-decoration:none;letter-spacing:.2em;text-transform:uppercase;transition:color .2s;}
.navlinks a:hover,.navlinks a.on{color:var(--g);}
.nav-status{display:flex;align-items:center;gap:8px;font-size:10px;color:var(--mu);letter-spacing:.15em;}
.live-dot{width:6px;height:6px;border-radius:50%;animation:dp 1.2s infinite;}
.live-dot.g{background:var(--g);}
.live-dot.r{background:var(--re);}
@keyframes dp{0%,100%{opacity:1}50%{opacity:.3}}

/* FULL HEIGHT LAYOUT */
.shell{display:flex;flex-direction:column;height:calc(100vh - 54px);}
.main{display:grid;grid-template-columns:300px 1fr;flex:1;overflow:hidden;}

/* LEFT SIDEBAR */
.sidebar{border-right:1px solid var(--br);display:flex;flex-direction:column;overflow:hidden;background:var(--dk);}
.sb-head{padding:20px;border-bottom:1px solid var(--br);}
.sb-title{font-size:9px;color:var(--g);letter-spacing:.25em;text-transform:uppercase;margin-bottom:12px;}
.sb-quant{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
.avatar{width:40px;height:40px;background:var(--g);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:var(--bk);flex-shrink:0;}
.quant-name{font-size:12px;font-weight:700;color:#fff;letter-spacing:.05em;}
.quant-sub{font-size:9px;color:var(--mu);letter-spacing:.08em;margin-top:2px;}

/* TRADE CONTEXT */
.trade-ctx{padding:16px 20px;display:flex;flex-direction:column;gap:10px;border-bottom:1px solid var(--br);}
.ctx-title{font-size:9px;color:var(--mu);letter-spacing:.2em;text-transform:uppercase;margin-bottom:2px;}
.dir-row{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.dir-btn{padding:10px 8px;border:1px solid var(--br);background:var(--bk);cursor:pointer;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.08em;transition:all .15s;color:var(--mu);}
.dir-btn.on-bull{border-color:var(--g);background:rgba(0,255,65,.08);color:var(--g);}
.dir-btn.on-bear{border-color:var(--re);background:rgba(255,51,51,.08);color:var(--re);}
.ctx-field{display:flex;flex-direction:column;gap:4px;}
.ctx-label{font-size:8px;color:var(--mu);letter-spacing:.15em;text-transform:uppercase;}
.ctx-inp{background:var(--bk);border:1px solid var(--br);padding:8px 10px;font-family:'Space Mono',monospace;font-size:11px;color:var(--tx);outline:none;width:100%;transition:border-color .2s;}
.ctx-inp:focus{border-color:var(--g);}
.ctx-inp::placeholder{color:var(--mu);}

/* P&L DISPLAY */
.pnl-box{margin:0 20px 16px;padding:14px;border:1px solid var(--br);background:var(--bk);}
.pnl-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;}
.pnl-row:last-child{margin-bottom:0;}
.pnl-label{font-size:9px;color:var(--mu);letter-spacing:.12em;text-transform:uppercase;}
.pnl-val{font-size:15px;font-weight:700;font-family:'Playfair Display',serif;}
.pnl-val.bull{color:var(--g);}
.pnl-val.bear{color:var(--re);}
.pnl-val.neutral{color:var(--dim);}
.target-bar{height:3px;background:var(--br);margin-top:10px;border-radius:1px;overflow:hidden;}
.target-fill{height:100%;background:var(--g);transition:width .5s ease;border-radius:1px;}
.target-fill.loss{background:var(--re);}
.target-hint{font-size:8px;color:var(--mu);margin-top:5px;letter-spacing:.08em;}

/* QUICK CHIPS */
.chips-section{padding:0 20px 16px;flex:1;overflow-y:auto;}
.chips-label{font-size:8px;color:var(--mu);letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px;}
.chips{display:flex;flex-direction:column;gap:6px;}
.chip{padding:10px 14px;border:1px solid var(--br);background:var(--bk);cursor:pointer;font-family:'Space Mono',monospace;font-size:10px;color:var(--dim);letter-spacing:.04em;text-align:left;transition:all .15s;line-height:1.4;}
.chip:hover{border-color:var(--dim);color:var(--tx);}
.chip.bull-chip:hover{border-color:var(--g);color:var(--g);background:rgba(0,255,65,.04);}
.chip.bear-chip:hover{border-color:var(--re);color:var(--re);background:rgba(255,51,51,.04);}
.chip.warn-chip:hover{border-color:var(--ye);color:var(--ye);background:rgba(255,221,0,.04);}

/* CHAT AREA */
.chat-area{display:flex;flex-direction:column;overflow:hidden;}
.messages{flex:1;overflow-y:auto;padding:28px 36px;display:flex;flex-direction:column;gap:24px;}
.messages::-webkit-scrollbar{width:3px;}
.messages::-webkit-scrollbar-track{background:transparent;}
.messages::-webkit-scrollbar-thumb{background:var(--br);}

/* MESSAGES */
.msg{display:flex;flex-direction:column;gap:6px;max-width:780px;}
.msg.user{align-self:flex-end;align-items:flex-end;}
.msg.quant{align-self:flex-start;align-items:flex-start;}

.msg-bubble{padding:14px 18px;line-height:1.75;font-size:13px;}
.user .msg-bubble{background:rgba(0,255,65,.08);border:1px solid rgba(0,255,65,.2);color:var(--tx);}
.quant .msg-bubble{background:var(--cd);border:1px solid var(--br);color:var(--tx);font-style:italic;}
.quant .msg-bubble strong{font-style:normal;color:#fff;}

.msg-meta{font-size:9px;color:var(--mu);letter-spacing:.1em;display:flex;align-items:center;gap:8px;}
.quant-meta-avatar{width:18px;height:18px;background:var(--g);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:8px;font-weight:900;color:var(--bk);}

/* VERDICT BLOCK */
.verdict-block{margin-top:10px;padding:12px 16px;border-left:3px solid var(--g);}
.verdict-block.exit{border-left-color:var(--re);background:rgba(255,51,51,.04);}
.verdict-block.reduce{border-left-color:var(--ye);background:rgba(255,221,0,.04);}
.verdict-block.hold{background:rgba(0,255,65,.04);}
.verdict-label{font-size:8px;color:var(--mu);letter-spacing:.2em;text-transform:uppercase;margin-bottom:5px;}
.verdict-text{font-size:14px;font-weight:700;letter-spacing:.06em;font-style:normal;}
.verdict-text.green{color:var(--g);}
.verdict-text.red{color:var(--re);}
.verdict-text.yellow{color:var(--ye);}

/* TYPING */
.typing-msg{display:flex;align-items:center;gap:10px;}
.typing-dots{display:flex;gap:4px;align-items:center;}
.typing-dot{width:5px;height:5px;background:var(--g);border-radius:50%;}
.typing-dot:nth-child(1){animation:td .9s .0s infinite;}
.typing-dot:nth-child(2){animation:td .9s .15s infinite;}
.typing-dot:nth-child(3){animation:td .9s .3s infinite;}
@keyframes td{0%,100%{opacity:.2;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}

.cursor{display:inline-block;width:2px;height:13px;background:var(--g);margin-left:2px;animation:cb .7s infinite;vertical-align:middle;}
@keyframes cb{0%,100%{opacity:1}50%{opacity:0}}

/* EMPTY STATE */
.empty-state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;gap:20px;}
.empty-avatar{width:64px;height:64px;background:var(--g);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:28px;font-weight:900;color:var(--bk);}
.empty-name{font-family:'Playfair Display',serif;font-size:22px;color:#fff;margin-top:4px;}
.empty-text{font-size:11px;color:var(--mu);line-height:1.9;font-style:italic;max-width:360px;}
.empty-hint{font-size:10px;color:var(--mu);line-height:2;border:1px solid var(--br);padding:14px 20px;background:var(--cd);text-align:left;width:100%;max-width:400px;}
.empty-hint-title{font-size:9px;color:var(--g);letter-spacing:.2em;margin-bottom:8px;}

/* INPUT BAR */
.input-bar{border-top:1px solid var(--br);padding:18px 36px;background:var(--dk);flex-shrink:0;}
.input-wrap{display:flex;gap:10px;align-items:flex-end;}
.input-box{flex:1;background:var(--bk);border:1px solid var(--br);padding:13px 16px;font-family:'Space Mono',monospace;font-size:12px;color:var(--tx);outline:none;resize:none;height:48px;max-height:120px;transition:border-color .2s;line-height:1.5;}
.input-box:focus{border-color:var(--g);}
.input-box::placeholder{color:var(--mu);}
.send-btn{background:var(--g);color:var(--bk);border:none;padding:13px 20px;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.15em;cursor:pointer;transition:all .15s;height:48px;white-space:nowrap;flex-shrink:0;}
.send-btn:hover:not(:disabled){background:#fff;}
.send-btn:disabled{background:var(--br);color:var(--mu);cursor:not-allowed;}
.input-hint{font-size:9px;color:var(--mu);margin-top:8px;letter-spacing:.08em;}

@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .35s ease forwards;}

@media(max-width:900px){
  .main{grid-template-columns:1fr;}
  .sidebar{display:none;}
  .messages{padding:20px;}
  .input-bar{padding:14px 20px;}
}
`;

// ─── QUICK CHIPS ──────────────────────────────────────────────────────────
const CHIPS = [
  { label: "SPY just dipped — should I hold?", type: "warn" },
  { label: "King Node still above price, VWAP rising", type: "bull" },
  { label: "I'm up 8% — is this worth holding to 20%?", type: "bull" },
  { label: "VWAP starting to flatten out", type: "warn" },
  { label: "I'm down, is the thesis still intact?", type: "bear" },
  { label: "Trinity still aligned on all 3?", type: "bull" },
  { label: "Quant just posted — it aligns with my trade", type: "bull" },
  { label: "Giul is being cautious — should I reduce?", type: "warn" },
  { label: "VIX is spiking up", type: "bear" },
  { label: "I'm at +18%, lock in or hold to target?", type: "bull" },
  { label: "It's 1:30pm, I'm up 10% — hold or exit?", type: "warn" },
  { label: "Price action looks like a fake bounce", type: "bear" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────
function calcPnL(entry: string, current: string, dir: "calls" | "puts") {
  const e = parseFloat(entry), c = parseFloat(current);
  if (!e || !c || e <= 0) return null;
  const pct = dir === "calls" ? ((c - e) / e) * 100 : ((e - c) / e) * 100;
  return pct;
}

function calcTarget(entry: string, dir: "calls" | "puts") {
  const e = parseFloat(entry);
  if (!e || e <= 0) return null;
  return (dir === "calls" ? e * 1.20 : e * 0.80).toFixed(2);
}

function extractVerdict(text: string): { body: string; verdict: string; type: "hold" | "reduce" | "exit" } {
  const lines = text.trim().split("\n").filter(Boolean);
  const last = lines[lines.length - 1].toUpperCase();
  let type: "hold" | "reduce" | "exit" = "hold";
  let verdict = "";

  if (last.includes("EXIT") || last.includes("GET OUT") || last.includes("CLOSE")) {
    type = "exit"; verdict = lines[lines.length - 1];
  } else if (last.includes("SCALE") || last.includes("REDUCE") || last.includes("TRIM") || last.includes("50%") || last.includes("75%")) {
    type = "reduce"; verdict = lines[lines.length - 1];
  } else if (last.includes("HOLD")) {
    type = "hold"; verdict = lines[lines.length - 1];
  }

  const body = verdict ? lines.slice(0, -1).join(" ") : text;
  return { body, verdict: verdict || "HOLD FULL SIZE", type };
}

// ─── TYPES ────────────────────────────────────────────────────────────────
type Message = {
  role: "user" | "quant";
  content: string;
  verdict?: string;
  verdictType?: "hold" | "reduce" | "exit";
  typing?: boolean;
};

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function TradePage() {
  const [direction, setDirection] = useState<"calls" | "puts" | null>(null);
  const [entryPrice, setEntryPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pnl = direction && entryPrice && currentPrice ? calcPnL(entryPrice, currentPrice, direction) : null;
  const target = direction && entryPrice ? calcTarget(entryPrice, direction) : null;
  const progress = pnl ? Math.min(100, Math.max(0, (pnl / 20) * 100)) : 0;
  const isLoss = pnl !== null && pnl < 0;

  const buildContext = () => {
    const parts: string[] = [];
    if (direction) parts.push(`Direction: ${direction.toUpperCase()}`);
    if (entryPrice) parts.push(`Option entry: $${entryPrice}`);
    if (currentPrice) parts.push(`Current price: $${currentPrice}`);
    if (pnl !== null) parts.push(`P&L: ${pnl >= 0 ? "+" : ""}${pnl.toFixed(1)}%`);
    if (target) parts.push(`20% target: $${target}`);
    return parts.length > 0 ? `[TRADE CONTEXT: ${parts.join(" | ")}]\n\n` : "";
  };

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");

    const userMsg: Message = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Add typing indicator
    setMessages(prev => [...prev, { role: "quant", content: "", typing: true }]);

    const contextStr = buildContext();
    const fullMsg = contextStr + msg;

    // Build conversation history for API
    const history = messages
      .filter(m => !m.typing)
      .map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.role === "quant" ? (m.content + (m.verdict ? `\n\n${m.verdict}` : "")) : m.content,
      }));

    history.push({ role: "user", content: fullMsg });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: QUANT_SYSTEM,
          messages: history,
        }),
      });

      const data = await res.json();
      const fullText = data.content?.[0]?.text || "Can't get the read right now — check your connection.";
      const { body, verdict, type } = extractVerdict(fullText);

      // Remove typing indicator, add real message with typewriter
      setMessages(prev => prev.filter(m => !m.typing));

      const quantMsg: Message = {
        role: "quant",
        content: "",
        verdict,
        verdictType: type,
      };
      setMessages(prev => [...prev, quantMsg]);

      // Typewriter effect
      let i = 0;
      const type_effect = () => {
        if (i <= body.length) {
          const chunk = body.slice(0, i);
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: chunk };
            return updated;
          });
          i++;
          setTimeout(type_effect, 14);
        }
      };
      type_effect();

    } catch {
      setMessages(prev => prev.filter(m => !m.typing));
      setMessages(prev => [...prev, {
        role: "quant",
        content: "Can't connect right now. Check your setup.",
        verdict: "—",
        verdictType: "hold",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasMessages = messages.filter(m => !m.typing).length > 0;
  const lastVerdictType = [...messages].reverse().find(m => m.verdictType)?.verdictType;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* NAV */}
      <nav className="nav">
        <a href="/dashboard" className="logo">ZERODTE.IO</a>
        <ul className="navlinks">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/scorer">Scorer</a></li>
          <li><a href="/trade" className="on">Live Trade</a></li>
          <li><a href="/journal">Journal</a></li>
        </ul>
        <div className="nav-status">
          <span className={`live-dot ${hasMessages ? (lastVerdictType === "hold" ? "g" : "r") : "r"}`} />
          {hasMessages
            ? lastVerdictType === "hold" ? "HOLD" : lastVerdictType === "reduce" ? "REDUCE" : "EXIT"
            : "AWAITING TRADE"}
        </div>
      </nav>

      <div className="shell">
        <div className="main">

          {/* ── SIDEBAR ── */}
          <div className="sidebar">
            <div className="sb-head">
              <div className="sb-title">Your Analyst</div>
              <div className="sb-quant">
                <div className="avatar">B</div>
                <div>
                  <div className="quant-name">Quant</div>
                  <div className="quant-sub">@FlowbyQuant · Skylit Framework</div>
                </div>
              </div>
            </div>

            {/* TRADE CONTEXT */}
            <div className="trade-ctx">
              <div className="ctx-title">Active Trade</div>
              <div className="dir-row">
                <button className={`dir-btn ${direction === "calls" ? "on-bull" : ""}`} onClick={() => setDirection("calls")}>🟢 CALLS</button>
                <button className={`dir-btn ${direction === "puts" ? "on-bear" : ""}`} onClick={() => setDirection("puts")}>🔴 PUTS</button>
              </div>
              <div className="ctx-field">
                <div className="ctx-label">Option Entry ($)</div>
                <input className="ctx-inp" placeholder="e.g. 1.45" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} />
              </div>
              <div className="ctx-field">
                <div className="ctx-label">Current Price ($)</div>
                <input className="ctx-inp" placeholder="e.g. 1.72" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} />
              </div>
            </div>

            {/* P&L */}
            {direction && entryPrice && (
              <div className="pnl-box">
                <div className="pnl-row">
                  <span className="pnl-label">P&L</span>
                  <span className={`pnl-val ${pnl === null ? "neutral" : isLoss ? "bear" : "bull"}`}>
                    {pnl !== null ? `${pnl >= 0 ? "+" : ""}${pnl.toFixed(1)}%` : "—"}
                  </span>
                </div>
                <div className="pnl-row">
                  <span className="pnl-label">Target (+20%)</span>
                  <span className="pnl-val bull">${target || "—"}</span>
                </div>
                {pnl !== null && (
                  <>
                    <div className="target-bar">
                      <div className={`target-fill ${isLoss ? "loss" : ""}`} style={{ width: `${Math.abs(Math.min(100, progress))}%` }} />
                    </div>
                    <div className="target-hint">
                      {isLoss ? `${Math.abs(pnl).toFixed(1)}% underwater` : pnl >= 20 ? "✓ Target hit" : `${(20 - pnl).toFixed(1)}% to target`}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* CHIPS */}
            <div className="chips-section">
              <div className="chips-label">Quick situations</div>
              <div className="chips">
                {CHIPS.map((c, i) => (
                  <button
                    key={i}
                    className={`chip ${c.type === "bull" ? "bull-chip" : c.type === "bear" ? "bear-chip" : "warn-chip"}`}
                    onClick={() => sendMessage(c.label)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── CHAT ── */}
          <div className="chat-area">
            <div className="messages">
              {!hasMessages ? (
                <div className="empty-state">
                  <div className="empty-avatar">B</div>
                  <div>
                    <div className="empty-name">Quant</div>
                    <div style={{ fontSize: 10, color: "var(--mu)", letterSpacing: ".1em", marginTop: 4 }}>Skylit Framework · 0DTE SPY Analyst</div>
                  </div>
                  <div className="empty-text">
                    You're in a trade and the market is moving. Tell me what you're seeing — or tap a situation on the left. I'll tell you exactly what I see and whether to hold.
                  </div>
                  <div className="empty-hint">
                    <div className="empty-hint-title">HOW TO USE</div>
                    <div style={{ fontSize: 10, color: "var(--mu)", lineHeight: 2.2 }}>
                      Set your direction + entry price in the sidebar<br />
                      Type anything: "SPY dipped, should I hold?"<br />
                      Or tap a quick situation on the left<br />
                      Quant responds based on the Skylit Framework
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((m, i) => {
                  if (m.typing) {
                    return (
                      <div key={i} className="msg quant fade-up">
                        <div className="msg-meta">
                          <div className="quant-meta-avatar">B</div>
                          <span>Quant · reading the chart</span>
                        </div>
                        <div className="msg-bubble">
                          <div className="typing-dots">
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (m.role === "user") {
                    return (
                      <div key={i} className="msg user fade-up">
                        <div className="msg-bubble">{m.content}</div>
                        <div className="msg-meta">You</div>
                      </div>
                    );
                  }

                  const vt = m.verdictType;
                  return (
                    <div key={i} className="msg quant fade-up">
                      <div className="msg-meta">
                        <div className="quant-meta-avatar">B</div>
                        <span>Quant</span>
                      </div>
                      <div className="msg-bubble">
                        {m.content}
                        {i === messages.length - 1 && loading === false && m.content && !m.content.endsWith(".") && !m.content.endsWith("!") && (
                          <span className="cursor" />
                        )}
                        {m.verdict && m.content.length > 10 && (
                          <div className={`verdict-block ${vt}`} style={{ marginTop: 14 }}>
                            <div className="verdict-label">Quant's Verdict</div>
                            <div className={`verdict-text ${vt === "hold" ? "green" : vt === "exit" ? "red" : "yellow"}`}>
                              {m.verdict}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="input-bar">
              <div className="input-wrap">
                <textarea
                  ref={inputRef}
                  className="input-box"
                  placeholder="Tell Quant what's happening... 'SPY just dropped 40 cents, I'm in calls up 8%, should I hold?'"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                >
                  {loading ? "..." : "ASK QUANT →"}
                </button>
              </div>
              <div className="input-hint">Enter to send · Shift+Enter for new line · Quant responds using the Skylit Framework</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
