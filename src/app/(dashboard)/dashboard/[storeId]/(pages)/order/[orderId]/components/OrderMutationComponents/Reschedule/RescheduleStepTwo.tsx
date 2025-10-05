"use client";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { RescheduleDialogContentProps } from "./RescheduleDialogContent";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TriangleAlert } from "lucide-react";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import BookingCalendar from "@/app/lib/components/BookingCalendar";
import BookingSelectVariation from "@/app/lib/components/BookingSelectVariations";
import BookingItemAmount from "@/app/lib/components/BookingItemAmount";
import { useBooking } from "@/app/lib/hooks/useBooking";
import { useBookingCalendarHours } from "@/app/lib/hooks/useBookingCalendarHours";
import { useBookingCalendar } from "@/app/lib/hooks/useBookingCalendar";
import { useBookingSelectVariation } from "@/app/lib/hooks/useBookingSelectVariation";
import { useBookingItemAmount } from "@/app/lib/hooks/useBookingItemAmount";
import { useOrder } from "@/app/lib/hooks/useOrder";
import { useParams } from "next/navigation";

interface RescheduleStepTwoProps extends RescheduleDialogContentProps {
  itemID: string;
  setNewItemData: Dispatch<SetStateAction<StoreOrderItemType[]>>;
  itemIndex: number;
}

export const RescheduleStepTwo: FC<RescheduleStepTwoProps> = ({
  itemID,
  setNewItemData,
  itemIndex,
}) => {
  const { APIEndpoint } = useAPIContext();
  const params = useParams();
  const { storeId } = params;

  const { data: storeProduct = [] } = useQuery({
    queryKey: ["storeProducts"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${APIEndpoint}/product/${itemID}`, {
          headers: {
            "x-store-id": storeId,
          },
        });
        return response.data.product;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  // USE ORDER
  const { orderItemData, setOrderItemData } = useOrder({ storeProduct });

  const {
    currMonth,
    currYear,
    currDateInMs,
    datesOfMonth,
    hoursArr,
    minutesArr,
    handleDecreaseMonth,
    handleIncreaseMonth,
    handleDecreaseYear,
    handleIncreaseYear,
  } = useBooking();

  // USE BOOKING CALENDAR HOUR
  const {
    bookingHourAndMinute,
    isBookingCalendarHourOpen,
    setIsBookingCalendarHourOpen,
    setBookingHourAndMinute,
    checkHourAvaibilty,
    getSelectedDateValueInMs,
  } = useBookingCalendarHours({
    setOrderItemData,
    orderItemData,
  });

  // USE BOOKING CALENDAR
  const {
    selectedDate,
    openBookingCalendarHours,
    handleBookingCalendarDateChange,
    isDateValid,
    checkAnyDateAvailability,
    checkEveryDateAvailability,
  } = useBookingCalendar({
    setIsBookingCalendarHourOpen,
    setOrderItemData,
    currDateInMs,
  });

  // USE BOOKING VARIATION
  const { handleBookingVariation, checkBookingVariantAvailability } =
    useBookingSelectVariation({
      orderItemData,
      setOrderItemData,
    });

  // USE BOOKING ITEM AMOUNT
  const { availableStocks, handleItemAmountChange } = useBookingItemAmount({
    storeProduct,
    orderItemData,
    setOrderItemData,
  });

  const updateNewItemDataAtIndex = (
    index: number,
    updatedItem: StoreOrderItemType,
  ) => {
    setNewItemData((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const newArr = [...prev];
      newArr[index] = updatedItem;
      return newArr;
    });
  };

  const { data: productDetail = [] } = useQuery({
    queryKey: ["productDetails"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${APIEndpoint}/product/${itemID}`, {
          headers: {
            "x-store-id": localStorage.getItem("STORE_ID"),
          },
        });
        return response.data.product;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  useEffect(() => {
    updateNewItemDataAtIndex(itemIndex, orderItemData);
  }, [orderItemData]);

  return (
    <div className="flex h-[300px] max-h-[500px] flex-col gap-2">
      <div className="flex w-full flex-col gap-1">
        <p className="flex w-full items-center gap-2">
          <span className="text-red-500">
            <TriangleAlert size={16} />
          </span>
          <span className="font-semibold text-red-500">Perhatian</span>
        </p>
        <p className="w-full rounded-md border border-red-400/50 bg-red-100 p-2 text-start text-xs text-slate-600">
          Mengklik tombol sebelumnya dapat mereset semua data reschedule untuk
          alat ini.
        </p>
      </div>
      <p className="text-sm">
        Reschedule{" "}
        <span className="font-medium">{productDetail[0]?.title}</span>.
      </p>
      <div className="flex flex-1 flex-col items-center justify-between pb-6">
        <div className="flex w-full flex-1 flex-col gap-4">
          <BookingCalendar
            isDateValid={isDateValid}
            checkAnyDateAvailability={checkAnyDateAvailability}
            checkEveryDateAvailability={checkEveryDateAvailability}
            openBookingCalendarHours={openBookingCalendarHours}
            selectedDate={selectedDate}
            storeProduct={storeProduct}
            currMonth={currMonth}
            currYear={currYear}
            datesOfMonth={datesOfMonth}
            handleDecreaseMonth={handleDecreaseMonth}
            handleBookingCalendarDateChange={handleBookingCalendarDateChange}
            handleDecreaseYear={handleDecreaseYear}
            handleIncreaseMonth={handleIncreaseMonth}
            handleIncreaseYear={handleIncreaseYear}
          />
          <BookingSelectVariation
            storeProduct={storeProduct}
            orderItemData={orderItemData}
            variationsDetails={storeProduct.variationsDetails}
            handleBookingVariation={handleBookingVariation}
            checkBookingVariantAvailability={checkBookingVariantAvailability}
          />
          <BookingItemAmount
            availableStocks={availableStocks}
            handleItemAmountChange={handleItemAmountChange}
          />
        </div>
      </div>
    </div>
  );
};
