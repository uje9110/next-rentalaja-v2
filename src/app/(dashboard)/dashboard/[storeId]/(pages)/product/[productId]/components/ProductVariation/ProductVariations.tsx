import React, { FC } from "react";
import DataTable from "./data-table";
import { getColumns } from "./columns";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import { useParams } from "next/navigation";

const ProductVariations: FC<{ product: ClientStoreProductType }> = ({
  product,
}) => {
  const { storeId } = useParams();
  const sortedVariations = product.variationsDetails.sort(
    (variationA, variationB) => variationA.hoursValue - variationB.hoursValue,
  );
  return (
    <div className="max-h-fit min-h-32 w-full rounded-md border border-slate-400/50 bg-white p-2">
      <DataTable
        getColumns={getColumns}
        data={sortedVariations}
        storeId={storeId as string}
      />
    </div>
  );
};

export default ProductVariations;
