import { GlobalCouponType } from "@/app/lib/types/global_coupon_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { ColumnDef } from "@tanstack/react-table";
import { FileDigit, Percent } from "lucide-react";
import moment from "moment-timezone";

export const getColumn = (): ColumnDef<GlobalCouponType>[] => {
  return [
    {
      accessorKey: "number",
      header: () => {
        return <span className="text-xs">No.</span>;
      },
      cell: ({ row }) => {
        const value = row.index + 1;
        return <span className="pl-2 text-xs">{value}</span>;
      },
    },
    {
      accessorKey: "couponID",
      header: () => {
        return <span className="text-xs">ID Kupon</span>;
      },
      cell: ({ row }) => {
        const value = row.original._id;
        return <span className="text-xs">{value}</span>;
      },
    },
    {
      accessorKey: "couponName",
      header: () => {
        return <span className="text-xs">Nama Kupon</span>;
      },
      cell: ({ row }) => {
        const value = row.original.couponName;
        return <span className="text-xs">{value}</span>;
      },
    },
    {
      accessorKey: "couponType",
      header: () => {
        return <span className="text-xs">Tipe</span>;
      },
      cell: ({ row }) => {
        const value = row.original.couponType;
        return (
          <p className="flex flex-row items-center gap-2 text-xs capitalize">
            <span>
              {value === "percentage" ? (
                <Percent size={18} />
              ) : (
                <FileDigit size={18} />
              )}
            </span>
            <span>{value}</span>
          </p>
        );
      },
    },
    {
      accessorKey: "couponValue",
      header: () => {
        return <span className="text-xs">Nilai</span>;
      },
      cell: ({ row }) => {
        const type = row.original.couponType;
        const value = row.original.couponValue;
        return (
          <span className="text-xs">
            {type === "percentage"
              ? `${value}%`
              : CurrencyHandlers.changeToLocaleCurrency(value)}
          </span>
        );
      },
    },
    {
      accessorKey: "couponExpire",
      header: () => {
        return <span className="text-xs">Expire</span>;
      },
      cell: ({ row }) => {
        const value = row.original.couponExpire;
        return (
          <span className="text-xs">
            {moment(value).tz("Asia/Jakarta").format("DD MMM YYYY, HH:mm")}
          </span>
        );
      },
    },
  ];
};
