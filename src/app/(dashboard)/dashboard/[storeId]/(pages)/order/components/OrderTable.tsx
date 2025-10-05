"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CalendarCheck,
  CalendarIcon,
  FileDigit,
  ListCheck,
  Search,
} from "lucide-react";

import {
  CustomTableFilter,
  CustomTableFilterProps,
} from "@/app/lib/components/CustomTableFilters";
import CustomDataTable from "@/app/lib/components/CustomDataTable";

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

  const filterData = [
    {
      filterType: "search",
      filterIcon: Search,
      filterName: "search",
      filterTitle: "Cari Nama Pelanggan",
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
        { label: "Semua Status", value: "all" },
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
    <div className="flex flex-col gap-4 rounded-md bg-white p-4 border border-slate-400/50">
      {/* filter */}
      <CustomTableFilter
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
