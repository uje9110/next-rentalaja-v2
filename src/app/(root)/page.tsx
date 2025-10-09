export const dynamic = "force-dynamic";

import React from "react";
import HomepageCategoryButtons from "./components/HomepageCategoryButtons";
import ProductCardSlider from "./components/ProductCardSlider";
import { GlobalProductHandler } from "../lib/utils/GlobalProductHandler";

const Homepage = async () => {
  const globalProductBySales = await GlobalProductHandler.getGlobalProducts(
    "limit=10&page=1&sortBy=totalSales",
  );
  const globalProductByCreatedAt = await GlobalProductHandler.getGlobalProducts(
    "limit=10&page=1&sortBy=createdAt",
  );
  return (
    <main className="home-page bg-defaultBackground relative flex h-full w-full flex-col items-center gap-4 p-4 pb-40">
      <HomepageCategoryButtons />
      <div className="w-full lg:w-[60%]">
        {/* ALAT TERPOPULER */}
        <div className="flex w-full flex-col gap-2 lg:h-full lg:w-full lg:justify-between lg:self-center">
          <h2 className="text-lg font-semibold text-black">Alat Terpopuler</h2>
          <ProductCardSlider
            products={globalProductBySales}
            isLoading={false}
          />
        </div>

        {/* ALAT TERBARU */}
        <div className="flex w-full flex-col gap-2 lg:h-full lg:w-full lg:justify-between lg:self-center">
          <h2 className="text-lg font-semibold text-black">Alat Terbaru</h2>
          <ProductCardSlider
            products={globalProductByCreatedAt}
            isLoading={false}
          />
        </div>
      </div>
    </main>
  );
};

export default Homepage;
