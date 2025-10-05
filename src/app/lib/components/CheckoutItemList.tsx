import React from "react";
import { useCart } from "../../(root)/(pages)/cart/hooks/useCart";
import { useCartContext } from "@/app/lib/context/CartContext";
import { Store } from "lucide-react";
import Image from "next/image";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

const CheckoutItemList = () => {
  const { checkout } = useCartContext();

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
                  <Store />
                </span>
                <span className="subheader-custom font-semibold">
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
                  } = item;

                  return (
                    <div
                      key={itemID}
                      className="relative flex h-full w-full flex-row items-center justify-start gap-4 p-4 lg:gap-8"
                    >
                      <div className="flex w-1/4 flex-col gap-2">
                        <div className="relative h-[100px] w-[100px]">
                          <Image
                            fill
                            src={itemImage}
                            alt={itemImage}
                            className="aspect-square rounded-md object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex w-3/4 flex-col gap-1">
                        <h3 className="font-uppercase truncate text-sm font-semibold">
                          {itemName}
                        </h3>
                        <div className="flex w-full items-center justify-between gap-0 lg:flex-row">
                          <p className="text-xs text-gray-400 lg:text-sm">
                            Paket: &nbsp;
                          </p>
                          <span className="text-xs lg:text-sm">
                            {itemVariation.variationName}
                          </span>
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
