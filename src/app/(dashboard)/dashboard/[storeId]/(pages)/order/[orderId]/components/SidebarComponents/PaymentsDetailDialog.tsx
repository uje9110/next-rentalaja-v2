/* eslint-disable react-hooks/exhaustive-deps */
import { ImageLightbox } from "@/app/lib/components/ImageLightBox";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import axios from "axios";
import { Eye, Send } from "lucide-react";
import moment from "moment";
import { Session } from "next-auth";
import Image from "next/image";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { useDashboardSingleOrderUtility } from "../../hooks/useDashboardSingleOrder";

interface PaymentDetailsDialogType {
  setIsPaymentDetailDialogOpen: Dispatch<SetStateAction<boolean>>;
  orderData: ClientStoreOrderType;
  session: Session;
}

const PaymentsDetailDialog: FC<PaymentDetailsDialogType> = ({
  setIsPaymentDetailDialogOpen,
  orderData,
  session,
}) => {
  const [thisOrderPayments, setThisOrderPayments] = useState<
    ClientStoreOrderPaymentType[]
  >([]);

  const { APIEndpoint } = useAPIContext();
  const { getStatusColor } = useDashboardSingleOrderUtility();

  // function formatPhoneNumber(phone: string): string {
  //   // Remove any non-digit characters
  //   const digitsOnly = phone.replace(/\D/g, "");

  //   if (digitsOnly.startsWith("0")) {
  //     return "62" + digitsOnly.slice(1);
  //   }

  //   if (digitsOnly.startsWith("62")) {
  //     return digitsOnly; // Already formatted
  //   }

  //   // Optional fallback for unexpected format
  //   throw new Error("Invalid phone number format");
  // }

  const sendQRCode = async (payment: ClientStoreOrderPaymentType) => {
    try {
      // const formattedPhone = formatPhoneNumber(phone);
      const res = await axios.post(
        `https://service.rentalaja.co.id/service/v1/notification/email/qr_payment`,
        payment,
        { headers: { Authorization: `Bearer ${session.user.token}` } },
      );
      if (res.status === 200) {
        setIsPaymentDetailDialogOpen(false);
        toast.success(`QRCODE berhasil dikirim ke email customer`);
      }
    } catch (error) {
      console.log(error);
      toast.error("QRCODE gagal dikirim ke email customer");
    }
  };

  const getOrderPayments = async (orderId: string) => {
    const paymentEndpoint = `${APIEndpoint}/order/${orderId}/get-order-payment`;
    const paymentResponse = await axios.get(paymentEndpoint, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
        "x-store-id": orderData.storeDetail.storeId,
      },
    });
    setThisOrderPayments(paymentResponse.data.json);
  };

  useEffect(() => {
    if (!orderData._id) {
      return;
    }
    getOrderPayments(orderData._id);
  }, [orderData._id]);

  return (
    <div className="overflow-auto rounded-sm border">
      <table className="phone:w-[90vh] w-full text-xs lg:w-full">
        <thead className="w-full border-b-2">
          <tr>
            <th className="w-[calc(100%/8)] py-2">Tanggal</th>
            <th className="w-[calc(100%/8)] py-2">Jumlah</th>
            <th className="w-[calc(100%/8)] py-2">Metode</th>
            <th className="w-[calc(100%/8)] py-2">Tipe</th>
            <th className="w-[calc(100%/8)] py-2">Dibuat Oleh</th>
            <th className="w-[calc(100%/8)] py-2">QRIS/Virtual Account</th>
            <th className="w-[calc(100%/8)] py-2">Expire</th>
            <th className="w-[calc(100%/8)] py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {thisOrderPayments.map((payment) => {
            const {
              createdAt,
              paymentAmount,
              paymentType,
              paymentMethod,
              _id,
              creatorDetail,
              isUsingXendit,
              xenditPayment,
              qrLink,
            } = payment;
            return (
              <tr key={_id}>
                <td className="w-[calc(100%/8)] py-2 text-center">
                  {moment(createdAt).format("DD MMM YYYY, HH:mm")}
                </td>
                <td className="w-[calc(100%/8)] py-2 text-center">
                  {CurrencyHandlers.changeToLocaleCurrency(paymentAmount)}
                </td>
                <td className="w-[calc(100%/8)] py-2 text-center">
                  {paymentMethod}
                </td>
                <td className="w-[calc(100%/8)] py-2 text-center">
                  {paymentType}
                </td>
                <td className="w-[calc(100%/8)] py-2 text-center">{`${creatorDetail?.firstName} ${creatorDetail?.lastName}`}</td>
                <td className="w-[calc(100%/8)] py-2 text-center">
                  {isUsingXendit && paymentMethod === "BCA_VA" ? (
                    xenditPayment?.actions[0].value
                  ) : paymentMethod === "QRIS" ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-md">
                      <div className="absolute z-20 flex h-full w-full items-center justify-center gap-2 bg-black/30">
                        <button
                          onClick={() => sendQRCode(payment)}
                          className="flex items-center justify-center gap-2 rounded-md bg-teal-500 p-2 text-white"
                        >
                          <Send strokeWidth={2} size={16} />
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-md bg-blue-500 p-2 text-white">
                          <ImageLightbox
                            alt="QR"
                            fullImageSrc={qrLink as string}
                            trigger={<Eye strokeWidth={2} size={16} />}
                          />
                        </button>
                      </div>
                      <Image
                        className="absolute z-10"
                        fill
                        src={payment.qrLink as string}
                        alt=""
                      />
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="w-[calc(100%/8)] py-2 text-center">
                  {isUsingXendit
                    ? moment(
                        xenditPayment?.channel_properties.expires_at,
                      ).format("DD MMM YYYY, HH:mm")
                    : "-"}
                </td>
                <td className="w-[calc(100%/8)] py-2 text-center">
                  {isUsingXendit ? (
                    <p
                      style={{
                        color: getStatusColor(xenditPayment?.status as string),
                      }}
                      className="font-semibold"
                    >
                      {xenditPayment?.status}
                    </p>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsDetailDialog;
