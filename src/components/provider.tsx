"use client";
import { Provider } from "react-redux";
import { store } from "@/store/strore";
import { ReactNode } from "react";

const Appprovider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children} </Provider>;
};

export default Appprovider;
