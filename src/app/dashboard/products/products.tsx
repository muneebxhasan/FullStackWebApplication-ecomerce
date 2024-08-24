"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { GETProductResponse } from "@/types/datatype";
import UpdateProduct from "@/components/updateproduct";
import UploadProduct from "@/components/upload";
import Link from "next/link";

function ProductList({ initialProducts }: any) {
  const [products, setProducts] = useState<GETProductResponse[]>(
    initialProducts || [],
  );
  const [selectedProduct, setSelectedProduct] =
    useState<GETProductResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [addproduct, setaddproduct] = useState(false);

  async function fetchProducts() {
    setLoading(true);
    try {
      const response = await fetch("/api/product", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        console.error("Failed to retrieve products:", response.statusText);
      }
    } catch (error) {
      console.error("Error retrieving products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function deleteProduct(id: number) {
    try {
      const response = await fetch(`/api/product?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
      } else {
        console.error("Failed to delete product:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  const handleEdit = (product: GETProductResponse) => {
    setSelectedProduct(product);
  };

  const handleProductUpdated = () => {
    fetchProducts();
    handleCloseDialog(); // Close the dialog after updating the product
  };
  const handleupload = () => {
    setaddproduct(true);
  };
  const handleCloseDialog = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
    }
    if (addproduct) {
      setaddproduct(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-row gap-2">
        <Link href={"/dashboard"}>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        </Link>
        {">"}
        <h1 className="text-2xl font-bold mb-2">Products</h1>
      </div>

      <h2 className="text-lg text-gray-600 mb-4">
        Manage your products and view their details.
      </h2>
      <div className="flex gap-4">
        <Button onClick={fetchProducts} className="w-28 mb-4">
          Refresh Products
        </Button>
        <Button className="w-28" onClick={handleupload}>
          Add Product
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              Image
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  {product.images.length > 0 ? (
                    <Image
                      alt={`${product.name} image`}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={String(product.images[0])}
                      width="64"
                    />
                  ) : (
                    <Image
                      alt="Placeholder image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src="/placeholder.svg"
                      width="64"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.clothType}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.gender}</Badge>
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <Button
                    className="w-10 h-5 "
                    onClick={() => handleEdit(product)}
                  >
                    edit
                  </Button>
                  {"     "}
                  <Button
                    className=" w-10 h-5"
                    onClick={() => {
                      deleteProduct(product.id);
                    }}
                  >
                    {" "}
                    delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <div className="text-xs text-muted-foreground mt-4">
        Showing <strong>{products.length}</strong> products
      </div>
      {selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={handleCloseDialog}
          onUpdate={handleProductUpdated}
        />
      )}
      {addproduct && (
        <UploadProduct
          onClose={handleCloseDialog}
          onUpdate={handleProductUpdated}
        />
      )}
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch data from your API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`);
  const initialProducts = await res.json();

  return {
    props: {
      initialProducts: initialProducts.products || [],
    },
  };
}

export default ProductList;
