import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
const Rightside = () => {
  return (
    <>
      <div className="flex flex-row py-4 ">
        <div className="flex-40 py-8 px-20 md:px-10">
          <span className="bg-gray-100 text-lg w-20 p-2 rounded-lg">
            Sale 69%
          </span>
          <h1 className="flex scroll-m-20 text-3xl font-bold font-sans tracking-tight lg:text-5xl py-4">
            An Industrial Take on Streetwear
          </h1>
          <p className="font-sans text-gray-500  py-5 w-2/3 text-md">
            Anyone can beat you but no one can beat your outfit as long as you
            wear Dine outfits.
          </p>
          <Button>
            <IoCartOutline className="mr-2 h-3 w-4" />
            <Link href={"/female"}>Start Shopping</Link>
          </Button>
          <div className="flex flex-wrap py-2 justify-around gap-4">
            <Image src="/Featured1.webp" width={92} height={100} alt="Logo" />
            <Image src="/Featured2.webp" width={98} height={100} alt="Logo" />
            <Image src="/Featured3.webp" width={98} height={100} alt="Logo" />
            <Image src="/Featured4.webp" width={98} height={100} alt="Logo" />
          </div>
        </div>
        <div className="flex-60 hide-mobile flex flex-auto">
          <div className="flex justify-end rounded-full bg-orange-50">
            <Image
              src="/header.webp"
              width={650}
              height={650}
              alt="Logo"
              className=" hide-mobile flex flex-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Rightside;
