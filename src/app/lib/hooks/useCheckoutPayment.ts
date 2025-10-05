"use client";
import { ClientCheckoutType } from "@/app/lib/types/client_checkout_type";
import { Dispatch, SetStateAction, useState } from "react";

type UseCheckoutPaymentProps = {
  setCheckout: Dispatch<SetStateAction<ClientCheckoutType>>;
};

export function useCheckoutPayment({ setCheckout }: UseCheckoutPaymentProps) {
  const handleCheckoutPaymentInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setCheckout((prevState) => {
      return {
        ...prevState,
        paymentRequest: {
          ...prevState.paymentRequest,
          [name]: value,
        },
      };
    });
  };

  return { handleCheckoutPaymentInput };
}
