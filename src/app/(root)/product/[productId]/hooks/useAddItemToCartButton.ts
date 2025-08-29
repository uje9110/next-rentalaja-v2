import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { Dispatch, SetStateAction } from "react";

type useAddItemToCartButtonProps = {
  setCart: Dispatch<SetStateAction<StoreOrderItemType[]>>;
};

export function useAddItemToCartButton({
  setCart,
}: useAddItemToCartButtonProps) {
  const handleAddItemToCart = (orderItemData: StoreOrderItemType) => {
    setCart((prevState) => [...prevState, orderItemData]);
  };

  return { handleAddItemToCart };
}
