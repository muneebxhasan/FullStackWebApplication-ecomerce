import Item from "@/components/item";
import { GETProductResponse } from "@/types/datatype";

const thisisfemalepage = async () => {
  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseURL}/api/product?gender=male`, {
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
