import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CartProduct } from "@/types/datatype";

const key = process.env.STRIPE_SECRET_KEY || "";

const stripe = new Stripe(key, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  // console.log(body);
  try {
    if (body.length > 0) {
      const session = await stripe.checkout.sessions.create({
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          { shipping_rate: "shr_1PjnMqKm0VUH0Uzj8zk4GY8F" },
          { shipping_rate: "shr_1PjnM9Km0VUH0UzjBRO4GzfL" },
        ],
        invoice_creation: {
          enabled: true,
        },
        line_items: body.map((item: CartProduct) => {
          const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
              },
              unit_amount: price * 100,
            },
            quantity: item.quantity,
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
              maximum: 10,
            },
          };
        }),
        phone_number_collection: {
          enabled: true,
        },
        success_url: `${request.headers.get("origin")}/success`,
        cancel_url: `${request.headers.get("origin")}/?canceled=true`,
      });
      return NextResponse.json({ session });
    } else {
      return NextResponse.json({ message: "No Data Found" });
    }
  } catch (err: any) {
    // console.log(err);
    return NextResponse.json(err.message);
  }
}
