"use client";
import { BookingOverdueNotificationType } from "@/app/lib/types/store_booking_overdue_type";
import { Bell } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

type OverdueBookingsNotificationProps = {
  overdueBookings: BookingOverdueNotificationType[];
};

const OverdueBookingsNotification: FC<OverdueBookingsNotificationProps> = ({
  overdueBookings,
}) => {
  return (
    <div className="flex w-fit flex-col items-center justify-between overflow-hidden rounded-md border border-slate-400/50 bg-white">
      <div className="flex w-full items-center justify-between px-4 py-2">
        <p>Notifikasi</p>
        <div className="flex items-center gap-1">
          {/* <RefreshCcw
            size={16}
            strokeWidth={2}
            onClick={() => getOverdueBookings(storeId)}
          /> */}
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-400 p-3 text-xs font-semibold text-white">
            {overdueBookings.length}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0">
        {overdueBookings.map((booking) => {
          return (
            <Link
              target="__blank"
              href={`dashboard/order/${booking.orderId}`}
              key={booking.orderId}
              className="flex h-fit w-full flex-row gap-1 border-t border-slate-400/50 bg-white py-2 text-xs shadow-sm first:border-blue-400"
            >
              <div className="flex flex-row items-center justify-start gap-3 px-4 py-2">
                <span className="text-blue-400">
                  <Bell strokeWidth={2} size={24} />
                </span>
                <div className="flex flex-col gap-0">
                  <p className="text-sm font-light">
                    Status order belum diselesaikan{" "}
                    <span className="font-semibold text-blue-400">
                      {booking.orderId}
                    </span>
                  </p>
                  <p className="text-slate-400">
                    Segera cek order apabila alat sudah dikembalikan atau belum
                    dikembalikan
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default OverdueBookingsNotification;
