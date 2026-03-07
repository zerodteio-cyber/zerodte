// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: "https://www.zerodte.io/subscribe/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://www.zerodte.io/subscribe",
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
