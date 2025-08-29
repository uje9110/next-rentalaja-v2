import { GlobalProductHandler } from "@/app/lib/utils/GlobalProductHandler";
import React from "react";
import ProductsSection from "./components/ProductsSection";
import ProductPageStickyBar from "./components/ProductStickyBar";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { GlobalCategoryHandler } from "@/app/lib/utils/GlobalCategoryHandler";
import { GlobalStoreHandler } from "@/app/lib/utils/GlobalStoreHandler";

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ searchParams }: ProductsPageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryHandler = QueryHandler.fromSearchParams(resolvedSearchParams);

  const { page, limit, sortBy, sortOrder } =
    queryHandler.getPaginationParams(5);

  const apiQueryString = queryHandler.toQueryString();

  const globalProduct =
    await GlobalProductHandler.getGlobalProducts(apiQueryString);

  const globalCategory =
    await GlobalCategoryHandler.getGlobalCategories(apiQueryString);

  const globalStore = await GlobalStoreHandler.getGlobalStores(apiQueryString);

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
