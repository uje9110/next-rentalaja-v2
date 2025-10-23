"use client";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { useCartContext } from "@/app/lib/context/CartContext";
import {
  CartBookingConflictsType,
  CartBookingValidationLoadingType,
  ClientCartType,
} from "@/app/lib/types/client_cart_types";
import { ClientCheckoutType } from "@/app/lib/types/client_checkout_type";
import {
  OrderItemRentalDetailsType,
  StoreOrderItemType,
} from "@/app/lib/types/store_order_item_type";
import { StoreProductBookingType } from "@/app/lib/types/store_product_booking_type";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type useCartProps = {
  checkout: ClientCheckoutType;
  setCheckout: Dispatch<SetStateAction<ClientCheckoutType>>;
};

export function useCart({ checkout, setCheckout }: useCartProps) {
  const { APIEndpoint } = useAPIContext();
  const { cart, setCart } = useCartContext();
  const [bookingConflicts, setBookingConflicts] =
    useState<CartBookingConflictsType>({});
  const [bookingValidationLoading, setBookingValidationLoading] =
    useState<CartBookingValidationLoadingType>({
      status: false,
      itemID: "",
    });

  const checkItemCartBooking = async (
    APIEndpoint: string,
    productId: string,
    stockIdArray: string[],
    rentalData: OrderItemRentalDetailsType,
    storeId: string,
  ): Promise<boolean> => {
    try {
      const { rentalStartInLocaleMs, rentalEndInLocaleMs } = rentalData;
      setBookingValidationLoading({ status: true, itemID: productId });

      const response = await axios.get(`${APIEndpoint}/product/${productId}`, {
        headers: {
          "x-store-id": storeId,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch product data");
      }

      setBookingValidationLoading({ status: false, itemID: "" });

      const thisProductStockBookingDetails: StoreProductBookingType[] =
        response.data.json.stockBookingDetails;

      const filteredStockBookingDetails = stockIdArray
        .map((stockId) =>
          thisProductStockBookingDetails.filter(
            (stockBooking) => stockBooking.belongToStockId === stockId,
          ),
        )
        .flat();

      const isThereBookingConflict = filteredStockBookingDetails.some(
        (bookingDetail) => {
          const { dateStart, dateEnd } = bookingDetail;
          if (!dateStart || !dateEnd) {
            return false;
          }
          return (
            rentalEndInLocaleMs >= dateStart && rentalStartInLocaleMs <= dateEnd
          );
        },
      );

      return isThereBookingConflict;
    } catch (error) {
      console.error("Error checking booking item in cart:", error);
      setBookingValidationLoading({ status: false, itemID: "" });
      return false;
    }
  };

  const validateBookings = async () => {
    const conflicts: CartBookingConflictsType = {};
    for (const cartItem of cart) {
      const { items, store } = cartItem;
      for (const item of items) {
        const hasConflict = await checkItemCartBooking(
          APIEndpoint,
          item.itemID,
          item.stockIds,
          item.rentalDetails,
          store.storeId,
        );
        conflicts[item.itemID] = hasConflict;
      }
    }
    setBookingConflicts(conflicts);
  };

  const checkIsItemAlreadyExistInCheckout = (
    orderItemData: StoreOrderItemType,
  ): boolean => {
    return checkout.checkoutCartItems.some(
      (cartItem) =>
        cartItem.store.storeId === orderItemData.storeDetail.storeId &&
        cartItem.items.some(
          (cartItem) => cartItem.itemID === orderItemData.itemID,
        ),
    );
  };

  const checkIsItemAlreadyExistInCart = (
    productId: string,
    storeId: string,
  ): boolean => {
    return cart.some(
      (cartItem) =>
        cartItem.store.storeId === storeId &&
        cartItem.items.some((cartItem) => cartItem.itemID === productId),
    );
  };

  const handleAddCartItemToCheckout = (
    orderItemData: StoreOrderItemType,
    isUsingDashboard?: boolean,
  ) => {
    const existedCartItemInCheckoutIndex = checkout.checkoutCartItems.findIndex(
      (cartItem) =>
        cartItem.store.storeId === orderItemData.storeDetail.storeId,
    );

    if (existedCartItemInCheckoutIndex === -1) {
      // Store not yet in checkout → add it
      const newCartItem: ClientCartType = {
        store: orderItemData.storeDetail,
        items: [orderItemData],
        subtotal: 0,
        total: 0,
      };
      setCheckout((prevState) => ({
        ...prevState,
        checkoutCartItems: [...prevState.checkoutCartItems, newCartItem],
      }));
    } else {
      // Store already exists in checkout → update it
      const existedCartItemInCheckout =
        checkout.checkoutCartItems[existedCartItemInCheckoutIndex];

      const existedItemInCartItemIndex =
        existedCartItemInCheckout.items.findIndex(
          (item) => item.itemID === orderItemData.itemID,
        );

      let updatedCartItem: ClientCartType;

      if (existedItemInCartItemIndex === -1) {
        // Item not yet in this store's cart → add it
        updatedCartItem = {
          ...existedCartItemInCheckout,
          items: [...existedCartItemInCheckout.items, orderItemData],
        };
      } else {
        // Through dashboard, update instead remove it
        if (isUsingDashboard) {
          updatedCartItem = {
            ...existedCartItemInCheckout,
            items: existedCartItemInCheckout.items.map((item) =>
              item.itemID === orderItemData.itemID
                ? { ...item, ...orderItemData }
                : item,
            ),
          };
        } else {
          // Through front app, Item already exists → remove it
          updatedCartItem = {
            ...existedCartItemInCheckout,
            items: existedCartItemInCheckout.items.filter(
              (item) => item.itemID !== orderItemData.itemID,
            ),
          };
        }
      }

      setCheckout((prevState) => {
        let updatedCartItems = [...prevState.checkoutCartItems];
        updatedCartItems[existedCartItemInCheckoutIndex] = updatedCartItem;
        updatedCartItems = updatedCartItems.filter(
          (cartItem) => cartItem.items.length > 0,
        );
        return {
          ...prevState,
          checkoutCartItems: updatedCartItems,
        };
      });
    }
  };

  const removeItemFromCart = (
    itemId: string,
    isItemExistInCheckout: boolean,
  ) => {
    if (isItemExistInCheckout) {
      toast.warning("hapus centang terlebih dahulu sebelum menghilangkan item");
      return;
    }
    const formattedCart: ClientCartType[] = cart
      .map(({ store, items, subtotal, total }) => {
        const filteredItems = items.filter((item) => item.itemID !== itemId);
        if (filteredItems.length === 0) return null;
        return { store, items: filteredItems, subtotal, total };
      })
      .filter((storeCart): storeCart is ClientCartType => storeCart !== null);

    setCart(formattedCart);
  };

  return {
    removeItemFromCart,
    validateBookings,
    checkItemCartBooking,
    bookingConflicts,
    bookingValidationLoading,
    handleAddCartItemToCheckout,
    checkIsItemAlreadyExistInCheckout,
    checkIsItemAlreadyExistInCart,
  };
}
