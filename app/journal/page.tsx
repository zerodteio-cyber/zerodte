"use client";
import { useState, useEffect } from "react";

type Trade = {
  id: string;
  date: string;
  time: string;
  direction: "CALLS" | "PUTS";
  ticker: string;
  strike: number;
  expiry: string;
  entry: number;
  exit: number;
  contracts: number;
  trinityScore: number;
  setup: string;
  notes: string;
  result: "WIN" | "LOSS" | "SCRATCH";
};

function calcPnl(t: Trade) {
  return parseFloat(((t.exit - t.entry) * t.contracts * 100 * (t.direction === "PUTS" ? -1 : 1)).toFixed(2));
}

function fmt(n: number) {
  return (n >= 0 ? "+" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

const empty: Omit<Trade, "id"> = {
  date: new Date().toISOString().split("T")[0],
  time: "",
  direction: "CALLS",
  ticker: "SPY",
  strike: 0,
  expiry: "0DTE",
  entry: 0,
  exit: 0,
  contracts: 1,
  trinityScore: 0,
  setup: "",
  notes: "",
  result: "WIN",
};

export default function Journal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zerodte_trades");
      if (saved) setTrades(JSON.parse(saved));
    } catch {}
  }, []);

  function save(updated: Trade[]) {
    setTrades(updated);
    localStorage.setItem("zerodte_trades", JSON.stringify(updated));
  }

  function addTrade() {
    const pnl = calcPnl({ ...form, id: "" });
    const result: Trade["result"] = pnl > 10 ? "WIN" : pnl < -10 ? "LOSS" : "SCRATCH";
    const trade: Trade = { ...form, id: Date.now().toString(), result };
    save([trade, ...trades]);
    setForm(empty);
    setAdding(false);
  }

  function deleteTrade(id: string) {
    save(trades.filter(t => t.id !== id));
  }

  const totalPnl = trades.reduce((sum, t) => sum + calcPnl(t), 0);
  const wins = trades.filter(t => t.result === "WIN").length;
  const losses = trades.filter(t => t.result === "LOSS").length;
  const winRate = trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0;
  const avgWin = wins > 0 ? trades.filter(t => t.result === "WIN").reduce((s, t) => s + calcPnl(t), 0) / wins : 0;
  const avgLoss = losses > 0 ? trades.filter(t => t.result === "LOSS").reduce((s, t) => s + calcPnl(t), 0) / losses : 0;
  const biggestWin = trades.length > 0 ? Math.max(...trades.map(calcPnl)) : 0;
  const biggestLoss = trades.length > 0 ? Math.min(...trades.map(calcPnl)) : 0;

  const F = ({ label, value, color = "#fff" }: { label: string; value: string | number; color?: string }) => (
    <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: "16px 20px" }}>
      <p style={{ color: "#444", fontSize: 10, letterSpacing: 3, marginBottom: 8 }}>{label}</p>
      <p style={{ color, fontSize: 20, fontWeight: 900, fontFamily: "Georgia, serif", margin: 0 }}>{value}</p>
    </div>
  );

  const inp = (field: keyof typeof form, label: string, type = "text", opts?: string[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 10, letterSpacing: 2, color: "#444" }}>{label}</label>
      {opts ? (
        <select value={String(form[field])} onChange={e => setForm({ ...form, [field]: e.target.value })}
          style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "8px 12px", fontSize: 13, fontFamily: "Courier New", outline: "none" }}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={String(form[field])} onChange={e => setForm({ ...form, [field]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
          style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "8px 12px", fontSize: 13, fontFamily: "Courier New", outline: "none", width: "100%" }} />
      )}
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Courier New, monospace" }}>
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#00ff64", fontWeight: 700, fontSize: "13px", letterSpacing: "3px" }}>ZERODTE.IO</span>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="/dashboard" style={{ color: "#444", fontSize: 11, letterSpacing: 2, textDecoration: "none" }}>DASHBOARD</a>
          <span style={{ color: "#666", fontSize: 11, letterSpacing: 2 }}>TRADE JOURNAL</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, fontFamily: "Georgia, serif", margin: 0 }}>Trade Journal</h1>
            <p style={{ color: "#333", fontSize: 11, letterSpacing: 2, marginTop: 4 }}>{trades.length} TRADES LOGGED</p>
          </div>
          <button onClick={() => setAdding(!adding)}
            style={{ background: adding ? "#333" : "#00ff64", color: adding ? "#fff" : "#000", border: "none", padding: "12px 24px", fontSize: 12, fontWeight: 900, letterSpacing: 2, cursor: "pointer", fontFamily: "Courier New" }}>
            {adding ? "CANCEL" : "+ LOG TRADE"}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 32 }}>
          <F label="TOTAL P&L" value={fmt(totalPnl)} color={totalPnl >= 0 ? "#00ff64" : "#ff4444"} />
          <F label="WIN RATE" value={winRate + "%"} color={winRate >= 60 ? "#00ff64" : winRate >= 45 ? "#ffaa00" : "#ff4444"} />
          <F label="WINS" value={wins} color="#00ff64" />
          <F label="LOSSES" value={losses} color="#ff4444" />
          <F label="AVG WIN" value={wins > 0 ? fmt(avgWin) : "--"} color="#00ff64" />
          <F label="AVG LOSS" value={losses > 0 ? fmt(avgLoss) : "--"} color="#ff4444" />
        </div>

        {/* Add trade form */}
        {adding && (
          <div style={{ background: "#0f0f0f", border: "1px solid #222", padding: 28, marginBottom: 32 }}>
            <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 24 }}>LOG NEW TRADE</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
              {inp("date", "DATE", "date")}
              {inp("time", "TIME", "time")}
              {inp("direction", "DIRECTION", "text", ["CALLS", "PUTS"])}
              {inp("ticker", "TICKER", "text")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
              {inp("strike", "STRIKE", "number")}
              {inp("expiry", "EXPIRY", "text", ["0DTE", "1DTE", "2DTE", "WEEKLY"])}
              {inp("entry", "ENTRY PRICE", "number")}
              {inp("exit", "EXIT PRICE", "number")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
              {inp("contracts", "CONTRACTS", "number")}
              {inp("trinityScore", "TRINITY SCORE", "number")}
              {inp("setup", "SETUP", "text", ["KING NODE BOUNCE", "CALL WALL REJECTION", "PUT WALL BOUNCE", "HVL BREAK", "REVERSE RUG", "MOMENTUM CONTINUATION", "OTHER"])}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 10, letterSpacing: 2, color: "#444" }}>CALC P&L</label>
                <div style={{ padding: "8px 12px", border: "1px solid #1a1a1a", fontSize: 16, fontWeight: 900, color: calcPnl({ ...form, id: "" }) >= 0 ? "#00ff64" : "#ff4444", fontFamily: "Georgia, serif" }}>
                  {fmt(calcPnl({ ...form, id: "" }))}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 10, letterSpacing: 2, color: "#444", display: "block", marginBottom: 6 }}>NOTES</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
                style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "10px 12px", fontSize: 13, fontFamily: "Courier New", outline: "none", width: "100%", resize: "vertical" }} />
            </div>
            <button onClick={addTrade}
              style={{ background: "#00ff64", color: "#000", border: "none", padding: "14px 32px", fontSize: 12, fontWeight: 900, letterSpacing: 2, cursor: "pointer", fontFamily: "Courier New" }}>
              SAVE TRADE
            </button>
          </div>
        )}

        {/* Trade list */}
        {trades.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#222", fontSize: 13, letterSpacing: 3 }}>
            NO TRADES YET — LOG YOUR FIRST TRADE ABOVE
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "100px 80px 70px 80px 70px 70px 70px 80px 80px 1fr 60px", gap: 8, padding: "8px 16px", fontSize: 10, letterSpacing: 2, color: "#333" }}>
              <span>DATE</span><span>DIR</span><span>STRIKE</span><span>SETUP</span><span>ENTRY</span><span>EXIT</span><span>QTY</span><span>P&L</span><span>TRINITY</span><span>NOTES</span><span></span>
            </div>
            {trades.map(t => {
              const pnl = calcPnl(t);
              return (
                <div key={t.id} style={{ display: "grid", gridTemplateColumns: "100px 80px 70px 80px 70px 70px 70px 80px 80px 1fr 60px", gap: 8, padding: "14px 16px", background: "#0f0f0f", border: `1px solid ${pnl > 0 ? "#00ff6422" : pnl < 0 ? "#ff444422" : "#1a1a1a"}`, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#555" }}>{t.date}</span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: t.direction === "CALLS" ? "#00ff64" : "#ff4444", letterSpacing: 1 }}>{t.direction}</span>
                  <span style={{ fontSize: 13, color: "#fff", fontFamily: "Georgia, serif" }}>${t.strike}</span>
                  <span style={{ fontSize: 10, color: "#444", letterSpacing: 1 }}>{t.setup}</span>
                  <span style={{ fontSize: 13, color: "#666" }}>${t.entry}</span>
                  <span style={{ fontSize: 13, color: "#666" }}>${t.exit}</span>
                  <span style={{ fontSize: 12, color: "#555" }}>{t.contracts}x</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: pnl >= 0 ? "#00ff64" : "#ff4444", fontFamily: "Georgia, serif" }}>{fmt(pnl)}</span>
                  <span style={{ fontSize: 12, color: t.trinityScore >= 65 ? "#00ff64" : t.trinityScore >= 45 ? "#ffaa00" : "#ff4444" }}>{t.trinityScore}/100</span>
                  <span style={{ fontSize: 11, color: "#333", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{t.notes}</span>
                  <button onClick={() => deleteTrade(t.id)} style={{ background: "none", border: "1px solid #1a1a1a", color: "#333", padding: "4px 8px", fontSize: 10, cursor: "pointer", fontFamily: "Courier New" }}>DEL</button>
                </div>
              );
            })}
          </div>
        )}

        {trades.length > 0 && (
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 24 }}>
              <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>BEST & WORST</p>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ fontSize: 11, color: "#444" }}>BIGGEST WIN</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#00ff64", fontFamily: "Georgia" }}>{fmt(biggestWin)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ fontSize: 11, color: "#444" }}>BIGGEST LOSS</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#ff4444", fontFamily: "Georgia" }}>{fmt(biggestLoss)}</span>
              </div>
            </div>
            <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: 24 }}>
              <p style={{ color: "#444", fontSize: 11, letterSpacing: 3, marginBottom: 16 }}>EDGE SCORE</p>
              <p style={{ fontSize: 11, color: "#333", lineHeight: 1.8 }}>
                {winRate >= 60 ? "✅ Win rate above 60% — your edge is real. Keep following the system." :
                  winRate >= 45 ? "⚠️ Win rate needs improvement. Review losing trades for pattern." :
                    trades.length < 5 ? "📊 Log more trades to see your edge score." :
                      "❌ Win rate below 45% — revisit entry rules. Only take 65+ Trinity setups."}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
