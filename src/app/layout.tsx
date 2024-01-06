import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header";
import Footer from "@/components/footer";
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
