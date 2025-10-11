"use client";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  paymentMethods,
  paymentTypes,
} from "../../(root)/(pages)/checkout/const/PaymentTypesAndMethods";
import { useCartContext } from "@/app/lib/context/CartContext";
import { Switch } from "@/components/ui/switch";
import { ClientCheckoutType } from "../types/client_checkout_type";

type CheckoutPaymentProps = {
  isUsingDashboard?: boolean;
  handleCheckoutPaymentInput: (e: ChangeEvent<HTMLInputElement>) => void;
  setCheckout?: Dispatch<SetStateAction<ClientCheckoutType>>;
};

const CheckoutPayment: FC<CheckoutPaymentProps> = ({
  isUsingDashboard,
  handleCheckoutPaymentInput,
  setCheckout,
}) => {
  const [isSkippingPayment, setIsSkippingPayment] = useState<boolean>(false);

  useEffect(() => {
    if (isUsingDashboard) {
      if (setCheckout) {
        setCheckout((prev) => {
          return {
            ...prev,
            isSkippingPayment: isSkippingPayment,
          };
        });
      }
    }
  }, [isSkippingPayment]);

  const { checkout } = useCartContext();
  return (
    <div className="border-accent-custom relative flex w-full flex-col overflow-hidden rounded-md bg-white shadow-sm">
      <div>
        <div className="flex items-center justify-between bg-sky-100 px-4 py-2 text-sm font-semibold">
          <h3 className="phone:text-sm">Metode Pembayaran</h3>
          {isUsingDashboard && (
            <div className="z-20 flex items-center justify-center gap-2">
              <p className="text-xs font-medium text-gray-600">
                Lewati pembayaran
              </p>
              <Switch
                checked={isSkippingPayment}
                onCheckedChange={(checked) => setIsSkippingPayment(checked)}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 px-4 py-2 pb-4">
          {paymentMethods.map((item, index) => {
            const { title, desc, value } = item;
            return (
              <div
                key={index}
                className="row-wrapper flex w-full flex-col justify-between gap-2"
              >
                <div className="flex w-full flex-row justify-between">
                  <label className="phone:text-xs text-sm" htmlFor={value}>
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
                      checkout.paymentRequest?.paymentMethod === value
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
        <h3 className="phone:text-sm bg-sky-100 px-4 py-2 text-sm font-semibold">
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
                  <label className="text-sm phone:text-xs" htmlFor={value}>
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
                      checkout.paymentRequest?.paymentType === value
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
      {isSkippingPayment ? (
        <div className="overlay absolute top-0 left-0 z-10 h-full w-full bg-gray-400/50" />
      ) : null}
    </div>
  );
};

export default CheckoutPayment;
