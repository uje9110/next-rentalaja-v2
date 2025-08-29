import { GlobalProductHandler } from "@/app/lib/utils/GlobalProductHandler";
import React from "react";
import GlobalProductSection from "./components/GlobalProductSection";
import StoreProductSection from "./components/StoreProductSection";

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
};

const page = async ({ params }: ProductDetailPageProps) => {
  const { productId } = await params;
  const globalProduct =
    await GlobalProductHandler.getSingleGlobalProduct(productId);
  return (
    <main className="single-product-page bg-defaultBackground relative flex h-full w-full flex-col items-center gap-4 pb-40 lg:p-4 lg:pb-80 phone:pb-20">
      <GlobalProductSection globalProduct={globalProduct} />
      <StoreProductSection
        globalProduct={globalProduct}
        productId={productId}
      />
    </main>
  );
};

export default page;
