import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CardDescription } from "@/components/ui/card";
import { GETProductResponse } from "@/types/datatype";

interface ItemProps {
  productsdata: GETProductResponse[];
}
const Item = ({ productsdata }: ItemProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10">
      {productsdata.map((product: GETProductResponse) => (
        <div key={product.id} className="border shadow-xl rounded-xl">
          <Link href={`/items/${product.id}`}>
            {product.images.length > 0 ? (
              <Image
                alt={`${product.name} image`}
                className="aspect-square rounded-md object-cover"
                height="400"
                src={String(product.images[0])}
                width="400"
              />
            ) : (
              <Image
                alt="Placeholder image"
                className="aspect-square rounded-md object-cover"
                height="400"
                src="/placeholder.svg"
                width="400"
              />
            )}
            <CardDescription className=" flex flex-col items-center p-2 mb-2">
              <span className="text-xl font-semibold">{product.name}</span>
              <b className="text-gray-600">${product.price}</b>
            </CardDescription>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Item;
