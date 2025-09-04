"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { ClientCartType } from "../types/client_cart_types";
import { ClientCheckoutType } from "../types/client_checkout_type";
import { CurrencyHandlers } from "../utils/CurrencyHandler";

type CartContextProps = {
  cart: ClientCartType[];
  setCart: Dispatch<SetStateAction<ClientCartType[]>>;
  checkout: ClientCheckoutType;
  setCheckout: Dispatch<SetStateAction<ClientCheckoutType>>;
  itemAmountInCart: number;
};

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useLocalStorageState<ClientCartType[]>("cart", []);
  const [checkout, setCheckout] = useLocalStorageState<ClientCheckoutType>(
    "checkout",
    {
      billing: {
        isAccountAlreadyMade: "yes",
        email: "",
      },
      checkoutCartItems: [],
      paymentRequest: {
        paymentMethod: "",
        paymentType: "",
        paymentAmount: 0,
      },
      discounts: [],
      subtotal: 0,
      total: 0,
    },
  );

  const itemAmountInCart = cart.reduce((totalItem, cartItem) => {
    return (
      totalItem +
      cartItem.items.reduce((total, item) => {
        return total + item.itemAmount;
      }, 0)
    );
  }, 0);

  // CALCULATE TOTAL AND SUBOTOTAL
  useEffect(() => {
    const subtotal = checkout.checkoutCartItems.reduce(
      (cartSubtotal, { items }) => {
        return (
          cartSubtotal + CurrencyHandlers.calculateOrderItemSubtotal(items)
        );
      },
      0,
    );
    const discountTotal = CurrencyHandlers.calculateDiscount(
      checkout.discounts,
      subtotal,
    );
    const total = subtotal - discountTotal;
    setCheckout((prevState) => {
      return {
        ...prevState,
        subtotal: subtotal,
        total: total,
      };
    });
  }, [checkout.checkoutCartItems, checkout.discounts]);

  useEffect(() => {
    setCheckout((prevState) => {
      const updatedItems = prevState.checkoutCartItems.map((cartItem) => {
        const newSubtotal = CurrencyHandlers.calculateOrderItemSubtotal(
          cartItem.items,
        );
        const newTotal = newSubtotal;

        if (cartItem.subtotal === newSubtotal && cartItem.total === newTotal) {
          return cartItem; // no change
        }

        return {
          ...cartItem,
          subtotal: newSubtotal,
          total: newTotal,
        };
      });

      // If nothing changed, return prevState (prevents re-render loop)
      const changed = updatedItems.some(
        (item, i) => item !== prevState.checkoutCartItems[i],
      );

      if (!changed) return prevState;

      return {
        ...prevState,
        checkoutCartItems: updatedItems,
      };
    });
  }, [checkout.checkoutCartItems]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, checkout, setCheckout, itemAmountInCart }}
    >
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
