"use client";
import {
  CartBookingConflictsType,
  CartBookingValidationLoadingType,
  ClientCartType,
} from "@/app/lib/types/client_cart_types";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { Loader2, Pencil, Store, Trash } from "lucide-react";
import moment from "moment-timezone";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CartItemProps = {
  bookingConflicts: CartBookingConflictsType;
  bookingValidationLoading: CartBookingValidationLoadingType;
  cart: ClientCartType[];
  removeItemFromCart: (itemId: string, isItemExistInCheckout: boolean) => void;
  handleAddCartItemToCheckout: (orderItemData: StoreOrderItemType) => void;
  checkIsItemAlreadyExistInCheckout: (
    orderItemData: StoreOrderItemType,
  ) => boolean;
};

export const CartItem: React.FC<CartItemProps> = ({
  bookingConflicts,
  bookingValidationLoading,
  cart,
  removeItemFromCart,
  handleAddCartItemToCheckout,
  checkIsItemAlreadyExistInCheckout,
}) => {
  const router = useRouter();

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
                  rentalDetails,
                  //   availableStock,
                } = item;

                // Check if item exists in checkout
                const isItemExistInCheckout =
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
                          checked={isItemExistInCheckout}
                          onChange={() => handleAddCartItemToCheckout(item)}
                          disabled={hasConflict} // Disable checkbox if conflict exists
                        />

                        {/* Item Image */}
                        <div className="relative flex h-20 w-20 flex-col gap-2">
                          <Image
                            fill
                            src={itemImage}
                            alt={itemImage}
                            className="aspect-square rounded-md border-2 object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex w-2/3 flex-col gap-1">
                          {/* Item Name */}
                          <div className="flex w-full items-center justify-between">
                            <h3 className="font-uppercase phone:text-xs truncate text-lg font-semibold">
                              {itemName}
                            </h3>
                            <div className="flex flex-row gap-2">
                              <button
                                className="rounded-sm bg-red-500 px-1 text-[10px] font-semibold text-white"
                                onClick={() =>
                                  removeItemFromCart(
                                    itemID,
                                    isItemExistInCheckout,
                                  )
                                }
                              >
                                <Trash className="phone:w-4 lg:w-6" />
                              </button>
                              <button
                                className="rounded-sm bg-green-500 px-1 text-[10px] font-semibold text-white"
                                onClick={() =>
                                  router.push(`/product/${itemID}`)
                                }
                              >
                                <Pencil className="phone:w-4 lg:w-6" />
                              </button>
                            </div>
                          </div>

                          {hasConflict ? null : (
                            <div className="flex w-full flex-col gap-1">
                              {/* Item Amount */}
                              <div className="flex w-full flex-row items-center justify-between">
                                <p className="phone:text-[10px] text-xs font-medium text-gray-400 lg:text-sm">
                                  Jumlah Item: &nbsp;
                                </p>
                                <div className="flex flex-row">
                                  <div className="flex flex-row gap-2">
                                    <span className="phone:text-[10px] text-xs font-medium text-gray-400 lg:text-sm">
                                      {itemAmount}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Item Subtotal */}
                              <div className="flex w-full flex-row items-center justify-between">
                                <p className="phone:text-[10px] text-xs font-medium text-gray-400 lg:text-sm">
                                  Total Harga: &nbsp;
                                </p>
                                <span className="phone:text-[10px] text-xs font-medium text-gray-400 lg:text-sm">
                                  {itemSubtotal.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                  })}
                                </span>
                              </div>

                              {/* Variation Details */}
                              <div className="phone:gap-0 flex flex-col gap-0 lg:gap-1">
                                <div className="flex w-full items-center justify-between lg:flex-row">
                                  <p className="phone:text-[10px] text-xs font-medium text-gray-400 lg:text-sm">
                                    Paket: &nbsp;
                                  </p>
                                  <div className="phone:text-[10px] text-xs font-medium text-gray-400 lg:text-sm">
                                    <p>{itemVariation.variationName}</p>
                                  </div>
                                </div>

                                <div className="flex w-full items-center justify-between lg:flex-row">
                                  <p className="text-[8px] text-gray-400 lg:text-sm">
                                    Mulai: &nbsp;
                                  </p>
                                  <div className="text-[8px] text-gray-400 lg:text-sm">
                                    {moment(rentalDetails.rentalStartInLocaleMs)
                                      .tz("Asia/Jakarta")
                                      .format("DD MMM YYYY HH:mm")}
                                  </div>
                                </div>

                                <div className="flex w-full items-center justify-between lg:flex-row">
                                  <p className="text-[8px] text-gray-400 lg:text-sm">
                                    Selesai: &nbsp;
                                  </p>
                                  <div className="text-[8px] text-gray-400 lg:text-sm">
                                    {moment(rentalDetails.rentalEndInLocaleMs)
                                      .tz("Asia/Jakarta")
                                      .format("DD MMM YYYY HH:mm")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Conflict Warning */}
                          {hasConflict && (
                            <div className="flex flex-col items-start gap-0">
                              <p className="text-xs text-red-500">
                                ⚠️ Bookingan alat ini telah kadaluarsa
                                klik&nbsp;
                                <a
                                  href={`../store/${store.storeStrings}/${itemID}`}
                                  className="font-bold text-sky-600"
                                >
                                  di sini
                                </a>{" "}
                                untuk mengubah jadwal booking.
                              </p>
                              {/* <button
                                onClick={() =>
                                  removeItemFromCart(
                                    itemID,
                                    isItemExistInCheckout,
                                  )
                                }
                                className="mt-2 rounded-md bg-red-600 px-2 py-1 text-xs text-white"
                              >
                                Hapus Item
                              </button> */}
                            </div>
                          )}
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
