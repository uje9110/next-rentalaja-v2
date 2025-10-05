import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import moment from "moment";
import React, { FC } from "react";

const CashPayment: FC<{ payment: ClientStoreOrderPaymentType }> = ({
  payment,
}) => {
  return (
    <div
      key={payment._id}
      className="flex flex-col items-center justify-between gap-4 rounded-md border border-slate-400/50 bg-white"
    >
      <div className="flex w-full flex-col items-start justify-start gap-2 p-2 text-xs">
        <p className="flex w-full justify-between">
          <span>Tanggal: </span>
          <span>{moment(payment.createdAt).format("DD MMMM YYYY, HH:mm")}</span>
        </p>
        <p className="flex w-full justify-between">
          <span>Metode:</span>
          <span>{payment.paymentMethod}</span>
        </p>
        <p className="flex w-full justify-between">
          <span>Jenis:</span>
          <span>
            {CurrencyHandlers.changePaymentTypeName(
              payment.paymentType as string,
            )}
          </span>
        </p>
        <p className="flex w-full justify-between">
          <span>Jumlah: </span>
          <span>
            {CurrencyHandlers.changeToLocaleCurrency(payment.paymentAmount)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CashPayment;
