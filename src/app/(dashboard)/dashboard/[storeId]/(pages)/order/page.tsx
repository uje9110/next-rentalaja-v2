import React from "react";
import axios from "axios";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { OrderTable } from "./components/OrderTable";
import { columns } from "./components/Columns";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";

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

  const getOrders = async (): Promise<ClientStoreOrderType[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/order`,
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

  const orders = await getOrders();

  return (
    <div className="phone:px-2 lg:px-0">
      <OrderTable columns={columns} data={orders as ClientStoreOrderType[]} />
    </div>
  );
};

export default Page;
