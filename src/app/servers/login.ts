"use server";

import * as z from "zod";
import { loginSchema } from "@/components/login";

export const login = async (value: z.infer<typeof loginSchema>) => {
  // console.log("Logging in with:", value);
  return { success: false, message: "Login unsuccessful" };
};
