"use client";
import { ClientGlobalProductType } from "@/app/lib/types/global_product_types";
import { Store } from "lucide-react";
import React, { FC } from "react";
import { useProductStoreSelection } from "../hooks/useProductStoreSelection";

type SelectProductStoreProps = {
  globalProduct: ClientGlobalProductType;
  handleSelectStore: (storeId: string) => void;
};

const SelectProductStore: FC<SelectProductStoreProps> = ({
  globalProduct,
  handleSelectStore,
}) => {
  return (
    <div className="mx-4 flex w-full flex-col gap-3 lg:w-[60%] lg:p-0">
      <div className="flex items-center gap-2">
        <Store size={18} />
        <h3 className="subheader-custom">Pilih cabang</h3>
      </div>
      <div className="flex w-full flex-row gap-4">
        {globalProduct.availableStores.map((item) => {
          const { storeName, storeId, storeAddress } = item;
          return (
            <div className="relative h-20 w-[calc(50%)]" key={storeId}>
              <input
                id={storeId}
                name="selectedStore"
                type="radio"
                className="peer sr-only"
                value={storeId}
                onChange={(e) => {
                  handleSelectStore(e.target.value);
                }}
              />
              <label
                htmlFor={storeId}
                className="border-accent-custom flex cursor-pointer flex-col gap-2 rounded-md bg-white p-2 shadow-sm peer-checked:border-2 peer-checked:bg-sky-100"
              >
                <p className="text-sm font-medium">{storeName}</p>
                <p className="text-xs font-light">{storeAddress?.address}</p>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectProductStore;
