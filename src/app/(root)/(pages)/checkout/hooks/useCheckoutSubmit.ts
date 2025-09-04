// useCheckoutSubmit.ts
import { ClientCheckoutType } from "@/app/lib/types/client_checkout_type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";

type useCheckoutSubmitProp = {
  APIEndpoint: string;
  checkout: ClientCheckoutType;
};

type CheckoutSubmitHook = {
  orderCheckout: UseMutationResult<void, Error, void>;
  submitCheckout: () => void;
};

export function useCheckoutSubmit({
  checkout,
  APIEndpoint,
}: useCheckoutSubmitProp): CheckoutSubmitHook {

  const orderCheckout = useMutation<void, Error, void>({
    mutationKey: ["orderCheckout"],
    mutationFn: async () => {
      const response = await axios.post(
        `${APIEndpoint}/order/checkout`,
        checkout,
      );
      console.log(response.data.json);
    },
  });

  // ✅ add helper wrapper if you want to hide .mutate()
  const submitCheckout = () => {
    orderCheckout.mutate();
  };

  return {
    orderCheckout,
    submitCheckout,
  };
}
