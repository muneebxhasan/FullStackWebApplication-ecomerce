import Item from "@/components/item";
import { GETProductResponse } from "@/types/datatype";
import { headers } from "next/headers"; // Only available in Next.js 13+ App directory

const thisisfemalepage = async () => {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  // Construct the full URL when running on the server
  const baseUrl = typeof window === "undefined" ? `${protocol}://${host}` : "";

  const response = await fetch(`${baseUrl}/api/product?gender=male`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },

    next: {
      revalidate: 1000,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  const products: GETProductResponse[] = data.products;

  return <Item productsdata={products} />;
};

export default thisisfemalepage;
