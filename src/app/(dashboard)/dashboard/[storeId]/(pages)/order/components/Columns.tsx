"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dot,
  ChevronRight,
  CalendarArrowUp,
  CalendarArrowDown,
} from "lucide-react";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { StoreOrderBillingType } from "@/app/lib/types/store_order_billing_type";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

export const columns: ColumnDef<ClientStoreOrderType>[] = [
  {
    accessorKey: "no",
    header: () => {
      return <span className="text-xs">No.</span>;
    },
    cell: ({ row }) => {
      const num = row.index + 1;
      return <span className="pl-2 text-xs">{num}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => {
      return <span className="text-xs">Tanggal</span>;
    },
    cell: ({ row }) => {
      const value = new Date(row.getValue("createdAt"));
      const formattedDay = moment(value).format("DD MMM YYYY");
      const formattedHour = moment(value).format("HH:mm");
      return (
        <p className="flex gap-1 text-xs">
          <span className="">{formattedDay},</span>
          <span className="text-slate-500">{formattedHour}</span>
        </p>
      );
    },
  },
  {
    accessorKey: "_id",
    header: () => {
      return <span className="text-xs">Order</span>;
    },
    cell: ({ row }) => {
      const storeId = row.original.storeDetail.storeId;
      const value: string = row.getValue("_id");
      return (
        <Link
          href={`/dashboard/${storeId}/order/${value}`}
          className="text-xs font-semibold text-blue-400"
        >
          {value}
        </Link>
      );
    },
  },
  {
    accessorKey: "billing",
    header: () => {
      return <span className="text-xs">Cust</span>;
    },
    cell: ({ row }) => {
      const billing: StoreOrderBillingType = row.getValue("billing");
      const custName = `${billing.firstName} ${billing.lastName}`
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return <p className="w-24 truncate text-xs capitalize">{custName}</p>;
    },
  },
  {
    accessorKey: "telephone",
    header: () => {
      return <span className="text-xs">Telepon</span>;
    },
    cell: ({ row }) => {
      const billing: StoreOrderBillingType = row.getValue("billing");
      return (
        <span className="text-xs capitalize">{`${billing.telephone}`}</span>
      );
    },
  },
  {
    accessorKey: "items",
    header: () => {
      return <span className="text-xs">Item</span>;
    },
    cell: ({ row }) => {
      const value: StoreOrderItemType[] = row.getValue("items");
      return (
        <div>
          {value.map((item) => {
            const { itemName, rentalDetails } = item;
            return (
              <li
                key={`${itemName}-${rentalDetails.rentalStartInLocaleMs}`}
                className="mt-1 flex flex-col items-start gap-1"
              >
                {/* ITEM NAME */}
                <div className="flex items-center">
                  <Dot size={16} strokeWidth={2} />
                  <span className="text-xs font-medium">{itemName}</span>
                </div>

                {/* ITEM RENTAL DETAILS */}
                <div className="flex items-center gap-0 pl-3 text-xs">
                  <p className="flex w-[140px] items-center justify-center gap-1 rounded-sm bg-green-500 px-[6px] py-1 text-center font-semibold text-white">
                    <CalendarArrowUp size={14} />
                    {moment(rentalDetails.rentalStartInLocaleMs).format(
                      "DD-MM-YYYY, HH:mm",
                    )}
                  </p>
                  <span className="text-sm text-blue-400">
                    <ChevronRight size={16} strokeWidth={2} />
                  </span>
                  <p className="flex w-[140px] items-center justify-center gap-1 rounded-sm bg-red-500 px-[6px] py-1 text-center font-semibold text-white">
                    <CalendarArrowDown size={14} />
                    {moment(rentalDetails.rentalEndInLocaleMs).format(
                      "DD-MM-YYYY, HH:mm",
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: () => {
      return <span className="text-xs">Total</span>;
    },
    cell: ({ row }) => {
      const formatted = CurrencyHandlers.changeToLocaleCurrency(
        row.getValue("total"),
      );
      return <span className="text-xs capitalize">{formatted}</span>;
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <span className="text-xs">Status</span>;
    },
    cell: ({ row }) => {
      const value: string = row.getValue("status");
      const getStatusColor = (status: string) => {
        switch (status) {
          case "completed":
            return "bg-green-200 text-slate-600"; // Pastel green
          case "canceled":
            return "bg-red-200 text-slate-600"; // Pastel red
          case "pending":
            return "bg-yellow-200 text-slate-600"; // Pastel yellow
          case "processing":
            return "bg-blue-200 text-slate-600"; // Pastel blue
          case "confirmed":
            return "bg-purple-200 text-slate-600"; // Pastel purple
          default:
            return "bg-gray-200 text-slate-600"; // Default pastel gray
        }
      };
      return (
        <p
          className={clsx(
            "w-max-[80 px] rounded-lg p-1 text-center text-xs capitalize",
            getStatusColor(value),
          )}
        >
          {value}
        </p>
      );
    },
  },
];
