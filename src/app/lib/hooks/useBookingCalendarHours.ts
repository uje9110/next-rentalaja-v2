import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { ClientStoreProductStockType } from "../types/store_product_stock_type";

type UseBookingCalendarHoursProps = {
  orderItemData?: StoreOrderItemType;
  setOrderItemData?: Dispatch<SetStateAction<StoreOrderItemType>>;
  defaultStartHour?: string;
};

export const useBookingCalendarHours = ({
  orderItemData,
  setOrderItemData,
  defaultStartHour,
}: UseBookingCalendarHoursProps) => {
  const [defaultHour, defaultMinute] = defaultStartHour?.split(":") ?? ["", ""];

  const [isBookingCalendarHourOpen, setIsBookingCalendarHourOpen] =
    useState<boolean>(false);

  const [bookingHourAndMinute, setBookingHourAndMinute] = useState<
    Record<string, string>
  >({
    hour: defaultHour ?? "",
    minute: defaultMinute ?? "",
  });

  // CHECK HOUR FOR BOOKING AVAIBILITY
  const checkHourAvaibilty = (
    hourInMs: number,
    stocksData: ClientStoreProductStockType[],
  ): boolean => {
    for (const stock of stocksData) {
      let isInputInAnyBooking = false;
      for (const booking of stock.stockBookingDetails) {
        const { dateStart, dateEnd } = booking;

        if (!dateStart || !dateEnd) {
          return false;
        }
        if (hourInMs >= dateStart && hourInMs <= dateEnd) {
          isInputInAnyBooking = true;
        }
      }
      if (!isInputInAnyBooking) {
        return false; // If input does not overlap with any booking in current stock, return false
      }
    }
    return true; // If input overlaps with bookings in all stocks, return true
  };

  // GET TIME VALUE OF SELECTED BOOKING DATE IN MS
  const getSelectedDateValueInMs = (): number => {
    if (!orderItemData) {
      return new Date().getTime();
    }
    const [year, month, day] = orderItemData.rentalDetails.rentalStartDate
      .split("-")
      .map(Number);

    return new Date(year, month - 1, day).getTime(); // local midnight
  };

  useEffect(() => {
    if (defaultStartHour) {
      setOrderItemData?.((prevState) => {
        return {
          ...prevState,
          rentalDetails: {
            ...prevState.rentalDetails,
            rentalStartTime: `${defaultStartHour}`,
          },
        };
      });
    }
  }, []);

  useEffect(() => {
    setOrderItemData?.((prevState) => {
      return {
        ...prevState,
        rentalDetails: {
          ...prevState.rentalDetails,
          rentalStartTime: `${bookingHourAndMinute.hour}:${bookingHourAndMinute.minute}`,
        },
      };
    });
  }, [bookingHourAndMinute]);

  return {
    isBookingCalendarHourOpen,
    setIsBookingCalendarHourOpen,
    bookingHourAndMinute,
    setBookingHourAndMinute,
    checkHourAvaibilty,
    getSelectedDateValueInMs,
  };
};
