"use client";
import React from "react";
import CheckoutItemList from "../../../lib/components/CheckoutItemList";
import CheckoutDetail from "../../../lib/components/CheckoutDetail";
import CheckoutPayment from "../../../lib/components/CheckoutPayment";
import { useCartContext } from "@/app/lib/context/CartContext";
import { useCheckoutPayment } from "../../../lib/hooks/useCheckoutPayment";
import { CheckoutBilling } from "../../../lib/components/CheckoutBilling";
import { useCheckoutBilling } from "../../../lib/hooks/useCheckoutBilling";
import CheckoutSubmit from "../../../lib/components/CheckoutSubmit";
import { useCheckoutSubmit } from "../../../lib/hooks/useCheckoutSubmit";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { useSession } from "next-auth/react";
import CheckoutCoupon from "@/app/lib/components/CheckoutCoupon";

const Page = () => {
  const { APIEndpoint } = useAPIContext();
  const {
    checkout,
    setCheckout,
    cart,
    setCart,
    isCheckoutLoading,
    setIsCheckoutLoading,
  } = useCartContext();

  const { data: session } = useSession();

  // CHECKOUT PAYMENT
  const { handleCheckoutPaymentInput } = useCheckoutPayment({ setCheckout });

  // CHECKOUT BILLING
  const { handleCheckoutBillingChange, hasAccount, setHasAccount } =
    useCheckoutBilling({ setCheckout });

  // CHECKOUT SUBMIT
  const { orderCheckout } = useCheckoutSubmit({
    cart,
    setCart,
    checkout,
    APIEndpoint,
    setCheckout,
    setIsCheckoutLoading,
  });

  console.log(checkout);

  return (
    <main className="checkout-page bg-defaultBackground relative flex h-full w-full flex-col items-center gap-4 p-4 pt-5 pb-40 lg:h-screen lg:flex-row lg:items-start lg:justify-center">
      <div className="flex w-full flex-col gap-4 lg:flex lg:w-[60%] lg:flex-row lg:gap-4">
        {/* --- Item List --- */}
        <div className="lg:w-1/2">
          <CheckoutItemList />
        </div>

        <div className="phone:flex phone:flex-col phone:gap-4 lg:flex lg:w-1/2 lg:flex-col lg:gap-4">
          {/* --- Payment --- */}
          <CheckoutPayment
            handleCheckoutPaymentInput={handleCheckoutPaymentInput}
          />

          {/* --- Billing --- */}
          {session ? null : (
            <CheckoutBilling
              hasAccount={hasAccount}
              setHasAccount={setHasAccount}
              handleCheckoutBillingChange={handleCheckoutBillingChange}
            />
          )}

          {/* {session ? (
            <CheckoutCoupon checkout={checkout} setCheckout={setCheckout} />
          ) : null} */}

          {/* --- Detail --- */}
          <CheckoutDetail />

          {/* --- Submit --- */}
          <CheckoutSubmit
            orderCheckout={orderCheckout}
            isCheckoutLoading={isCheckoutLoading}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
