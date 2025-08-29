import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import React, { FC } from "react";

type AddItemToCartButtonProps = {
  orderItemData: StoreOrderItemType;
  handleAddItemToCart: (orderItemData: StoreOrderItemType) => void;
};

const AddItemToCartButton: FC<AddItemToCartButtonProps> = ({
  orderItemData,
  handleAddItemToCart,
}) => {
  return (
    <div className="flex w-full items-center justify-center">
      <button
        className="w-full rounded-md bg-teal-400 px-4 py-2 font-semibold text-white shadow"
        onClick={() => {
          handleAddItemToCart(orderItemData);
        }}
      >
        Tambahkan Ke Cart
      </button>
    </div>
  );
};

export default AddItemToCartButton;
