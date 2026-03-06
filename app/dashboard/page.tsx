"use client";
import { useState, useEffect, useRef } from "react";

const defaultLevels = { kingNode: 590, callWall: 595, putWall: 585, hvl: 588 };

type Candle = { time: number; open: number; high: number; low: number; close: number; volume: number };

function scoreMarket(spy: number, vix: number, levels: typeof defaultLevels) {
  let s = 50;
  if (spy > levels.kingNode) s += 15; else s -= 15;
  if (spy > levels.hvl) s += 10; else s -= 10;
  if (vix < 15) s += 10; else if (vix > 20) s -= 15; else s -= 5;
  if (spy > levels.putWall && spy < levels.callWall) s += 10;
  return Math.max(0, Math.min(100, s));
}

function analyzeCandles(candles: Candle[], levels: typeof defaultLevels): string[] {
  if (candles.length < 5) return ["Loading candle data..."];
  const insights: string[] = [];
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const last5 = candles.slice(-5);
  const last10 = candles.slice(-10);

  // Trend
  const opens10 = last10[0]?.open;
  const closes10 = last.close;
  if (closes10 > opens10 * 1.002) insights.push("📈 Uptrend on 5m — higher highs forming over last 10 candles");
  else if (closes10 < opens10 * 0.998) insights.push("📉 Downtrend on 5m — lower lows forming over last 10 candles");
  else insights.push("➡️ Consolidation — price grinding sideways, wait for breakout direction");

  // Momentum
  const bullCandles = last5.filter(c => c.close > c.open).length;
  if (bullCandles >= 4) insights.push("🟢 Strong bull momentum — " + bullCandles + "/5 candles closed green");
  else if (bullCandles <= 1) insights.push("🔴 Strong bear momentum — " + (5 - bullCandles) + "/5 candles closed red");

  // Candle body size
  const bodySize = Math.abs(last.close - last.open);
  const range = last.high - last.low;
  const wickRatio = range > 0 ? bodySize / range : 0;
  if (wickRatio < 0.3) insights.push("⚡ Doji/indecision candle — buyers and sellers equal, reversal possible");
  else if (last.close > last.open && wickRatio > 0.7) insights.push("💪 Strong bull candle — small wicks, body filled = conviction move up");
  else if (last.close < last.open && wickRatio > 0.7) insights.push("🔻 Strong bear candle — small wicks, body filled = conviction move down");

  // Upper/lower wick
  const upperWick = last.high - Math.max(last.open, last.close);
  const lowerWick = Math.min(last.open, last.close) - last.low;
  if (upperWick > bodySize * 1.5) insights.push("🕯️ Long upper wick — rejection at highs, sellers stepped in");
  if (lowerWick > bodySize * 1.5) insights.push("🕯️ Long lower wick — rejection at lows, buyers defended");

  // Engulfing
  if (last.close > last.open && prev.close < prev.open && last.open < prev.close && last.close > prev.open)
    insights.push("🚀 Bullish engulfing pattern — current candle swallowed previous red candle");
  if (last.close < last.open && prev.close > prev.open && last.open > prev.close && last.close < prev.open)
    insights.push("💥 Bearish engulfing pattern — current candle swallowed previous green candle");

  // GEX levels proximity
  const distKing = Math.abs(last.close - levels.kingNode);
  const distCall = Math.abs(last.close - levels.callWall);
  const distPut = Math.abs(last.close - levels.putWall);
  if (distKing < 0.5) insights.push("👑 Price at King Node $" + levels.kingNode + " — major decision point, watch closely");
  if (distCall < 0.5) insights.push("🧱 Price at Call Wall $" + levels.callWall + " — strong resistance, likely rejection");
  if (distPut < 0.5) insights.push("🛡️ Price at Put Wall $" + levels.putWall + " — strong support, bounce possible");

  // Range
  const dayHigh = Math.max(...candles.map(c => c.high));
  const dayLow = Math.min(...candles.map(c => c.low));
  const pctOfRange = range > 0 ? ((last.close - dayLow) / (dayHigh - dayLow) * 100).toFixed(0) : "50";
  insights.push("📊 Price at " + pctOfRange + "% of today's range (Low: $" + dayLow.toFixed(2) + " — High: $" + dayHigh.toFixed(2) + ")");

  return insights.slice(0, 6);
}

