// components/Cart.tsx
"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { CartActions } from "@/store/slice/cartSlice";
import { CartProduct } from "@/types/datatype";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StripeCheckOutButton from "@/components/Checkout";

const Cart: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.cartSlice.products);

  const handleRemove = (id: number, size: string) => {
    dispatch(CartActions.removeProduct({ id, size }));
  };

  const handleClearCart = () => {
    dispatch(CartActions.clearCart());
  };

  const handleIncrement = (id: number, size: string) => {
    dispatch(CartActions.incrementProduct({ id, size }));
  };

  const handleDecrement = (id: number, size: string) => {
    dispatch(CartActions.decrementProduct({ id, size }));
  };

  const totalQuantity = products.reduce(
    (total: number, product: CartProduct) => total + product.quantity,
    0,
  );
  const totalPrice = products.reduce((total: number, product: CartProduct) => {
    const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
    return total + price * product.quantity;
  }, 0);
  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row md:space-x-6">
      <div className="flex-1 space-y-6">
        {products.length === 0 ? (
          <div className="text-center text-lg font-medium py-20">
            <p>Your cart is currently empty.</p>
          </div>
        ) : (
          products.map((product: CartProduct) => (
            <Card
              key={product.id}
              className="w-full border border-gray-200 rounded-lg shadow-md"
            >
              <CardContent className="flex flex-col md:flex-row items-center p-4">
                <img
                  src={product.src}
                  alt={product.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                />
                <div className="mt-4 md:mt-0 md:ml-4 flex-1 text-center md:text-left">
                  <div className="text-xl font-semibold">{product.name}</div>
                  <div className="text-gray-600">{product.clothType}</div>
                  <p className="text-lg font-semibold mt-2">{product.price}</p>
                  <div className="flex flex-col gap-2 items-center md:items-start mt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() =>
                          handleDecrement(product.id, product.size)
                        }
                        variant="outline"
                        className="px-4 py-1"
                      >
                        -
                      </Button>
                      <span className="text-lg">{product.quantity}</span>
                      <Button
                        onClick={() =>
                          handleIncrement(product.id, product.size)
                        }
                        variant="outline"
                        className="px-4 py-1"
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleRemove(product.id, product.size)}
                      variant="outline"
                      className="w-full md:w-auto px-4 py-1 mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className="w-full md:w-[350px] mt-6 md:mt-0">
        <Card className="border border-gray-200 rounded-lg shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Quantity:</span>
                <span className="text-lg">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Price:</span>
                <span className="text-lg">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex flex-col justify-between items-center mt-4">
                <Button
                  onClick={handleClearCart}
                  className="w-full bg-red-500 text-white hover:bg-red-600 px-4 py-2"
                >
                  Clear Cart
                </Button>
              </div>
              <StripeCheckOutButton products={products} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
