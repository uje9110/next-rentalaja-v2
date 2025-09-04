import { UseMutationResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

type CheckoutSubmitProps = {
  orderCheckout: UseMutationResult<void, Error, void>;
};

const CheckoutSubmit = ({ orderCheckout }: CheckoutSubmitProps) => {
  return (
    <div className="row-wrapper flex w-full flex-row justify-end">
      <div className="phone:w-full">
        <button
          // disabled={orderCheckout.isLoading}
          className="text-md shadow-defaultShadow bg-colorPrimary phone:w-full w-full rounded-lg px-4 py-2 text-white disabled:bg-slate-500 disabled:text-black lg:w-full"
          onClick={() => orderCheckout.mutate()}
        >
          {/* {orderCheckout.isLoading ? (
            <p className="flex-gap-2 phone:w-full flex items-center justify-center">
              <Loader2 size={16} strokeWidth={2} className="animate-spin" />
              Loading...
            </p>
          ) : (
          )} */}
          <p>Checkout</p>
        </button>
      </div>
    </div>
  );
};

export default CheckoutSubmit;
