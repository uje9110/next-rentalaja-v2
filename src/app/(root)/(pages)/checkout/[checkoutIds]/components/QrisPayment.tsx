import Image from "next/image";
import React, { FC } from "react";
import qrisLogo from "@/app/assets/img/logo/qris.png";
import moment from "moment";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";

function getStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "#f5c905"; // Dark Yellow
    case "REQUIRES_ACTION":
      return "#C2410C"; // Dark Orange
    case "CANCELED":
      return "#374151"; // Gray-700
    case "SUCCEEDED":
      return "#15803D"; // Dark Green
    case "FAILED":
      return "#B91C1C"; // Dark Red
    case "VOIDED":
      return "#6B21A8"; // Dark Purple
    case "AWAITING_CAPTURE":
      return "#1D4ED8"; // Dark Blue
    case "EXPIRED":
      return "#1E293B"; // Slate-800
    case "UNKNOWN":
    case "UNKNOWN_ENUM_VALUE":
    default:
      return "#334155"; // Neutral/Dark Slate
  }
}

const changePaymentTypeName = (type: string) => {
  if (type === "partial-payment") {
    return "Uang Muka";
  } else if (type === "full-payment") {
    return "Pelunasan";
  } else {
    return type;
  }
};

export const QrisPayment: FC<{
  payment: ClientStoreOrderPaymentType;
  orderData: ClientStoreOrderType;
}> = ({ payment, orderData }) => {
  return (
    <div
      key={payment._id}
      className="flex flex-col items-center justify-between gap-4 rounded-md border border-slate-400/50 bg-white"
    >
      {payment.xenditPayment?.status === "REQUIRES_ACTION" ? (
        <>
          <div className="flex w-full items-center justify-between border-b border-b-slate-400/50 p-4">
            <Image src={qrisLogo} alt="QRIS" width={120} height={120} />
            <div className="flex flex-col items-start justify-center">
              <p className="text-xs">
                {" "}
                <span className="font-medium">
                  {payment.paymentType === "partial-payment"
                    ? "Uang Muka"
                    : "Pelunasan"}
                </span>
              </p>
              <p className="text-xl font-semibold">
                {CurrencyHandlers.changeToLocaleCurrency(payment.paymentAmount)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 p-4 pt-0">
            {payment.xenditPayment?.status !== "REQUIRES_ACTION" ? null : (
              <p className="text-sm text-slate-600">
                Expire:{" "}
                <span>
                  {moment(
                    payment.xenditPayment?.channel_properties?.expires_at,
                  ).format("DD MMMM YYYY, HH:mm")}
                </span>
              </p>
            )}
            <p
              style={{
                color: getStatusColor(payment.xenditPayment?.status as string),
              }}
              className="text-lg font-bold"
            >
              {payment.xenditPayment?.status === "REQUIRES_ACTION"
                ? "PERLU DIBAYAR"
                : payment.xenditPayment?.status}
            </p>
            {payment.xenditPayment?.status !== "REQUIRES_ACTION" ? null : (
              <div className="relative h-[200px] w-[200px]">
                <Image
                  className={orderData.status === "confirmed" ? "" : "blur-sm"}
                  height={200}
                  width={200}
                  src={payment.qrLink as string}
                  alt="qrCode"
                />
                {orderData.status === "confirmed" ? null : (
                  <p className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 bg-white/80 p-2 text-center text-sm">
                    Lakukan konfirmasi order terlebih dahulu sebelum membayar
                    dengan mengklik tombol konfirmasi diatas.
                  </p>
                )}
              </div>
            )}
            {payment.xenditPayment?.status === "REQUIRES_ACTION" ? (
              <p className="text-center text-xs text-slate-500">
                Diperlukan waktu sekitar 1 menit untuk mengecheck pembayaran,
                lalu refresh halaman ini untuk mengecek status pembayaran.
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <div className="flex w-full flex-col items-start justify-start gap-2 p-2 text-xs">
          <p className="flex w-full justify-between">
            <span>Status:</span>
            <span
              style={{
                color: getStatusColor(payment.xenditPayment?.status as string),
              }}
            >
              {payment.xenditPayment?.status}
            </span>
          </p>
          <p className="flex w-full justify-between">
            <span>Tanggal: </span>
            <span>
              {moment(payment.xenditPayment?.created).format(
                "DD MMMM YYYY, HH:mm",
              )}
            </span>
          </p>
          <p className="flex w-full justify-between">
            <span>Metode:</span>
            <span>{payment.paymentMethod}</span>
          </p>
          <p className="flex w-full justify-between">
            <span>Jenis:</span>
            <span>{changePaymentTypeName(payment.paymentType as string)}</span>
          </p>
          <p className="flex w-full justify-between">
            <span>Jumlah: </span>
            <span>
              {CurrencyHandlers.changeToLocaleCurrency(
                payment.xenditPayment?.request_amount,
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
