"use client";
// app/page.tsx
import FileUpload from "@/components/fileupload";
import { SessionProvider } from "next-auth/react";
import { use } from "react";

export default function Home() {
  return (
    <SessionProvider>
      <div>
        <h1>Upload an Image</h1>
        <FileUpload />
      </div>
    </SessionProvider>
  );
}
