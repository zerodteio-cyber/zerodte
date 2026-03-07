// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ success: false }, { status: 400 })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === 'paid') {
      const response = NextResponse.json({ success: true })
      response.cookies.set('stripe_paid', process.env.SESSION_SECRET!, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
      })
      return response
    }
    return NextResponse.json({ success: false })
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
