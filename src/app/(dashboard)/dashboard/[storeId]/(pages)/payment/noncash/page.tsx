import axios from "axios";
import React from "react";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { NoncashPaymentTable } from "./components/NoncashPaymentTable";
import { XenditTransaction } from "@/app/lib/types/xendit_type";

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

  const getNoncashPayments = async (): Promise<{
    data: XenditTransaction[];
    link: string[];
    has_more: boolean;
    length: number;
  }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/payment/xendit`,
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
        data: [],
        link: [],
        has_more: false,
        length: 0,
      };
    }
  };

  const cashPayments = await getNoncashPayments();
  
  return (
    <div className="phone:m-0 phone:px-2 flex flex-col gap-4 rounded-md border-[1px] border-slate-400/50 bg-white p-4 shadow-sm">
      <NoncashPaymentTable payments={cashPayments.data} />
    </div>
  );
};

export default Page;
