"use client";
import getStipePromise from "@/lib/stripe";
import { CartProduct } from "@/types/datatype";
import { MdOutlinePayment } from "react-icons/md";
import { Button } from "./ui/button";
interface StripeCheckOutButtonProps {
  products: CartProduct[];
}

const StripeCheckOutButton = ({ products }: StripeCheckOutButtonProps) => {
  const handleCheckout = async () => {
    const stripe = await getStipePromise();
    const response = await fetch("/api/stripe-session/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify(products),
    });

    const data = await response.json();
    if (data.session) {
      stripe?.redirectToCheckout({ sessionId: data.session.id });
    }
  };

  return (
    <div>
      <Button
        className="w-full bg-gray-800  text-white hover:bg-gray-950 px-4 py-2"
        onClick={handleCheckout}
      >
        <MdOutlinePayment />
        {"   "} Check out
      </Button>
    </div>
  );
};

export default StripeCheckOutButton;
