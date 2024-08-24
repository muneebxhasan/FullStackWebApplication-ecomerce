import { NextRequest, NextResponse } from "next/server";
import db, { Order } from "@/lib/db";
import { ensureTablesExist } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const {
      sessionId,
      amountTotal,
      currency,
      paymentStatus,
      customerDetails,
      shippingDetails,
      items, // Expecting items as an array of objects
    } = await req.json();

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid items", { status: 400 });
    }

    // Insert the order into the database
    const [order] = await db
      .insert(Order)
      .values({
        sessionId,
        amountTotal,
        currency,
        paymentStatus,
        orderStatus: "processing",
        customerEmail: customerDetails?.email || null,
        customerName: customerDetails?.name || null,
        customerPhone: customerDetails?.phone || null,
        shippingAddress: shippingDetails || null,
        items: items, // Store the items as JSONB
      })
      .returning();

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error uploading order:", error);
    return new NextResponse("Database error", { status: 500 });
  }
}

// Route to get order(s)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("id");

    if (orderId) {
      // Fetch a specific order by ID
      const [order] = await db
        .select()
        .from(Order)
        .where(eq(Order.id, Number(orderId)));

      if (!order) {
        return new NextResponse("Order not found", { status: 404 });
      }

      return NextResponse.json(order);
    } else {
      // Fetch all orders
      const orders = await db.select().from(Order);
      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new NextResponse("Database error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, newStatus } = await req.json();

    // Validate inputs
    if (!orderId || !newStatus) {
      return new NextResponse("Missing orderId or newStatus", { status: 400 });
    }

    // Update the order status in the database
    const [updatedOrder] = await db
      .update(Order)
      .set({ orderStatus: newStatus })
      .where(eq(Order.id, Number(orderId)))
      .returning();

    if (!updatedOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json({ updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    return new NextResponse("Database error", { status: 500 });
  }
}
