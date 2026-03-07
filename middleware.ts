import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/scorer', '/trade', '/journal', '/dashboard']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtected = PROTECTED.some(p => path.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const session = request.cookies.get('zerodte_session')?.value
  const stripePaid = request.cookies.get('stripe_paid')?.value
  const secret = process.env.SESSION_SECRET

  if (session === secret || stripePaid === secret) return NextResponse.next()

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/scorer/:path*', '/trade/:path*', '/journal/:path*', '/dashboard/:path*'],
}
