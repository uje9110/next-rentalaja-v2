"use client";
import CustomDataTable from "@/app/lib/components/CustomDataTable";
import {
  CustomTableFilter,
  CustomTableFilterProps,
} from "@/app/lib/components/CustomTableFilters";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { GlobalCategoryType } from "@/app/lib/types/global_category_types";
import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios";
import { FileDigit, ListCheck, Search, SquareStack } from "lucide-react";
import React from "react";
import { getColumns } from "./Columns";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";

const ProductTable = ({
  storeId,
  data,
}: {
  storeId: string;
  data: ClientStoreProductType[];
}) => {
  const { APIEndpoint } = useAPIContext();

  const columns = getColumns(storeId);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getCategories = async (): Promise<GlobalCategoryType[]> => {
    try {
      const response = await axios.get(`${APIEndpoint}/global/category`, {});
      return response.data.json;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const filterData = [
    {
      filterType: "search",
      filterName: "search",
      filterIcon: Search,
      filterTitle: "Cari Produk",
    },
    {
      filterType: "select",
      filterIcon: SquareStack,
      filterName: "categoriesIds",
      filterTitle: "Kategori Produk",
      filterValues: categories.map((category) => {
        return {
          label: category.title,
          value: category._id,
        };
      }),
    },
    {
      filterType: "select",
      filterIcon: ListCheck,
      filterName: "status",
      filterTitle: "Status Produk",
      filterValues: [
        { label: "Published", value: "published" },
        { label: "Unpublished", value: "unpublished" },
        { label: "Draft", value: "draft" },
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
    <div className="flex flex-col gap-4 rounded-md border border-slate-400/50 bg-white p-4">
      {/* filter */}
      <CustomTableFilter
        pageTitle="Product"
        filterData={filterData}
        table={table}
      />
      <div className="rounded-lg border border-slate-400/50">
        <CustomDataTable table={table} columns={columns} />
      </div>
    </div>
  );
};

export default ProductTable;
