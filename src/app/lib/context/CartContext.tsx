"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

type CartContextProps = {
  cart: StoreOrderItemType[];
  setCart: Dispatch<SetStateAction<StoreOrderItemType[]>>;
};

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useLocalStorageState<StoreOrderItemType[]>(
    "cart",
    [],
  );

  console.log("cart =>", cart);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartContextProvider");
  }
  return context;
};
