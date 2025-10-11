"use client";
import {
  CartBookingConflictsType,
  CartBookingValidationLoadingType,
  ClientCartType,
} from "@/app/lib/types/client_cart_types";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { Loader2, Store } from "lucide-react";
import Image from "next/image";

type CartItemProps = {
  bookingConflicts: CartBookingConflictsType;
  bookingValidationLoading: CartBookingValidationLoadingType;
  cart: ClientCartType[];
  handleAddCartItemToCheckout: (orderItemData: StoreOrderItemType) => void;
  checkIsItemAlreadyExistInCheckout: (
    orderItemData: StoreOrderItemType,
  ) => boolean;
};

export const CartItem: React.FC<CartItemProps> = ({
  bookingConflicts,
  bookingValidationLoading,
  cart,
  handleAddCartItemToCheckout,
  checkIsItemAlreadyExistInCheckout,
}) => {
  return (
    <div className="flex w-full flex-col gap-6">
      {cart.map((cartItem) => {
        const { store, items } = cartItem;
        return (
          <div
            key={store.storeId}
            className="border-accent-custom w-full overflow-hidden rounded-lg bg-white shadow-sm"
          >
            {/* Store Header */}
            <p className="flex items-center gap-2 border-b border-sky-200 bg-sky-100 p-4 py-2">
              <span className="text-colorSecondary">
                <Store className="phone:w-4" />
              </span>
              <span className="subheader-custom phone:text-sm font-semibold">
                {store.storeName}
              </span>
            </p>
            {/* Items */}
            <div>
              {items.map((item: StoreOrderItemType) => {
                const {
                  itemName,
                  itemID,
                  itemAmount,
                  itemVariation,
                  itemSubtotal,
                  itemImage,
                  //   availableStock,
                } = item;

                // Check if item exists in checkout
                const itemExistsInCheckout =
                  checkIsItemAlreadyExistInCheckout(item);

                // Check for booking conflicts
                const hasConflict = bookingConflicts[itemID] || false;

                return (
                  <div
                    key={itemID}
                    className={`relative flex h-full w-full flex-row items-center justify-center gap-4 p-4 lg:gap-8 ${
                      hasConflict ? "opacity-50" : ""
                    }`}
                  >
                    {bookingValidationLoading.status &&
                    bookingValidationLoading.itemID === itemID ? (
                      <p className="flex flex-row items-center gap-2 text-sky-600">
                        <span className="animate-spin">
                          <Loader2 />
                        </span>
                        <span className="text-xs">
                          Dilakukan pengecekan booking terlebih dahulu
                        </span>
                      </p>
                    ) : (
                      <>
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          id={`${itemID}-checkbox`}
                          checked={itemExistsInCheckout}
                          onChange={() => handleAddCartItemToCheckout(item)}
                          disabled={hasConflict} // Disable checkbox if conflict exists
                        />

                        {/* Item Image */}
                        <div className="flex w-1/3 flex-col gap-2">
                          <Image
                            width={100}
                            height={100}
                            src={itemImage}
                            alt={itemImage}
                            className="aspect-square w-[100px] rounded-md border-2 object-cover lg:w-[150px]"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex w-2/3 flex-col gap-1">
                          {/* Item Name */}
                          <h3 className="font-uppercase truncate text-lg font-semibold phone:text-sm">
                            {itemName}
                          </h3>

                          {hasConflict ? null : (
                            <div className="flex w-full flex-col gap-1">
                              {/* Variation Details */}
                              <div className="flex w-full items-center justify-between lg:flex-row">
                                <p className="text-xs text-gray-400 lg:text-sm">
                                  Paket: &nbsp;
                                </p>
                                <span className="text-xs text-gray-400 lg:text-sm">
                                  {itemVariation.variationName}
                                </span>
                              </div>

                              {/* Item Amount */}
                              <div className="flex w-full flex-row items-center justify-between">
                                <p className="text-xs text-gray-400 lg:text-sm">
                                  Jumlah Item: &nbsp;
                                </p>
                                <div className="flex flex-row">
                                  <div className="flex flex-row gap-2">
                                    {/* Decrease Item Button */}
                                    {/* <button
                                      className="flex h-[20px] w-[20px] flex-col items-center justify-center rounded-md bg-slate-400 p-2"
                                      onClick={() => {
                                        if (itemExistsInCheckout) {
                                          toast.warning(
                                            "Uncheck item terlebih dahulu sebelum mengurangi jumlah",
                                            {
                                              position: "top-right",
                                              autoClose: 5000,
                                              hideProgressBar: false,
                                              closeOnClick: true,
                                              pauseOnHover: true,
                                              draggable: true,
                                              progress: undefined,
                                              theme: "light",
                                            },
                                          );
                                        } else {
                                          handleDecreaseItemAmount(
                                            itemID,
                                            cartArray,
                                            setCartArray,
                                          );
                                        }
                                      }}
                                    >
                                      -
                                    </button> */}
                                    <p className="rounded-sm border px-2 py-0.5 text-xs">
                                      {itemAmount}
                                    </p>

                                    {/* Increase Item Button */}
                                    {/* <button
                                      className="flex h-[20px] w-[20px] flex-col items-center justify-center rounded-md bg-slate-400 p-2"
                                      onClick={() => {
                                        if (itemExistsInCheckout) {
                                          toast.warning(
                                            "Uncheck item terlebih dahulu sebelum menambah jumlah",
                                            {
                                              position: "top-right",
                                              autoClose: 5000,
                                              hideProgressBar: false,
                                              closeOnClick: true,
                                              pauseOnHover: true,
                                              draggable: true,
                                              progress: undefined,
                                              theme: "light",
                                            },
                                          );
                                        } else {
                                          if (
                                            itemAmount < availableStock.length
                                          ) {
                                            handleIncreaseItemAmount(
                                              itemID,
                                              cartArray,
                                              setCartArray,
                                            );
                                          } else {
                                            toast.warning(
                                              "Jumlah item telah mencapai maksimum",
                                              {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "light",
                                              },
                                            );
                                          }
                                        }
                                      }}
                                    >
                                      +
                                    </button> */}
                                  </div>
                                </div>
                              </div>

                              {/* Item Subtotal */}
                              <div className="flex w-full flex-row items-center justify-between">
                                <p className="text-xs text-gray-400 lg:text-sm">
                                  Total Harga: &nbsp;
                                </p>
                                <span className="text-xs text-gray-400 lg:text-sm">
                                  {itemSubtotal.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Conflict Warning */}
                          {/* {hasConflict && (
                            <div className="flex flex-col items-start gap-0">
                              <p className="text-xs text-red-500">
                                ⚠️ Bookingan alat ini telah kadaluarsa
                                klik&nbsp;
                                <a
                                  href={`../store/${storeInfo.storeStrings}/${itemID}`}
                                  className="font-bold text-sky-600"
                                >
                                  di sini
                                </a>{" "}
                                untuk mengubah jadwal booking.
                              </p>

                              Remove Item Button
                              <button
                                onClick={() =>
                                  handleDecreaseItemAmount(
                                    itemID,
                                    cartArray,
                                    setCartArray,
                                  )
                                }
                                className="mt-2 rounded-md bg-red-600 px-2 py-1 text-xs text-white"
                              >
                                Hapus Item
                              </button>
                            </div>
                          )} */}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
