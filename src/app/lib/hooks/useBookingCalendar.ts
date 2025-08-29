import { Dispatch, SetStateAction } from "react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { ClientStoreProductStockType } from "../types/store_product_stock_type";

type UseBookingCalendarProps = {
  setIsBookingCalendarHourOpen?: Dispatch<SetStateAction<boolean>>;
  setOrderItemData?: Dispatch<SetStateAction<StoreOrderItemType>>;
  currDateInMs?: number;
  setCurrDateInMs?: Dispatch<SetStateAction<number>>;
};

export function useBookingCalendar({
  setIsBookingCalendarHourOpen,
  setOrderItemData,
  currDateInMs,
  setCurrDateInMs,
}: UseBookingCalendarProps) {

  
  const handleBookingCalendarDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrderItemData?.((prevState) => {
      return {
        ...prevState,
        rentalDetails: {
          ...prevState.rentalDetails,
          rentalStartDate: e.target.value,
        },
      };
    });
  };

  const openBookingCalendarHours = () => {
    if (currDateInMs) {
      setCurrDateInMs?.(currDateInMs);
    }
    setIsBookingCalendarHourOpen?.(true); // ✅ safe optional call
  };

  const closeBookingCalendarHours = () => {
    setIsBookingCalendarHourOpen?.(false); // ✅ safe optional call
  };

  // CHECK IF DATE IS NOT PASSED
  const isDateValid = (date: number): boolean => {
    const dateNow = new Date();
    const todaysDateInMs = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate(),
    ).getTime();
    if (todaysDateInMs > date) {
      return true;
    }
    return false;
  };

  // CHECK IF EVERY HOUR IS BOOKED
  const checkEveryDateAvailability = (
    dateHoursInMs: number[],
    stockData: ClientStoreProductStockType[],
  ): boolean => {
    for (const stock of stockData) {
      let allDatesAvailable = false;

      for (const booking of stock.stockBookingDetails) {
        const { dateStart, dateEnd } = booking;
        if (!dateStart || !dateEnd) {
          return false;
        }

        if (
          dateHoursInMs.every(
            (hourInMs) => hourInMs >= dateStart && hourInMs <= dateEnd,
          )
        ) {
          allDatesAvailable = true;
          break; // Exit loop early if a valid booking is found
        }
      }

      if (!allDatesAvailable) {
        return false;
      }
    }
    return true;
  };

  // CHECK IF THERE IS SOME HOUR ALREADY BOOKED
  const checkAnyDateAvailability = (
    dateHoursInMs: number[],
    stockData: ClientStoreProductStockType[],
  ): boolean => {
    for (const stock of stockData) {
      let anyDateAvailable = false;

      for (const booking of stock.stockBookingDetails) {
        const { dateStart, dateEnd } = booking;
        if (!dateStart || !dateEnd) {
          return false;
        }

        if (
          dateHoursInMs.some(
            (hourInMs) => hourInMs >= dateStart && hourInMs <= dateEnd,
          )
        ) {
          anyDateAvailable = true;
          break; // Exit loop early if a valid booking is found
        }
      }

      if (anyDateAvailable) {
        return true;
      }
    }
    return false;
  };

  return {
    handleBookingCalendarDateChange,
    openBookingCalendarHours,
    closeBookingCalendarHours,
    isDateValid,
    checkAnyDateAvailability,
    checkEveryDateAvailability,
  };
}
