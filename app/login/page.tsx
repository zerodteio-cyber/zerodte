// @ts-nocheck
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Space+Mono:wght@400;700&display=swap');*{margin:0;padding:0;box-sizing:border-box;}body{background:#080808;color:#e5e5e5;font-family:'Space Mono',monospace;height:100vh;display:flex;align-items:center;justify-content:center;}.wrap{width:100%;max-width:400px;padding:40px 20px;}.logo{color:#00ff41;font-weight:700;letter-spacing:.15em;font-size:13px;text-align:center;margin-bottom:48px;}h1{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:#fff;text-align:center;line-height:1.1;margin-bottom:8px;}h1 em{font-style:italic;color:#00ff41;}.sub{font-size:11px;color:#555;text-align:center;margin-bottom:36px;letter-spacing:.08em;}.field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}.field label{font-size:9px;color:#555;letter-spacing:.2em;text-transform:uppercase;}.inp{background:#0e0e0e;border:1px solid #1c1c1c;padding:14px 16px;font-family:'Space Mono',monospace;font-size:13px;color:#e5e5e5;outline:none;width:100%;transition:border-color .2s;}.inp:focus{border-color:#00ff41;}.inp::placeholder{color:#333;}.btn{background:#00ff41;color:#080808;border:none;padding:16px;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;cursor:pointer;width:100%;margin-top:8px;transition:all .15s;}.btn:hover:not(:disabled){background:#fff;}.btn:disabled{background:#1c1c1c;color:#333;cursor:not-allowed;}.error{font-size:10px;color:#ff3333;text-align:center;margin-top:12px;letter-spacing:.08em;min-height:16px;}`;
export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const login = async () => {
    if (!password) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.success) { router.push("/trade"); } else { setError("Invalid password. Try again."); }
    } catch { setError("Connection error."); } finally { setLoading(false); }
  };
  return (<><style dangerouslySetInnerHTML={{ __html: CSS }} /><div className="wrap"><div className="logo">ZERODTE.IO</div><h1>Welcome back, <em>Quant.</em></h1><p className="sub">Members only · 0DTE SPY Analytics</p><div className="field"><label>Access Password</label><input className="inp" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} autoFocus /></div><button className="btn" onClick={login} disabled={!password || loading}>{loading ? "VERIFYING..." : "ENTER →"}</button><div className="error">{error}</div></div></>);
}
