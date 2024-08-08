"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/login";

const Login = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="flex justify-center items-center py-10">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
};

export default Login;
