import axios from "axios";
import { Session } from "next-auth";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import {
  ClientStoreOrderPaymentType,
  ClientStorePaymentRequest,
} from "@/app/lib/types/store_order_payment_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { toast } from "sonner";
import { useAPIContext } from "@/app/lib/context/ApiContext";

interface OrderPaymentDialogType {
  orderData: ClientStoreOrderType;
  session: Session;
  setIsPaymentDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const OrderPaymentDialog: FC<OrderPaymentDialogType> = ({
  orderData,
  session,
  setIsPaymentDialogOpen,
}) => {
  const queryClient = useQueryClient();

  const { APIEndpoint } = useAPIContext();
  const [isLoading, setIsLoading] = useState(false);

  const [paymentData, setPaymentData] = useState<ClientStorePaymentRequest>({
    paymentAmount: 0,
    paymentMethod: "",
    paymentType: "",
    paymentDesc: "",
  });

  const paymentRequestData = {
    byAdmin: { isByAdmin: true, adminId: session.user.id },
    orderId: orderData._id,
    storeId: orderData.storeDetail.storeId,
    paymentData,
    orderTotal: orderData.total,
    billing: orderData.billing,
  };

  const paymentInputsChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "paymentAmount" && paymentData.paymentType !== "Denda") {
      const maxValue =
        orderData.total -
        orderData.paymentDetails.reduce((total, payment) => {
          return payment.paymentAmount + total;
        }, 0);

      // Ensure the value is numeric before applying Math.min
      const numericValue = Number(value);

      // Ensure the value does not exceed the max or fall below the min
      const newValue = Math.min(Math.max(numericValue, 0), maxValue); // Also ensures value doesn't go below 0

      setPaymentData((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));
    } else {
      setPaymentData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const createPayment = async (
    orderId: string,
  ): Promise<ClientStoreOrderType | undefined> => {
    try {
      const response = await axios.patch(
        `${APIEndpoint}/order/${orderId}/add-order-payment`,
        {
          ...paymentRequestData,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
            "x-store-id": orderData?.storeDetail?.storeId as string,
          },
        },
      );
      return response.data.order;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  const paymentMutation = useMutation({
    mutationKey: ["mutationKey"],
    mutationFn: () => createPayment(orderData._id as string),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderData"] });
      setIsPaymentDialogOpen(false);
    },
  });

  const submitPaymentData = (
    e: FormEvent,
    paymentArr: ClientStoreOrderPaymentType[],
    orderTotal: number,
  ) => {
    e.preventDefault();

    const paymentAmountInput = document.getElementById(
      "paymentAmount-input",
    ) as HTMLInputElement;
    if (!paymentAmountInput) {
      return;
    }

    const paymentTotal = paymentArr.reduce((total, item) => {
      return total + item.paymentAmount;
    }, 0);

    const remainderMoneyAmount = orderTotal - paymentTotal;

    if (Number(paymentAmountInput.value) <= remainderMoneyAmount) {
      paymentMutation.mutate();
    } else if (
      paymentData.paymentType === "Denda" &&
      Number(paymentAmountInput.value) > remainderMoneyAmount
    ) {
      paymentMutation.mutate();
    } else if (remainderMoneyAmount === 0) {
      toast.warning(
        `Tidak bisa menambahkan pembayaran ke dalam order yang sudah lunas!`,
      );
    } else {
      toast.success("QRCODE berhasil dikirim ke email customer");
    }
  };

  return (
    <div>
      <div className="dialog-body phone:flex-col phone:w-full flex h-5/6 w-[600px] flex-row gap-2 text-sm">
        {/* PAYMENT DETAIL */}
        <div className="phone:w-full phone:border-0 flex h-full w-2/5 flex-col gap-2 border-slate-400/50 py-3">
          <div id="order-price-info" className="flex w-full flex-col gap-2">
            {/* TOTAL AMOUNT */}
            <div className="flex w-full flex-row border-slate-400/50">
              <p className="w-1/2">Total</p>
              <p className="w-1/2 text-end">
                {CurrencyHandlers.changeToLocaleCurrency(orderData.total)}
              </p>
            </div>
            {/* PARTIAL PAYMENT */}
            <div className="flex w-full flex-row font-semibold">
              <p className="w-1/2">Terbayar</p>
              <p className="w-1/2 text-end">
                {CurrencyHandlers.changeToLocaleCurrency(
                  orderData.paymentDetails.reduce((total, item) => {
                    return total + item.paymentAmount;
                  }, 0),
                )}
              </p>
            </div>
            {/* REMAINDER PAYMENT */}
            <div className="flex w-full flex-row">
              <p className="w-1/2">Sisa</p>
              <p className="w-1/2 text-end">
                {CurrencyHandlers.changeToLocaleCurrency(
                  orderData.total -
                    orderData.paymentDetails.reduce((total, item) => {
                      return total + item.paymentAmount;
                    }, 0),
                )}
              </p>
            </div>
          </div>
        </div>

        {/* PAYMENT ACTION */}
        <div className="phone:w-full flex h-full w-3/5 flex-col justify-between">
          <form
            id="add-payment-form"
            className="h-full"
            onSubmit={(e) =>
              submitPaymentData(e, orderData.paymentDetails, orderData.total)
            }
          >
            <div
              id="payment-action-wrapper"
              className="flex h-5/6 w-full flex-col items-center justify-center gap-2 px-4"
            >
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full flex-col items-start justify-between">
                  <label
                    htmlFor="paymentAmount-input"
                    className="text-xs font-semibold text-slate-600"
                  >
                    Jumlah Pembayaran
                  </label>
                  <div className="relative w-full bg-white">
                    <input
                      required
                      placeholder="Contoh: Rp.20.000"
                      min={0}
                      max={orderData.total}
                      value={paymentData.paymentAmount}
                      name="paymentAmount"
                      id="paymentAmount-input"
                      type="number"
                      className="w-full rounded-md border-2 px-2 py-1 text-white"
                      onChange={(e) => paymentInputsChange(e)}
                    />
                    <span className="absolute top-1/2 left-2 -translate-y-1/2 text-black">
                      {paymentData.paymentAmount
                        ? CurrencyHandlers.changeToLocaleCurrency(
                            paymentData.paymentAmount,
                          )
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor=""
                    className="text-xs font-semibold text-slate-600"
                  >
                    Jenis
                  </label>
                  <select
                    name="paymentType"
                    id="paymentType"
                    onChange={(e) => paymentInputsChange(e)}
                    className="w-full rounded-md border-2 border-slate-400/40 bg-white p-2 py-1 text-xs shadow-sm"
                  >
                    <option value="">Pilih Jenis Pembayaran</option>
                    <option value="partial-payment">Uang Muka</option>
                    <option value="full-payment">Pelunasan</option>
                    <option
                      value="Denda"
                      disabled={
                        orderData.paymentStatus !== "fully-paid" ? true : false
                      }
                    >
                      Denda
                    </option>
                  </select>
                </div>
              </div>
              <span className="w-full text-start text-[10px] leading-[12px] text-red-500 italic">
                *Denda bisa ditambahkan bila pembayaran fully-paid
              </span>
              <div className="flex w-full flex-col gap-2">
                <label
                  htmlFor=""
                  className="text-xs font-semibold text-slate-600"
                >
                  Metode
                </label>
                <select
                  name="paymentMethod"
                  id="paymentMethod"
                  onChange={(e) => paymentInputsChange(e)}
                  className="w-full rounded-md border-2 border-slate-400/40 bg-white p-2 py-1 text-xs shadow-sm"
                >
                  <option value="">Pilih Metode Pembayaran</option>
                  <option value="Cash">Cash</option>
                  {/* <option value="BCA_VA">BCA Virtual Account</option> */}
                  <option value="QRIS">QRIS</option>
                </select>
              </div>
              <div className="flex w-full gap-2">
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor=""
                    className="text-xs font-semibold text-slate-600"
                  >
                    Catatan
                  </label>
                  <textarea
                    onChange={(e) => paymentInputsChange(e)}
                    name="paymentDesc"
                    className="w-full rounded-md border-2 border-slate-400/40 bg-white p-2 py-1 text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>
            <div className="phone:bg-white flex h-1/6 flex-row items-center justify-end gap-2 p-2 text-xs">
              {isLoading ? (
                <p className="flex h-8 gap-2 rounded-lg border-2 bg-slate-700 px-2 py-1 text-white">
                  <span className="animate-spin">
                    <Loader size={12} />
                  </span>
                  <span>Menginput pembayaran...</span>
                </p>
              ) : (
                <input
                  type="submit"
                  className="bg-colorSecondary h-8 rounded-lg border-2 px-2 py-1 text-white"
                  value={"Submit Pembayaran"}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentDialog;
