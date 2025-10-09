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
    <div className="phone:order-1 flex h-32 w-full flex-col items-start justify-center rounded-lg border border-slate-400/50 bg-white p-4 shadow lg:order-1">
      <div className="flex w-full flex-row justify-between">
        <p className="flex w-3/5 items-center gap-2 text-sm font-semibold">
          {/* {window.innerWidth < 640 ? (
            <Sheet>
              <SheetTrigger>
                <p className="rounded-sm bg-teal-400 p-1 text-white">
                  <PanelRightClose size={20} strokeWidth={2} />
                </p>
              </SheetTrigger>
              <SheetContent side={"left"} className="flex flex-col gap-4">
                <SheetHeader>
                  <p className="text-start font-semibold">Detail Tambahan</p>
                </SheetHeader>
                <SingleOrderSidebar
                  session={session as Session}
                  orderId={orderData._id as string}
                  paymentData={paymentData}
                  setPaymentData={setPaymentData}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </SheetContent>
            </Sheet>
          ) : null} */}
          <span className="text-colorSecondary flex items-center text-base font-bold">
            {orderData._id}
          </span>
        </p>

        {/* ACTION BUTTONS CONTAINER */}
        <OrderStatusChangerButtons
          orderData={orderData}
          customerData={customerData}
          setRevertOrderStatusTo={setRevertOrderStatusTo}
          setIsRevertOrderDialogOpen={setIsRevertOrderDialogOpen}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2 capitalize">
          <p className="w-[140px] text-xs">Status Pembayaran</p>
          <p
            style={{
              backgroundColor: getPaymentStatusColor(
                orderData.paymentStatus as string,
              ),
            }}
            className="w-auto rounded-md bg-blue-500 px-2 py-1 text-center text-xs font-[500] tracking-wide text-white"
          >
            {orderData.paymentStatus}
          </p>
        </div>
        <div className="flex flex-row items-center gap-2 capitalize">
          <p className="w-[140px] text-xs">Status Order &nbsp;</p>
          <p
            style={{
              backgroundColor: getOrderStatusColor(orderData.status as string),
            }}
            className="w-auto rounded-md bg-blue-500 px-2 py-1 text-center text-xs font-[500] tracking-wide text-white"
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
