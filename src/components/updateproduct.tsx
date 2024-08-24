"use client";

import { useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { MultiImageDropzone, type FileState } from "./MultiImageDropzone";
import { z } from "zod";
import { useEdgeStore } from "@/lib/edgestore";

// Define the schema for product validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  gender: z.enum(["male", "female"]),
  clothType: z.enum(["Dress", "Pants", "Jackets", "T-Shirts", "Sweater"]),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  imageUrls: z.array(z.string().url()),
});

interface UpdateProductProps {
  product: any; // You can define the product type accordingly
  onClose: () => void;
  onUpdate: () => void;
}

export default function UpdateProduct({
  product,
  onClose,
  onUpdate,
}: UpdateProductProps) {
  const [name, setName] = useState(product.name);
  const [gender, setGender] = useState(product.gender);
  const [clothType, setClothType] = useState(product.clothType);
  const [price, setPrice] = useState(product.price);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(product.images || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  async function handleFilesAdded(addedFiles: FileState[]) {
    setFileStates([...fileStates, ...addedFiles]);
    const uploadedUrls: string[] = [];
    await Promise.all(
      addedFiles.map(async (addedFileState) => {
        try {
          const res = await edgestore.myPublicImages.upload({
            file: addedFileState.file,
            onProgressChange: async (progress: any) => {
              updateFileProgress(addedFileState.key, progress);
              if (progress === 100) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(addedFileState.key, "COMPLETE");
              }
            },
          });
          uploadedUrls.push(res.url);
        } catch (err) {
          updateFileProgress(addedFileState.key, "ERROR");
        }
      }),
    );

    setImageUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const validatedData = productSchema.parse({
        name,
        gender,
        clothType,
        price,
        imageUrls,
      });

      const res = await fetch(`/api/product?id=${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (res.ok) {
        console.log("Product updated successfully");
        onUpdate(); // Trigger parent update
      } else {
        console.error("Error updating product:", res.statusText);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = error.errors.reduce(
          (acc: Record<string, string>, err) => {
            acc[err.path[0] as string] = err.message;
            return acc;
          },
          {} as Record<string, string>,
        );
        setErrors(newErrors);
      } else {
        console.error("Error submitting form:", error);
      }
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleImageRemove(url: string) {
    setImageUrls((prevUrls) => prevUrls.filter((imgUrl) => imgUrl !== url));
    // Optionally, you can also delete the image from the server/storage
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>
          <div>
            <Label htmlFor="clothType">Cloth Type</Label>
            <Select value={clothType} onValueChange={setClothType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Cloth Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dress">Dress</SelectItem>
                <SelectItem value="Pants">Pants</SelectItem>
                <SelectItem value="Jackets">Jackets</SelectItem>
                <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                <SelectItem value="Sweater">Sweater</SelectItem>
              </SelectContent>
            </Select>
            {errors.clothType && (
              <p className="text-red-500 text-sm">{errors.clothType}</p>
            )}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>
          <div>
            <Label className="block text-sm font-medium">Product Images</Label>
            <MultiImageDropzone
              value={fileStates}
              dropzoneOptions={{
                maxFiles: 6,
              }}
              onChange={(files) => setFileStates(files)}
              onFilesAdded={handleFilesAdded}
            />
            <div className="mt-2 space-y-2">
              {imageUrls.map((url) => (
                <div key={url} className="flex items-center space-x-2">
                  <img
                    src={url}
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleImageRemove(url)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              className={`text-white rounded px-4 py-2 ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
