import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { ColumnDef } from "@tanstack/react-table";
import {
  Banknote,
  Info,
  Landmark,
  SquareArrowDown,
  SquareArrowUp,
} from "lucide-react";
import moment from "moment-timezone";
import { Dispatch, SetStateAction } from "react";

export const getColumns = (
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>,
  setPaymentData: Dispatch<
    SetStateAction<ClientStoreOrderPaymentType | undefined>
  >,
): ColumnDef<ClientStoreOrderPaymentType>[] => {
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
          <span className="text-xs">
            {moment(value).tz("Asia/Jakarta").format("DD MMM YYYY, HH:mm")}
          </span>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: () => {
        return <span className="text-xs">Metode</span>;
      },
      cell: ({ row }) => {
        const value = row.original.paymentMethod;
        return (
          <p className="flex items-center justify-start gap-2 text-xs">
            {value?.toLowerCase() === "bank" ? (
              <Landmark size={20} strokeWidth={2} color="green" />
            ) : (
              <Banknote size={20} strokeWidth={2} color="green" />
            )}
            <span className="capitalize">{value}</span>
          </p>
        );
      },
    },
    {
      accessorKey: "paymentType",
      header: () => {
        return <span className="text-xs">Tipe</span>;
      },
      cell: ({ row }) => {
        const value = row.original.paymentType;
        return <span className="text-xs">{value}</span>;
      },
    },
    {
      accessorKey: "cashflow",
      header: () => {
        return <span className="text-xs">Cashflow</span>;
      },
      cell: ({ row }) => {
        const value = row.original.type;
        return (
          <p className="flex items-center justify-start gap-2 text-xs">
            {value === "income" ? (
              <SquareArrowDown size={20} strokeWidth={2} color="green" />
            ) : (
              <SquareArrowUp size={20} strokeWidth={2} color="red" />
            )}
            <span className="capitalize">{value}</span>
          </p>
        );
      },
    },
    {
      accessorKey: "paymentAmount",
      header: () => {
        return <span className="text-xs">Jumlah</span>;
      },
      cell: ({ row }) => {
        const value = row.original.paymentAmount;
        return (
          <span className="text-xs">
            {CurrencyHandlers.changeToLocaleCurrency(value)}
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
              setPaymentData(row.original as ClientStoreOrderPaymentType);
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
