import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import Appprovider from "@/components/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EdgeStoreProvider } from "@/lib/edgestore";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dine Market",
  description: "Next.js + Tailwind CSS + TypeScript template",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Optional: For iOS devices
    other: [
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" },
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <EdgeStoreProvider>
          <Appprovider>
            <TooltipProvider>
              <Navbar />
              <main className="pt-20">
                {/* Padding ensures content is below navbar */}
                {children}
              </main>
              <Toaster />
              <Footer />
            </TooltipProvider>
          </Appprovider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
