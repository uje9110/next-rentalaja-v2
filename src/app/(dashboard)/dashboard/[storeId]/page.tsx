import { ServerPageProps } from "@/app/lib/types/server_component_types";
import { BookingOverdueNotificationType } from "@/app/lib/types/store_booking_overdue_type";
import axios from "axios";
import React from "react";
import OverdueBookingsNotification from "./components/OverdueBookingsNotification";

const Page = async ({ params }: ServerPageProps) => {
  const { storeId } = await params;
  const getOverdueBookings = async (storeId: string) => {
    try {
      await axios.get(
        `https://service.rentalaja.co.id/service/v1/booking/check`,
      );
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/notification/overdue_bookings`,
        {
          headers: {
            "x-store-id": storeId,
          },
        },
      );
      const responseData: BookingOverdueNotificationType[] =
        response.data.overdueBookingNotifications;
      const formattedData = responseData.sort((a, b) => {
        return (
          Number(b.orderId.split("-")[1]) - Number(a.orderId.split("-")[1])
        );
      });
      return formattedData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const overdueBookings = await getOverdueBookings(storeId);

  return (
    <div className="flex h-fit w-full flex-col gap-4 rounded-lg">
      <OverdueBookingsNotification overdueBookings={overdueBookings} />
    </div>
  );
};

export default Page;
