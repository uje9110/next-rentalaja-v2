import React from "react";
import axios from "axios";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { GlobalCouponType } from "@/app/lib/types/global_coupon_type";
import CouponTable from "./components/CouponTable";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ storeId: string }>;
}) => {
  const resolvedSearchParam = await searchParams;
  const Query = QueryHandler.fromSearchParams(resolvedSearchParam);

  const getCoupons = async (): Promise<GlobalCouponType[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/global/coupon`,
        {
          params: Query.getParams(),
        },
      );
      return response.data.json;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const coupons = await getCoupons();

  return <CouponTable coupons={coupons} />;
};

export default Page;