function CandleChart({ candles, levels }: { candles: Candle[]; levels: typeof defaultLevels }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const pad = { top: 20, bottom: 40, left: 10, right: 60 };
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, W, H);

    const displayed = candles.slice(-60);
    const highs = displayed.map(c => c.high);
    const lows = displayed.map(c => c.low);
    const maxP = Math.max(...highs, levels.callWall, levels.kingNode);
    const minP = Math.min(...lows, levels.putWall, levels.hvl);
    const priceRange = maxP - minP || 1;
    const chartH = H - pad.top - pad.bottom;
    const chartW = W - pad.left - pad.right;
    const toY = (p: number) => pad.top + ((maxP - p) / priceRange) * chartH;
    const candleW = Math.max(2, Math.floor(chartW / displayed.length) - 1);

    // Grid lines
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (chartH / 5) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      const price = (maxP - (priceRange / 5) * i).toFixed(2);
      ctx.fillStyle = "#333"; ctx.font = "10px Courier New"; ctx.textAlign = "left";
      ctx.fillText("$" + price, W - pad.right + 4, y + 4);
    }

    // GEX level lines
    const gexLines = [
      { price: levels.kingNode, color: "#00ff64", label: "KING" },
      { price: levels.callWall, color: "#ff4444", label: "CALL" },
      { price: levels.putWall, color: "#4444ff", label: "PUT" },
      { price: levels.hvl, color: "#ffaa00", label: "HVL" },
    ];
    gexLines.forEach(({ price, color, label }) => {
      const y = toY(price);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = color + "88"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = color; ctx.font = "9px Courier New"; ctx.textAlign = "right";
      ctx.fillText(label, W - pad.right - 2, y - 2);
    });

    // Candles
    displayed.forEach((c, i) => {
      const x = pad.left + (i / displayed.length) * chartW + candleW / 2;
      const isGreen = c.close >= c.open;
      const color = isGreen ? "#00ff64" : "#ff4444";
      ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([]);
      // Wick
      ctx.beginPath(); ctx.moveTo(x, toY(c.high)); ctx.lineTo(x, toY(c.low)); ctx.stroke();
      // Body
      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBot = toY(Math.min(c.open, c.close));
      const bodyH = Math.max(1, bodyBot - bodyTop);
      ctx.fillStyle = isGreen ? "#00ff6433" : "#ff444433";
      ctx.strokeStyle = color;
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
      ctx.strokeRect(x - candleW / 2, bodyTop, candleW, bodyH);
    });

    // Time labels
    ctx.fillStyle = "#333"; ctx.font = "9px Courier New"; ctx.textAlign = "center";
    [0, Math.floor(displayed.length / 3), Math.floor(displayed.length * 2 / 3), displayed.length - 1].forEach(i => {
      if (displayed[i]) {
        const x = pad.left + (i / displayed.length) * chartW + candleW / 2;
        const t = new Date(displayed[i].time * 1000);
        ctx.fillText(t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), x, H - 10);
      }
    });
  }, [candles, levels]);

  return <canvas ref={canvasRef} width={800} height={300} style={{ width: "100%", height: "300px", display: "block" }} />;
}

