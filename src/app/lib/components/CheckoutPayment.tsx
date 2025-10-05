"use client";
import React, { ChangeEvent, FC } from "react";
import { paymentMethods, paymentTypes } from "../../(root)/(pages)/checkout/const/PaymentTypesAndMethods";
import { useCartContext } from "@/app/lib/context/CartContext";

type CheckoutPaymentProps = {
  handleCheckoutPaymentInput: (e: ChangeEvent<HTMLInputElement>) => void;
};

const CheckoutPayment: FC<CheckoutPaymentProps> = ({
  handleCheckoutPaymentInput,
}) => {
  const { checkout } = useCartContext();
  return (
    <div className="border-accent-custom flex w-full flex-col rounded-md bg-white shadow-sm overflow-hidden ">
      <div>
        <h3 className="bg-sky-100 px-4 py-2 text-sm font-semibold">
          Metode Pembayaran
        </h3>
        <div className="flex flex-col gap-2 px-4 py-2 pb-4">
          {paymentMethods.map((item, index) => {
            const { title, desc, value } = item;
            return (
              <div
                key={index}
                className="row-wrapper flex w-full flex-col justify-between gap-2"
              >
                <div className="flex w-full flex-row justify-between">
                  <label className="text-sm" htmlFor={value}>
                    {title}
                  </label>
                  <input
                    required
                    type="radio"
                    value={value}
                    id={value}
                    name="paymentMethod"
                    onChange={(e) => handleCheckoutPaymentInput(e)}
                  />
                </div>
                <div
                  style={{
                    display:
                      checkout.paymentRequest.paymentMethod === value
                        ? "block"
                        : "none",
                  }}
                  className="rounded-md border border-slate-400/50 bg-gray-100 p-2 text-xs text-slate-500"
                >
                  {desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="bg-sky-100 px-4 py-2 text-sm font-semibold">
          Tipe Pembayaran
        </h3>
        <div className="flex flex-col gap-2 px-4 py-2 pb-4">
          {paymentTypes.map((item, index) => {
            const { title, desc, value } = item;

            return (
              <div
                key={index}
                className="row-wrapper flex w-full flex-col justify-between gap-2"
              >
                <div className="flex w-full flex-row justify-between">
                  <label className="text-sm" htmlFor={value}>
                    {title}
                  </label>
                  <input
                    required
                    type="radio"
                    value={value}
                    id={value}
                    name="paymentType"
                    onChange={(e) => {
                      handleCheckoutPaymentInput(e);
                    }}
                  />
                </div>
                <div
                  style={{
                    display:
                      checkout.paymentRequest.paymentType === value
                        ? "block"
                        : "none",
                  }}
                  className="rounded-md border border-slate-400/50 bg-gray-100 p-2 text-xs text-slate-500"
                >
                  {desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
