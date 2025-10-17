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
      //   dateStart: moment(new Date()). .tz("Asia/Jakarta").format("YYYY-MM-DD:00:00:00"),
      //   dateEnd: moment(new Date()). .tz("Asia/Jakarta").format("YYYY-MM-DD:23:59:00"),
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
    <div className="flex flex-row gap-4">
      <CustomTableFilter filterData={filterData} pageTitle="analytic" />
    </div>
  );
};

export default SalesAnalyticGraphAndTableFilter;
