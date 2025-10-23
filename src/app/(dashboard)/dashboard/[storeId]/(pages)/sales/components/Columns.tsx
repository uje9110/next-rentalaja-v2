"use client";
import { ClientStoreSalesType } from "@/app/lib/types/store_sales_types";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Info } from "lucide-react";
import moment from "moment-timezone";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const getOrderStatusColor = (status: string) => {
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

const getPaymentColor = (status: string) => {
  switch (status) {
    case "fully-paid":
      return "bg-green-200 text-slate-600"; // Pastel green
    case "partially-paid":
      return "bg-yellow-200 text-slate-600"; // Pastel red
    case "unpaid":
      return "bg-red-200 text-slate-600"; // Pastel yellow
    default:
      return "bg-gray-200 text-slate-600"; // Default pastel gray
  }
};

export const getColumns = (
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>,
  setSalesData: Dispatch<SetStateAction<ClientStoreSalesType | undefined>>,
): ColumnDef<ClientStoreSalesType>[] => {
  return [
    {
      accessorKey: "number",
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
        const value = row.original.createdAt;
        return (
          <span className="text-xs text-slate-400">
            {moment(value).tz("Asia/Jakarta").format("DD MMM YYYY, HH:mm")}
          </span>
        );
      },
    },
    {
      accessorKey: "orderId",
      header: () => {
        return <span className="text-xs">Order ID</span>;
      },
      cell: ({ row }) => {
        const value = row.original._id;
        const storeId = row.original.orderDetail.storeDetail.storeId;
        return (
          <Link
            href={`/dashboard/${storeId}/order/${value}`}
            target="__blank"
            className="border-b-2 border-blue-400 pb-0.5 text-xs font-bold text-blue-400"
          >
            {value}
          </Link>
        );
      },
    },
    {
      accessorKey: "custName",
      header: () => {
        return <span className="text-xs">Customer</span>;
      },
      cell: ({ row }) => {
        const value = `${row.original.orderDetail?.billing?.firstName} ${row.original.orderDetail?.billing?.lastName}`;
        const formatted = value
          .toLowerCase()
          .split(" ")
          .map((strings) =>
            strings
              .split("")
              .map((string, index) =>
                index === 0 ? string.toUpperCase() : string,
              )
              .join(""),
          )
          .join(" ");

        return <span className="text-xs capitalize">{formatted}</span>;
      },
    },
    {
      accessorKey: "orderStatus",
      header: () => {
        return <span className="text-xs">Status Order</span>;
      },
      cell: ({ row }) => {
        const value = row.original.orderDetail.status;
        return (
          <span
            className={clsx(
              "rounded-md px-3 py-1 text-xs capitalize",
              getOrderStatusColor(value as string),
            )}
          >
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "subtotal",
      header: () => {
        return <span className="text-xs">Subtotal</span>;
      },
      cell: ({ row }) => {
        const value = row.original.orderDetail.subtotal;
        return (
          <span className="text-xs">
            {CurrencyHandlers.changeToLocaleCurrency(value)}
          </span>
        );
      },
    },
    {
      accessorKey: "discount",
      header: () => {
        return <span className="text-xs">Diskon</span>;
      },
      cell: ({ row }) => {
        const value =
          row.original.orderDetail.total - row.original.orderDetail.subtotal;
        return (
          <span className="text-xs">
            {CurrencyHandlers.changeToLocaleCurrency(value)}
          </span>
        );
      },
    },
    {
      accessorKey: "total",
      header: () => {
        return <span className="text-xs">Total</span>;
      },
      cell: ({ row }) => {
        const value = row.original.orderDetail.total;
        return (
          <span className="text-xs">
            {CurrencyHandlers.changeToLocaleCurrency(value)}
          </span>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: () => {
        return <span className="text-xs">Pembayaran</span>;
      },
      cell: ({ row }) => {
        const value = row.original.orderDetail.paymentStatus;
        return (
          <span
            className={clsx(
              "rounded-md px-3 py-1 text-xs capitalize",
              getPaymentColor(value as string),
            )}
          >
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "payments",
      header: () => {
        return <span className="text-xs">Terbayar</span>;
      },
      cell: ({ row }) => {
        const value = row.original.orderDetail.paymentDetails;
        return (
          <ul className="-ml-4">
            {value
              .filter((payment) => {
                if (payment.isUsingXendit) {
                  return payment.xenditPayment?.status === "SUCCEEDED";
                }
                return true; // keep all non-Xendit payments
              })
              .map((payment) => (
                <li
                  key={payment._id}
                  className={clsx(
                    "text-xs",
                    payment.paymentType === "Denda" && "text-red-400",
                  )}
                >
                  {CurrencyHandlers.changeToLocaleCurrency(
                    payment.paymentAmount,
                  )}
                </li>
              ))}
          </ul>
        );
      },
    },
    {
      accessorKey: "unpaidPayments",
      header: () => {
        return <span className="text-xs">Sisa</span>;
      },
      cell: ({ row }) => {
        const paidPayments = row.original.orderDetail.paymentDetails.reduce(
          (total, payment) => {
            if (payment.paymentType === "Denda") {
              return total;
            }
            return total + payment.paymentAmount;
          },
          0,
        );
        const total = row.original.orderDetail.total;
        return (
          <span className="text-xs">
            {CurrencyHandlers.changeToLocaleCurrency(total - paidPayments)}
          </span>
        );
      },
    },
    {
      accessorKey: "paymentDetail",
      header: () => {
        return <span className="text-xs">Detail</span>;
      },
      cell: ({ row }) => {
        return (
          <button
            className="flex items-center gap-1 rounded-md border-2 border-blue-300 bg-white px-2 py-1 text-blue-300"
            onClick={() => {
              setIsDialogOpen(true);
              setSalesData(row.original as ClientStoreSalesType);
            }}
          >
            <Info size={18} strokeWidth={2} />
            <span className="text-xs">Lihat Detail</span>
          </button>
        );
      },
    },
  ];
};
