"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface OrderData {
  id: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string | null;
      postal_code: string | null;
      country: string;
    };
  };
  created: string;
  items: Array<{
    description: string;
    quantity: number;
    itemTotal: number;
  }>;
}

const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID not found in URL");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const storedOrderId = sessionStorage.getItem("orderId");

      if (storedOrderId) {
        try {
          const response = await fetch(`/api/order?id=${storedOrderId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch order data");
          }

          const orderData: OrderData = await response.json();
          setOrder(orderData);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>No order data found</div>;
  }

  const {
    id,
    amountTotal,
    currency,
    customerName,
    customerEmail,
    customerPhone,
    paymentStatus,
    shippingAddress,
    created,
    items,
  } = order;

  const orderDate = new Date(created).toLocaleString();

  return (
    <div>
      <h1>Success</h1>
      <hr />
      <h2>Order Details</h2>
      <p>Order ID: {id}</p>
      <p>
        Amount Paid: ${(amountTotal / 100).toFixed(2)} {currency.toUpperCase()}
      </p>
      <p>Payment Status: {paymentStatus}</p>
      <p>Order Date: {orderDate}</p>

      <h3>Items:</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.description} - {item.quantity} x $
            {(item.itemTotal / 100).toFixed(2)} {currency.toUpperCase()}
          </li>
        ))}
      </ul>
      <hr />
      <h2>Customer Details</h2>
      <p>Name: {customerName || "N/A"}</p>
      <p>Email: {customerEmail || "N/A"}</p>
      <p>Phone: {customerPhone || "N/A"}</p>

      <h2>Shipping Details</h2>
      <p>
        Address: {shippingAddress.address.line1},{" "}
        {shippingAddress.address.line2
          ? `${shippingAddress.address.line2}, `
          : ""}
        {shippingAddress.address.city},{" "}
        {shippingAddress.address.state
          ? `${shippingAddress.address.state}, `
          : ""}
        {shippingAddress.address.postal_code
          ? `${shippingAddress.address.postal_code}, `
          : ""}
        {shippingAddress.address.country}
      </p>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
