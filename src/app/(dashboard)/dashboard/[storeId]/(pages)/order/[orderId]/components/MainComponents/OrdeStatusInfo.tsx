"use client";
import React, { FC, useState } from "react";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { useDashboardSingleOrderUtility } from "../../hooks/useDashboardSingleOrder";
import OrderStatusChangerButtons from "../OrderMutationComponents/OrderStatusChanger/OrderStatusChangerButtons";
import { GlobalUserType } from "@/app/lib/types/global_user_type";
import { RevertOrderDialog } from "../OrderMutationComponents/OrderRevert/OrderRevertDialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type OrderStatusInfoProps = {
  orderData: ClientStoreOrderType;
  customerData: GlobalUserType;
};

export const OrdeStatusInfo: FC<OrderStatusInfoProps> = ({
  orderData,
  customerData,
}) => {
  const { getPaymentStatusColor, getOrderStatusColor } =
    useDashboardSingleOrderUtility();
  const [revertOrderStatusTo, setRevertOrderStatusTo] = useState<string>("");
  const [isRevertOrderDialogOpen, setIsRevertOrderDialogOpen] =
    useState<boolean>(false);

  return (
    <div className="phone:order-1 phone:gap-4 phone:h-35 flex h-32 w-full flex-col items-start justify-center rounded-lg border border-slate-400/50 bg-white p-4 shadow lg:order-1 lg:h-32">
      <div className="phone:flex-col phone:items-center phone:justify-center phone:w-full phone:gap-2 flex w-full flex-row justify-between lg:flex lg:flex-row lg:items-center lg:justify-between">
        <div className="phone:text-center text-colorSecondary phone:w-full phone:flex phone:justify-center flex w-3/5 items-center gap-2 text-sm font-semibold lg:w-fit">
          <span className="lg:hidden">-----</span>
          <p>{orderData._id}</p>
          <span className="lg:hidden">-----</span>
        </div>

        {/* ACTION BUTTONS CONTAINER */}
        <OrderStatusChangerButtons
          orderData={orderData}
          customerData={customerData}
          setRevertOrderStatusTo={setRevertOrderStatusTo}
          setIsRevertOrderDialogOpen={setIsRevertOrderDialogOpen}
        />
      </div>

      <div className="phone:w-full flex flex-col gap-1">
        <div className="phone:justify-between phone:w-full phone:flex phone:flex-row flex flex-row items-center gap-2 capitalize">
          <p className="w-[140px] text-xs">Status Pembayaran</p>
          <p
            style={{
              backgroundColor: getPaymentStatusColor(
                orderData.paymentStatus as string,
              ),
            }}
            className="phone:text-[10px] lg:text-xs w-fit rounded-sm bg-blue-500 px-2 py-1 text-center text-xs font-[500] tracking-wide text-white"
          >
            {orderData.paymentStatus}
          </p>
        </div>
        <div className="phone:justify-between phone:w-full phone:flex phone:flex-row flex flex-row items-center gap-2 capitalize">
          <p className="w-[140px] text-xs">Status Order &nbsp;</p>
          <p
            style={{
              backgroundColor: getOrderStatusColor(orderData.status as string),
            }}
            className="phone:text-[10px] lg:text-xs w-fit rounded-sm bg-blue-500 px-2 py-1 text-center text-xs font-[500] tracking-wide text-white"
          >
            {orderData.status}
          </p>
        </div>
      </div>
      <Dialog
        open={isRevertOrderDialogOpen}
        onOpenChange={setIsRevertOrderDialogOpen}
      >
        <DialogContent className="lg:h-5/6 lg:w-1/3">
          <DialogTitle>Perubahan status khusus</DialogTitle>
          <RevertOrderDialog
            setIsRevertOrderDialogOpen={setIsRevertOrderDialogOpen}
            orderData={orderData}
            revertOrderStatusTo={revertOrderStatusTo}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
