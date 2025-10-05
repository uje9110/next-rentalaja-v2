import React from "react";
import axios from "axios";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { ClientStoreSalesType } from "@/app/lib/types/store_sales_types";
import SalesTable from "./components/SalesTable";

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

  const getSales = async (): Promise<ClientStoreSalesType[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/sales`,
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

  const sales = await getSales();

  return <SalesTable sales={sales} />;
};

export default Page;
