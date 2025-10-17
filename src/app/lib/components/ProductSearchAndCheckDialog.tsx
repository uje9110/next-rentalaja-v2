"use client";
import { DateTimePicker } from "@/app/lib/components/DateTimePicker";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlobalCategoryHandler } from "@/app/lib/utils/api-call/GlobalCategoryHandler";
import { CalendarIcon, LibraryBig, Store, Tag } from "lucide-react";
import ProductFilterSelect from "../../(root)/(pages)/product/components/ProductFilter";
import { GlobalCategoryType } from "@/app/lib/types/global_category_types";
import { useRouter } from "next/navigation";
import { GlobalStoreHandler } from "@/app/lib/utils/api-call/GlobalStoreHandler";
import { ByCityGlobalStoreType } from "@/app/lib/types/global_store_types";
import moment from "moment-timezone";

const SearchAndCheckDialog = ({
  isUsingDashboard = false,
  storeId,
}: {
  storeId?: string;
  isUsingDashboard?: boolean;
}) => {
  const router = useRouter();

  // ✅ Use string instead of Date
  const [dateStart, setDateStart] = useState<Date>();
  const [dateEnd, setDateEnd] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<GlobalCategoryType[]> =>
      GlobalCategoryHandler.getGlobalCategories({ isFromClient: true }),
  });

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: async (): Promise<ByCityGlobalStoreType[]> =>
      GlobalStoreHandler.getGlobalStores({ isFromClient: true }),
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (dateStart) {
      // dateStart is already "DD-MM-YYYY HH:mm:ss"
      const isoStart = moment(dateStart, "DD-MM-YYYY HH:mm:ss").tz("Asia/Jakarta").format(
        "YYYY-MM-DDTHH:mm:ss",
      );
      params.set("bookingStart", isoStart);
    }

    if (dateEnd) {
      const isoEnd = moment(dateEnd, "DD-MM-YYYY HH:mm:ss").tz("Asia/Jakarta").format(
        "YYYY-MM-DDTHH:mm:ss",
      );
      params.set("bookingEnd", isoEnd);
    }

    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedStore) params.set("storeId", selectedStore);

    if (isUsingDashboard) {
      params.set("storeId", storeId as string);
    }

    const endpoint = isUsingDashboard
      ? `/dashboard/${storeId}/product/check?${params.toString()}`
      : `/product/search?${params.toString()}`;

    router.push(endpoint);
  };

  return (
    <div className="flex flex-col gap-0">
      <div className="phone:gap-2 flex flex-col gap-4 lg:gap-4">
        <DateTimePicker date={dateStart} setDate={setDateStart} />
        <DateTimePicker date={dateEnd} setDate={setDateEnd} />

        <ProductFilterSelect
          value={selectedCategory}
          placeholder="Pilih Kategori"
          icon={<LibraryBig size={15} className="text-colorSecondary" />}
          options={
            categories
              ?.sort((a, b) => a.title.localeCompare(b.title))
              .map((c) => ({ label: c.title, value: c._id })) ?? []
          }
          onChange={(val) => setSelectedCategory(val)}
        />

        {!isUsingDashboard && (
          <ProductFilterSelect
            value={selectedStore}
            placeholder="Pilih Toko"
            icon={<Store size={15} className="text-colorSecondary" />}
            options={
              stores?.flatMap((s) =>
                s.cityStores?.map((st) => ({
                  label: st.storeName,
                  value: st.storeId,
                })),
              ) ?? []
            }
            onChange={(val) => setSelectedStore(val)}
          />
        )}
      </div>

      <div className="bg-muted/30 text-muted-foreground mt-4 space-y-2 rounded-lg border border-dashed p-3 text-sm">
        {!dateStart && !dateEnd && !selectedCategory && !selectedStore && (
          <p className="phone:text-xs lg:phone:sm w-full text-center">
            Isi filter terlebih dahulu
          </p>
        )}
        {dateStart && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-primary h-4 w-4" />
            <p>
              <span className="text-foreground font-medium">Mulai:</span>{" "}
              {moment(dateStart).tz("Asia/Jakarta").format("DD MMM YYYY")}
            </p>
          </div>
        )}
        {dateEnd && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-primary h-4 w-4" />
            <p>
              <span className="text-foreground font-medium">Akhir:</span>{" "}
              {moment(dateEnd).tz("Asia/Jakarta").format("DD MMM YYYY")}
            </p>
          </div>
        )}
        {selectedCategory && (
          <div className="flex items-center gap-2">
            <Tag className="text-primary h-4 w-4" />
            <p>
              <span className="text-foreground font-medium">Kategori:</span>{" "}
              {selectedCategory}
            </p>
          </div>
        )}
        {selectedStore && (
          <div className="flex items-center gap-2">
            <Store className="text-primary h-4 w-4" />
            <p>
              <span className="text-foreground font-medium">Toko:</span>{" "}
              {selectedStore}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleSearch}
        className="phone:text-xs lg:phone:sm mt-4 rounded-md bg-sky-500 px-4 py-2 font-semibold text-white"
      >
        Cari alat
      </button>
    </div>
  );
};

export default SearchAndCheckDialog;
