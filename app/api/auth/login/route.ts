// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const masterPassword = process.env.MASTER_PASSWORD;
  if (!masterPassword) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  if (password === masterPassword) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("zerodte_session", process.env.SESSION_SECRET || "zerodte_auth", { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 * 30, path: "/" });
    return res;
  }
  return NextResponse.json({ success: false }, { status: 401 });
}
