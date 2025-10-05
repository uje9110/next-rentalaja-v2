"use client";
import React, { useState } from "react";
import CustomerSelect from "./components/BillingSection/CustomerSelect";
import { useOrder } from "@/app/lib/hooks/useOrder";
import ItemForm from "./components/ItemSection/ItemForm";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { useCartContext } from "@/app/lib/context/CartContext";
import { useCheckoutPayment } from "@/app/lib/hooks/useCheckoutPayment";
import { useCheckoutBilling } from "@/app/lib/hooks/useCheckoutBilling";
import { useCheckoutSubmit } from "@/app/lib/hooks/useCheckoutSubmit";
import CheckoutPayment from "@/app/lib/components/CheckoutPayment";
import { CheckoutBilling } from "@/app/lib/components/CheckoutBilling";
import CheckoutDetail from "@/app/lib/components/CheckoutDetail";
import CheckoutSubmit from "@/app/lib/components/CheckoutSubmit";
import CheckoutItemList from "@/app/lib/components/CheckoutItemList";
import CheckoutBillingPreview from "@/app/lib/components/CheckoutBillingPreview";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { APIEndpoint } = useAPIContext();
  const { setOrderData, orderItemData } = useOrder({});

  const {
    checkout,
    setCheckout,
    cart,
    setCart,
    isCheckoutLoading,
    setIsCheckoutLoading,
  } = useCartContext();

  // CHECKOUT PAYMENT
  const { handleCheckoutPaymentInput } = useCheckoutPayment({ setCheckout });

  // CHECKOUT BILLING
  const {
    handleCheckoutBillingChange,
    retainingCustomer,
    setRetainingCustomer,
  } = useCheckoutBilling({ setCheckout, isUsingDashboard: true });

  // CHECKOUT SUBMIT
  const { orderCheckout } = useCheckoutSubmit({
    isUsingDashboard: true,
    cart,
    setCart,
    checkout,
    APIEndpoint,
    setCheckout,
    setIsCheckoutLoading,
  });

  // step state
  const [step, setStep] = useState<1 | 2>(1);

  console.log(checkout);

  return (
    <main className="phone:h-full phone:w-full phone:flex-col phone:p-2 flex h-[calc(100vh-2.5rem)] w-full flex-1 flex-row gap-4 px-2 lg:flex lg:flex-row lg:p-0">
      {/* Left Section (Steps) */}
      <div className="phone:w-full flex h-full w-1/2 flex-col gap-4 text-sm">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              step === 1 ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span className={step === 1 ? "text-teal-600" : "text-gray-500"}>
            Pilih Item
          </span>
          <div className="h-[1px] w-6 bg-gray-300" />
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              step === 2 ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span className={step === 2 ? "text-teal-600" : "text-gray-500"}>
            Billing & Payment
          </span>
        </div>

        {/* Step content */}
        {step === 1 && (
          <div className="h-fit w-full">
            <ItemForm setOrderData={setOrderData} itemData={orderItemData} />
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => setStep(2)}>
                Lanjut ke Billing
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="h-fit w-full">
              <CheckoutBilling
                isUsingDashboard={true}
                retainingCustomer={retainingCustomer}
                setRetainingCustomer={setRetainingCustomer}
                handleCheckoutBillingChange={handleCheckoutBillingChange}
                setCheckout={setCheckout}
              />
            </div>
            <div className="h-fit w-full">
              <CheckoutPayment
                setCheckout={setCheckout}
                isUsingDashboard={true}
                handleCheckoutPaymentInput={handleCheckoutPaymentInput}
              />
            </div>
            <div className="mt-2 flex justify-between">
              <Button size="sm" variant="outline" onClick={() => setStep(1)}>
                Kembali
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Right Section (Preview) */}
      <div className="phone:w-full flex h-fit w-1/2 flex-col gap-4">
        <div className="h-fit w-full">
          <CheckoutBillingPreview checkout={checkout} />
        </div>
        <div className="h-fit w-full">
          <CheckoutItemList />
        </div>
        <CheckoutDetail />
        <CheckoutSubmit
          orderCheckout={orderCheckout}
          isCheckoutLoading={isCheckoutLoading}
        />
      </div>
    </main>
  );
};

export default Page;
