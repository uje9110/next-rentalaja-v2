import React from "react";
import { useCartContext } from "@/app/lib/context/CartContext";
import { Store, Trash } from "lucide-react";
import Image from "next/image";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import moment from "moment";
import { ClientCartType } from "../types/client_cart_types";

type CheckoutItemListProps = {
  isUsingDashboard?: boolean;
};

const CheckoutItemList = ({
  isUsingDashboard = false,
}: CheckoutItemListProps) => {
  const { checkout, setCheckout } = useCartContext();

  // DELETE ITEM IN DASHBOARD
  const deleteItemFromCheckout = (storeId: string, itemId: string) => {
    const newCheckoutCarts = checkout.checkoutCartItems
      .map(({ store, items, subtotal, total }) => {
        if (store.storeId === storeId) {
          const filteredItems = items.filter((item) => item.itemID !== itemId);
          if (filteredItems.length === 0) return null;
          return { store, items: filteredItems, subtotal, total };
        }
        return { store, items, subtotal, total };
      })
      .filter((storeCart): storeCart is ClientCartType => storeCart !== null);

    setCheckout((prev) => {
      return {
        ...prev,
        checkoutCartItems: newCheckoutCarts,
      };
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {checkout.checkoutCartItems.length < 1 ? (
        <div className="border-accent-custom flex h-24 w-full items-center justify-center rounded-md bg-white text-xs shadow-sm">
          Belum ada item yang ditambahkan
        </div>
      ) : (
        checkout.checkoutCartItems.map(({ store, items }) => {
          return (
            <div
              key={store.storeId}
              className="border-accent-custom w-full rounded-md bg-white shadow-sm"
            >
              <p className="flex items-center gap-2 border-b border-sky-200 bg-sky-100 p-4 py-2">
                <span className="text-colorSecondary">
                  <Store className="phone:w-4" />
                </span>
                <span className="subheader-custom phone:text-sm font-semibold">
                  {store.storeName}
                </span>
              </p>
              <div>
                {items.map((item) => {
                  const {
                    itemName,
                    itemID,
                    itemAmount,
                    itemVariation,
                    itemSubtotal,
                    itemImage,
                    rentalDetails,
                  } = item;

                  return (
                    <div
                      key={itemID}
                      className="relative flex h-full w-full flex-row items-center justify-between gap-4 p-4 lg:gap-8"
                    >
                      <div className="relative aspect-square flex-1">
                        <Image
                          fill
                          src={itemImage}
                          alt={itemImage}
                          className="aspect-square rounded-md object-cover"
                        />
                      </div>
                      <div className="flex w-3/4 flex-col gap-1">
                        <div className="flex w-full items-center justify-between">
                          <h3 className="font-uppercase truncate text-sm font-semibold">
                            {itemName}
                          </h3>
                          {isUsingDashboard && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deleteItemFromCheckout(
                                    item.storeDetail.storeId,
                                    itemID,
                                  );
                                }}
                                className="border-sm flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-red-500 px-2 py-1 text-xs font-semibold text-white"
                              >
                                <Trash size={14} strokeWidth={3} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex w-full flex-row items-center justify-between">
                          <p className="text-xs text-gray-400 lg:text-sm">
                            Jumlah Item: &nbsp;
                          </p>
                          <div className="flex flex-row">
                            <div className="flex flex-row gap-2">
                              <p className="text-sm">{itemAmount}</p>
                            </div>
                          </div>
                        </div>
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
                        <div className="flex w-full flex-row items-center justify-between">
                          <p className="text-xs text-gray-400 lg:text-sm">
                            Total Harga: &nbsp;
                          </p>
                          <span className="text-xs lg:text-sm">
                            {CurrencyHandlers.changeToLocaleCurrency(
                              itemSubtotal,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CheckoutItemList;
