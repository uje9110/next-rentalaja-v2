import { useCartContext } from "@/app/lib/context/CartContext";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import React from "react";

const CheckoutDetail = () => {
  const { checkout } = useCartContext();
  return (
    <div className="border-accent-custom relative flex w-full flex-col overflow-hidden rounded-md bg-white shadow-sm">
      <h3 className="bg-sky-100 px-4 py-2 text-sm font-semibold">
        Rincian Pembayaran
      </h3>
      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="row-wrapper flex w-full flex-row justify-between text-sm">
          <p className="text-gray-400">Subtotal</p>
          <p className="text-gray-400">
            {checkout.subtotal.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Diskon :</p>
          {checkout.discounts.map((discount) => {
            const { _id, couponName, couponType, couponValue } = discount;
            const thisTotalDiscount =
              couponType === "fixed"
                ? couponValue
                : (checkout.subtotal * couponValue) / 100;
            return (
              <div
                key={_id}
                className="row-wrapper flex w-full flex-row justify-between text-sm"
              >
                <span className="text-gray-400">{couponName}</span>
                <span className="text-gray-400">
                  {CurrencyHandlers.changeToLocaleCurrency(thisTotalDiscount)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="row-wrapper flex w-full flex-row justify-between text-sm">
          <p className="text-gray-400">Total Diskon</p>
          <p className="text-gray-400">
            {CurrencyHandlers.changeToLocaleCurrency(
              CurrencyHandlers.calculateDiscount(
                checkout.discounts,
                checkout.subtotal,
              ),
            )}
          </p>
        </div>
        <div className="row-wrapper flex w-full flex-row justify-between text-sm">
          <p className="text-gray-400">Total</p>
          <p className="text-gray-400">
            {checkout.total.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      {/* OVERLAY */}
      {/* <div
        style={
          isCouponLoading
            ? {
                display: "flex",
              }
            : {
                display: "none",
              }
        }
        className="absolute top-0 left-0 h-full w-full items-center justify-center rounded-lg bg-slate-300"
      >
        <p className="flex items-center gap-2">
          <span className="animate-spin">
            <Loader2 />
          </span>
          <span>Menghitung Diskon...</span>
        </p>
      </div> */}
    </div>
  );
};

export default CheckoutDetail;
