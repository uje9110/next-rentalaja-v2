"use client";
import {
  ClientStoreOrderType,
  StoreOrderType,
} from "@/app/lib/types/store_order_type";
import { ArrowDownFromLine, ArrowUpFromLine, Check, Plus } from "lucide-react";
import React, { Dispatch, FC, SetStateAction } from "react";
import OrderRevertPopover from "../OrderRevert/OrderRevertPopover";
import axios from "axios";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { useSession } from "next-auth/react";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { toast } from "sonner";
import { GlobalUserType } from "@/app/lib/types/global_user_type";

type OrderStatusChangerButtonsProps = {
  orderData: ClientStoreOrderType;
  customerData: GlobalUserType;
  setRevertOrderStatusTo: Dispatch<SetStateAction<string>>;
  setIsRevertOrderDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const OrderStatusChangerButtons: FC<OrderStatusChangerButtonsProps> = ({
  orderData,
  customerData,
  setRevertOrderStatusTo,
  setIsRevertOrderDialogOpen,
}) => {
  const { APIEndpoint } = useAPIContext();
  const { data: session } = useSession();

  if (!session) return null;

  const authHeaders = {
    Authorization: `Bearer ${session.user.token}`,
    "x-store-id": orderData.storeDetail.storeId ?? "",
  };

  /** 🔹 Base PATCH helper */
  const patchRequest = async (url: string, data: object, extraHeaders = {}) => {
    return axios.patch(`${APIEndpoint}${url}`, data, {
      headers: { ...authHeaders, ...extraHeaders },
    });
  };

  /** 🔹 Update order status */
  const updateOrderStatus = async (
    orderId: string,
    statusUpdate: string,
  ): Promise<StoreOrderType | null> => {
    try {
      const orderRes = await patchRequest(`/order/${orderId}`, {
        status: statusUpdate,
        updateLogs: [
          ...orderData.updateLogs,
          {
            updatedBy: `${session.user.firstName} ${session.user.lastName}`,
            updateTime: Date.now(),
            updateInfo: `Order di ubah ke status ${statusUpdate}`,
          },
        ],
      });

      if (orderRes.status === 200) return orderRes.data.json;
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /** 🔹 Update stock status */
  const updateStock = (stockId: string, stockUpdateData: object) => {
    return patchRequest(`/stock/${stockId}`, stockUpdateData);
  };

  /** 🔹 Update pickup/return + order status */
  const updateOrderItemPickUpReturnDetailAndStatus = async (
    orderId: string,
    orderStatus: string,
    pickupOrReturn: "pickupDateTimeInMs" | "returnDateTimeInMs",
  ): Promise<void> => {
    try {
      await patchRequest(`/order/${orderId}`, {
        status: orderStatus,
        updateLogs: [
          ...orderData.updateLogs,
          {
            updatedBy: `${session.user.firstName} ${session.user.lastName}`,
            updateTime: Date.now(),
            updateInfo: `Order di ubah ke status ${orderStatus}`,
          },
        ],
        items: orderData.items.map((item) => ({
          ...item,
          pickupAndReturnDetails: {
            ...item.pickupAndReturnDetails,
            [pickupOrReturn]: Date.now(),
          },
        })),
      });
    } catch (error) {
      console.error(error);
    }
  };

  /** 🔹 Pick up order */
  const pickUpOrder = async (
    orderItems: StoreOrderItemType[],
    orderPaymentStatus: string,
    userMembership: string,
  ) => {
    const isFullyPaid = orderPaymentStatus === "fully-paid";
    const isPrivilegedMember = ["MEMBERSHIP_01", "STAFF_MEMBERSHIP"].includes(
      userMembership,
    );

    if (!isFullyPaid && !isPrivilegedMember) {
      toast.warning(
        "Order harus lunas terlebih dahulu sebelum melakukan Pick Up!",
      );
      return;
    }

    try {
      await Promise.all(
        orderItems.flatMap((item) =>
          item.stockIds.map((stockId) =>
            updateStock(stockId, {
              status: "rented",
              rentedByOrderId: orderData._id!,
            }),
          ),
        ),
      );

      await updateOrderItemPickUpReturnDetailAndStatus(
        orderData._id!,
        "processing",
        "pickupDateTimeInMs",
      );
    } catch (error) {
      console.error("Error updating stocks:", error);
    }
  };

  /** 🔹 Return order */
  const returnOrder = async (orderItems: StoreOrderItemType[]) => {
    try {
      await Promise.all(
        orderItems.flatMap((item) =>
          item.stockIds.map((stockId) =>
            updateStock(stockId, { status: "available", rentedByOrderId: "" }),
          ),
        ),
      );

      await updateOrderItemPickUpReturnDetailAndStatus(
        orderData._id!,
        "completed",
        "returnDateTimeInMs",
      );
    } catch (error) {
      console.error("Error updating stocks:", error);
    }
  };

  /** 🔹 Render buttons by status */
  const renderButtons = () => {
    switch (orderData.status) {
      case "pending":
        return (
          <>
            <ActionButton
              onClick={() => updateOrderStatus(orderData._id!, "confirmed")}
              color="bg-cyan-400"
              icon={<Check size={16} />}
              label="CONFIRM"
            />
            <ActionButton
              onClick={() => updateOrderStatus(orderData._id!, "canceled")}
              color="bg-red-500"
              icon={<Plus size={16} className="rotate-45" />}
              label="CANCEL"
            />
          </>
        );
      case "confirmed":
        return (
          <ActionButton
            onClick={() =>
              pickUpOrder(
                [...orderData.items, ...(orderData.additionalItems ?? [])],
                orderData.paymentStatus!,
                customerData.membershipId,
              )
            }
            color="bg-yellow-500"
            icon={<ArrowUpFromLine size={16} />}
            label="PICK UP"
          />
        );
      case "processing":
        return (
          <ActionButton
            onClick={() =>
              returnOrder([
                ...orderData.items,
                ...(orderData.additionalItems ?? []),
              ])
            }
            color="bg-green-500"
            icon={<ArrowDownFromLine size={16} />}
            label="RETURN"
          />
        );
      case "completed":
        return (
          <ActionButton
            disabled
            color="bg-green-500"
            icon={<Check size={16} />}
            label="COMPLETED"
          />
        );
      case "canceled":
        return (
          <p className="font-semibold text-red-600 uppercase">
            Order Dibatalkan
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="phone:w-full phone:flex phone:flex-row phone:justify-center relative flex w-2/5 items-center justify-end gap-1 lg:w-fit">
      {renderButtons()}
      <OrderRevertPopover
        orderData={orderData}
        setRevertOrderStatusTo={setRevertOrderStatusTo}
        setIsRevertOrderDialogOpen={setIsRevertOrderDialogOpen}
      />
    </div>
  );
};

/** 🔹 Reusable action button */
const ActionButton: FC<{
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
  disabled?: boolean;
}> = ({ onClick, icon, label, color, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-row items-center justify-center gap-2 rounded-md px-3 py-1 text-xs font-semibold text-white ${color} ${
      disabled ? "cursor-not-allowed opacity-70" : ""
    }`}
  >
    <span className="text-sm">{icon}</span>
    <span>{label}</span>
  </button>
);

export default OrderStatusChangerButtons;
