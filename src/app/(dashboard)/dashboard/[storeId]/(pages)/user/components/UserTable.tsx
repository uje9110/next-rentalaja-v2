"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";
import { FileDigit, Search, SquareStack } from "lucide-react";
import { getColumns } from "./Columns";
import { ClientStoreUserType } from "@/app/lib/types/store_user_type";
import {
  CustomTableFilter,
  CustomTableFilterProps,
} from "@/app/lib/components/CustomTableFilters";
import CustomDataTable from "@/app/lib/components/CustomDataTable";

interface DataTableProps {
  users: ClientStoreUserType[];
}

const UserTable = ({ users }: DataTableProps) => {
  const columns = getColumns();
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const defaultFilters: Record<string, string | Date> = {
    limit: "25",
  };

  const filterData = [
    {
      filterType: "search",
      filterIcon: Search,
      filterName: "search",
      filterTitle: "Cari user dengan email",
    },
    {
      filterType: "select",
      filterIcon: SquareStack,
      filterName: "membershipId",
      filterTitle: "Filter berdasar member",
      filterValues: [
        { label: "Member Rentalaja", value: "MEMBERSHIP_01" },
        { label: "Staff Rentalaja", value: "STAFF_MEMBERSHIP" },
        { label: "Non Member", value: "NO-MEMBERSHIP" },
      ],
    },
    {
      filterType: "select",
      filterIcon: FileDigit,
      filterName: "limit",
      filterTitle: "Limit Produk",
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
      <CustomTableFilter
        defaultFilters={defaultFilters}
        pageTitle="User"
        table={table}
        filterData={filterData}
      />
      <div className="rounded-md border-[1px] border-slate-400/50 bg-white shadow-sm">
        <CustomDataTable columns={columns} table={table} />
      </div>
    </div>
  );
};

export default UserTable;
