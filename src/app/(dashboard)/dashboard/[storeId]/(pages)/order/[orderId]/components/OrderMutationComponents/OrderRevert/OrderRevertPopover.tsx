import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PopoverContent } from "@/components/ui/popover";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import {
  Archive,
  Calendar,
  Check,
  Grip,
  Inbox,
  LoaderCircle,
  X,
} from "lucide-react";
import React, { Dispatch, FC, SetStateAction } from "react";
import RescheduleDialogContent from "../Reschedule/RescheduleDialogContent";

interface RevertOrderMenuPopoverProps {
  orderData: ClientStoreOrderType;
  setRevertOrderStatusTo: Dispatch<SetStateAction<string>>;
  setIsRevertOrderDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const OrderRevertPopover: FC<RevertOrderMenuPopoverProps> = ({
  orderData,
  setRevertOrderStatusTo,
  setIsRevertOrderDialogOpen,
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="phone:flex phone:flex-row phone:items-center phone:px-3 phone:py-1 phone:gap-2 rounded-sm border border-slate-400/50 bg-sky-100 p-1">
          <Grip size={16} className="text-slate-600" />
          <p className="lg:hidden">Other</p>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full p-0">
        <div
          id="revert-action-body"
          className="flex w-full flex-col text-xs text-slate-500 capitalize"
        >
          <Dialog>
            <DialogTrigger>
              <p className="flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-300">
                <span className="text-blue-300">
                  <Calendar size={16} />
                </span>
                <span>Reschedule</span>
              </p>
            </DialogTrigger>
            <DialogContent className="phone:w-full phone:p-4 phone:rounded-md flex h-[800px] min-h-[600px] w-2/6 flex-col items-start justify-start lg:w-1/3">
              <DialogTitle>Reschedule Item</DialogTitle>
              <DialogDescription>
                Atur ulang jadwal alat yang disewa.
              </DialogDescription>
              <RescheduleDialogContent orderData={orderData} />
            </DialogContent>
          </Dialog>
          <button
            onClick={() => {
              setRevertOrderStatusTo("pending");
              setIsRevertOrderDialogOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-300"
          >
            <span className="text-yellow-300">
              <LoaderCircle size={16} />
            </span>
            <span>Ubah ke pending</span>
          </button>
          <button
            onClick={() => {
              setRevertOrderStatusTo("confirmed");
              setIsRevertOrderDialogOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-300"
          >
            <span className="text-blue-400">
              <Check size={16} />
            </span>
            <span>Ubah ke confirmed</span>
          </button>
          <button
            onClick={() => {
              setRevertOrderStatusTo("processing");
              setIsRevertOrderDialogOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-300"
          >
            <span className="text-yellow-500">
              <Archive size={16} />
            </span>
            <span>Ubah ke processing</span>
          </button>
          <button
            onClick={() => {
              setRevertOrderStatusTo("completed");
              setIsRevertOrderDialogOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-300"
          >
            <span className="text-green-400">
              <Inbox size={16} />
            </span>
            <span>Ubah ke completed</span>
          </button>
          <button
            onClick={() => {
              setRevertOrderStatusTo("canceled");
              setIsRevertOrderDialogOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-300"
          >
            <span className="text-red-400">
              <X size={16} />
            </span>
            <span>Ubah ke canceled</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OrderRevertPopover;
