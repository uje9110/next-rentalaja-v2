import { CartContextProvider } from "@/app/lib/context/CartContext";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CartContextProvider>{children}</CartContextProvider>
    </>
  );
};

export default layout;
