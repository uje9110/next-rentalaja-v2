"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Box,
  CalendarCheck,
  CalendarIcon,
  FileDigit,
  FilterX,
  ListCheck,
  Search,
} from "lucide-react";

import {
  CustomTableFilter,
  CustomTableFilterProps,
} from "@/app/lib/components/CustomTableFilters";
import CustomDataTable from "@/app/lib/components/CustomDataTable";
import { ProductIds } from "@/app/lib/const/ProductIds";
import moment from "moment";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const OrderTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const now = new Date();

  // Start of today: 00:00:00.000
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  // End of today: 23:59:59.999
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
  );

  const defaultDateStart = moment(startOfToday)
    .tz("Asia/Jakarta")
    .format("YYYY-MM-DDTHH:mm:ss");

  const defaultDateEnd = moment(endOfToday)
    .tz("Asia/Jakarta")
    .format("YYYY-MM-DDTHH:mm:ss");

  const defaultFilters: Record<string, string | Date> = {
    dateBy: "createdAt",
    dateStart: defaultDateStart,
    dateEnd: defaultDateEnd,
    limit: "25",
  };

  const filterData = [
    {
      filterType: "reset",
      filterIcon: FilterX,
      filterName: "reset",
      filterTitle: "",
    },
    {
      filterType: "search",
      filterIcon: Search,
      filterName: "search",
      filterTitle: "Cari Nama Pelanggan",
    },
    {
      filterType: "select",
      filterIcon: Box,
      filterName: "productId",
      filterTitle: "Produk",
      filterValues: ProductIds.map((id) => {
        return { label: id.name, value: id.value };
      }),
    },
    {
      filterType: "select",
      filterIcon: CalendarCheck,
      filterName: "dateBy",
      filterTitle: "Filter Tanggal",
      filterValues: [
        { label: "Tanggal Dibuat", value: "createdAt" },
        { label: "Rental Dimulai", value: "byRentalStartIs" },
        { label: "Rental Selesai", value: "byRentalEndIs" },
      ],
    },
    {
      filterType: "dateTimePicker",
      filterIcon: CalendarIcon,
      filterName: "dateRange",
      filterTitle: "Tanggal Order",
    },
    {
      filterType: "select",
      filterName: "status",
      filterIcon: ListCheck,
      filterTitle: "Status Order",
      filterValues: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Canceled", value: "canceled" },
      ],
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
    <div className="phone:w-[calc(100vw-1.5rem)] flex flex-col gap-4 rounded-md border border-slate-400/50 bg-white p-4 lg:w-full">
      {/* filter */}
      <CustomTableFilter
        defaultFilters={defaultFilters}
        filterData={filterData}
        pageTitle="Order"
        table={table}
      />
      <div className="rounded-lg border border-slate-400/50">
        <CustomDataTable table={table} columns={columns} />
      </div>
    </div>
  );
};
