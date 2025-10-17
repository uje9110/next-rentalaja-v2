"use client";
import React, { useState } from "react";
import { useAPIContext } from "../context/ApiContext";
import { useQuery } from "@tanstack/react-query";
import { GlobalCouponType } from "../types/global_coupon_type";
import axios from "axios";
import { Ticket } from "lucide-react";
import moment from "moment";

const CheckoutCoupon = () => {
  const { APIEndpoint } = useAPIContext();

  const { data: couponList = [] } = useQuery({
    queryKey: ["coouponList"],
    queryFn: async (): Promise<GlobalCouponType[] | []> => {
      try {
        const response = await axios.get(`${APIEndpoint}/global/coupon`);
        return response.data.json;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  console.log(couponList);

  return (
    <div className="border-accent-custom relative flex w-full flex-col overflow-hidden rounded-md bg-white shadow-sm">
      <div className="flex items-center justify-between bg-sky-100 px-4 py-2 text-sm font-semibold">
        <h3 className="phone:text-sm">Kupon</h3>
      </div>
      <div className="flex flex-col gap-2 px-4 py-4">
        {couponList.length < 1 ? (
          <p>Tidak ada kupon yang tersedia</p>
        ) : (
          couponList?.map((coupon) => {
            return <CouponItem key={coupon.couponName} couponData={coupon} />;
          })
        )}
      </div>
    </div>
  );
};

export default CheckoutCoupon;

const CouponItem = ({ couponData }: { couponData: GlobalCouponType }) => {
  const couponValueHelper = (couponValue: number, couponType: string) => {
    if (couponType === "fixed") {
      return `Diskon Rp. ${couponValue}`;
    } else if (couponType === "percentage") {
      return `Diskon ${couponValue}% dari total sewa`;
    }
  };
  return (
    <div className="border-accent-custom flex w-full gap-2 rounded-md border">
      <div className="flex w-2/3 flex-col justify-center gap-0 px-2 py-1">
        <p className="text-sm font-medium">{couponData.couponName}</p>
        <p className="text-xs text-gray-500">{couponData.couponDesc}</p>
        <p className="text-xs">
          {couponValueHelper(couponData.couponValue, couponData.couponType)}
        </p>
      </div>
      <div className="border-accent-custom flex w-1/3 flex-col items-center justify-center border-0 border-l">
        <Ticket size={32} strokeWidth={1} />
        <p className="flex flex-col text-[10px] text-gray-500">
          <span>Berlaku s/d</span>{" "}
          <span>{moment(couponData.couponExpire).format("DD MMM YYYY")}</span>
        </p>
      </div>
    </div>
  );
};
