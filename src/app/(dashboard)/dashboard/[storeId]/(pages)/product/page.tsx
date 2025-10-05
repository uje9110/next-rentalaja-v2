import React from "react";
import axios from "axios";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import ProductTable from "./components/ProductTable";

const Page = async ({
  params,
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const resolvedSearchParam = await searchParams;
  const Query = QueryHandler.fromSearchParams(resolvedSearchParam);

  const getProducts = async (): Promise<ClientStoreProductType[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/product`,
        {
          headers: {
            "x-store-id": storeId,
          },
          params: Query.getParams(),
        },
      );
      return response.data.json;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const products = await getProducts();

  return (
    <ProductTable
      storeId={storeId}
      data={products as ClientStoreProductType[]}
    />
  );
};

export default Page;
