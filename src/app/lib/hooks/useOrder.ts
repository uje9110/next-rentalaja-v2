import { useState, useEffect } from "react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { ClientStoreProductType } from "../types/store_product_type";
import { StoreOrderType } from "../types/store_order_type";
import { StoreOrderBillingType } from "../types/store_order_billing_type";

type UseOrderProps = {
  storeProduct?: ClientStoreProductType;
};

export function useOrder({ storeProduct }: UseOrderProps) {
  const [orderData, setOrderData] = useState<StoreOrderType>({
    storeDetail: {
      storeId: "",
      storeName: "",
      storeStrings: "",
      storeImage: {
        name: "",
        link: "",
      },
      storeAddress: {
        province: "",
        city: "",
        district: "",
        address: "",
      },
    },
    byAdmin: {
      isByAdmin: true,
    },
    subtotal: 0,
    total: 0,
    items: [],
    billing: {
      firstName: "",
      lastName: "",
      telephone: "",
      email: "",
      socialMedia: "",
      address: {
        city: "",
        district: "",
        province: "",
        street: "",
      },
    },
    discounts: [],
    updateLogs: [],
  });

  const [orderBillingData, setOrderBillingData] =
    useState<StoreOrderBillingType>({
      firstName: "",
      lastName: "",
      telephone: "",
      email: "",
      socialMedia: "",
      membershipId: "",
      address: {
        city: "",
        district: "",
        province: "",
        street: "",
      },
    });

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
    storeDetail: {
      storeId: "",
      storeName: "",
      storeStrings: "",
      storeImage: {
        name: "",
        link: "",
      },
      storeAddress: {
        province: "",
        city: "",
        district: "",
        address: "",
      },
    },
    pickupAndReturnDetails: {
      returnDateTimeInMs: 0,
      pickupDateTimeInMs: 0,
    },
  });

  useEffect(() => {
    if (!storeProduct) return;
    setOrderItemData((prevState) => {
      return {
        ...prevState,
        itemID: storeProduct._id,
        itemName: storeProduct.title,
        itemImage: storeProduct.primaryImage.link,
        storeDetail: storeProduct.storeDetail,
      };
    });
  }, [storeProduct]);

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

  return {
    orderItemData,
    setOrderItemData,
    orderData,
    setOrderData,
    orderBillingData,
    setOrderBillingData,
  };
}
