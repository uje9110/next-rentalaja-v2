"use client";
import CustomDataTable from "@/app/lib/components/CustomDataTable";
import { ClientSalesAnalyticPerProductType } from "@/app/lib/types/store_sales_types";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Box } from "lucide-react";
import React from "react";

const getColumns = (): ColumnDef<ClientSalesAnalyticPerProductType>[] => {
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
      accessorKey: "productName",
      header: () => {
        return <span className="text-xs">Nama Produk</span>;
      },
      cell: ({ row }) => {
        const value = row.original.productDetail.title;
        return <span className="text-xs">{value}</span>;
      },
    },
    {
      accessorKey: "rentedAmount",
      header: () => {
        return <span className="text-xs">Tersewa</span>;
      },
      cell: ({ row }) => {
        const value = row.original.totalSales;
        return <span className="text-center text-xs">{value}</span>;
      },
    },
    {
      accessorKey: "profit",
      header: () => {
        return <span className="text-xs">Profit</span>;
      },
      cell: ({ row }) => {
        const value = row.original.totalProfit;
        return (
          <span className="text-xs">
            {CurrencyHandlers.changeToLocaleCurrency(value as number)}
          </span>
        );
      },
    },
    {
      accessorKey: "netProfit",
      header: () => {
        return <span className="text-xs">Net Profit</span>;
      },
      cell: ({ row }) => {
        const value = row.original.totalNetProfit;
        return (
          <span className="text-xs">
            {CurrencyHandlers.changeToLocaleCurrency(value as number)}
          </span>
        );
      },
    },
  ];
};

const SalesAnalyticPerProductTable = ({
  salesAnalyticPerProduct,
}: {
  salesAnalyticPerProduct: ClientSalesAnalyticPerProductType[];
}) => {
  const columns = getColumns();
  const table = useReactTable({
    columns: columns,
    data: salesAnalyticPerProduct,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="phone:w-full flex w-1/2 flex-col gap-4 rounded-md border border-slate-400/50 bg-white p-4 shadow-sm">
      <div className="flex flex-row items-center justify-start gap-2">
        <p className="flex items-center justify-center rounded-md bg-teal-200 p-1 text-white">
          <Box size={32} strokeWidth={2} />
        </p>
        <div className="flex flex-col gap-0">
          <p className="text-sm font-semibold">Performa Produk Teratas</p>
          {/* <p className="text-xs text-slate-500">{`Periode ${moment(date?.from).format("DD MMMM YYYY")} sampai ${moment(date?.to).format("DD MMMM YYYY")}`}</p> */}
        </div>
      </div>
      <div className="rounded-sm border border-slate-400/50">
        <CustomDataTable table={table} columns={columns} />
      </div>
    </div>
  );
};

export default SalesAnalyticPerProductTable;
