import { ClientCartType } from "@/app/lib/types/client_cart_types";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import { Dispatch, SetStateAction } from "react";

type useAddItemToCartButtonProps = {
  cart: ClientCartType[];
  setCart: Dispatch<SetStateAction<ClientCartType[]>>;
};

export function useAddItemToCartButton({
  cart,
  setCart,
}: useAddItemToCartButtonProps) {
  const handleAddItemToCart = (orderItemData: StoreOrderItemType) => {
    const storeIndex = cart.findIndex(
      (c) => c.store.storeId === orderItemData.storeDetail.storeId,
    );

    // 🟢 Case 1: Store already exists in cart
    if (storeIndex !== -1) {
      const storeCart = cart[storeIndex];
      const itemExists = storeCart.items.some(
        (item) => item.itemID === orderItemData.itemID,
      );

      let updatedStoreCart: ClientCartType;
      if (itemExists) {
        // Item already exists → update if you want quantity, or just leave it
        updatedStoreCart = {
          ...storeCart,
          items: storeCart.items.map((item) =>
            item.itemID === orderItemData.itemID
              ? { ...item, ...orderItemData }
              : item,
          ),
        };
      } else {
        // Add new item to store
        updatedStoreCart = {
          ...storeCart,
          items: [...storeCart.items, orderItemData],
        };
      }

      const newCart = [...cart];
      newCart[storeIndex] = updatedStoreCart;
      setCart(newCart);
    } else {
      // 🟢 Case 2: Store not yet in cart → add new store entry
      setCart([
        ...cart,
        { store: orderItemData.storeDetail, items: [orderItemData] },
      ]);
    }
  };

  return { handleAddItemToCart };
}
