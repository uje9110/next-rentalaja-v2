"use client";
import { ClientStoreSalesType } from "@/app/lib/types/store_sales_types";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import React, { FC } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesAnalyticPerPeriodeAnalyticProps {
  analytic: {
    _id: {
      hour: string;
    };
    label: string;
    totalProfit: number;
    totalNetProfit: number;
    totalSales: number;
    documents: ClientStoreSalesType[];
  }[];
}

const formatLabel = (key: string) => {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

const SalesAnalyticPerPeriodeGraph: FC<
  SalesAnalyticPerPeriodeAnalyticProps
> = ({ analytic }) => {
  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
      <ResponsiveContainer className="">
        <LineChart data={analytic}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: "12px" }}
            interval={0}
            padding={{ right: 20 }}
          />
          <YAxis
            tick={{ fontSize: "12px" }}
            padding={{ bottom: 10 }}
            width={100}
            tickFormatter={(value) =>
              CurrencyHandlers.changeToLocaleCurrency(value)
            }
          />

          <Legend formatter={(value) => formatLabel(value)} />
          <Tooltip
            formatter={(value, name) => [
              name === "totalProfit" || name === "totalNetProfit"
                ? CurrencyHandlers.changeToLocaleCurrency(value as number)
                : value,
              formatLabel(name as string),
            ]}
          />

          <Line
            type="monotone"
            dataKey="totalProfit"
            stroke="#7C9CC3"
            strokeDasharray="4"
          />
          <Line type="monotone" dataKey="totalNetProfit" stroke="#254770" />
          <Line type="monotone" dataKey="totalSales" stroke="#09beaf" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesAnalyticPerPeriodeGraph;
