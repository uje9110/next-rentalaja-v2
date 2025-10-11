import axios from "axios";
import React from "react";
import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import CashPaymentTable from "./components/CashPaymentTable";
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

  const getCashPayments = async (): Promise<ClientStoreOrderPaymentType[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/payment`,
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

  const cashPayments = await getCashPayments();

  return (
    <div className="phone:m-0 phone:px-2 m-2 flex flex-col gap-4 rounded-md border-[1px] border-slate-400/50 bg-white p-4 shadow-sm">
      <CashPaymentTable payments={cashPayments} />
    </div>
  );
};

export default Page;
