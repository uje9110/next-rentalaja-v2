import { useAPIContext } from "@/app/lib/context/ApiContext";
import { StoreOrderNoteType } from "@/app/lib/types/store_order_note_type";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader, Pencil, XCircle } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type OrderNoteDialogType = {
  setIsOrderNoteDialogOpen: Dispatch<SetStateAction<boolean>>;
  orderData: ClientStoreOrderType;
  session: Session;
};

const OrderNoteDialog: FC<OrderNoteDialogType> = ({
  orderData,
  session,
  setIsOrderNoteDialogOpen,
}) => {
  const { APIEndpoint } = useAPIContext();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState({
    fromOrderId: "",
    userId: "",
    userEmail: "",
    note: "",
  });

  useEffect(() => {
    setOrderNote((prevState) => {
      return {
        ...prevState,
        fromOrderId: orderData._id as string,
        userId: session.user.id,
        userEmail: session.user.email,
      };
    });
  }, [orderData._id, session]);

  const handleOrderNoteInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderNote((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const orderNoteMutation = useMutation({
    mutationFn: async (): Promise<StoreOrderNoteType | null> => {
      try {
        const response = await axios.post(
          `${APIEndpoint}/order/${orderData._id}/add-order-note`,
          orderNote,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
              "x-store-id": orderData.storeDetail.storeId,
            },
          },
        );
        if (response.status === 200) {
          router.refresh();
        }
        return response.data.json;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    onSuccess: () => {
      setIsOrderNoteDialogOpen(false);
      setIsLoading(false);
    },
    onError: () => {
      setMessage("Gagal menambahkan catatan.");
      setIsLoading(false);
    },
    onMutate: () => {
      setIsLoading(true);
    },
  });

  const handleOrderNoteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    orderNoteMutation.mutate();
  };

  return (
    <div className="flex h-100 w-full flex-col gap-8 p-4">
      <div id="order-note-body" className="h-full">
        <textarea
          name="note"
          id="note"
          onChange={(e) => handleOrderNoteInput(e)}
          className="2 h-[90%] w-full rounded-sm border border-slate-400/50 p-4 lg:h-[90%]"
        />
        <div className="flex w-full justify-between">
          <div>
            {message ? (
              <p className="flex w-1/2 items-center justify-end gap-2 text-red-500">
                <span>
                  <XCircle size={16} />
                </span>
                <span>{message}</span>
              </p>
            ) : null}
          </div>
          <button
            disabled={isLoading}
            className="bg-colorSecondary w-fit rounded-sm px-4 py-2 text-xs text-white disabled:bg-gray-400"
            onClick={(e) => handleOrderNoteSubmit(e)}
          >
            {isLoading ? (
              <p className="flex items-center justify-center">
                <Loader size={14} className="animate-spin" />
                Loading
              </p>
            ) : (
              <p className="flex items-center justify-center">
                <Pencil size={14} />
                Buat Catatan Order
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderNoteDialog;
