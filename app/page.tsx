export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Courier New', monospace",
      overflow: 'hidden',
    }}>

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,100,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,100,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Top bar */}
      <nav style={{
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid #1a1a1a',
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#00ff64', boxShadow: '0 0 10px #00ff64',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontSize: '13px', color: '#00ff64', letterSpacing: '3px', fontWeight: 700 }}>
            ZERODTE.IO
          </span>
        </div>
        <div style={{ fontSize: '11px', color: '#444', letterSpacing: '2px' }}>
          SYSTEM: ONLINE — 0DTE SPY INTELLIGENCE
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '900px', margin: '0 auto',
        padding: '100px 40px 60px',
      }}>

        <div style={{ marginBottom: '24px' }}>
          <span style={{
            fontSize: '11px', letterSpacing: '4px', color: '#00ff64',
            border: '1px solid #00ff6430', padding: '6px 14px',
          }}>
            ▲ NOW ACCEPTING WAITLIST — LIMITED SEATS
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(42px, 7vw, 80px)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-2px',
          marginBottom: '32px',
          fontFamily: "'Georgia', serif",
        }}>
          Stop Guessing.<br />
          <span style={{ color: '#00ff64' }}>Read the Market</span><br />
          Like a Machine.
        </h1>

        <p style={{
          fontSize: '18px', lineHeight: 1.7,
          color: '#888', maxWidth: '560px',
          marginBottom: '48px',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
        }}>
          Real-time GEX heatmap analysis, AI-scored trade setups, and
          King Node intelligence for serious 0DTE SPY traders.
          Every signal scored 0–100. No noise. No guessing.
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '40px', marginBottom: '56px',
          flexWrap: 'wrap',
        }}>
          {[
            { value: '0–100', label: 'AI TRADE SCORE' },
            { value: 'LIVE', label: 'GEX HEATMAPS' },
            { value: '4', label: 'ANALYSTS TRACKED' },
            { value: '0DTE', label: 'SPY ONLY' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '10px', color: '#444', letterSpacing: '2px', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: '#00ff64',
            color: '#000',
            border: 'none',
            padding: '16px 36px',
            fontSize: '13px',
            fontWeight: 900,
            letterSpacing: '2px',
            cursor: 'pointer',
            fontFamily: "'Courier New', monospace",
          }}>
            JOIN THE WAITLIST →
          </button>
          <span style={{ fontSize: '12px', color: '#444', letterSpacing: '1px' }}>
            $200/month · No trials · Serious traders only
          </span>
        </div>
      </section>

      {/* Feature cards */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '900px', margin: '0 auto',
        padding: '40px 40px 100px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1px',
        background: '#1a1a1a',
      }}>
        {[
          {
            icon: '★',
            title: 'King Node Detection',
            desc: 'The single most powerful gamma position on the board. Know where price is being magnetically pulled — before it moves.',
          },
          {
            icon: '◈',
            title: 'Trinity Alignment',
            desc: 'SPX + SPY + QQQ read simultaneously. All three aligned = maximum conviction. Divergence detected instantly.',
          },
          {
            icon: '▲',
            title: 'AI Score Card',
            desc: 'Every setup scored 0–100 using King Node, VIX, VWAP, candlestick pattern, time of day, and analyst consensus.',
          },
          {
            icon: '⬡',
            title: 'Analyst Consensus',
            desc: 'Bobby, Giul, Glitch, and Prophitcy — monitored in real time. When they agree, you know. When they conflict, you wait.',
          },
          {
            icon: '◉',
            title: 'VIX Filter',
            desc: 'VIX King Node direction is a required filter on every trade. No long exposure when fear is accelerating.',
          },
          {
            icon: '⬛',
            title: 'Reverse Rug System',
            desc: 'Six-phase detection system. Know the difference between a fake bounce and a real reverse rug before you enter.',
          },
        ].map((card) => (
          <div key={card.title} style={{
            background: '#0a0a0a',
            padding: '32px 28px',
            borderTop: '2px solid transparent',
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderTopColor = '#00ff64')}
            onMouseLeave={(e) => (e.currentTarget.style.borderTopColor = 'transparent')}
          >
            <div style={{ fontSize: '22px', color: '#00ff64', marginBottom: '14px' }}>
              {card.icon}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', marginBottom: '10px' }}>
              {card.title.toUpperCase()}
            </div>
            <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              {card.desc}
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid #1a1a1a',
        textAlign: 'center',
        padding: '80px 40px',
      }}>
        <div style={{ fontSize: '11px', color: '#444', letterSpacing: '4px', marginBottom: '24px' }}>
          PHASE 1 — EARLY ACCESS
        </div>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 900,
          fontFamily: 'Georgia, serif',
          marginBottom: '16px',
        }}>
          The edge is real.<br />
          <span style={{ color: '#00ff64' }}>The seat is limited.</span>
        </h2>
        <p style={{ color: '#555', fontSize: '15px', marginBottom: '40px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          Built in the live market. Tested in real time. March 2026.
        </p>
        <button style={{
          background: 'transparent',
          color: '#00ff64',
          border: '1px solid #00ff64',
          padding: '16px 48px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '3px',
          cursor: 'pointer',
          fontFamily: "'Courier New', monospace",
        }}>
          REQUEST ACCESS →
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid #111',
        padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{ fontSize: '11px', color: '#333', letterSpacing: '2px' }}>
          ZERODTE.IO — 0DTE SPY INTELLIGENCE PLATFORM
        </span>
        <span style={{ fontSize: '11px', color: '#222', letterSpacing: '1px' }}>
          NOT FINANCIAL ADVICE. TRADE AT YOUR OWN RISK.
        </span>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:hover { opacity: 0.85; }
      `}</style>
    </main>
  );
}
