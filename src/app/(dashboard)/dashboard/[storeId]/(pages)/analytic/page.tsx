import React from "react";
import axios from "axios";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import {
  ClientSalesAnalyticPerPeriodeType,
  ClientSalesAnalyticPerProductType,
  ClientSalesAnalyticPerUserType,
} from "@/app/lib/types/store_sales_types";
import SalesAnalyticPerProductTable from "./components/SalesAnalyticPerProductTable";
import SalesAnalyticPerUserTable from "./components/SalesAnalyticPerUserTable";
import SalesAnalyticGraphAndTableFilter from "./components/SalesAnalyticGraphAndTableFilter";
import SalesAnalyticPerPeriodeGraph from "./components/SalesAnalyticPerPeriodeGraph";

type SalesAnalyticResponseType = {
  salesAnalyticPerPeriode: ClientSalesAnalyticPerPeriodeType[] | [];
  salesAnalyticPerProduct: ClientSalesAnalyticPerProductType[] | [];
  salesAnalyticPerUser: ClientSalesAnalyticPerUserType[] | [];
};

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

  const getSalesAnalytic = async (): Promise<SalesAnalyticResponseType> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/analytic`,
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
      return {
        salesAnalyticPerPeriode: [],
        salesAnalyticPerProduct: [],
        salesAnalyticPerUser: [],
      };
    }
  };

  const salesAnalytic = await getSalesAnalytic();

  return (
    <div className="phone:w-[calc(100vw-1.5rem)] phone:m-2 m-2 flex flex-col gap-4 lg:m-0 lg:w-full">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-400/50 bg-white p-4 shadow-sm">
        <SalesAnalyticGraphAndTableFilter />
        <SalesAnalyticPerPeriodeGraph
          analytic={salesAnalytic.salesAnalyticPerPeriode}
        />
      </div>
      <div className="phone:flex-col flex w-full flex-row gap-4 lg:flex lg:flex-row">
        <SalesAnalyticPerProductTable
          salesAnalyticPerProduct={salesAnalytic.salesAnalyticPerProduct}
        />
        <SalesAnalyticPerUserTable
          salesAnalyticPerUser={salesAnalytic.salesAnalyticPerUser}
        />
      </div>
    </div>
  );
};

export default Page;
