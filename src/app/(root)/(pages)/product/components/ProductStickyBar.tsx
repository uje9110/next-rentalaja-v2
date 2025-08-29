"use client";

import clsx from "clsx";
import ProductFilterSelect from "./ProductFilter";
import { LibraryBig, Store } from "lucide-react";
import { useIsMobile } from "@/app/(root)/hooks/useIsMobile";
import { SortByFilter } from "../constants/ProductSortByFilters";
import { GlobalCategoryType } from "@/app/lib/types/global_category_types";
import { ByCityGlobalStoreType } from "@/app/lib/types/global_store_types";
import { useUpdateSearchParam } from "@/app/(root)/hooks/useUpdateSearchParam";
import { useSticky } from "@/app/(root)/hooks/useSticky";

type ProductPageStickyBarProps = {
  sortBy: string | null;
  searchParams: string;
  categories: GlobalCategoryType[];
  stores: ByCityGlobalStoreType[];
};

export default function ProductPageStickyBar({
  sortBy,
  searchParams,
  categories,
  stores,
}: ProductPageStickyBarProps) {
  const isMobile = useIsMobile();
  const updateSearchParam = useUpdateSearchParam();
  const { ref: stickyBarRef, isSticky } = useSticky<HTMLDivElement>(); // adjust offset for top nav

  const resolvedURLSearchParam = new URLSearchParams(searchParams);

  return (
    <div
      ref={stickyBarRef}
      className={`${!isMobile ? "top-5 w-[59%] border-none" : "phone:w-[94%] top-18 border border-slate-400/50"} sticky z-40 flex h-full flex-col items-center gap-4 overflow-hidden rounded-lg bg-white pt-2 shadow-xl transition-all lg:top-24`}
    >
      <div className="flex w-[95%] flex-row gap-2">
        <ProductFilterSelect
          value={resolvedURLSearchParam.get("categoriesIds") || ""}
          placeholder="Pilih Kategori"
          icon={<LibraryBig size={15} className="text-colorSecondary" />}
          options={categories.map((c) => ({ label: c.title, value: c._id }))}
          onChange={(val) => updateSearchParam("categoriesIds", val)}
        />
        <ProductFilterSelect
          value={resolvedURLSearchParam.get("availableIn") || ""}
          placeholder="Pilih Toko"
          icon={<Store size={15} className="text-colorSecondary" />}
          options={stores.flatMap((s) =>
            s.cityStores.map((st) => ({
              label: st.storeName,
              value: st.storeId,
            })),
          )}
          onChange={(val) => updateSearchParam("availableIn", val)}
        />
      </div>
      <div className="flex w-full justify-between">
        {SortByFilter.map(({ name, value }) => (
          <div
            key={name}
            className={clsx(
              "w-full border-b-2 pb-2 text-center text-sm",
              sortBy === value && "border-teal-400",
            )}
          >
            <label htmlFor={value}>{name}</label>
            <input
              id={value}
              type="radio"
              name="sortBy"
              value={value}
              onChange={() => updateSearchParam("sortBy", value)}
              className="hidden"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
