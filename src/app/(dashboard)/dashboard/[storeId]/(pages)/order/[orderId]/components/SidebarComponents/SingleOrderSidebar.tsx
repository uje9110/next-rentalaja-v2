/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { FC } from "react";
import moment from "moment";
import { Session } from "next-auth";
import { Banknote, Logs, Plus, ReceiptText, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import PaymentsDetailDialog from "./PaymentsDetailDialog";
import OrderNoteDialog from "./OrderNoteDialog";
import Invoice from "../MainComponents/Invoice";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import OrderPaymentDialog from "./OrderPaymentDialog";
import { useDashboardSingleOrderUtility } from "../../hooks/useDashboardSingleOrder";
import { useDashboardSingleOrderSidebar } from "../../hooks/useDashboardSingleOrderSidebar";
import { useSession } from "next-auth/react";

interface SingleOrderSidebarProps {
  orderData: ClientStoreOrderType;
}

const SingleOrderSidebar: FC<SingleOrderSidebarProps> = ({ orderData }) => {
  const { data: session } = useSession();
  const { getPaymentTypeColor } = useDashboardSingleOrderUtility();
  const {
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    isPaymentDetailDialogOpen,
    setIsPaymentDetailDialogOpen,
    isOrderNoteDialogOpen,
    setIsOrderNoteDialogOpen,
    orderNotes,
    handleOpenPrinting,
    overdueNotification,
  } = useDashboardSingleOrderSidebar(orderData);

  return (
    <section className="phone:m-0 phone:w-full m-2 flex w-1/5 flex-col rounded-lg border border-slate-400/50 bg-white text-sm shadow-sm lg:h-full">
      {/* CUSTOMER ACTION */}
      <div id="order-customer-action" className="p-2">
        <div className="flex w-full flex-col rounded-lg bg-white">
          <p
            onClick={() => handleOpenPrinting()}
            className="hover:bg-colorSecondary flex w-full cursor-pointer items-center justify-start gap-2 rounded-t-lg border-[1px] border-b-0 border-slate-400/50 bg-teal-50 p-2 hover:text-white"
          >
            <span className="text-xs">
              <ReceiptText size={16} strokeWidth={1} />
            </span>
            <span className="text-xs">Print Invoice</span>
          </p>
          <p
            onClick={() => {
              overdueNotification.mutate();
            }}
            className="hover:bg-colorSecondary flex w-full cursor-pointer items-center justify-start gap-2 rounded-b-lg border-[1px] border-slate-400/50 bg-teal-50 p-2 hover:text-white"
          >
            <span className="text-xs">
              <Send size={16} strokeWidth={1} />
            </span>
            <span className="text-xs">Pengingat Pengembalian</span>
          </p>
        </div>
      </div>

      {/* ORDER PAYMENT */}
      <div
        id="order-payments"
        className="m-2 rounded-md border border-slate-400/50 bg-teal-50"
      >
        <Dialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <DialogTrigger className="w-full">
            <p className="flex w-full items-center justify-start gap-2 rounded-t-sm bg-teal-400 px-2 py-2 text-xs text-white">
              <span>
                <Plus size={16} />
              </span>
              <span>Pembayaran</span>
            </p>
          </DialogTrigger>
          <DialogContent className="phone:w-screen flex flex-col gap-2 lg:w-2/6">
            <DialogTitle>Tambah Pembayaran</DialogTitle>
            <OrderPaymentDialog
              setIsPaymentDialogOpen={setIsPaymentDialogOpen}
              orderData={orderData}
              session={session as Session}
            />
          </DialogContent>
        </Dialog>
        <ScrollArea className="h-24">
          <ul className="ml-2 p-4">
            {(orderData.paymentDetails.length > 0 &&
              orderData.paymentDetails.map((item) => {
                const { paymentAmount, paymentType, _id, createdAt } = item;
                return (
                  <li key={_id} className="mb-1 list-disc text-xs">
                    <div className="flex gap-2">
                      <div>
                        {CurrencyHandlers.changeToLocaleCurrency(paymentAmount)}
                      </div>
                      <div
                        className="flex w-20 items-center justify-center rounded-full text-center text-[8px] text-white capitalize"
                        style={{
                          backgroundColor: getPaymentTypeColor(
                            paymentType as string,
                          ),
                        }}
                      >
                        {paymentType}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-700">
                      {moment(createdAt).format("DD-MM-YYYY HH:mm")}
                    </p>
                  </li>
                );
              })) || (
              <li className="list-disc">
                <p className="text-xs">Belum ada pembayaran</p>
              </li>
            )}
          </ul>
        </ScrollArea>
        <Dialog
          onOpenChange={setIsPaymentDetailDialogOpen}
          open={isPaymentDetailDialogOpen}
        >
          <DialogTrigger asChild>
            <button className="flex w-full items-center justify-center gap-2 rounded-b-sm bg-yellow-200 p-1 text-xs text-slate-500">
              <Banknote size={16} strokeWidth={1} />
              Detail Pembayaran
            </button>
          </DialogTrigger>
          <DialogContent className="flex max-h-full min-h-64 max-w-screen-lg flex-col items-start gap-4 overflow-auto p-2 lg:w-[1600px]">
            <div className="phone:w-screen flex w-full flex-col gap-4 lg:w-full">
              <DialogHeader className="phone:px-4">
                <DialogTitle className="flex items-center text-base">
                  Detail Pembayaran
                </DialogTitle>
                <DialogDescription className="text-left text-xs">
                  Detail pembayaran yang diterima untuk order {orderData._id}
                </DialogDescription>
              </DialogHeader>
              <PaymentsDetailDialog
                setIsPaymentDetailDialogOpen={setIsPaymentDetailDialogOpen}
                orderData={orderData}
                session={session as Session}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ORDER NOTES */}
      <div
        id="order-notes"
        className="m-2 rounded-md border border-slate-400/50 bg-teal-50"
      >
        <Dialog
          open={isOrderNoteDialogOpen}
          onOpenChange={setIsOrderNoteDialogOpen}
        >
          <DialogTrigger className="w-full">
            <p className="bg-colorPrimary flex w-full items-center justify-start gap-2 rounded-t-sm px-2 py-2 text-xs text-white">
              <span>
                <Plus size={16} />
              </span>
              <span>Catatan</span>
            </p>
          </DialogTrigger>
          <DialogContent className="phone:w-screen flex flex-col gap-2 lg:w-2/6">
            <DialogHeader className="phone:px-4">
              <DialogTitle className="flex items-center text-base">
                Detail Pembayaran
              </DialogTitle>
              <DialogDescription className="text-left text-xs">
                Detail pembayaran yang diterima untuk order {orderData._id}
              </DialogDescription>
            </DialogHeader>
            <OrderNoteDialog
              setIsOrderNoteDialogOpen={setIsOrderNoteDialogOpen}
              orderData={orderData}
              session={session as Session}
            />
          </DialogContent>
        </Dialog>
        <ScrollArea className="h-24">
          <ul className="ml-2 p-4">
            {orderNotes && orderNotes.length > 0 ? (
              orderNotes.map((orderNote) => {
                const { _id, note, createdAt, userDetails } = orderNote;
                return (
                  <li key={_id} className="mb-1 list-disc text-xs">
                    <p className="text-[10px] font-semibold text-slate-700">
                      Dibuat oleh: {userDetails?.firstName}{" "}
                      {userDetails?.lastName}
                    </p>
                    <p className="">{note}</p>
                    <p className="text-[10px] text-slate-700">
                      {moment(createdAt).format("DD-MM-YYYY HH:mm")}
                    </p>
                  </li>
                );
              })
            ) : (
              <li className="list-disc">
                <p className="text-xs">Belum ada catatan</p>
              </li>
            )}
          </ul>
        </ScrollArea>
      </div>

      {/* ORDER UPDATE LOGS */}
      <div
        id="order-updateLogs"
        className="m-2 overflow-auto rounded-md border border-slate-400/50 bg-teal-50"
      >
        <p className="flex w-full items-center justify-start gap-2 rounded-t-sm bg-teal-400 px-2 py-2 text-xs text-white">
          <Logs size={16} />
          <span>Log Perubahan</span>
        </p>
        <ScrollArea className="h-48 min-h-12">
          <ul className="ml-2 p-4">
            {(orderData.updateLogs.length &&
              orderData.updateLogs.map((item) => {
                const { _id, updatedBy, updateInfo, updateTime } = item;
                return (
                  <li key={_id} className="mb-1 list-disc text-xs">
                    <p className="text-[10px] font-semibold text-slate-700">
                      Diupdate oleh: {updatedBy}
                    </p>
                    <p className="">{updateInfo}</p>
                    <p className="text-[10px] text-slate-700">
                      {moment(updateTime).format("DD-MM-YYYY HH:mm")}
                    </p>
                  </li>
                );
              })) || (
              <li className="list-disc">
                <p className="text-xs">Belum terdapat log</p>
              </li>
            )}
          </ul>
        </ScrollArea>
      </div>

      <Invoice order={orderData} session={session as Session} />
    </section>
  );
};

export default SingleOrderSidebar;
