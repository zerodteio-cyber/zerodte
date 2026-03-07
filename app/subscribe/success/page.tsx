// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Space+Mono:wght@400;700&display=swap');*{margin:0;padding:0;box-sizing:border-box;}body{background:#080808;color:#e5e5e5;font-family:'Space Mono',monospace;min-height:100vh;display:flex;align-items:center;justify-content:center;}.wrap{width:100%;max-width:480px;padding:40px 20px;text-align:center;}.logo{color:#00ff41;font-weight:700;letter-spacing:.15em;font-size:12px;margin-bottom:48px;}.title{font-family:'Playfair Display',serif;font-size:36px;font-weight:900;color:#fff;margin-bottom:12px;}.title em{font-style:italic;color:#00ff41;}.btn{background:#00ff41;color:#080808;border:none;padding:16px 32px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;cursor:pointer;}`;
export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    const i = setInterval(() => setCountdown(c => { if(c<=1){clearInterval(i);router.push("/trade");return 0;}return c-1;}),1000);
    return ()=>clearInterval(i);
  }, []);
  return (<><style dangerouslySetInnerHTML={{__html:CSS}}/><div className="wrap"><div className="logo">ZERODTE.IO</div><div style={{fontSize:48,marginBottom:24}}>⚡</div><div className="title">You're <em>in.</em></div><p style={{fontSize:12,color:"#666",lineHeight:1.8,marginBottom:40}}>Welcome to ZeroDTE. Your membership is active.<br/>Quant is ready. Don't trade the open flush.</p><button className="btn" onClick={()=>router.push("/trade")}>ENTER THE PLATFORM →</button><p style={{fontSize:10,color:"#444",marginTop:16}}>Auto-redirecting in {countdown}s</p></div></>);
}
