// app/api/get-checkout-session/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer", "payment_intent"],
    });
    // console.log("Stripe session retrieved:", session);
    return NextResponse.json(session);
  } catch (err: any) {
    console.error("Stripe session retrieval error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
