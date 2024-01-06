import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CardDescription } from "@/components/ui/card";

interface ItemProps {
  productsdata: producttype[];
}
const Item = ({ productsdata }: ItemProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10">
      {productsdata.map((product: producttype) => (
        <div key={product.id} className="border shadow-xl rounded-xl">
          <Link href={`/items/${product.id}`}>
            <Image
              src={product.src}
              width={400}
              height={400}
              alt={product.name}
              className="w-full h-62 object-cover mb-2"
            />
            <CardDescription className=" flex flex-col items-center p-2 mb-2">
              <span className="text-xl font-semibold">{product.name}</span>
              <p className="text-gray-600">{product.price}</p>
            </CardDescription>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Item;
