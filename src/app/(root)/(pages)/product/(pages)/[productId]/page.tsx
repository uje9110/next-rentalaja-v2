import { GlobalProductHandler } from "@/app/lib/utils/api-call/GlobalProductHandler";
import React from "react";
import GlobalProductSection from "./components/GlobalProductSection";
import StoreProductSection from "./components/StoreProductSection";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ params, searchParams }: ProductDetailPageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryHandler = QueryHandler.fromSearchParams(resolvedSearchParams);

  // Example usage
  const filters = queryHandler.getFilterParams([
    "bookingStart",
    "bookingEnd",
    "storeId",
  ]);

  const { productId } = await params;
  const globalProduct = await GlobalProductHandler.getSingleGlobalProduct({
    productId,
    isFromClient: false,
  });
  return (
    <main className="single-product-page bg-defaultBackground phone:pb-20 relative flex h-full flex-col items-center gap-4 pb-40 lg:p-4 lg:pb-80">
      <GlobalProductSection globalProduct={globalProduct} />
      <StoreProductSection
        globalProduct={globalProduct}
        productId={productId}
        defaultValues={filters}
      />
    </main>
  );
};

export default page;
