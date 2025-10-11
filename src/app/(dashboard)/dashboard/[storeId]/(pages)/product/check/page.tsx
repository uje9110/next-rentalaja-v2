// app/product/search/page.tsx
import React from "react";
import { QueryHandler } from "@/app/lib/utils/QueryHandler"; // adjust path if needed
import { StoreProductHandler } from "@/app/lib/utils/api-call/StoreProductHandler";
import SearchFilterInfo from "@/app/lib/components/ProductSearchFilterInfo";
import ProductSearchResult from "@/app/lib/components/ProductSearchResult";

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  // Initialize QueryHandler directly from Next.js searchParams
  const resolvedSearchParams = await searchParams;

  const queryHandler = QueryHandler.fromSearchParams(resolvedSearchParams);

  // Example usage
  const filters = queryHandler.getFilterParams([
    "bookingStart",
    "bookingEnd",
    "categoriesIds",
    "storeId",
  ]);

  const apiQueryString = queryHandler.toQueryString();

  const products = await StoreProductHandler.getProductSearch({
    urlSearchParam: apiQueryString,
    isFromClient: false,
  });

  return (
    <main className="relative flex h-screen w-full flex-col items-center gap-4 pt-5 pb-4">
      <h1 className="text-lg font-bold">Hasil Pencarian</h1>
      <div className="phone:px-2 flex w-full flex-col gap-4 lg:px-0">
        <SearchFilterInfo filters={filters} />
        <ProductSearchResult
          products={products}
          searchFilter={filters}
          isUsingDashboard={true}
        />
      </div>
    </main>
  );
};

export default SearchPage;
