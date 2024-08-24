"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface SessionData {
  id: string;
  amount_total: number;
  currency: string;
  payment_status: string;
  customer_details: {
    name: string;
    email: string;
    phone: string;
  };
  shipping_details: {
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  created: number;
  line_items: {
    data: Array<{
      id: string;
      description: string;
      quantity: number;
      amount_total: number;
    }>;
  };
}

const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID not found in URL");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      // Check if session data exists in sessionStorage
      const storedSession = sessionStorage.getItem(sessionId);

      if (storedSession) {
        setSession(JSON.parse(storedSession));
        setLoading(false);
      } else {
        try {
          const response = await fetch(
            `/api/get-checkout-session?session_id=${sessionId}`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch session data");
          }

          const data: SessionData = await response.json();
          setSession(data);

          // Store session data in sessionStorage to prevent refetching
          sessionStorage.setItem(sessionId, JSON.stringify(data));

          // Call the API to save the order in the database
          await saveOrder(data);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    const saveOrder = async (sessionData: SessionData) => {
      try {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionData.id,
            amountTotal: sessionData.amount_total,
            currency: sessionData.currency,
            paymentStatus: sessionData.payment_status,
            customerDetails: sessionData.customer_details,
            shippingDetails: sessionData.shipping_details,
            items: sessionData.line_items.data.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              itemTotal: item.amount_total,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save order");
        }

        console.log("Order saved successfully");
      } catch (error: any) {
        console.error("Error saving order:", error.message);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!session) {
    return <div>No session data found</div>;
  }

  const {
    id,
    amount_total,
    currency,
    customer_details,
    payment_status,
    shipping_details,
    created,
    line_items,
  } = session;

  return (
    <div>
      <h1>Success</h1>
      <hr />
      <h2>Order Details</h2>
      <p>Order ID: {id}</p>
      <p>
        Amount Paid: ${(amount_total / 100).toFixed(2)} {currency.toUpperCase()}
      </p>
      <p>Payment Status: {payment_status}</p>
      <p>Order Date: {new Date(created * 1000).toLocaleString()}</p>

      <h3>Items:</h3>
      <ul>
        {line_items.data.map((item) => (
          <li key={item.id}>
            {item.description} - {item.quantity} x $
            {(item.amount_total / 100).toFixed(2)} {currency.toUpperCase()}
          </li>
        ))}
      </ul>
      <hr />
      <h2>Customer Details</h2>
      <p>Name: {customer_details?.name}</p>
      <p>Email: {customer_details?.email}</p>
      <p>Phone: {customer_details?.phone}</p>

      <h2>Shipping Details</h2>
      <p>
        Address: {shipping_details?.address?.line1},{" "}
        {shipping_details?.address?.city}, {shipping_details?.address?.state},{" "}
        {shipping_details?.address?.postal_code},{" "}
        {shipping_details?.address?.country}
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
