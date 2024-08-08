"use client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  callbackUrl: string;
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const formErrors = validation.error.errors.reduce(
        (acc, error) => {
          acc[error.path[0] as keyof LoginFormData] = error.message;
          return acc;
        },
        {} as Partial<Record<keyof LoginFormData, string>>,
      );
      setErrors(formErrors);
      setLoading(false);
    } else {
      setErrors({});
      const response = await signIn("credentials", {
        ...formData,
        redirect: false,
        callbackUrl: callbackUrl,
      });
      if (response?.error) {
        if (response.error.includes("CredentialsSignin")) {
          setLoginError("Incorrect email or password!");
        } else if (response.error.includes("User not found")) {
          setLoginError(
            "User not found. Please check your email and password.",
          );
        } else if (response.error.includes("Email not authenticated")) {
          setLoginError("Email not authenticated. Please verify your email.");
        } else {
          setLoginError("Server error. Please try again later.");
        }
      } else {
        window.location.href = response?.url || callbackUrl;
      }
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="flex justify-center py-6">
        <Image
          src="/Logo.webp"
          width={150}
          height={150}
          alt="Logo"
          className="rounded-full"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          {loginError && (
            <p className="text-red-500 text-sm text-center mt-2">
              {loginError}
            </p>
          )}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
