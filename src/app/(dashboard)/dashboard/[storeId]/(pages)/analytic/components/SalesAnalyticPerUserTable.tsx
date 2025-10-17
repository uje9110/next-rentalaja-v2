"use client";
import CustomDataTable from "@/app/lib/components/CustomDataTable";
import { ClientSalesAnalyticPerUserType } from "@/app/lib/types/store_sales_types";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { User } from "lucide-react";
import React from "react";

const getColumns = (): ColumnDef<ClientSalesAnalyticPerUserType>[] => {
  return [
    {
      accessorKey: "number",
      header: () => {
        return <span className="text-xs">No.</span>;
      },
      cell: ({ row }) => {
        const value = row.index + 1;
        return <span className="text-center text-xs">{value}</span>;
      },
    },
    {
      accessorKey: "customerName",
      header: () => {
        return <span className="text-xs">Nama Cust.</span>;
      },
      cell: ({ row }) => {
        const value = `${row.original.firstName} ${row.original.lastName}`;
        const formatted = value
          .toLowerCase()
          .split(" ")
          .map((strings) =>
            strings
              .split("")
              .map((string, index) =>
                index === 0 ? string.toUpperCase() : string,
              )
              .join(""),
          )
          .join(" ");
        return <span className="text-xs">{formatted}</span>;
      },
    },
    {
      accessorKey: "totalRent",
      header: () => {
        return <span className="text-xs">Total Sewa</span>;
      },
      cell: ({ row }) => {
        const value = row.original.totalRenting;
        return <span className="text-center text-xs">{value}</span>;
      },
    },
  ];
};

const SalesAnalyticPerUserTable = ({
  salesAnalyticPerUser,
}: {
  salesAnalyticPerUser: ClientSalesAnalyticPerUserType[];
}) => {
  const columns = getColumns();
  const table = useReactTable({
    columns: columns,
    data: salesAnalyticPerUser,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="phone:w-full flex w-1/2 flex-col gap-4 rounded-md border border-slate-400/50 bg-white p-4 shadow-sm">
      <div className="flex flex-row items-center justify-start gap-2">
        <p className="flex items-center justify-center rounded-md bg-teal-200 p-1 text-white">
          <User size={32} strokeWidth={2} />
        </p>
        <div className="flex flex-col gap-0">
          <p className="text-sm font-semibold">Performa Produk Teratas</p>
          {/* <p className="text-xs text-slate-500">{`Periode ${moment(date?.from). .tz("Asia/Jakarta").format("DD MMMM YYYY")} sampai ${moment(date?.to). .tz("Asia/Jakarta").format("DD MMMM YYYY")}`}</p> */}
        </div>
      </div>
      <div className="rounded-sm border border-slate-400/50">
        <CustomDataTable table={table} columns={columns} />
      </div>
    </div>
  );
};

export default SalesAnalyticPerUserTable;
