import axios from "axios";
import { CheckCircle, Loader, TriangleAlert, XCircle } from "lucide-react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import PaymentRefund from "./PaymentRefund";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { StoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { toast } from "sonner";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { StoreOrderUpdateLogType } from "@/app/lib/types/store_order_updateLogs_type";
import { validateObj } from "@/app/lib/utils/ValidationHandler";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface RevertOrderDialogType {
  setIsRevertOrderDialogOpen: Dispatch<SetStateAction<boolean>>;
  orderData: ClientStoreOrderType;
  revertOrderStatusTo: string;
}

const RevertOrderDialog: FC<RevertOrderDialogType> = ({
  setIsRevertOrderDialogOpen,
  orderData,
  revertOrderStatusTo,
}) => {
  const { APIEndpoint } = useAPIContext();
  const { data: session } = useSession();
  const router = useRouter();

  const stockEndpoint = `${APIEndpoint}/stock`;
  const orderEndpoint = `${APIEndpoint}/order`;
  const paymentEndpoint = `${APIEndpoint}/payment`;

  const [paymentChanneledOrderNum, setPaymentChanneledOrderNum] = useState(0);
  const [existedPaymentAction, setExistedPaymentAction] = useState<
    string | undefined
  >();
  const [updateInfo, setUpdateInfo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRevertOrderStatusSuccesed, setIsRevertOrderStatusSuccesed] =
    useState<boolean | undefined>();
  const [paymentRefundData, setPaymentRefundData] =
    useState<StoreOrderPaymentType>({
      orderID: orderData._id,
      createdBy: session?.user.id,
      paymentAmount: 0,
      paymentMethod: "",
      paymentType: "Refund",
      paymentDesc: "",
      type: "outcome",
      paidBy: `${orderData.billing.firstName} ${orderData.billing.lastName}`,
      isUsingXendit: false,
      xenditPayment: null,
      qrLink: "",
    });

  useEffect(() => {
    setPaymentRefundData((prevState) => {
      return {
        ...prevState,
        orderID: orderData._id,
      };
    });
  }, [orderData]);

  const getStatusStyle = (status: string): React.CSSProperties => {
    switch (status.toLocaleLowerCase()) {
      case "confirmed":
        return { backgroundColor: "rgb(34 211 238)" };
      case "processing":
        return { backgroundColor: "rgb(234 179 8)" };
      case "completed":
        return { backgroundColor: "rgb(34 197 94)" };
      case "canceled":
        return { backgroundColor: "rgb(217 18 18)" };
      default:
        return { backgroundColor: "rgb(59 130 246)" };
    }
  };

  const updateAllStocks = async (
    orderData: ClientStoreOrderType,
    updateType: string,
  ) => {
    const stockUpdateData =
      updateType === "processing"
        ? { status: "rented", rentedByOrderId: orderData._id }
        : { status: "available", rentedByOrderId: "" };

    const token = session?.user.token;
    const storeId = orderData.storeDetail.storeId;
    const stockUpdatePromises = orderData.items.flatMap((item) =>
      item.stockIds.map((stockId) =>
        axios.patch(`${stockEndpoint}/${stockId}`, stockUpdateData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-store-id": storeId,
          },
        }),
      ),
    );

    await Promise.all(stockUpdatePromises);
  };

  const channelPaymentUpdate = async (orderData: ClientStoreOrderType) => {
    try {
      const updateOrderToDeletePaymentIdsRes = await axios.patch(
        `${orderEndpoint}/${orderData._id}`,
        {
          paymentIds: [],
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "x-request-type": "updatePayments",
            "x-store-id": orderData.storeDetail.storeId,
          },
        },
      );

      if (updateOrderToDeletePaymentIdsRes.status === 200) {
        const updateOrderToAddPaymentIdsRes = await axios.patch(
          `${orderEndpoint}/ORDER-${paymentChanneledOrderNum}`,
          {
            paymentIds: orderData.paymentIds,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
              "x-request-type": "updatePayments",
              "x-store-id": orderData.storeDetail.storeId,
            },
          },
        );

        if (updateOrderToAddPaymentIdsRes.status === 200) {
          const updatePaymentIdsPromises = orderData.paymentDetails.map(
            ({ _id }) =>
              axios.patch(
                `${paymentEndpoint}/${_id}`,
                { orderID: `ORDER-${paymentChanneledOrderNum}` },
                {
                  headers: {
                    Authorization: `Bearer ${session?.user.token}`,
                    "x-store-id": orderData.storeDetail.storeId,
                  },
                },
              ),
          );

          await Promise.all(updatePaymentIdsPromises);
          await updateAllStocks(
            updateOrderToAddPaymentIdsRes.data.order[0],
            revertOrderStatusTo,
          );
          return true;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const refundPaymentUpdate = async (orderData: ClientStoreOrderType) => {
    function isFile(value: Blob): value is File {
      return value instanceof File;
    }
    const paymentRefundDataValidation = validateObj(paymentRefundData, []);

    // Exit early if validation fails
    if (
      !paymentRefundDataValidation.validationSuccess ||
      paymentRefundData.paymentAmount <= 0
    ) {
      toast.error(`Kolom ${paymentRefundDataValidation.msg} masih kosong!`);
      return false;
    }

    try {
      const refundFormData = new FormData();
      Object.entries(paymentRefundData).forEach(([key, value]) => {
        if (value instanceof Blob) {
          // Check if it's a File to safely access `.name`
          const filename = isFile(value) ? value.name : "file";
          refundFormData.append(key, value, filename);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof Blob) {
              const filename = isFile(item) ? item.name : "file";
              refundFormData.append(`${key}[${index}]`, item, filename);
            } else {
              refundFormData.append(`${key}[${index}]`, item);
            }
          });
        } else if (value !== undefined && value !== null) {
          refundFormData.append(key, value.toString());
        }
      });
      // Create a refund payment
      const createRefundPaymentRes = await axios.post(
        paymentEndpoint,
        refundFormData,
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "x-request-type": "updateOrderStatus",
            "x-store-id": orderData.storeDetail.storeId,
          },
        },
      );

      if (createRefundPaymentRes.status === 200) {
        // Update the order with the new refund payment ID
        const updateRefundOrderPayments = await axios.patch(
          `${orderEndpoint}/${orderData._id}`,
          {
            paymentIds: [
              ...orderData.paymentDetails.map(({ _id }) => _id),
              createRefundPaymentRes.data._id,
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
              "x-request-type": "updatePayments",
              "x-store-id": orderData.storeDetail.storeId,
            },
          },
        );

        if (updateRefundOrderPayments.status === 200) {
          console.log("Refund processed and order updated successfully.");
          return true;
        }
      }

      // If we reached here, one of the API calls failed
      console.error("Failed to update order with refund payment.");
    } catch (error) {
      console.error("Error processing refund:", error);
      return false;
      // Ensure failure state is set
    }
  };

  const submitOrderStatusRevert = async () => {
    setLoading(true);
    // let cancelOrderExecSuccess;

    if (!updateInfo) {
      setErrorMsg("Alasan masih kosong!");
      setLoading(false);
      return;
    }

    // Prepare the update payload
    const updatePayload: {
      status: string;
      updateLogs: StoreOrderUpdateLogType[];
      items: StoreOrderItemType[];
    } = {
      status: revertOrderStatusTo,
      updateLogs: [
        ...orderData.updateLogs,
        {
          updatedBy: `${session?.user.firstName} ${session?.user.lastName}`,
          updateTime: new Date(),
          updateInfo: `Order di ubah ke status ${revertOrderStatusTo}, ${updateInfo}`,
        },
      ],
      items: orderData.items,
    };

    // Handle specific status updates
    if (revertOrderStatusTo === "processing") {
      updatePayload.items = updatePayload.items.map((item) => ({
        ...item,
        pickupAndReturnDetails: {
          ...item.pickupAndReturnDetails,
          pickupDateTimeInMs: Date.now(),
        },
      }));
    } else if (revertOrderStatusTo === "completed") {
      updatePayload.items = updatePayload.items.map((item) => ({
        ...item,
        pickupAndReturnDetails: {
          ...item.pickupAndReturnDetails,
          returnDateTimeInMs: Date.now(),
        },
      }));
    } else if (
      revertOrderStatusTo === "canceled" &&
      orderData.total !== 0 &&
      existedPaymentAction
    ) {
      try {
        if (existedPaymentAction === "refund") {
          await refundPaymentUpdate(orderData);
        } else if (existedPaymentAction === "channel") {
          await channelPaymentUpdate(orderData);
        }
      } catch (error) {
        console.error("Failed to process refund or channel", error);
      }
    }

    // Attempt to update the order
    try {
      const updateOrderRes = await axios.patch(
        `${orderEndpoint}/${orderData._id}`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "x-request-type": "updateOrderStatus",
            "x-store-id": orderData.storeDetail.storeId,
          },
        },
      );

      if (updateOrderRes.status === 200) {
        await updateAllStocks(updateOrderRes.data.json, revertOrderStatusTo);
        router.refresh();
        setIsRevertOrderStatusSuccesed(true);
        setIsRevertOrderDialogOpen(false);
      } else {
        setIsRevertOrderDialogOpen(false);
        throw new Error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setIsRevertOrderStatusSuccesed(false);
      setIsRevertOrderDialogOpen(false);
    } finally {
      setLoading(false);
      setIsRevertOrderDialogOpen(false);
    }
  };

  return (
    <div
      id="revert-dialog"
      className="flex h-full w-full flex-col gap-2 rounded-lg bg-white"
    >
      {/* DIALOG BODY */}
      <div
        className={`flex h-full w-full flex-col gap-4 overflow-auto border-y-2 px-4 py-2`}
      >
        {/* TEXT WARNING */}
        <div className="flex w-full flex-col gap-1">
          <p className="flex w-full items-center gap-2">
            <span className="text-red-500">
              <TriangleAlert size={16} />
            </span>
            <span className="font-semibold text-red-500">Perhatian</span>
          </p>
          <p className="w-full rounded-md border border-red-400/50 bg-red-100 p-2 text-start text-xs text-slate-600">
            Perubahan status order lewat menu ini dimaksudkan apabila terdapat
            suatu <i>flow order</i> yang tidak sesuai prosedur. Oleh karenanya,
            beri alasan mengapa perubahan status order dilakukan melalui menu
            ini.
          </p>
        </div>

        {/* CHANGE STATUS */}
        <div className="flex w-full flex-col gap-1 text-xs">
          <div className="flex w-full items-center justify-start">
            <p className="w-3/6 font-semibold text-slate-400">
              Status Sebelumnya
            </p>
            <p className="w-[5%]">:</p>
            <p
              style={getStatusStyle(orderData.status as string)}
              className="w-fit rounded-md bg-black px-2 py-1 text-white capitalize"
            >
              {orderData.status}
            </p>
          </div>
          <div className="flex w-full items-center justify-start">
            <p className="w-3/6 font-semibold text-slate-400">
              Diubah Ke Status
            </p>
            <p className="w-[5%]">:</p>
            <p
              style={getStatusStyle(revertOrderStatusTo as string)}
              className="w-fit rounded-md bg-black px-2 py-1 text-white capitalize"
            >
              {revertOrderStatusTo}
            </p>
          </div>
          <div className="flex w-full flex-col justify-start gap-2">
            <label
              htmlFor="change-note"
              className="w-full font-semibold text-slate-400"
            >
              Catatan Perubahan
            </label>
            <textarea
              id="change-note"
              placeholder="Contoh alasan: Diubah ke processing, tidak jadi qris, jadinya transfer"
              className="border-colorSecondary/50 h-24 w-full rounded-md border-2 p-2"
              onChange={(e) => {
                const { value } = e.target;
                setUpdateInfo(value);
              }}
            />
            {errorMsg ? <p className="text-red-500">{errorMsg}</p> : null}
          </div>
        </div>

        {/* ORDER PAYMENT */}
        {revertOrderStatusTo === "canceled" ? (
          <PaymentRefund
            orderData={orderData}
            existedPaymentAction={existedPaymentAction}
            setExistedPaymentAction={setExistedPaymentAction}
            paymentRefundData={paymentRefundData}
            setPaymentRefundData={setPaymentRefundData}
            setPaymentChanneledOrderNum={setPaymentChanneledOrderNum}
          />
        ) : null}
      </div>

      {/* DIALOG FOOTER */}
      <div className="flex h-[10%] w-full items-center justify-end gap-2 px-4 py-2">
        {isRevertOrderStatusSuccesed ===
        undefined ? null : isRevertOrderStatusSuccesed === true ? (
          <p className="flex w-2/3 items-center justify-end gap-2 text-[10px] text-green-600">
            <span>
              <CheckCircle size={16} />
            </span>
            <span>Status berhasil diubah</span>
          </p>
        ) : (
          <p className="flex w-2/3 items-center justify-end gap-2 text-[10px] text-red-500">
            <span>
              <XCircle size={16} />
            </span>
            <span>Status gagal diubah, coba lagi</span>
          </p>
        )}
        <button
          disabled={loading ? true : false}
          onClick={() => submitOrderStatusRevert()}
          className="bg-colorSecondary w-1/3 rounded-md px-2 py-1 text-xs text-white disabled:bg-slate-500"
        >
          {loading ? (
            <p className="flex items-center justify-center">
              <Loader className="animate-spin" size={14} />
              <span>loading...</span>
            </p>
          ) : (
            <p>Ubah Status</p>
          )}
        </button>
      </div>
    </div>
  );
};

export { RevertOrderDialog };
