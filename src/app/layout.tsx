import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import Appprovider from "@/components/provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import App from "next/app";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Dine Market",
  description: "Next.js + Tailwind CSS + TypeScript template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Appprovider>
          <TooltipProvider>
            <Navbar />
            {children}
            <Toaster />
            <Footer />
          </TooltipProvider>
        </Appprovider>
      </body>
    </html>
  );
}
