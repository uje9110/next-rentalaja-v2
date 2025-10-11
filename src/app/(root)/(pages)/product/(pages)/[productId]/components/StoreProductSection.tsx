"use client";
import React, { FC } from "react";
import { useProductStoreSelection } from "../hooks/useProductStoreSelection";
import SelectProductStore from "./SelectProductStore";
import { ClientGlobalProductType } from "@/app/lib/types/global_product_types";
import ProductBookingSection from "./ProductBookingSection";
import { useQuery } from "@tanstack/react-query";
import { StoreProductHandler } from "@/app/lib/utils/StoreProductHandler";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";

type StoreProductSectionProp = {
  globalProduct: ClientGlobalProductType;
  productId: string;
  defaultValues: {
    bookingStart?: string;
    bookingEnd?: string;
    storeId?: string;
  };
};

const StoreProductSection: FC<StoreProductSectionProp> = ({
  globalProduct,
  productId,
  defaultValues,
}) => {
  const { selectedStore, handleSelectStore } = useProductStoreSelection(
    defaultValues.storeId,
  );

  const { data: storeProduct } = useQuery({
    queryKey: ["storeProduct", selectedStore],
    queryFn: async (): Promise<ClientStoreProductType | null> => {
      try {
        const response = await StoreProductHandler.getSingleStoreProduct(
          productId,
          selectedStore as string,
        );
        return response;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: !!selectedStore,
  });

  return (
    <div className="flex w-full flex-col lg:flex lg:w-[60%] lg:gap-5">
      {/* ----- Pilih Cabang ----- */}
      <SelectProductStore
        selectedStore={selectedStore}
        globalProduct={globalProduct}
        handleSelectStore={handleSelectStore}
      />

      {storeProduct ? (
        <div className="flex flex-col gap-6">
          <ProductBookingSection
            storeProduct={storeProduct}
            defaultValue={{
              bookingStart: defaultValues.bookingStart,
              bookingEnd: defaultValues.bookingEnd,
            }}
          />
        </div>
      ) : (
        <div className="border-accent-custom mx-4 mt-2 flex items-center justify-center rounded-md border border-dashed bg-white p-2 shadow-sm lg:mx-0">
          <p className="phone:text-xs text-center text-sm text-gray-500">
            Silahkan pilih cabang terlebih dahulu untuk memboking
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreProductSection;
