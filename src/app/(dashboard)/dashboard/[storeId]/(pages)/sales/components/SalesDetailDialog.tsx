import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { FC } from "react";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { ClientStoreSalesType } from "@/app/lib/types/store_sales_types";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { ImageLightBox } from "@/app/lib/components/ImageLightBox";

const SalesDetailDialog: FC<{ salesData: ClientStoreSalesType }> = ({
  salesData,
}) => {
  return (
    <div className="flex w-[360px] flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Sales Detail</DialogTitle>
      </DialogHeader>
      <Separator />
      <div className="flex w-full justify-between text-sm">
        <p className="font-semibold text-slate-500">Order ID:</p>
        <Link
          href={`/dashboard/order/${salesData.orderDetail._id}`}
          target="__blank"
          className="border-b-2 border-blue-400 font-semibold text-blue-400"
        >
          {salesData.orderDetail._id}
        </Link>
      </div>
      {/* Item Detail */}
      <div className="grid grid-cols-1 text-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Alat</p>
          <div className="flex flex-col gap-0.5">
            {salesData.orderDetail.items.map((item) => {
              return (
                <div key={item.itemID} className="flex justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p>{item.itemName}</p>
                    <p className="text-xs text-slate-500">
                      Paket : {item.itemVariation.variationName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Jumlah : {item.itemAmount}
                    </p>
                  </div>
                  <p>
                    {CurrencyHandlers.changeToLocaleCurrency(item.itemSubtotal)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Order Values Detail */}
      <div className="grid grid-cols-1 text-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Nilai Order</p>
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>
                {CurrencyHandlers.changeToLocaleCurrency(
                  salesData.orderDetail.subtotal,
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Diskon</p>
              <p>
                {CurrencyHandlers.changeToLocaleCurrency(
                  salesData.orderDetail.total - salesData.orderDetail.subtotal,
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Total</p>
              <p>
                {CurrencyHandlers.changeToLocaleCurrency(
                  salesData.orderDetail.total,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Payments Detail */}
      <div className="grid grid-cols-1 text-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Pembayaran</p>
          <div className="flex flex-col gap-0.5">
            {salesData.orderDetail.paymentDetails.map((payment) => {
              return (
                <div key={payment._id} className="flex justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p>{payment.paymentType}</p>
                    <p className="text-xs text-slate-500">
                      Metode : {payment.paymentMethod}
                    </p>
                  </div>
                  <p>
                    {CurrencyHandlers.changeToLocaleCurrency(
                      payment.paymentAmount,
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetailDialog;
