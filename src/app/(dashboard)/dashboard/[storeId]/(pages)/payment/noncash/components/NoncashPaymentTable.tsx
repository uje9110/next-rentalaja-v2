"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { FC } from "react";
import { CalendarCheck, CalendarIcon, FileDigit } from "lucide-react";
import { getColumns } from "./Columns";
import { XenditTransaction } from "@/app/lib/types/xendit_type";
import {
  CustomTableFilter,
  CustomTableFilterProps,
} from "@/app/lib/components/CustomTableFilters";
import CustomDataTable from "@/app/lib/components/CustomDataTable";
import moment from "moment-timezone";

interface NoncashPaymentTableProps {
  payments: XenditTransaction[];
}

export const NoncashPaymentTable: FC<NoncashPaymentTableProps> = ({
  payments,
}) => {
  const columns = getColumns();
  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const filterData = [
    {
      filterType: "select",
      filterIcon: CalendarCheck,
      filterName: "dateBy",
      filterTitle: "Filter Tanggal",
      filterValues: [{ label: "Tanggal Dibuat", value: "created" }],
      defaultValue: "created",
    },
    {
      filterType: "dateTimePicker",
      filterIcon: CalendarIcon,
      filterName: "dateRange",
      filterTitle: "Tanggal Sales",
      defaultValue: {
        dateStart: moment(new Date()).tz("Asia/Jakarta").format("YYYY-MM-DD:00:00:00"),
        dateEnd: moment(new Date()).tz("Asia/Jakarta").format("YYYY-MM-DD:23:59:00"),
      },
    },
    {
      filterType: "select",
      filterIcon: FileDigit,
      filterName: "limit",
      filterTitle: "Limit Order",
      filterValues: [
        { label: "25", value: "25" },
        { label: "50", value: "50" },
        { label: "75", value: "75" },
        { label: "100", value: "100" },
        { label: "200", value: "200" },
        { label: "300", value: "300" },
        { label: "400", value: "400" },
        { label: "500", value: "500" },
      ],
    },
  ] as const satisfies CustomTableFilterProps[];

  return (
    <div className="phone:w-[calc(100vw-1.5rem)] flex flex-col gap-4 lg:w-full">
      <CustomTableFilter
        filterData={filterData}
        pageTitle="Filter Payment"
        table={table}
      />
      <div className="rounded-md border border-slate-400/50">
        <CustomDataTable table={table} columns={columns} />
      </div>
    </div>
  );
};
