"use client";
import {
  SettlementStatus,
  TransactionStatus,
  XenditTransaction,
} from "@/app/lib/types/xendit_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { ColumnDef } from "@tanstack/react-table";
import { Rocket, Clock, CheckCircle, XCircle, Ban, Undo2 } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { JSX } from "react";

export function renderTransactionStatus(value: TransactionStatus): JSX.Element {
  const statusMap: Record<
    TransactionStatus,
    { Icon: React.ElementType; color: string }
  > = {
    PENDING: { Icon: Clock, color: "orange" },
    SUCCESS: { Icon: CheckCircle, color: "green" },
    FAILED: { Icon: XCircle, color: "red" },
    VOIDED: { Icon: Ban, color: "gray" },
    REVERSED: { Icon: Undo2, color: "blue" },
  };

  const { Icon, color } = statusMap[value] || {
    Icon: Ban,
    color: "gray",
  };

  return (
    <p className="flex items-center justify-start gap-2 text-xs">
      <Icon size={20} strokeWidth={2} color={color} />
      <span style={{ color: color }} className="capitalize">
        {value.toLowerCase()}
      </span>
    </p>
  );
}

export function renderSettlementStatus(
  value: SettlementStatus | null,
): JSX.Element {
  if (!value) {
    return (
      <p className="flex items-center justify-start gap-2 text-xs text-gray-400">
        <Clock size={20} strokeWidth={2} color="gray" />
        <span className="capitalize">Unknown</span>
      </p>
    );
  }

  const statusMap: Record<
    SettlementStatus,
    { Icon: React.ElementType; color: string }
  > = {
    PENDING: { Icon: Clock, color: "orange" },
    EARLY_SETTLED: { Icon: Rocket, color: "blue" },
    SETTLED: { Icon: CheckCircle, color: "green" },
  };

  const { Icon, color } = statusMap[value];

  return (
    <p className="flex items-center justify-start gap-2 text-xs">
      <Icon size={20} strokeWidth={2} color={color} />
      <span style={{ color: color }} className="capitalize">
        {value.toLowerCase().replace("_", " ")}
      </span>
    </p>
  );
}

export const getColumns = (): ColumnDef<XenditTransaction>[] => {
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
      accessorKey: "created",
      header: () => {
        return <span className="text-xs">Tanggal</span>;
      },
      cell: ({ row }) => {
        const value = row.original.created;
        return (
          <span className="text-xs">
            {moment(value).format("DD MMM YYYY, HH:mm")}
          </span>
        );
      },
    },
    {
      accessorKey: "channel_code",
      header: () => {
        return <span className="text-xs">Via</span>;
      },
      cell: ({ row }) => {
        const value = row.original.channel_code;
        return <span className="text-xs font-bold italic">{value}</span>;
      },
    },
    {
      accessorKey: "status",
      header: () => <span className="text-xs">Status</span>,
      cell: ({ row }) => {
        const value: TransactionStatus = row.original.status;
        return renderTransactionStatus(value);
      },
    },

    {
      accessorKey: "reference_id",
      header: () => {
        return <span className="text-xs">Reference</span>;
      },
      cell: ({ row }) => {
        const value = row.original.reference_id;
        return (
          <Link
            href={`/dashboard/order/${value}`}
            target="__blank"
            className="text-xs text-blue-400 underline"
          >
            {value}
          </Link>
        );
      },
    },
    {
      accessorKey: "Settlement Status",
      header: () => {
        return <span className="text-xs">Settlement Status</span>;
      },
      cell: ({ row }) => {
        const value = row.original.settlement_status;
        return renderSettlementStatus(value);
      },
    },
    {
      accessorKey: "amount",
      header: () => {
        return <span className="text-xs">Jumlah</span>;
      },
      cell: ({ row }) => {
        const value = row.original.amount;
        return (
          <span className="text-xs">
            {CurrencyHandlers.changeToLocaleCurrency(value)}
          </span>
        );
      },
    },
  ];
};
