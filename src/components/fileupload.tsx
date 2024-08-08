// components/FileUpload.tsx
"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function FileUpload() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  if (!session) {
    return (
      <div>
        <p>You are not logged in.</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG, and GIF files are allowed");
      return false;
    }

    if (file.size > maxSize) {
      alert("File size exceeds 5MB");
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setImageUrl(data.url);
    } else {
      alert("Failed to upload the file.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      {imageUrl && <img src={imageUrl} alt="Uploaded File" />}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
