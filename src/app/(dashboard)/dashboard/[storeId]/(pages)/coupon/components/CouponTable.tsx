"use client";
import React, { FC } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { GlobalCouponType } from "@/app/lib/types/global_coupon_type";
import { getColumn } from "./Columns";
import CustomDataTable from "@/app/lib/components/CustomDataTable";

const CouponTable: FC<{ coupons: GlobalCouponType[] }> = ({ coupons }) => {
  const columns = getColumn();
  const table = useReactTable({
    data: coupons,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="flex flex-col gap-4 rounded-md border border-slate-400/50 bg-white p-4">
      <CustomDataTable table={table} columns={columns} />
    </div>
  );
};

export default CouponTable;
