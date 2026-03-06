"use client";
import { useState, useEffect } from "react";

const defaultLevels = {
  kingNode: 590,
  callWall: 595,
  putWall: 585,
  hvl: 588,
};

function score(spy: number, vix: number, levels: typeof defaultLevels) {
  let s = 50;
  if (spy > levels.kingNode) s += 15; else s -= 15;
  if (spy > levels.hvl) s += 10; else s -= 10;
  if (vix < 15) s += 10; else if (vix > 20) s -= 15; else s -= 5;
  if (spy > levels.putWall && spy < levels.callWall) s += 10;
  return Math.max(0, Math.min(100, s));
}

function ScoreBar({ value }: { value: number }) {
  const color = value >= 65 ? "#00ff64" : value >= 45 ? "#ffaa00" : "#ff4444";
  const label = value >= 65 ? "BULLISH" : value >= 45 ? "NEUTRAL" : "BEARISH";
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, letterSpacing: 3, color: "#666" }}>TRINITY SCORE</span>
        <span style={{ fontSize: 13, letterSpacing: 3, color }}>{label}</span>
      </div>
      <div style={{ background: "#111", height: 8, borderRadius: 4 }}>
        <div style={{ background: color, height: 8, borderRadius: 4, width: `${value}%`, transition: "width 0.5s" }} />
      </div>
      <div style={{ textAlign: "right", marginTop: 6 }}>
        <span style={{ fontSize: 48, fontWeight: 900, color, fontFamily: "Georgia, serif" }}>{value}</span>
        <span style={{ fontSize: 16, color: "#444", marginLeft: 4 }}>/100</span>
      </div>
    </div>
  );
}

function Level({ label, value, prefix = "$", highlight = false }: { label: string; value: number; prefix?: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1a1a1a" }}>
      <span style={{ fontSize: 12, letterSpacing: 2, color: "#555" }}>{label}</span>
      <span style={{ fontSize: 20, fontWeight: 700, color: highlight ? "#00ff64" : "#fff", fontFamily: "Georgia, serif" }}>{prefix}{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const [levels, setLevels] = useState(defaultLevels);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(defaultLevels);
  const [spy, setSpy] = useState(0);
  const [vix, setVix] = useState(0);
  const [lastUpdate, setLastUpdate] = useState("--");
  const [loading, setLoading] = useState(true);

  async function fetchMarket() {
    try {
      const res = await fetch("/api/market");
      const data = await res.json();
      if (data.spy) setSpy(parseFloat(data.spy.toFixed(2)));
      if (data.vix) setVix(parseFloat(data.vix.toFixed(2)));
      setLastUpdate(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000);
    return () => clearInterval(interval);
  }, []);

  const s = score(spy, vix, levels);
  const bias = s >= 65 ? "CALLS" : s >= 45 ? "NO TRADE — WAIT" : "PUTS";
  const biasColor = s >= 65 ? "#00ff64" : s >= 45 ? "#ffaa00" : "#ff4444";
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Courier New, monospace" }}>
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#00ff64", fontWeight: 700, fontSize: "13px", letterSpacing: "3px" }}>ZERODTE.IO</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ color: "#222", fontSize: "10px", letterSpacing: 2 }}>UPDATED {lastUpdate}</span>
          <span style={{ color: "#444", fontSize: "11px", letterSpacing: "2px" }}>COMMAND CENTER</span>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 6 }}>{date}</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, fontFamily: "Georgia, serif", margin: 0 }}>SPY 0DTE Intelligence</h1>
          </div>
          <button onClick={() => { setEditing(!editing); setDraft(levels); }} style={{ background: editing ? "#333" : "#111", color: editing ? "#fff" : "#555", border: "1px solid #222", padding: "10px 20px", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "Courier New" }}>
            {editing ? "CANCEL" : "UPDATE GEX LEVELS"}
          </button>
        </div>

        {editing && (
          <div style={{ background: "#0f0f0f", border: "1px solid #222", padding: 24, marginBottom: 32 }}>
            <p style={{ color: "#555", fontSize: 11, letterSpacing: 3, marginBottom: 20 }}>ENTER TODAY'S GEX LEVELS FROM SKYLIT</p>
            {(["kingNode", "callWall", "putWall", "hvl"] as const).map(key => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <label style={{ fontSize: 11, letterSpacing: 2, color: "#555", width: 120, textTransform: "uppercase" }}>{key.replace(/([A-Z])/g, " $1")}</label>
                <input type="number" step="0.5" value={draft[key]} onChange={e => setDraft({ ...draft, [key]: parseFloat(e.target.value) })}
                  style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "8px 12px", fontSize: 14, width: 120, fontFamily: "Courier New", outline: "none" }} />
              </div>
            ))}
            <button onClick={() => { setLevels(draft); setEditing(false); }}
              style={{ background: "#00ff64", color: "#000", border: "none", padding: "12px 28px", fontSize: 12, fontWeight: 900, letterSpacing: 2, cursor: "pointer", marginTop: 12, fontFamily: "Courier New" }}>
              APPLY
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 24 }}>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>LIVE MARKET</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 12, letterSpacing: 2, color: "#555" }}>SPY PRICE</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#00ff64", fontFamily: "Georgia, serif" }}>{loading ? "---" : `$${spy}`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 12, letterSpacing: 2, color: "#555" }}>VIX</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: vix > 20 ? "#ff4444" : vix > 15 ? "#ffaa00" : "#fff", fontFamily: "Georgia, serif" }}>{loading ? "---" : vix}</span>
            </div>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginTop: 24, marginBottom: 16 }}>GEX LEVELS</p>
            <Level label="KING NODE" value={levels.kingNode} highlight />
            <Level label="CALL WALL" value={levels.callWall} />
            <Level label="PUT WALL" value={levels.putWall} />
            <Level label="HVL" value={levels.hvl} />
          </div>

          <div>
            <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 24, marginBottom: 24 }}>
              <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>TRINITY ANALYSIS</p>
              <ScoreBar value={s} />
            </div>
            <div style={{ background: "#0f0f0f", border: `1px solid ${biasColor}33`, padding: 24 }}>
              <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 12 }}>TODAY'S BIAS</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: biasColor, fontFamily: "Georgia, serif", margin: 0, letterSpacing: 2 }}>{bias}</p>
              <p style={{ fontSize: 11, color: "#333", marginTop: 12, lineHeight: 1.6 }}>
                {spy > 0 && (spy > levels.kingNode ? "Price above King Node — bulls in control." : "Price below King Node — bears in control.")}
                {" "}{vix > 0 && (vix < 15 ? "VIX low — momentum favored." : vix > 20 ? "VIX high — reduce size." : "VIX moderate — stay selective.")}
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 24 }}>
          <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>ANALYST WATCH</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {["BOBBY", "GIUL", "GLITCH", "PROPHITCY"].map(name => (
              <div key={name} style={{ textAlign: "center", padding: 16, border: "1px solid #1a1a1a" }}>
                <p style={{ color: "#00ff64", fontSize: 11, letterSpacing: 2, marginBottom: 4 }}>{name}</p>
                <p style={{ color: "#333", fontSize: 10 }}>monitoring...</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 24, fontSize: 10, color: "#222", textAlign: "center", letterSpacing: 1 }}>
          LIVE DATA · REFRESHES EVERY 30 SECONDS · NOT FINANCIAL ADVICE
        </p>
      </div>
    </main>
  );
}
