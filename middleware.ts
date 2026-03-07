// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
const PROTECTED = ["/scorer", "/trade", "/journal"];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some(path => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();
  const session = req.cookies.get("zerodte_session");
  const validSession = process.env.SESSION_SECRET || "zerodte_auth";
  if (session?.value === validSession) return NextResponse.next();
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}
export const config = { matcher: ["/scorer/:path*", "/trade/:path*", "/journal/:path*"] };
