import React from "react";
import Image from "next/image";
import { CardDescription } from "./ui/card";
const Promotions = () => {
  return (
    <div className="flex flex-col  items-center py-20">
      <p className=" text-blue-500">PROMOTIONS</p>
      <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Our Promotions Events
      </h4>
      <div className="">
        <div className="flex flex-row  p-3">
          {/* rightside */}
          <div className="flex justify-between gap-1 flex-row">
            <div>
              <div className="flex items-center justify-center p-4 bg-gray-300 rounded-lg">
                <CardDescription className=" flex flex-col items-center justify-center p-2 ">
                  <span className="text-xl text-black font-semibold">
                    GET UP TO 60%
                  </span>
                  <p className="text-gray-600">For the summer season</p>
                </CardDescription>
                <div className="ml-4">
                  <Image
                    src={"/event1.webp"}
                    width={200}
                    height={200}
                    alt="logo"
                    className="object-cover rounded-sm shadow-lg"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center bg-gray-800 rounded-lg">
                <CardDescription className=" flex flex-col items-center justify-center p-7 ">
                  <span className="text-xl text-white font-semibold">
                    GET 30% Off
                  </span>
                  <p className="text-white">USE PROMO CODE</p>
                  <div className="bg-gray-700 p-2 text-white font-semibold rounded-md">
                    DINEWEEKENDSALE
                  </div>
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col items-center  bg-gray-300 rounded-lg ">
              <CardDescription className="  p-2 ">
                <span className="text-xl text-black font-semibold">
                  Flex Push Button Bomber
                </span>
                <p className="text-gray-600">
                  $225.00 <b>$190.00</b>{" "}
                </p>
              </CardDescription>
              <div className="ml-4">
                <Image
                  src={"/event2.webp"}
                  width={200}
                  height={200}
                  alt="logo"
                  className="object-cover rounded-sm shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions;
