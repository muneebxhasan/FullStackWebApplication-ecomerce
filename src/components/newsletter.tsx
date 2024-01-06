import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
const Newsletter = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row">
        <div className="flex justify-center p-4 max-w-full sm:w-1/2">
          <h1 className="flex text-7xl items-center font-extrabold text-transparent bg-clip-text bg-slate-200 ">
            Different from others
          </h1>
        </div>
        <div className="flex flex-col">
          <h1 className="flex justify-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-6 ">
            Unique and Authentic Vintage Designer Jewellery
          </h1>
          <div className="flex flex-col px-10 shadow-lg rounded-lg">
            <div className="flex flex-row justify-evenly">
              <Image
                src={"/products/i2.png"}
                width={200}
                height={100}
                alt="logo"
                className="max-w-full h-32 object-cover mb-2 rounded-sm"
              />
              <Image
                src={"/products/i3.png"}
                width={200}
                height={100}
                alt="logo"
                className="max-w-full h-32 object-cover mb-2 rounded-sm"
              />
              <Image
                src={"/products/i4.png"}
                width={200}
                height={100}
                alt="logo"
                className="max-w-full h-32 object-cover mb-2 rounded-sm"
              />
            </div>

            <span className="p-3 text-gray-800 text-sm font-sans">
              This piece is ethically crafted in our small family-owned workshop
              in Peru with unmatched attention to detail and care. The Natural
              color is the actual natural color of the fiber, undyed and 100%
              traceable.
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-32 ">
        <h1 className="flex  text-7xl items-center font-extrabold text-transparent bg-clip-text bg-slate-200 ">
          Newsletter
        </h1>
        <div className="flex flex-col items-center  absolute z-10 gap-y-2">
          <h3 className="flex justify-center p-1 scroll-m-20 text-3xl font-semibold  tracking-tight font-sans">
            Subscribe to our news letter
          </h3>
          <p className="">
            {" "}
            Get the latest information and promo offers directly
          </p>
          <div className="flex w-full max-w-sm items-center space-x-2 ">
            <Input type="email" placeholder="Email" />
            <Button type="submit">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
