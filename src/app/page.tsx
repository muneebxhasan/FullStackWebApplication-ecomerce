"use client";
import Rightside from "@/components/rightside";
import Cards from "@/components/wehave";
import Promotions from "@/components/promotions";
import Newsletter from "@/components/newsletter";
export default function Home() {
  return (
    <>
      <div className="px-6">
        <Rightside />
      </div>
      <div>
        <Promotions />
      </div>
      <div>
        <Cards />
      </div>
      <div>
        <Newsletter />
      </div>
    </>
  );
}
