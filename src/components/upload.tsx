"use client";

import { MultiImageDropzone, type FileState } from "./MultiImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { FormEvent, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { z } from "zod";

// Define a Zod schema for validating the form data
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

interface UploadProductProps {
  onClose: () => void;
  onUpdate: () => void; // Trigger parent update after successful API call
}

export default function UploadProduct({
  onClose,
  onUpdate,
}: UploadProductProps) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [name, setName] = useState("");
  const [clothType, setClothType] = useState(""); // Updated to start empty
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const { edgestore } = useEdgeStore();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const validatedData = productSchema.parse({
        name,
        clothType,
        gender,
        price,
        imageUrls,
      });

      const res = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Product created successfully:", data);
      } else {
        console.log("Error uploading product:", res.statusText);
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
        console.log("Error submitting form:", error);
      }
    } finally {
      setIsProcessing(false);
      setName("");
      setClothType(""); // Reset to empty
      setGender(""); // Reset to empty
      setPrice("");
      setImageUrls([]);
      setFileStates([]);
    }
  }

  async function handleFilesAdded(addedFiles: FileState[]) {
    setFileStates([...fileStates, ...addedFiles]);
    const uploadedUrls: SetStateAction<string[]> = [];

    await Promise.all(
      addedFiles.map(async (addedFileState) => {
        try {
          const res = await edgestore.myPublicImages.upload({
            file: addedFileState.file,
            onProgressChange: async (progress) => {
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

    setImageUrls(uploadedUrls);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium">
              Product Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded px-2 py-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="gender" className="block text-sm font-medium">
              Gender
            </Label>
            <Select value={gender} onValueChange={(value) => setGender(value)}>
              <SelectTrigger className="w-40 border border-gray-600 rounded px-2 py-1 mt-1">
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
            <Label htmlFor="clothType" className="block text-sm font-medium">
              Cloth Type
            </Label>
            <Select
              value={clothType}
              onValueChange={(value) => setClothType(value)}
            >
              <SelectTrigger className="w-40 border border-gray-600 rounded px-2 py-1 mt-1">
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
            <Label htmlFor="price" className="block text-sm font-medium">
              Price
            </Label>
            <Input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded px-2 py-1"
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
          </div>

          <Button
            type="submit"
            className={` text-white rounded px-4 py-2 hover:bg-blue-600 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
