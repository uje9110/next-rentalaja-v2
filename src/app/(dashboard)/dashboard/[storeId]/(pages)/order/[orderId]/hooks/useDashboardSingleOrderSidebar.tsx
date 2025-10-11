"use client";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { GlobalUserType } from "@/app/lib/types/global_user_type";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface OrderNoteType {
  _id?: string;
  createdAt: Date;
  fromOrderId: string;
  userId: string;
  userEmail: string;
  note: string;
  userDetails?: GlobalUserType;
}

export function useDashboardSingleOrderSidebar(
  orderData: ClientStoreOrderType,
) {
  const { APIEndpoint, ServiceEndpoint } = useAPIContext();
  const { data: session } = useSession();

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPaymentDetailDialogOpen, setIsPaymentDetailDialogOpen] =
    useState(false);
  const [isOrderNoteDialogOpen, setIsOrderNoteDialogOpen] = useState(false);

  const handleOpenPrinting = () => {
    const invoiceModal = document.getElementById(
      "invoice-modal",
    ) as HTMLDialogElement | null;
    invoiceModal?.showModal();
  };

  const { data: orderNotes } = useQuery({
    queryKey: ["orderNotes"],
    queryFn: async (): Promise<OrderNoteType[] | []> => {
      try {
        const orderNotesRes = await axios.get(
          `${APIEndpoint}/order-note/${orderData._id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
              "x-store-id": orderData.storeDetail.storeId,
            },
          },
        );
        if (orderNotesRes.status === 200) {
          return orderNotesRes.data.json;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  const overdueNotification = useMutation({
    mutationFn: async () => {
      try {
        await axios.post(
          `${ServiceEndpoint}/notification/wa/booking_overdue`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          },
        );
       
      } catch (error) {
        console.log(error);
      }
    },
  });

  return {
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    isPaymentDetailDialogOpen,
    setIsPaymentDetailDialogOpen,
    isOrderNoteDialogOpen,
    setIsOrderNoteDialogOpen,
    orderNotes,
    handleOpenPrinting,
    overdueNotification,
  };
}
