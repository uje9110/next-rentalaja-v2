import React, { FC } from "react";
import DataTable from "./data-table";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import { useParams } from "next/navigation";

const ProductStocks: FC<{ product: ClientStoreProductType }> = ({
  product,
}) => {
  const { storeId } = useParams();

  return (
    <div className="max-h-fit min-h-32 w-full rounded-md border border-slate-400/50 bg-white p-2">
      <DataTable
        stocksData={product.stocksDetails}
        storeId={storeId as string}
      />
    </div>
  );
};

export default ProductStocks;
