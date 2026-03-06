"use client";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function submit() {
    if (!email) return;
    await fetch("https://formsubmit.co/ajax/zerodte.io@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: email, message: "Waitlist: " + email }),
    });
    setDone(true);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Courier New" }}>
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "16px 40px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#00ff64", fontWeight: 700, fontSize: "13px", letterSpacing: "3px" }}>ZERODTE.IO</span>
        <span style={{ color: "#444", fontSize: "11px" }}>0DTE SPY INTELLIGENCE</span>
      </nav>
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 40px" }}>
        <p style={{ color: "#00ff64", fontSize: "11px", letterSpacing: "4px", marginBottom: "24px" }}>NOW ACCEPTING WAITLIST</p>
        <h1 style={{ fontSize: "clamp(40px,7vw,68px)", fontWeight: 900, fontFamily: "Georgia, serif", lineHeight: 1.05, marginBottom: "32px" }}>
          Stop Guessing.<br/>
          <span style={{ color: "#00ff64" }}>Read the Market</span><br/>
          Like a Machine.
        </h1>
        <p style={{ fontSize: "18px", color: "#888", fontStyle: "italic", lineHeight: 1.7, maxWidth: "560px", marginBottom: "48px", fontFamily: "Georgia, serif" }}>
          Real-time GEX heatmap analysis, AI-scored trade setups, and King Node intelligence for serious 0DTE SPY traders.
        </p>
        {!open && !done && (
          <button onClick={() => setOpen(true)} style={{ background: "#00ff64", color: "#000", border: "none", padding: "16px 36px", fontSize: "13px", fontWeight: 900, cursor: "pointer", fontFamily: "Courier New" }}>
            JOIN THE WAITLIST
          </button>
        )}
        {open && !done && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "16px 20px", fontSize: "14px", width: "280px", fontFamily: "Courier New", outline: "none" }} />
            <button onClick={submit} style={{ background: "#00ff64", color: "#000", border: "none", padding: "16px 28px", fontSize: "13px", fontWeight: 900, cursor: "pointer", fontFamily: "Courier New" }}>SUBMIT</button>
          </div>
        )}
        {done && <p style={{ color: "#00ff64", fontSize: "15px", letterSpacing: "2px" }}>YOU ARE ON THE LIST.</p>}
        <p style={{ marginTop: "16px", fontSize: "12px", color: "#444" }}>$200/month · Serious traders only</p>
      </section>
    </main>
  );
}
