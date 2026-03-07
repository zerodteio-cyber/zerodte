// @ts-nocheck
'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState('Verifying your payment...')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { router.push('/subscribe'); return }

    fetch(`/api/stripe/verify?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('Payment confirmed. Welcome to ZeroDTE.')
          setDone(true)
          setTimeout(() => router.push('/scorer'), 2500)
        } else {
          setStatus('Payment could not be verified. Contact support.')
        }
      })
      .catch(() => setStatus('Verification error. Contact support.'))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>{done ? '✅' : '⏳'}</div>
        <div style={{ color: done ? '#00ff88' : '#888', fontSize: '18px' }}>{status}</div>
        {done && <div style={{ color: '#555', fontSize: '13px', marginTop: '12px' }}>Redirecting to Scorer...</div>}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>
}
