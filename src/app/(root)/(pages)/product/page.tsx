import { GlobalProductHandler } from "@/app/lib/utils/api-call/GlobalProductHandler";
import React from "react";
import ProductsSection from "./components/ProductsSection";
import ProductPageStickyBar from "./components/ProductStickyBar";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { GlobalCategoryHandler } from "@/app/lib/utils/api-call/GlobalCategoryHandler";
import { GlobalStoreHandler } from "@/app/lib/utils/api-call/GlobalStoreHandler";

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ searchParams }: ProductsPageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryHandler = QueryHandler.fromSearchParams(resolvedSearchParams);

  const { sortBy } = queryHandler.getPaginationParams(5);

  const apiQueryString = queryHandler.toQueryString();

  const globalProduct = await GlobalProductHandler.getGlobalProducts({
    urlSearchParam: apiQueryString,
    isFromClient: false,
  });

  const globalCategory = await GlobalCategoryHandler.getGlobalCategories({
    urlSearchParam: apiQueryString,
    isFromClient: false,
  });

  const globalStore = await GlobalStoreHandler.getGlobalStores({
    urlSearchParam: apiQueryString,
    isFromClient: false,
  });

  return (
    <main className="bg-defaultBackground relative flex w-full flex-col items-center gap-4 pt-5 pb-4">
      <ProductPageStickyBar
        sortBy={sortBy}
        categories={globalCategory}
        stores={globalStore}
        searchParams={apiQueryString}
      />
      <ProductsSection products={globalProduct} />
    </main>
  );
};

export default page;
