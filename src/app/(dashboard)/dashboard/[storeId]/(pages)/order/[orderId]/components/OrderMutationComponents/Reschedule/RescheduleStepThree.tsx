import React, { FC, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LoaderCircle,
  CalendarClock,
  ShieldCheck,
  ArrowBigDownDash,
} from "lucide-react";

import { RescheduleDialogContentProps } from "./RescheduleDialogContent";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";

interface RescheduleStepThreeProps extends RescheduleDialogContentProps {
  newItemData: StoreOrderItemType[];
}

const RescheduleStepThree: FC<RescheduleStepThreeProps> = ({
  orderData,
  newItemData,
}) => {
  const queryClient = useQueryClient();
  const { APIEndpoint } = useAPIContext();
  const { data: session } = useSession();

  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 1️⃣ Send OTP to supervisor
  const sendOtpMutation = useMutation({
    mutationKey: ["sendOtp"],
    mutationFn: async () => {
      await axios.post(`${APIEndpoint}/security/otp/send`, {
        orderId: `${orderData._id} --- ${orderData.storeDetail?.storeName}`,
      });
    },
    onSuccess: () => {
      setOtpSent(true);
    },
  });

  // 2️⃣ Reschedule after OTP verification
  const rescheduleMutation = useMutation({
    mutationKey: ["rescheduleMutation"],
    mutationFn: async (): Promise<ClientStoreOrderType | null> => {
      const verifyResponse = await axios.post(
        `${APIEndpoint}/security/otp/verify`,
        {
          otp: otpValue,
          orderId: `${orderData._id} --- ${orderData.storeDetail?.storeName}`,
        },
      );

      if (!verifyResponse.data.valid) {
        setOtpError("Kode OTP salah!");
        return null;
      }

      setOtpError("");

      const response = await axios.patch(
        `${APIEndpoint}/order/${orderData._id}/reschedule`,
        {
          newItemData: newItemData,
          updatedBy: `${session?.user.firstName} ${session?.user.lastName}`,
        },
        { headers: { "x-store-id": localStorage.getItem("STORE_ID") || "" } },
      );

      return response.data.success;
    },
    onSuccess: (success) => {
      if (success) {
        setSuccessMessage("✅ Reschedule berhasil!");
        queryClient.invalidateQueries({ queryKey: ["order", orderData._id] });

        // Wait 1.5s so user sees the success message
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    },
  });

  const comparisonArray = newItemData
    .map((newItem) => {
      const oldItem = orderData.items.find(
        (orderItem) => orderItem.itemID === newItem.itemID,
      );
      if (!oldItem) return null;
      return { old: oldItem, new: newItem, itemName: newItem.itemName };
    })
    .filter(Boolean) as {
    itemName: string;
    old: StoreOrderItemType;
    new: StoreOrderItemType;
  }[];

  return (
    <div className="flex h-full w-full flex-col pb-4">
      <p className="w-full text-sm font-semibold">Preview Perubahan Jadwal</p>
      <div className="mt-2 flex flex-1 flex-col gap-6 overflow-y-auto pr-1">
        {comparisonArray.length === 0 ? (
          <p className="mt-4 text-center text-sm text-gray-500 italic">
            Tidak ada data untuk ditampilkan.
          </p>
        ) : (
          comparisonArray.map((item, index) => {
            const isSameVariation =
              item.old.itemVariation.variationName ===
                item.new.itemVariation.variationName &&
              item.old.itemVariation.variationBonus.title ===
                item.new.itemVariation.variationBonus.title;

            const isSameStart =
              item.old.rentalDetails.rentalStartInLocaleMs ===
              item.new.rentalDetails.rentalStartInLocaleMs;

            const isSameEnd =
              item.old.rentalDetails.rentalEndInLocaleMs ===
              item.new.rentalDetails.rentalEndInLocaleMs;

            return (
              <div key={item.itemName} className="flex w-full flex-col">
                <p className="mb-1 text-xs font-medium">
                  {index + 1}. {item.itemName}
                </p>

                <div className="flex flex-col items-center justify-center gap-0">
                  {/* BEFORE */}
                  <div className="flex w-full flex-col gap-1 rounded-sm border border-gray-300 bg-gray-100 p-2 opacity-70">
                    <p className="text-xs font-medium text-gray-500">
                      Sebelumnya
                    </p>
                    <p className="flex items-end justify-start gap-1">
                      <span className="font-semibold">
                        {item.old.itemVariation.variationName}
                      </span>
                      <span className="text-xs font-light">
                        ({item.old.itemVariation.variationBonus.title})
                      </span>
                    </p>
                    <div className="flex justify-between text-xs font-medium text-slate-800">
                      <p className="flex gap-1">
                        <span className="font-semibold text-green-500">
                          Mulai:
                        </span>
                        <span>
                          {moment(
                            item.old.rentalDetails.rentalStartInLocaleMs,
                          ).format("D MMMM YYYY, HH:mm")}
                        </span>
                      </p>
                      <p className="flex gap-1">
                        <span className="font-semibold text-red-500">
                          Selesai:
                        </span>
                        <span>
                          {moment(
                            item.old.rentalDetails.rentalEndInLocaleMs,
                          ).format("D MMMM YYYY, HH:mm")}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ARROW */}
                  <span className="text-green-500">
                    <ArrowBigDownDash size={32} strokeWidth={1} />
                  </span>

                  {/* AFTER */}
                  <div className="flex w-full flex-col gap-1 rounded-sm border border-green-500 bg-white p-2 shadow">
                    <p className="text-xs font-medium text-gray-500">
                      Setelah reschedule
                    </p>
                    <p className="flex items-end justify-start gap-1">
                      <span
                        className={
                          !isSameVariation
                            ? "font-semibold text-green-600"
                            : "font-semibold"
                        }
                      >
                        {item.new.itemVariation.variationName}
                      </span>
                      <span
                        className={
                          !isSameVariation
                            ? "text-xs font-light text-green-600"
                            : "text-xs font-light"
                        }
                      >
                        ({item.new.itemVariation.variationBonus.title})
                      </span>
                    </p>
                    <div className="flex justify-between text-xs font-medium text-slate-800">
                      <p className="flex gap-1">
                        <span className="font-semibold text-green-500">
                          Mulai:
                        </span>
                        <span
                          className={
                            !isSameStart ? "font-bold text-green-600" : ""
                          }
                        >
                          {moment(
                            item.new.rentalDetails.rentalStartInLocaleMs,
                          ).format("D MMMM YYYY, HH:mm")}
                        </span>
                      </p>
                      <p className="flex gap-1">
                        <span className="font-semibold text-red-500">
                          Selesai:
                        </span>
                        <span
                          className={!isSameEnd ? "font-bold text-red-600" : ""}
                        >
                          {moment(
                            item.new.rentalDetails.rentalEndInLocaleMs,
                          ).format("D MMMM YYYY, HH:mm")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {!otpSent ? (
        <button
          onClick={() => sendOtpMutation.mutate()}
          disabled={sendOtpMutation.isPending}
          className="flex w-full items-center justify-center rounded-md bg-yellow-500 p-2 font-semibold text-white"
        >
          {sendOtpMutation.isPending ? (
            <LoaderCircle size={20} className="mr-2 animate-spin" />
          ) : (
            <ShieldCheck size={20} className="mr-2" />
          )}
          Kirim OTP ke Supervisor
        </button>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <input
            type="text"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value)}
            placeholder="Masukkan OTP"
            className="rounded-md border p-2"
          />
          {otpError && <p className="text-sm text-red-500">{otpError}</p>}
          {successMessage && (
            <p className="text-sm text-green-500">{successMessage}</p>
          )}
          <button
            onClick={() => rescheduleMutation.mutate()}
            disabled={rescheduleMutation.isPending}
            className="flex w-full items-center justify-center rounded-md bg-teal-500 p-2 font-semibold text-white"
          >
            {rescheduleMutation.isPending ? (
              <LoaderCircle size={20} className="mr-2 animate-spin" />
            ) : (
              <CalendarClock size={20} className="mr-2" />
            )}
            Konfirmasi Reschedule
          </button>
        </div>
      )}
    </div>
  );
};

export default RescheduleStepThree;
