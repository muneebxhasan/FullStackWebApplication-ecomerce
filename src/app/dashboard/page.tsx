import { auth } from "@/lib/auth";
import UploadProduct from "@/components/upload";
import SignOut from "@/components/signout";
import ProductList from "./products/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import UpdateProduct from "@/components/updateproduct";
export default async function ProtectedPage() {
  let session = await auth();

  if (session?.user?.email === "muneexhasan@gmail.com") {
    return;
  }

  return (
    <div className="flex h-screen ">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-black">
        You are logged in as
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {session?.user?.email}
        </h1>
        <Link href={"/dashboard/products"}>products</Link>
        <Link href={"/dashboard/orders"}>orders</Link>
        {/* <UploadProduct /> */}
        {/* <ProductList /> */}
        <SignOut />
      </div>
    </div>
  );
}
