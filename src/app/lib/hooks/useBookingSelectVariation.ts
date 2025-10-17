import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import moment from "moment-timezone";
import { ClientStoreProductStockType } from "../types/store_product_stock_type";

type useBookingSelectVariation = {
  orderItemData?: StoreOrderItemType;
  setOrderItemData?: Dispatch<SetStateAction<StoreOrderItemType>>;
};

export function useBookingSelectVariation({
  orderItemData,
  setOrderItemData,
}: useBookingSelectVariation) {
  const handleBookingVariation = (
    e: ChangeEvent<HTMLInputElement>,
    variationTimeValueInMs: number,
  ) => {
    const rentalStartInMs = orderItemData?.rentalDetails.rentalStartInLocaleMs;
    if (!rentalStartInMs || !setOrderItemData) {
      return;
    }
    const rentalEndInMs = rentalStartInMs + variationTimeValueInMs;
    setOrderItemData((prevState) => {
      return {
        ...prevState,
        itemSubtotal: parseInt(e.target.value, 10),
        itemVariation: {
          variationID: e.target.dataset.variation_id || "",
          variationName: e.target.dataset.variation_title || "",
          variationPrice: parseInt(e.target.value, 10),
          hoursValue: parseInt(e.target.dataset.hoursvalue || "0", 10),
          variationBonus: {
            title: e.target.dataset.variationbonustitle || "",
            hoursValue: parseInt(
              e.target.dataset.variationbonushoursvalue || "0",
              10,
            ),
          },
        },
        rentalDetails: {
          ...prevState.rentalDetails,
          rentalEndInLocaleMs: rentalEndInMs,
          rentalEndDate: moment(rentalEndInMs).tz("Asia/Jakarta").format("YYYY-MM-DD"),
          rentalEndTime: moment(rentalEndInMs).tz("Asia/Jakarta").format("HH:mm"),
        },
      };
    });
  };

  const checkBookingVariantAvailability = (
    selectedDateTime: number,
    bookingDuration: number,
    stocksData: ClientStoreProductStockType[],
  ): boolean => {
    const bookingEndInMs = selectedDateTime + bookingDuration;
    let validBookingCount = 0;

    for (const stock of stocksData) {
      let isValidForThisStock = false;
      for (const booking of stock.stockBookingDetails) {
        const { dateStart, dateEnd } = booking;
        if (!dateStart || !dateEnd) {
          return false;
        }
        if (bookingEndInMs >= dateStart && selectedDateTime <= dateEnd) {
          isValidForThisStock = true;
          break;
        }
      }
      if (isValidForThisStock) {
        validBookingCount++;
      } else {
        return false;
      }
    }

    return validBookingCount === stocksData.length;
  };

  return { handleBookingVariation, checkBookingVariantAvailability };
}
