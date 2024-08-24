import React, { useEffect, useState } from "react";
import { Card, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";
import { GETProductResponse } from "@/types/datatype";
import Image from "next/image";
import Link from "next/link";

const Cards = () => {
  const [products, setProducts] = useState<GETProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (products.length === 0) {
      // Only fetch products if not already loaded
      const fetchProducts = async () => {
        const baseURL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        try {
          const response = await fetch(`${baseURL}/api/product`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }

          const data = await response.json();
          setProducts(data.products);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    } else {
      setLoading(false); // Products are already loaded, no need to fetch
    }
  }, [products]); // Dependency array includes products to avoid refetch

  return (
    <div className="flex flex-col items-center py-20">
      <p className="text-blue-500">Product</p>
      <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Check What We Have
      </h4>
      <div className="flex">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-xs sm:max-w-xs md:max-w-xl lg:max-w-lg"
        >
          <CarouselContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-3/4 xl:basis-1/2 2xl:basis-3/4"
                >
                  <Link href={`/items/${product.id}`}>
                    <div className="p-1">
                      <Card>
                        <Image
                          src={String(product.images[0]) || "/placeholder.svg"}
                          width={400}
                          height={400}
                          alt={product.name || "Product Image"}
                          className="w-full h-62 object-cover rounded-lg mb-4"
                        />
                        <CardDescription className="p-2 flex flex-col items-center">
                          <span className="text-xl font-semibold">
                            {product.name}
                          </span>
                          <b className="text-gray-600">${product.price}</b>
                        </CardDescription>
                      </Card>
                    </div>
                  </Link>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          {/* Uncomment if needed */}
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      </div>
    </div>
  );
};

export default Cards;
