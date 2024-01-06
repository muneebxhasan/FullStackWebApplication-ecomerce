"use client";
import React from "react";

import { Fproductsdata, Mproductsdata } from "@/utilites/data";
import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
const ItemPage = ({ params }: { params: { itempage: string } }) => {
  const bData: producttype[] = Fproductsdata.concat(Mproductsdata);
  const name: string = params.itempage;
  const [count, setcount] = useState<number>(1);
  const [size, setsize] = useState<string>(" ");

  const selectedItem = bData.find(
    (value) => value.id === Number(params.itempage)
  );
  const choiceSize = (value: string) => {
    setsize(value);
  };
  const increment = () => {
    setcount(count + 1);
  };
  const decrement = () => {
    if (count > 1) {
      setcount(count - 1);
    }
  };
  return (
    <div className="lg:*:px-28">
      {selectedItem ? (
        <>
          <div className="flex flex-col sm:flex-row px-4 sm:px-8 py-4 sm:py-10">
            <div className="flex flex-col sm:flex-row">
              <div className="mb-2 sm:mb-0 sm:mr-2">
                <Image
                  src={selectedItem.src}
                  width={100}
                  height={100}
                  alt={selectedItem.name}
                  className="object-cover p-2"
                />
              </div>

              <div>
                <Image
                  src={selectedItem.src}
                  width={500}
                  height={400}
                  alt={selectedItem.name}
                  className="object-cover p-2"
                />
              </div>
            </div>

            <div className="p-2">
              <div className="mb-4">
                <h1 className="text-xl sm:text-2xl font-medium">
                  {selectedItem.name}
                </h1>
                <span className="text-gray-400 font-bold">
                  {selectedItem.clothType}
                </span>
              </div>
              <div className="mb-4">
                <p>SELECT SIZE</p>
                <ul className="flex flex-row justify-evenly m-2">
                  <li
                    onClick={(event) => choiceSize("XS")}
                    className="border rounded-full bg-gray-100 size-list-item glow-on-hover"
                  >
                    XS
                  </li>
                  <li
                    onClick={(event) => choiceSize("S")}
                    className="border rounded-full bg-gray-100 size-list-item glow-on-hover"
                  >
                    S
                  </li>

                  <li
                    onClick={(event) => choiceSize("M")}
                    className="border rounded-full bg-gray-100 size-list-item glow-on-hover"
                  >
                    M
                  </li>

                  <li
                    onClick={(event) => choiceSize("L")}
                    className="border rounded-full bg-gray-100 size-list-item glow-on-hover"
                  >
                    L
                  </li>

                  <li
                    onClick={(event) => choiceSize("XL")}
                    className="border rounded-full bg-gray-100 size-list-item glow-on-hover"
                  >
                    XL
                  </li>
                </ul>
              </div>
              <div className="mb-4">
                <b>Quantity:</b>
                <Button
                  onClick={decrement}
                  className="border rounded-full bg-gray-100 text-black"
                >
                  -
                </Button>{" "}
                {count}{" "}
                <Button
                  onClick={increment}
                  className="border rounded-full bg-gray-100 text-black"
                >
                  +
                </Button>
              </div>
              <div className="mb-4">
                <Button>
                  <IoCartOutline size={30} /> Add to Cart
                </Button>
                <b className="p-2">{selectedItem.price}</b>
              </div>
            </div>
          </div>
          <div>sad</div>
        </>
      ) : (
        <div>Item not found</div>
      )}
    </div>
  );
};

export default ItemPage;
