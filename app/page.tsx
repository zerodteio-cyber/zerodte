export default function Home() {
  return (
    <main style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:"Courier New"}}>
      <nav style={{borderBottom:"1px solid #1a1a1a",padding:"16px 40px",display:"flex",justifyContent:"space-between"}}>
        <span style={{color:"#00ff64",fontWeight:700,fontSize:"13px",letterSpacing:"3px"}}>ZERODTE.IO</span>
        <span style={{color:"#444",fontSize:"11px"}}>0DTE SPY INTELLIGENCE</span>
      </nav>
      <section style={{maxWidth:"900px",margin:"0 auto",padding:"100px 40px"}}>
        <p style={{color:"#00ff64",fontSize:"11px",letterSpacing:"4px",marginBottom:"24px"}}>NOW ACCEPTING WAITLIST</p>
        <h1 style={{fontSize:"64px",fontWeight:900,fontFamily:"Georgia,serif",lineHeight:1.1,marginBottom:"32px"}}>Stop Guessing.<br/><span style={{color:"#00ff64"}}>Read the Market</span><br/>Like a Machine.</h1>
        <p style={{fontSize:"18px",color:"#888",fontStyle:"italic",lineHeight:1.7,marginBottom:"40px"}}>Real-time GEX heatmap analysis and AI-scored trade setups for serious 0DTE SPY traders.</p>
        <button style={{background:"#00ff64",color:"#000",border:"none",padding:"16px 36px",fontSize:"13px",fontWeight:900,cursor:"pointer"}}>JOIN THE WAITLIST</button>
        <p style={{marginTop:"16px",fontSize:"12px",color:"#444"}}>/month</p>
      </section>
    </main>
  );
}