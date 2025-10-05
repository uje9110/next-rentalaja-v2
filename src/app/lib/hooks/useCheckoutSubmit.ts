// useCheckoutSubmit.ts
import { ClientCartType } from "@/app/lib/types/client_cart_types";
import {
  CheckoutResponse,
  ClientCheckoutType,
} from "@/app/lib/types/client_checkout_type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";

type useCheckoutSubmitProp = {
  isUsingDashboard?: boolean;
  APIEndpoint: string;
  cart: ClientCartType[];
  setCart: React.Dispatch<React.SetStateAction<ClientCartType[]>>;
  checkout: ClientCheckoutType;
  setCheckout: React.Dispatch<React.SetStateAction<ClientCheckoutType>>;
  setIsCheckoutLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type CheckoutSubmitHook = {
  orderCheckout: UseMutationResult<CheckoutResponse, Error, void>;
  submitCheckout: () => void;
};

export function useCheckoutSubmit({
  isUsingDashboard = false,
  checkout,
  APIEndpoint,
  cart,
  setCart,
  setCheckout,
  setIsCheckoutLoading,
}: useCheckoutSubmitProp): CheckoutSubmitHook {
  const orderCheckout = useMutation<CheckoutResponse, Error, void>({
    mutationKey: ["orderCheckout"],
    mutationFn: async () => {
      setIsCheckoutLoading(true);
      const res = await axios.post<CheckoutResponse>(
        `${APIEndpoint}/order/checkout`,
        checkout,
      );
      return res.data;
    },
    onSuccess: (orderResponse) => {
      setIsCheckoutLoading(false);

      const orderResponseData = orderResponse.orders;

      // Collect all ordered itemIDs
      const orderItemIDs = orderResponseData.flatMap((order) =>
        order.items.map((item) => item.itemID),
      );

      // Remove ordered items from cart
      const newCart = cart
        .map((storeCart) => ({
          ...storeCart,
          items: storeCart.items.filter(
            (item) => !orderItemIDs.includes(item.itemID),
          ),
        }))
        .filter((storeCart) => storeCart.items.length > 0);

      setCart(newCart);

      // Reset checkout state
      setCheckout((prev) => ({
        ...prev,
        checkoutCartItems: [],
        discounts: [],
        subtotal: 0,
        total: 0,
      }));

      let redirectLink;
      if (isUsingDashboard) {
        const order = orderResponseData[0];
        redirectLink = `/dashboard/${order.storeDetail.storeId}/order/${order._id}`;
      } else {
        // Collect orderIds for redirect
        const orderIds = orderResponseData.map((thisOrder) => {
          return `${thisOrder.storeDetail.storeId}:${thisOrder._id}`;
        });

        const orderIdsString = orderIds.join(",");
        redirectLink = `checkout/${orderIdsString}`;
      }

      window.location.href = redirectLink;
    },
    onError: (error) => {
      console.error("Checkout failed:", error);
    },
    onSettled: () => {
      setIsCheckoutLoading(false);
    },
  });

  const submitCheckout = () => {
    setIsCheckoutLoading(true);
    orderCheckout.mutate();
  };

  return {
    orderCheckout,
    submitCheckout,
  };
}
