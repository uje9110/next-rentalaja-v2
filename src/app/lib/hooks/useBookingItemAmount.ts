import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { ClientStoreProductType } from "../types/store_product_type";
import { ClientStoreProductStockType } from "../types/store_product_stock_type";

type UseBookingItemAmountProps = {
  orderItemData?: StoreOrderItemType;
  setOrderItemData?: Dispatch<SetStateAction<StoreOrderItemType>>;
  storeProduct?: ClientStoreProductType;
};

export function useBookingItemAmount({
  orderItemData,
  setOrderItemData,
  storeProduct,
}: UseBookingItemAmountProps) {
  const [availableStocks, setAvailableStocks] = useState<string[]>([]);

  const handleItemAmountChange = (value: string) => {
    if (!orderItemData || !setOrderItemData) {
      return;
    }
    const filteredAvailableStock = availableStocks.slice(0, Number(value));
    const orderItemSubtotal = orderItemData?.itemSubtotal * Number(value);
    setOrderItemData((prevState) => {
      return {
        ...prevState,
        stockIds: filteredAvailableStock,
        itemSubtotal: orderItemSubtotal,
        itemAmount: Number(value),
      };
    });
  };

  // CALCULATE AMOUNT OF STOCK THAT AVAILABLE BY DATE OF CHOOSING
  const calculateStockByDate = (
    rentalStartInMs: number,
    rentalEndInMs: number,
    stocksData: ClientStoreProductStockType[],
  ) => {
    let availableStock = stocksData?.filter(
      (item) => item.status === "available" || item.status === "rented",
    );

    availableStock = availableStock?.filter((stock) => {
      const hasConflict = stock.stockBookingDetails.some((booking) => {
        const { dateStart, dateEnd } = booking;
        if (!dateStart || !dateEnd) {
          return false;
        }
        const isConflicting =
          rentalEndInMs >= dateStart && rentalStartInMs <= dateEnd;
        return isConflicting;
      });
      return !hasConflict;
    });
    setAvailableStocks(
      availableStock
        ?.filter((item) => item.status === "available" || item.status === "rented")
        .map((item) => item._id as string)
        .sort(),
    );
  };

  useEffect(() => {
    if (!orderItemData || !storeProduct) {
      return;
    }
    calculateStockByDate(
      orderItemData?.rentalDetails.rentalStartInLocaleMs,
      orderItemData?.rentalDetails.rentalEndInLocaleMs,
      storeProduct?.stocksDetails,
    );
  }, [
    orderItemData?.rentalDetails.rentalStartInLocaleMs,
    orderItemData?.rentalDetails.rentalEndInLocaleMs,
  ]);

  return {
    availableStocks,
    setAvailableStocks,
    handleItemAmountChange,
    calculateStockByDate,
  };
}
