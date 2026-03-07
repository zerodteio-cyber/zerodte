// @ts-nocheck
'use client'
import { useState } from 'react'

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      <div style={{ border: '1px solid #00ff88', borderRadius: '12px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#00ff88', letterSpacing: '4px', marginBottom: '16px' }}>ZERODTE.IO</div>
        <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, margin: '0 0 8px' }}>Full Access</h1>
        <div style={{ color: '#00ff88', fontSize: '48px', fontWeight: 800, margin: '16px 0' }}>
          $200<span style={{ fontSize: '18px', color: '#666' }}>/month</span>
        </div>
        <div style={{ color: '#888', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
          Dual Scan Scorer · Quant Live Trade Chat<br />
          GEX Dashboard · ZeroDTE Framework<br />
          Real-time AI Analysis · Cancel anytime
        </div>
        <button onClick={handleSubscribe} disabled={loading}
          style={{ width: '100%', padding: '16px', background: loading ? '#333' : '#00ff88', color: '#000', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '2px' }}>
          {loading ? 'REDIRECTING...' : 'SUBSCRIBE NOW'}
        </button>
        <div style={{ color: '#555', fontSize: '12px', marginTop: '16px' }}>Secured by Stripe · Cancel anytime</div>
      </div>
    </div>
  )
}
