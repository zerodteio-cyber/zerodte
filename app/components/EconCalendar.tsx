// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

const TYPE_META = {
  fed:    { label:"FED",    color:"#ff6644", bg:"rgba(255,102,68,.12)", icon:"🏦" },
  cpi:    { label:"CPI",    color:"#ffdd00", bg:"rgba(255,221,0,.10)",  icon:"📊" },
  gdp:    { label:"GDP",    color:"#00ff41", bg:"rgba(0,255,65,.10)",   icon:"📈" },
  nfp:    { label:"JOBS",   color:"#44aaff", bg:"rgba(68,170,255,.10)", icon:"👷" },
  ppi:    { label:"PPI",    color:"#cc88ff", bg:"rgba(204,136,255,.10)",icon:"🏭" },
  retail: { label:"RETAIL", color:"#ffaa44", bg:"rgba(255,170,68,.10)", icon:"🛒" },
  pce:    { label:"PCE",    color:"#ff88cc", bg:"rgba(255,136,204,.10)",icon:"💰" },
  default:{ label:"ECON",   color:"#aaaaaa", bg:"rgba(170,170,170,.08)",icon:"📅" },
};

function getMeta(name) {
  const n = (name||"").toLowerCase();
  if (n.includes("federal")||n.includes("fomc")||n.includes("interest rate")) return TYPE_META.fed;
  if (n.includes("cpi")||n.includes("consumer price")) return TYPE_META.cpi;
  if (n.includes("gdp")) return TYPE_META.gdp;
  if (n.includes("non-farm")||n.includes("nonfarm")||n.includes("payroll")) return TYPE_META.nfp;
  if (n.includes("ppi")||n.includes("producer")) return TYPE_META.ppi;
  if (n.includes("retail")) return TYPE_META.retail;
  if (n.includes("pce")||n.includes("personal consumption")) return TYPE_META.pce;
  return TYPE_META.default;
}

const FF = "'Space Mono',monospace";
const PF = "'Playfair Display',serif";