export default function Dashboard() {
  const [levels, setLevels] = useState(defaultLevels);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(defaultLevels);
  const [spy, setSpy] = useState(0);
  const [vix, setVix] = useState(0);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [lastUpdate, setLastUpdate] = useState("--");
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    try {
      const [mktRes, candleRes] = await Promise.all([fetch("/api/market"), fetch("/api/candles")]);
      const mkt = await mktRes.json();
      const candleData = await candleRes.json();
      if (mkt.spy) setSpy(parseFloat(mkt.spy.toFixed(2)));
      if (mkt.vix) setVix(parseFloat(mkt.vix.toFixed(2)));
      if (candleData.candles) setCandles(candleData.candles);
      setLastUpdate(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setLoading(false);
    } catch { setLoading(false); }
  }

  useEffect(() => { fetchAll(); const i = setInterval(fetchAll, 30000); return () => clearInterval(i); }, []);

  const s = scoreMarket(spy, vix, levels);
  const bias = s >= 65 ? "CALLS" : s >= 45 ? "NO TRADE — WAIT" : "PUTS";
  const biasColor = s >= 65 ? "#00ff64" : s >= 45 ? "#ffaa00" : "#ff4444";
  const scoreColor = s >= 65 ? "#00ff64" : s >= 45 ? "#ffaa00" : "#ff4444";
  const insights = analyzeCandles(candles, levels);
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Courier New, monospace" }}>
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#00ff64", fontWeight: 700, fontSize: "13px", letterSpacing: "3px" }}>ZERODTE.IO</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ color: "#222", fontSize: "10px", letterSpacing: 2 }}>LIVE · {lastUpdate}</span>
          <span style={{ color: "#444", fontSize: "11px", letterSpacing: "2px" }}>COMMAND CENTER</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 40px" }}>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p style={{ color: "#333", fontSize: 11, letterSpacing: 3, marginBottom: 4 }}>{date}</p>
            <h1 style={{ fontSize: 24, fontWeight: 900, fontFamily: "Georgia, serif", margin: 0 }}>SPY 0DTE Intelligence</h1>
          </div>
          <button onClick={() => { setEditing(!editing); setDraft(levels); }} style={{ background: "#111", color: "#555", border: "1px solid #222", padding: "10px 20px", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "Courier New" }}>
            {editing ? "CANCEL" : "UPDATE GEX LEVELS"}
          </button>
        </div>

        {/* GEX editor */}
        {editing && (
          <div style={{ background: "#0f0f0f", border: "1px solid #222", padding: 24, marginBottom: 24 }}>
            <p style={{ color: "#555", fontSize: 11, letterSpacing: 3, marginBottom: 20 }}>ENTER TODAY'S LEVELS FROM SKYLIT</p>
            {(["kingNode", "callWall", "putWall", "hvl"] as const).map(key => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <label style={{ fontSize: 11, letterSpacing: 2, color: "#555", width: 120, textTransform: "uppercase" }}>{key.replace(/([A-Z])/g, " $1")}</label>
                <input type="number" step="0.5" value={draft[key]} onChange={e => setDraft({ ...draft, [key]: parseFloat(e.target.value) })}
                  style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "8px 12px", fontSize: 14, width: 120, fontFamily: "Courier New", outline: "none" }} />
              </div>
            ))}
            <button onClick={() => { setLevels(draft); setEditing(false); }} style={{ background: "#00ff64", color: "#000", border: "none", padding: "12px 28px", fontSize: 12, fontWeight: 900, letterSpacing: 2, cursor: "pointer", marginTop: 12, fontFamily: "Courier New" }}>APPLY</button>
          </div>
        )}

        {/* Top stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { label: "SPY PRICE", value: loading ? "---" : "$" + spy, color: "#00ff64" },
            { label: "VIX", value: loading ? "---" : String(vix), color: vix > 20 ? "#ff4444" : vix > 15 ? "#ffaa00" : "#fff" },
            { label: "TRINITY SCORE", value: s + "/100", color: scoreColor },
            { label: "TODAY'S BIAS", value: bias, color: biasColor },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: "16px 20px" }}>
              <p style={{ color: "#444", fontSize: 10, letterSpacing: 3, marginBottom: 8 }}>{label}</p>
              <p style={{ color, fontSize: 18, fontWeight: 900, fontFamily: "Georgia, serif", margin: 0, lineHeight: 1.2 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Candlestick chart */}
        <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, margin: 0 }}>SPY 5-MINUTE CHART</p>
            <p style={{ color: "#222", fontSize: 10, margin: 0 }}>{candles.length} candles · refreshes every 30s</p>
          </div>
          {candles.length > 0 ? <CandleChart candles={candles} levels={levels} /> : (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#222", fontSize: 12, letterSpacing: 2 }}>
              {loading ? "LOADING CHART DATA..." : "MARKET CLOSED — CHART AVAILABLE MON–FRI 9:30AM–4PM ET"}
            </div>
          )}
        </div>

        {/* Analysis */}
        <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 24, marginBottom: 24 }}>
          <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 20 }}>5-MINUTE CANDLE ANALYSIS</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {insights.map((insight, i) => (
              <div key={i} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "14px 16px" }}>
                <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GEX levels + Analyst watch */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 24 }}>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>GEX LEVELS</p>
            {[
              { label: "KING NODE", value: levels.kingNode, color: "#00ff64" },
              { label: "CALL WALL", value: levels.callWall, color: "#ff4444" },
              { label: "PUT WALL", value: levels.putWall, color: "#4444ff" },
              { label: "HVL", value: levels.hvl, color: "#ffaa00" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ fontSize: 11, letterSpacing: 2, color: "#444" }}>{label}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "Georgia, serif" }}>${value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 24 }}>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>ANALYST WATCH</p>
            {["BOBBY", "GIUL", "GLITCH", "PROPHITCY"].map(name => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ color: "#00ff64", fontSize: 11, letterSpacing: 2 }}>{name}</span>
                <span style={{ color: "#222", fontSize: 10 }}>monitoring...</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 24, fontSize: 10, color: "#1a1a1a", textAlign: "center", letterSpacing: 1 }}>
          LIVE DATA · REFRESHES EVERY 30 SECONDS · NOT FINANCIAL ADVICE
        </p>
      </div>
    </main>
  );
}
