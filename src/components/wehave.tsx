import React from "react";
import { Card, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Image from "next/image";
import { Fproductsdata } from "@/utilites/data";
import Link from "next/link";
const Cards = () => {
  return (
    <>
      <div className="flex flex-col  items-center py-20">
        <p className=" text-blue-500">Product</p>
        <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Check What We Have
        </h4>
        <div className="flex">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-lg"
          >
            <CarouselContent>
              {Fproductsdata.map((product: producttype) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-3/4 xl:basis-1/2 2xl:basis-1/3"
                >
                  {" "}
                  <Link href={`/items/${product.id}`}>
                    <div className="p-1">
                      <Card>
                        <Image
                          src={product.src}
                          width={400}
                          height={400}
                          alt={product.name}
                          className="w-full h-62 object-cover rounded-lg mb-4"
                        />
                        <CardDescription className=" p-2 flex flex-col items-center">
                          <span className="text-xl font-semibold">
                            {product.name}
                          </span>
                          <p className="text-gray-600">{product.price}</p>
                        </CardDescription>
                      </Card>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default Cards;
