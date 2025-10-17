import moment from "moment-timezone";
import React, { FC } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { StoreOrderType } from "@/app/lib/types/store_order_type";

export type AddOrderPreviewProps = {
  orderData: StoreOrderType;
  checkoutMutation: UseMutationResult<void, Error, void>;
};

export const AddOrderPreview: FC<AddOrderPreviewProps> = ({
  orderData,
  checkoutMutation,
}) => {
  return (
    <div
      className={`h-full w-full rounded-md border border-slate-400/50 bg-white`}
    >
      {orderData ? (
        <div className={`flex h-full flex-col gap-4 overflow-auto p-4 text-xs`}>
          <h3 className="w-full text-center text-lg font-semibold">
            Order Detail
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-2">
              <p className="font font-semibold">Billing</p>
              <div className="flex flex-col items-start gap-2">
                <p className="flex w-full flex-row justify-between text-left">
                  <span className="font-medium">Nama: </span>
                  <span>
                    {orderData.billing.firstName} {orderData.billing.lastName}
                  </span>
                </p>
                <p className="flex w-full flex-row justify-between text-left">
                  <span className="font-medium">Email: </span>
                  <span>{orderData.billing.email}</span>
                </p>
                <p className="flex w-full flex-row justify-between text-left">
                  <span className="font-medium">Telp : </span>
                  <span>{orderData.billing.telephone}</span>
                </p>
                <p className="flex w-full flex-row justify-between text-left">
                  <span className="font-medium">Alamat: </span>
                  <span className="text-right">
                    {orderData.billing.address
                      ? `${orderData.billing.address.street}, ${orderData.billing.address.district}, ${orderData.billing.address.city}, ${orderData.billing.address.province}.`
                      : ""}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2">
              <p className="font font-semibold">Item</p>
              <div className="flex flex-col gap-4">
                {orderData.items.map((item, index) => {
                  const { itemName, itemVariation, itemAmount, rentalDetails } =
                    item;
                  const { variationName, variationPrice } = itemVariation;
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-md border-2 p-4"
                    >
                      <div className="flex flex-row justify-between">
                        <p className="flex w-2/4 flex-col">
                          <span className="font-medium">{itemName}</span>
                          <span>{variationName}</span>
                        </p>
                        <p className="flex w-1/4 flex-col items-end justify-center">
                          {variationPrice.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          })}
                        </p>
                        <p className="flex w-1/4 flex-col items-end justify-center">
                          x{itemAmount}
                        </p>
                      </div>
                      <div className="flex flex-row justify-between font-semibold">
                        <span>Waktu Rental:</span>
                        <span className="text-[10px] font-medium">
                          {moment(rentalDetails.rentalStartInLocaleMs).tz("Asia/Jakarta").format(
                            "DD-MM-YYYY HH:mm",
                          )}
                          <br />
                          {moment(rentalDetails.rentalEndInLocaleMs).tz("Asia/Jakarta").format(
                            "DD-MM-YYYY HH:mm",
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <p className="font font-semibold">Subtotal</p>
              <p>
                {orderData.subtotal.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="flex flex-col justify-between">
              <p className="font font-semibold">Diskon</p>
              <div className="flex flex-col gap-1">
                {orderData.discounts.map((item) => {
                  const { _id, couponName, couponValue, couponType } = item;
                  if (couponType === "percentage") {
                    const discount = (orderData.subtotal * couponValue) / 100;
                    return (
                      <div key={_id} className="flex justify-between">
                        <p className="text-gray-400">{couponName}</p>
                        <p>
                          - {CurrencyHandlers.changeToLocaleCurrency(discount)}
                        </p>
                      </div>
                    );
                  } else if (couponType === "fixed") {
                    const discount = couponValue;
                    return (
                      <div key={_id} className="flex justify-between">
                        <p className="text-gray-400">{couponName}</p>
                        <p>
                          - {CurrencyHandlers.changeToLocaleCurrency(discount)}
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <p key={_id}>
                        {CurrencyHandlers.changeToLocaleCurrency(0)}
                      </p>
                    );
                  }
                })}
              </div>
              <div className="flex flex-row justify-between pt-1">
                <p className="font font-semibold">Total Diskon</p>
                <p>
                  {CurrencyHandlers.changeToLocaleCurrency(
                    CurrencyHandlers.calculateDiscount(
                      orderData.discounts,
                      orderData.subtotal,
                    ),
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <p className="font font-semibold">Total</p>
              <p>
                {CurrencyHandlers.changeToLocaleCurrency(
                  orderData.subtotal -
                    CurrencyHandlers.calculateDiscount(
                      orderData.discounts,
                      orderData.subtotal,
                    ),
                )}
              </p>
            </div>
            <button
              onClick={() => checkoutMutation.mutate()}
              className="text-md rounded-lg bg-green-500 px-4 py-2 text-white capitalize"
            >
              {checkoutMutation.isPending ? (
                <p className="flex items-center justify-center">
                  <Loader size={12} strokeWidth={2} className="animate-spin" />
                  Loading...
                </p>
              ) : (
                <p>Buat Order</p>
              )}
            </button>
          </div>
        </div>
      ) : (
        <p>Silhakan Isi Form Terlebih Dahulu</p>
      )}
    </div>
  );
};
