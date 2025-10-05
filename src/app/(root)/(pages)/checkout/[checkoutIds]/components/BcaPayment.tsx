import Image from "next/image";
import React, { FC } from "react";
import bcaLogo from "@/app/assets/img/logo/bca.png";
import moment from "moment";
import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";

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

export const BcaPayment: FC<{ payment: ClientStoreOrderPaymentType }> = ({
  payment,
}) => {
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-400/50 bg-white p-4">
      <Image src={bcaLogo} alt="BCA_VA" width={140} height={140} />
      <div className="flex flex-col items-start justify-center">
        <p className="text-xs">
          <span className="font-medium">Expire</span> :{" "}
          {moment(payment.xenditPayment?.channel_properties.expires_at).format(
            "DD MMMM YYYY, HH:mm",
          )}
        </p>
        <p className="text-lg font-semibold">
          {payment.xenditPayment?.actions[0].value}
        </p>
        <p>
          <span
            style={{
              color: getStatusColor(payment.xenditPayment?.status as string),
            }}
            className="font-semibold"
          >
            {payment.xenditPayment?.status}
          </span>
        </p>
      </div>
    </div>
  );
};
