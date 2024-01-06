import React from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
const ShoppingCart = () => {
  return (
    <>
      <div className="flex items-center justify-center ">
        <HiOutlineShoppingBag size={200} />
      </div>
      <div className="flex items-center justify-center">
        <h3 className="scroll-m-30 text-3xl font-bold tracking-tight">
          Your Shopping Bag is Empty
        </h3>
      </div>
    </>
  );
};

export default ShoppingCart;
