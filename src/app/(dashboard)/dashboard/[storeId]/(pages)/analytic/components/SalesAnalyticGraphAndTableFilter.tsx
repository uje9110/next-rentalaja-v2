"use client";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  CustomTableFilter,
  CustomTableFilterProps,
} from "@/app/lib/components/CustomTableFilters";
import { GlobalCategoryType } from "@/app/lib/types/global_category_types";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import {
  CalendarCheck,
  CalendarIcon,
  FileDigit,
  SquareStack,
} from "lucide-react";
import moment from "moment-timezone";

const SalesAnalyticGraphAndTableFilter = () => {
  const { APIEndpoint } = useAPIContext();
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
      filterType: "select",
      filterIcon: CalendarCheck,
      filterName: "dateBy",
      filterTitle: "Filter Tanggal",
      filterValues: [{ label: "Tanggal Dibuat", value: "createdAt" }],
    },
    {
      filterType: "dateTimePicker",
      filterIcon: CalendarIcon,
      filterName: "dateRange",
      filterTitle: "Tanggal Sales",
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
    <div className="flex flex-row gap-4">
      <CustomTableFilter
        filterData={filterData}
        defaultFilters={defaultFilters}
        pageTitle="analytic"
      />
    </div>
  );
};

export default SalesAnalyticGraphAndTableFilter;
