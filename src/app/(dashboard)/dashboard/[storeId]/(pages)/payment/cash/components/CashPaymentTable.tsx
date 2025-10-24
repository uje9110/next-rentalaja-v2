"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { FC, useState } from "react";
import {
  CalendarCheck,
  CalendarIcon,
  FileDigit,
  ListCheck,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { getColumns } from "./Columns";
import {
  CustomTableFilter,
  CustomTableFilterProps,
} from "@/app/lib/components/CustomTableFilters";
import CustomDataTable from "@/app/lib/components/CustomDataTable";
import moment from "moment-timezone";
import { CashPaymentDetailDialog } from "./CashPaymentDetailDialog";

interface PaymentTableProps {
  payments: ClientStoreOrderPaymentType[];
}

const CashPaymentTable: FC<PaymentTableProps> = ({ payments }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<
    ClientStoreOrderPaymentType | undefined
  >();

  const columns = getColumns(setIsDialogOpen, setPaymentData);

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      defaultValue: "createdAt",
    },
    {
      filterType: "dateTimePicker",
      filterIcon: CalendarIcon,
      filterName: "dateRange",
      filterTitle: "Tanggal Sales",
      defaultValue: {
        dateStart: moment(new Date())
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD:00:00:00"),
        dateEnd: moment(new Date())
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DD:23:59:00"),
      },
    },
    {
      filterType: "select",
      filterIcon: ListCheck,
      filterName: "paymentType",
      filterTitle: "Tipe Payment",
      filterValues: [
        { label: "Pelunasan", value: "full-payment" },
        { label: "Uang Muka", value: "partial-payment" },
      ],
    },
    {
      filterType: "select",
      filterIcon: ListCheck,
      filterName: "paymentMethod",
      filterTitle: "Metode Payment",
      filterValues: [
        { label: "Cash", value: "Cash" },
        { label: "QRIS", value: "QRIS" },
      ],
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
    <div className="phone:w-[calc(100vw-1.5rem)] flex flex-col gap-4 lg:w-full">
      <CustomTableFilter
        filterData={filterData}
        defaultFilters={defaultFilters}
        pageTitle="Filter Payment"
        table={table}
      />
      <div className="rounded-md border border-slate-400/50">
        <CustomDataTable table={table} columns={columns} />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <CashPaymentDetailDialog
            data={paymentData as ClientStoreOrderPaymentType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashPaymentTable;
