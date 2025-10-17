"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CircleCheck } from "lucide-react";
import moment from "moment-timezone";
import { StoreOrderType } from "@/app/lib/types/store_order_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

type Props = {
  orderData: StoreOrderType;
};

export const ClientCheckoutDetailActions = ({ orderData }: Props) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!orderData) return;

    const messageString =
      `Halo Admin! Saya mau konfirmasi pesanan saya dengan detail:\n` +
      `
Cabang: ${orderData?.storeDetail?.storeName}
ID Order: ${orderData._id}
Nama Pelanggan: ${orderData.billing.firstName} ${orderData.billing.lastName}
Email Pelanggan: ${orderData.billing.email}
WA Pelanggan: ${orderData.billing.telephone}
Produk yang disewa:` +
      orderData.items
        .map((item, index) => {
          return `
${index + 1}.
Nama Item: ${item.itemName}
Paket Sewa: ${item.itemVariation.variationName}
Harga Sewa: ${CurrencyHandlers.changeToLocaleCurrency(item.itemVariation.variationPrice)}
Mulai Sewa: ${moment(item.rentalDetails.rentalStartInLocaleMs).tz("Asia/Jakarta").format(
            "DD MMMM YYYY, HH:mm",
          )}
Berakhir Sewa: ${moment(item.rentalDetails.rentalEndInLocaleMs).tz("Asia/Jakarta").format(
            "DD MMMM YYYY, HH:mm",
          )}
Jumlah: ${item.itemAmount}\n`;
        })
        .join("");

    const encodedMessage = encodeURIComponent(messageString);
    setMessage(encodedMessage);
  }, [orderData]);

  return (
    <div className="phone:flex phone:flex-col phone:gap-4 lg:flex lg:w-1/2 lg:flex-col lg:gap-4">
      {orderData.status === "pending" && (
        <div className="flex h-fit w-full flex-col items-center gap-2 rounded-lg border-2 border-red-500 bg-white p-4 text-sm shadow-sm">
          <span className="text-lg text-red-500">
            <AlertCircle size={32} />
          </span>
          <p>
            Segera lakukan{" "}
            <span className="font-medium text-red-600">konfirmasi pesanan</span>{" "}
            anda dan pengecekan persyaratan dengan menekan tombol di bawah ini.
            Setelah terkonfirmasi anda baru bisa melakukan pembayaran.
          </p>
        </div>
      )}

      {orderData.status !== "completed" && orderData.status === "pending" && (
        <a
          href={`https://api.whatsapp.com/send?phone=6285141203495&text=${message}`}
          target="__blank"
          className="bg-colorSecondary flex w-full items-center justify-center gap-4 rounded-md py-2 text-center text-white shadow-sm"
        >
          <span>
            <CircleCheck />
          </span>
          <span>Konfirmasi Order</span>
        </a>
      )}
    </div>
  );
};
