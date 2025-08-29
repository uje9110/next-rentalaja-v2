import { useState, useEffect } from "react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { ClientStoreProductType } from "../types/store_product_type";

type UseOrderProps = {
  storeProduct: ClientStoreProductType;
};

export function useOrder({ storeProduct }: UseOrderProps) {
  const [orderItemData, setOrderItemData] = useState<StoreOrderItemType>({
    itemID: "",
    itemName: "",
    itemAmount: 0,
    stockIds: [],
    itemImage: "",
    itemVariation: {
      variationID: "",
      variationName: "",
      variationPrice: 0,
      hoursValue: 0,
      variationBonus: {
        title: "",
        hoursValue: 0,
      },
    },
    itemSubtotal: 0,
    rentalDetails: {
      rentalStartDate: "",
      rentalStartTime: "",
      rentalEndDate: "",
      rentalEndTime: "",
      rentalStartInLocaleMs: 0,
      rentalEndInLocaleMs: 0,
    },
    storeId: "",
    pickupAndReturnDetails: {
      returnDateTimeInMs: 0,
      pickupDateTimeInMs: 0,
    },
  });

  useEffect(() => {
    setOrderItemData((prevState) => {
      return {
        ...prevState,
        itemID: storeProduct._id,
        itemName: storeProduct.title,
        itemImage: storeProduct.primaryImage.link,
        storeId: storeProduct.storeDetail.storeId,
      };
    });
  }, []);

  useEffect(() => {
    const { rentalStartDate, rentalStartTime } = orderItemData.rentalDetails;

    if (rentalStartDate && rentalStartTime) {
      const startDateTime = new Date(
        `${rentalStartDate}T${rentalStartTime}`,
      ).getTime();

      setOrderItemData((prev) => ({
        ...prev,
        rentalDetails: {
          ...prev.rentalDetails,
          rentalStartInLocaleMs: startDateTime,
        },
      }));
    }
  }, [
    orderItemData.rentalDetails.rentalStartDate,
    orderItemData.rentalDetails.rentalStartTime,
  ]);

  return { orderItemData, setOrderItemData };
}
