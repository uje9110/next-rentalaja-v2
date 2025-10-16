"use client";
import React, { FC, useEffect, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  CalendarCheck,
  CalendarIcon,
  FileDigit,
  SquareStack,
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ClientStoreSalesType } from "@/app/lib/types/store_sales_types";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { getColumns } from "./Columns";
import { GlobalCategoryType } from "@/app/lib/types/global_category_types";
import CustomDataTable from "@/app/lib/components/CustomDataTable";
import {
  CustomTableFilter,
  CustomTableFilterProps,
} from "@/app/lib/components/CustomTableFilters";
import SalesSummaryTabs from "./SalesSummaryTab";
import moment from "moment";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SalesDetailDialog from "./SalesDetailDialog";

type SalesTableProps = {
  sales: ClientStoreSalesType[];
};

const SalesTable: FC<SalesTableProps> = ({ sales }) => {
  const { APIEndpoint } = useAPIContext();

  const [salesData, setSalesData] = useState<
    ClientStoreSalesType | undefined
  >();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredSales, setFilteredSales] = useState<ClientStoreSalesType[]>(
    [],
  );

  useEffect(() => {
    setFilteredSales(sales);
  }, [sales]);

  const columns = getColumns(setIsDialogOpen, setSalesData);

  const table = useReactTable({
    columns,
    data: filteredSales,
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
      filterType: "select",
      filterIcon: CalendarCheck,
      filterName: "dateBy",
      filterTitle: "Filter Tanggal",
      filterValues: [{ label: "Tanggal Dibuat", value: "createdAt" }],
      // defaultValue: "createdAt",
    },
    {
      filterType: "dateTimePicker",
      filterIcon: CalendarIcon,
      filterName: "dateRange",
      filterTitle: "Tanggal Sales",
      // defaultValue: {
      //   dateStart: moment(new Date()).format("YYYY-MM-DD:00:00:00"),
      //   dateEnd: moment(new Date()).format("YYYY-MM-DD:23:59:00"),
      // },
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
    <div className="phone:w-[calc(100vw-1.5rem)] m-2 phone:m-2 lg:m-0 flex flex-col gap-2 lg:w-full">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <SalesDetailDialog salesData={salesData as ClientStoreSalesType} />
        </DialogContent>
      </Dialog>
      <SalesSummaryTabs sales={sales} setFilteredSales={setFilteredSales} />
      <div className="flex flex-col gap-4 rounded-md border border-slate-400/50 bg-white p-4">
        <CustomTableFilter
          filterData={filterData}
          pageTitle="Order"
          table={table}
        />

        <div className="rounded-lg border border-slate-400/50">
          <CustomDataTable table={table} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default SalesTable;
