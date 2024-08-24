"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/store/strore";
import { CartActions } from "@/store/slice/cartSlice";
import { ProductType, GETProductResponse } from "@/types/datatype";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductDetailsProps {
  selectedItem: ProductType | null;
  count: number;
  selectedSize: string;
  loading: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  selectedItem,
  count,
  selectedSize,
  loading,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const handleAddToCart = () => {
    if (selectedSize) {
      dispatch(
        CartActions.addProduct({
          ...selectedItem,
          id: selectedItem?.id ?? null,
          images: selectedItem?.images ?? [],
          name: selectedItem?.name ?? null, // Default to null if name is undefined
          clothType: selectedItem?.clothType ?? null, // Default to null if clothType is undefined
          gender: selectedItem?.gender ?? null, // Default to null if gender is undefined
          price: selectedItem?.price ?? null, // Default to null if price is undefined
          quantity: count,
          size: selectedSize,
        }),
      );
      toast({
        description: "Product added to cart.",
      });
    } else {
      alert("Please select a size");
    }
  };

  return (
    <div className="flex gap-4 mb-4">
      {loading ? (
        <Skeleton className="h-10 w-48 rounded transition-opacity duration-500" />
      ) : (
        <>
          <Button onClick={handleAddToCart}>
            <IoCartOutline size={30} /> Add to Cart
          </Button>
          <b className="p-2">${selectedItem?.price}</b>
        </>
      )}
    </div>
  );
};

const ItemPage = ({ params }: { params: { itempage: string } }) => {
  const [selectedItem, setSelectedItem] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const fetchSelectedItem = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/product?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      const product: GETProductResponse = data.products[0];
      setSelectedItem(product || null);
    } catch (error) {
      console.error("Error fetching product:", error);
      setSelectedItem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedItem(params.itempage);
  }, [params.itempage]);

  const choiceSize = (size: string) => {
    setSelectedSize(size);
  };

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <div className="lg:px-28">
      <div className="flex flex-col sm:flex-row px-4 sm:px-8 py-4 sm:py-10">
        <div className="flex flex-col sm:flex-row">
          <div className="mb-2 sm:mb-0 sm:mr-2">
            {loading ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[100px] w-[100px] rounded-xl transition-opacity duration-500" />
              </div>
            ) : (
              <Image
                alt={`${selectedItem?.name} image`}
                className="aspect-square rounded-md object-cover transition-opacity duration-500"
                height="100"
                src={String(selectedItem?.images[0]) || "/placeholder.svg"}
                width="100"
              />
            )}
          </div>

          <div>
            {loading ? (
              <Skeleton className="h-[400px] w-[500px] rounded-md transition-opacity duration-500" />
            ) : (
              <Image
                alt={`${selectedItem?.name} image`}
                className="aspect-square rounded-md object-cover transition-opacity duration-500"
                height="400"
                src={String(selectedItem?.images[0]) || "/placeholder.svg"}
                width="500"
              />
            )}
          </div>
        </div>

        <div className="px-10 py-2">
          {loading ? (
            <Skeleton className="h-10 w-full mb-4 rounded transition-opacity duration-500" />
          ) : (
            <>
              <div className="mb-4 transition-opacity duration-500">
                <h1 className="text-xl sm:text-2xl font-medium">
                  {selectedItem?.name}
                </h1>
                <span className="text-gray-400 font-bold">
                  {selectedItem?.clothType}
                </span>
              </div>

              <div className="mb-4">
                <p>SELECT SIZE</p>
                <ul className="flex flex-row gap-4 justify-evenly m-2">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <li
                      key={size}
                      onClick={() => choiceSize(size)}
                      className={`border rounded-full bg-gray-100 size-list-item ${
                        selectedSize === size
                          ? "bg-gray-700 text-white border-gray-900"
                          : ""
                      }`}
                    >
                      {size}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 mb-4">
                <b>Quantity:</b>
                <Button
                  onClick={decrement}
                  className="border rounded-full bg-gray-100 text-black"
                >
                  -
                </Button>
                {"   "}
                {count}
                {"    "}
                <Button
                  onClick={increment}
                  className="border rounded-full bg-gray-100 text-black"
                >
                  +
                </Button>
              </div>

              <ProductDetails
                selectedItem={selectedItem}
                count={count}
                selectedSize={selectedSize}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>

      <div className="border rounded-lg shadow-xl flex flex-col m-14 p-4 md:p-8 lg:p-16">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-slate-200 text-center mb-4">
            Overview
          </h1>
        </div>

        <div className="p-4 md:p-8 lg:p-20 flex items-center justify-center">
          <div className="max-w-screen-lg w-full md:flex">
            <div className="md:w-1/3 pr-8">
              <h2 className="text-2xl font-semibold mb-2">PRODUCT DETAILS</h2>
            </div>
            <div className="md:w-2/3">
              {loading ? (
                <Skeleton className="h-20 w-full transition-opacity duration-500" />
              ) : (
                <p className="text-gray-600 transition-opacity duration-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 lg:p-20 flex items-center justify-center">
          <div className="max-w-screen-lg w-full md:flex">
            <div className="md:w-1/3 pr-8">
              <h2 className="text-2xl font-semibold mb-4">PRODUCT CARE</h2>
            </div>
            <div className="md:w-2/3">
              {loading ? (
                <Skeleton className="h-20 w-full transition-opacity duration-500" />
              ) : (
                <ul className="list-disc list-inside text-gray-600 transition-opacity duration-500">
                  <li>Hand wash using cold water.</li>
                  <li>Do not use bleach.</li>
                  <li>Hang it to dry.</li>
                  <li>Iron on low temperature.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
