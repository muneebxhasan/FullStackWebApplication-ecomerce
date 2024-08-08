"use client";
import React from "react";

import { Fproductsdata, Mproductsdata } from "@/utils/data";
import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";
import { ProductType } from "@/types/datatype";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/store/strore";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { CartActions } from "@/store/slice/cartSlice";

interface ProductDetailsProps {
  selectedItem: ProductType;
  count: number;
  selectedSize: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  selectedItem,
  count,
  selectedSize,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const handleAddToCart = () => {
    if (selectedSize) {
      dispatch(
        CartActions.addProduct({
          ...selectedItem,
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
    <div className=" flex gap-4 mb-4">
      <Button onClick={handleAddToCart}>
        <IoCartOutline size={30} /> Add to Cart
      </Button>
      <b className="p-2">{selectedItem.price}</b>
    </div>
  );
};

const ItemPage = ({ params }: { params: { itempage: string } }) => {
  const bData: ProductType[] = Fproductsdata.concat(Mproductsdata);
  const [count, setCount] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const selectedItem = bData.find(
    (value) => value.id === Number(params.itempage),
  );

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

  if (!selectedItem) {
    return <div>Item not found</div>;
  }

  return (
    <div className="lg:*:px-28">
      <div className="flex flex-col sm:flex-row px-4 sm:px-8 py-4 sm:py-10">
        <div className="flex flex-col sm:flex-row">
          <div className="mb-2 sm:mb-0 sm:mr-2">
            <Image
              src={selectedItem.src}
              width={100}
              height={100}
              alt={selectedItem.name}
              className="rounded-xl object-cover p-2"
            />
          </div>

          <div>
            <Image
              src={selectedItem.src}
              width={500}
              height={400}
              alt={selectedItem.name}
              className="rounded-xl object-cover p-2"
            />
          </div>
        </div>

        <div className="px-10 py-2">
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-medium">
              {selectedItem.name}
            </h1>
            <span className="text-gray-400 font-bold">
              {selectedItem.clothType}
            </span>
          </div>

          <div className=" mb-4">
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

          <div className=" flex gap-4 mb-4">
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
          />
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
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 lg:p-20 flex items-center justify-center">
          <div className="max-w-screen-lg w-full md:flex">
            <div className="md:w-1/3 pr-8">
              <h2 className="text-2xl font-semibold mb-4">PRODUCT CARE</h2>
            </div>
            <div className="md:w-2/3">
              <ul className="list-disc list-inside text-gray-600">
                <li>Hand wash using cold water.</li>
                <li>Do not use bleach.</li>
                <li>Hang it to dry.</li>
                <li>Iron on low temperature.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