export function EconCalendar({ mode = "full" }: { mode?: "full"|"compact"|"widget" }) {
  const [econData, setEconData] = useState<any>(null);
  const [newsData, setNewsData] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/econ-today").then(r=>r.json()).catch(()=>({today:[],upcoming:[]})),
      fetch("/api/market-news").then(r=>r.json()).catch(()=>({articles:[]})),
    ]).then(([econ,news]) => {
      setEconData(econ);
      setNewsData(news);
      setLoading(false);
    });
  }, []);

  const todayEvents = econData?.today || [];
  const upcomingEvents = econData?.upcoming || [];
  const articles = newsData?.articles || [];

  if (loading) return (
    <div style={{fontFamily:FF,padding:"20px 48px",color:"#333",fontSize:10,letterSpacing:".2em"}}>
      LOADING MARKET INTELLIGENCE...
    </div>
  );

  // WIDGET
  if (mode === "widget") {
    const all = [...todayEvents,...upcomingEvents.slice(0,3)];
    return (
      <div style={{fontFamily:FF,background:"#0f0f0f",border:"1px solid #1f1f1f",padding:"14px 18px"}}>
        <div style={{fontSize:9,color:"#00ff41",letterSpacing:".2em",marginBottom:10}}>📅 ECON EVENTS</div>
        {all.length===0 && <div style={{fontSize:10,color:"#444",fontStyle:"italic"}}>No major events this week.</div>}
        {all.map((ev,i)=>{
          const m=getMeta(ev.name); const isToday=i<todayEvents.length;
          const d=new Date(ev.date+"T12:00:00");
          const label=isToday?"TODAY":d.toLocaleDateString("en-US",{weekday:"short"}).toUpperCase();
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #1a1a1a"}}>
              <span style={{fontSize:9,fontWeight:700,color:isToday?"#ff6644":"#555",minWidth:32}}>{label}</span>
              <span style={{fontSize:9,color:m.color,fontWeight:700}}>{m.icon} {ev.name}</span>
              {ev.actual!=null&&ev.bias==="beat"&&<span style={{marginLeft:"auto",fontSize:8,fontWeight:700,color:"#00ff41",padding:"1px 5px",background:"rgba(0,255,65,.1)"}}>BEAT</span>}
              {ev.actual!=null&&ev.bias==="miss"&&<span style={{marginLeft:"auto",fontSize:8,fontWeight:700,color:"#ff3333",padding:"1px 5px",background:"rgba(255,51,51,.1)"}}>MISS</span>}
              {ev.actual==null&&<span style={{marginLeft:"auto",fontSize:8,color:"#444"}}>PENDING</span>}
            </div>
          );
        })}
        {articles[0]&&(
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #1a1a1a"}}>
            <div style={{fontSize:9,color:"#444",letterSpacing:".1em",marginBottom:4}}>LATEST</div>
            <a href={articles[0].url} target="_blank" rel="noreferrer" style={{fontSize:9,color:articles[0].sentiment==="bullish"?"#00ff41":articles[0].sentiment==="bearish"?"#ff3333":"#888",textDecoration:"none",lineHeight:1.5,display:"block"}}>
              {(articles[0].title||"").slice(0,80)}...
            </a>
          </div>
        )}
      </div>
    );
  }

  // COMPACT
  if (mode === "compact") {
    return (
      <div style={{fontFamily:FF,marginBottom:16}}>
        {todayEvents.length>0&&(
          <div style={{background:"rgba(255,100,50,.06)",border:"1px solid rgba(255,100,50,.2)",padding:"16px 18px",marginBottom:8}}>
            <div style={{fontSize:9,color:"#ff6644",letterSpacing:".2em",fontWeight:700,marginBottom:10}}>⚡ ECON EVENT TODAY</div>
            {todayEvents.map((ev,i)=>{
              const m=getMeta(ev.name);
              return (
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:6}}>
                  <span style={{fontSize:16}}>{m.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#fff",fontWeight:700}}>{ev.name}</div>
                    {ev.actual!=null?(
                      <div style={{fontSize:10,marginTop:4,display:"flex",gap:12}}>
                        <span style={{color:ev.bias==="beat"?"#00ff41":"#ff3333",fontWeight:700}}>
                          {ev.bias==="beat"?"▲ BEAT":"▼ MISS"} — Actual: {ev.actual}
                        </span>
                        {ev.estimate!=null&&<span style={{color:"#555"}}>Est: {ev.estimate}</span>}
                      </div>
                    ):(
                      <div style={{fontSize:10,color:"#555",marginTop:2}}>Pending — set Economic Event in scorer after release</div>
                    )}
                  </div>
                  <div style={{fontSize:8,fontWeight:700,padding:"3px 8px",background:"rgba(255,100,50,.12)",color:"#ff6644",whiteSpace:"nowrap"}}>HIGH IMPACT</div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{background:"#111",border:"1px solid #1f1f1f",padding:"14px 18px"}}>
          <div style={{fontSize:9,color:"#00ff41",letterSpacing:".2em",marginBottom:10}}>UPCOMING THIS WEEK</div>
          {upcomingEvents.length===0&&<div style={{fontSize:10,color:"#444",fontStyle:"italic"}}>No more events this week.</div>}
          {upcomingEvents.slice(0,4).map((ev,i)=>{
            const m=getMeta(ev.name); const d=new Date(ev.date+"T12:00:00");
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid #1a1a1a"}}>
                <span style={{fontSize:9,color:"#555",minWidth:60}}>{d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
                <span style={{fontSize:9,padding:"2px 6px",background:m.bg,color:m.color}}>{m.label}</span>
                <span style={{fontSize:9,color:"#bbb"}}>{ev.name}</span>
              </div>
            );
          })}
        </div>
        {articles.length>0&&(
          <div style={{background:"#0d0d0d",border:"1px solid #1f1f1f",padding:"14px 18px",marginTop:8}}>
            <div style={{fontSize:9,color:"#00ff41",letterSpacing:".2em",marginBottom:10}}>MARKET HEADLINES</div>
            {articles.slice(0,3).map((a,i)=>(
              <div key={i} style={{padding:"7px 0",borderBottom:"1px solid #161616"}}>
                <a href={a.url} target="_blank" rel="noreferrer" style={{fontSize:10,color:a.sentiment==="bullish"?"#88ffaa":a.sentiment==="bearish"?"#ffaaaa":"#888",textDecoration:"none",lineHeight:1.5,display:"block"}}>
                  {(a.title||"").slice(0,90)}{(a.title||"").length>90?"...":""}
                </a>
                <div style={{fontSize:8,color:"#444",marginTop:3}}>{a.source} · {(a.sentiment||"").toUpperCase()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // FULL (landing page)
  return (
    <div style={{fontFamily:FF,padding:"80px 48px",maxWidth:1200,margin:"0 auto"}}>
      <span style={{fontSize:10,letterSpacing:".3em",color:"#00ff41",textTransform:"uppercase",marginBottom:20,display:"block"}}>MARKET INTELLIGENCE</span>
      <h2 style={{fontFamily:PF,fontSize:"clamp(32px,4vw,52px)",fontWeight:900,color:"#fff",lineHeight:1.05,marginBottom:16}}>
        Know what's moving<br/>the market <span style={{color:"#00ff41",fontStyle:"italic"}}>before open.</span>
      </h2>
      <p style={{fontSize:13,color:"#555",lineHeight:1.8,maxWidth:540,marginBottom:48,fontStyle:"italic"}}>
        GDP, CPI, FOMC, NFP — major economic releases move SPY hard and fast. ZeroDTE tracks every scheduled event and factors the data directly into your AI trade score. Good data favors calls. Bad data favors puts.
      </p>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"#1f1f1f",marginBottom:32}}>
        <div style={{background:"#0f0f0f",padding:"32px"}}>
          {todayEvents.length>0?(
            <>
              <div style={{fontSize:9,color:"#ff6644",letterSpacing:".25em",fontWeight:700,marginBottom:16}}>⚡ ECON EVENT TODAY</div>
              {todayEvents.map((ev,i)=>{
                const m=getMeta(ev.name);
                const isBeat=ev.actual!=null&&ev.bias==="beat";
                const isMiss=ev.actual!=null&&ev.bias==="miss";
                return (
                  <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start",padding:"16px",background:"rgba(255,100,50,.05)",border:"1px solid rgba(255,100,50,.2)",marginBottom:8}}>
                    <span style={{fontSize:24}}>{m.icon}</span>
                    <div>
                      <div style={{fontSize:12,color:"#fff",fontWeight:700,marginBottom:4}}>{ev.name}</div>
                      {ev.actual!=null?(
                        <div style={{display:"flex",gap:16,fontSize:11}}>
                          <span style={{color:isBeat?"#00ff41":"#ff3333",fontWeight:700}}>{isBeat?"▲ BEAT":"▼ MISS"} · Actual: {ev.actual}</span>
                          {ev.estimate&&<span style={{color:"#555"}}>Est: {ev.estimate}</span>}
                          {ev.previous&&<span style={{color:"#555"}}>Prev: {ev.previous}</span>}
                        </div>
                      ):(
                        <div style={{fontSize:10,color:"#555",fontStyle:"italic"}}>Data pending — set Economic Event in scorer after release</div>
                      )}
                    </div>
                    <div style={{marginLeft:"auto",fontSize:8,fontWeight:700,padding:"4px 10px",
                      background:isBeat?"rgba(0,255,65,.1)":isMiss?"rgba(255,51,51,.1)":"rgba(255,100,50,.08)",
                      color:isBeat?"#00ff41":isMiss?"#ff3333":"#ff6644",whiteSpace:"nowrap"}}>
                      {isBeat?"BULLISH":isMiss?"BEARISH":"PENDING"}
                    </div>
                  </div>
                );
              })}
            </>
          ):(
            <div style={{fontSize:9,color:"#444",letterSpacing:".2em",marginBottom:16}}>NO EVENTS TODAY</div>
          )}
          <div style={{fontSize:9,color:"#00ff41",letterSpacing:".2em",marginTop:todayEvents.length>0?24:0,marginBottom:12}}>UPCOMING</div>
          {upcomingEvents.length===0&&<div style={{fontSize:10,color:"#444",fontStyle:"italic"}}>No major events this week.</div>}
          {upcomingEvents.slice(0,6).map((ev,i)=>{
            const m=getMeta(ev.name); const d=new Date(ev.date+"T12:00:00");
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #1a1a1a"}}>
                <span style={{fontSize:9,color:"#555",minWidth:70}}>{d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
                <span style={{fontSize:8,padding:"2px 6px",background:m.bg,color:m.color,whiteSpace:"nowrap"}}>{m.label}</span>
                <span style={{fontSize:10,color:"#ccc"}}>{ev.name}</span>
              </div>
            );
          })}
        </div>

        <div style={{background:"#0a0a0a",padding:"32px"}}>
          <div style={{fontSize:9,color:"#00ff41",letterSpacing:".25em",marginBottom:16}}>📡 LIVE MARKET HEADLINES</div>
          {articles.length===0&&<div style={{fontSize:10,color:"#444",fontStyle:"italic"}}>Headlines loading...</div>}
          {articles.map((a,i)=>(
            <div key={i} style={{padding:"14px 0",borderBottom:"1px solid #181818"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontSize:8,fontWeight:700,padding:"2px 7px",letterSpacing:".1em",
                  background:a.sentiment==="bullish"?"rgba(0,255,65,.1)":a.sentiment==="bearish"?"rgba(255,51,51,.1)":"rgba(100,100,100,.1)",
                  color:a.sentiment==="bullish"?"#00ff41":a.sentiment==="bearish"?"#ff3333":"#888"}}>
                  {a.sentiment==="bullish"?"▲ BULLISH":a.sentiment==="bearish"?"▼ BEARISH":"● NEUTRAL"}
                </span>
                <span style={{fontSize:8,color:"#444"}}>{a.source}</span>
              </div>
              <a href={a.url} target="_blank" rel="noreferrer"
                style={{fontSize:11,color:"#ccc",textDecoration:"none",lineHeight:1.6,display:"block"}}>
                {a.title}
              </a>
            </div>
          ))}
          <div style={{marginTop:16,fontSize:9,color:"#333",fontStyle:"italic"}}>Updated every 30 min · Sentiment auto-detected</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"#1f1f1f"}}>
        {[
          {icon:"🔴",title:"Bearish Data = Puts Edge",sub:"GDP miss · CPI hot · Fed hike · NFP weak",desc:"Bad economic data adds +10 to +15 pts to your PUTS score and penalizes calls. Strong catalyst can block call recommendations entirely."},
          {icon:"🟢",title:"Bullish Data = Calls Edge",sub:"GDP beat · CPI cool · Fed cut · Strong retail",desc:"Good data adds +10 to +15 pts to CALLS. Even at the open — a strong catalyst provides a partial pre-10AM override when the setup is right."},
          {icon:"⚠️",title:"Event Pending = Reduce Size",sub:"FOMC decision · Pre-announcement",desc:"Major event pending auto-applies -10 pts and a warning to cut size 50%. Wait for the print, then score the direction."},
        ].map((c,i)=>(
          <div key={i} style={{background:"#111",padding:"32px 28px"}}>
            <div style={{fontSize:24,marginBottom:12}}>{c.icon}</div>
            <div style={{fontSize:12,color:"#fff",fontWeight:700,marginBottom:6}}>{c.title}</div>
            <div style={{fontSize:9,color:"#00ff41",letterSpacing:".1em",marginBottom:10}}>{c.sub}</div>
            <div style={{fontSize:11,color:"#555",lineHeight:1.7,fontStyle:"italic"}}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
