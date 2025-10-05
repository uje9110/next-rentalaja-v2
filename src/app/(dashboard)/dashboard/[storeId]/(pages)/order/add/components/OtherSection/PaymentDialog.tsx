import React, { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import { Session } from "next-auth";
import {
  ClientStoreOrderType,
  StoreOrderType,
} from "@/app/lib/types/store_order_type";
import { X } from "lucide-react";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

type PaymentDialogProps = {
  orderData: StoreOrderType;
  setOrderData: Dispatch<SetStateAction<StoreOrderType>>;
  paymentData: {
    paymentAmount: number;
    paymentMethod: string;
    paymentType: string;
  };
  session: Session;
  handleManualPaymentChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
};

const PaymentDialog: FC<PaymentDialogProps> = ({
  orderData,
  setOrderData,
  paymentData,
  handleManualPaymentChange,
}) => {
  const handleClosePaymentModal = () => {
    const paymentModal = document.getElementById(
      "payment-modal",
    ) as HTMLDialogElement;
    paymentModal.close();
  };

  const handleAddPaymentToOrder = async () => {
    setOrderData((prevState) => {
      return {
        ...prevState,
        paymentRequest: paymentData,
      };
    });

    handleClosePaymentModal();
  };

  return (
    <dialog id="payment-modal" className="phone:w-full w-4/5">
      <div className="modalBackground fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-slate-700/70">
        <div className="modalContainer phone:w-4/5 flex h-2/3 w-1/4 flex-col justify-start gap-4 rounded-lg bg-white p-4 shadow-lg">
          <div className="modalHeader flex w-full justify-between">
            <h3 className="text-lg font-semibold">Tambahkan Pembayaran</h3>
            <span
              className="flex items-center justify-center text-2xl text-red-500"
              onClick={handleClosePaymentModal}
            >
              <X size={14} />
            </span>
          </div>
          <div className="modalBody h-full">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="inputs-wrapper flex flex-col gap-4">
                <div className="item-input-wrapper flex flex-row items-center justify-between gap-2">
                  <label
                    htmlFor="paymentMethod"
                    className="w-[48%] font-semibold"
                  >
                    Metode Pembayaran
                  </label>
                  <select
                    defaultValue=""
                    name="paymentMethod"
                    id="paymentMethod"
                    className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
                    onChange={(e) => {
                      handleManualPaymentChange(e);
                    }}
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    <option value="Cash">Cash</option>
                    {/* <option value="BCA_VA">BCA Virtual Account</option> */}
                    <option value="QRIS">QRIS</option>
                  </select>
                </div>
                <div className="item-input-wrapper flex flex-row items-center justify-between gap-2">
                  <label
                    htmlFor="paymentType"
                    className="w-[48%] font-semibold"
                  >
                    Tipe Pembayaran
                  </label>
                  <select
                    defaultValue=""
                    name="paymentType"
                    id="paymentType"
                    className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
                    onChange={(e) => {
                      handleManualPaymentChange(e);
                    }}
                  >
                    <option value="">Pilih Tipe Pembayaran</option>
                    <option value="partial-payment">Uang Muka</option>
                    <option value="full-payment">Pelunasan</option>
                  </select>
                </div>
                <div className="item-input-wrapper flex flex-row items-center justify-between gap-2">
                  <label
                    htmlFor="paymentAmount"
                    className="w-[48%] font-semibold"
                  >
                    Nominal
                  </label>
                  <div className="relative w-full bg-white">
                    <input
                      placeholder="Contoh: Rp.20.000"
                      required
                      min={0}
                      max={orderData?.total}
                      value={paymentData.paymentAmount}
                      name="paymentAmount"
                      id="paymentAmount"
                      type="number"
                      className="w-full rounded-md border-2 px-2 py-1 text-white"
                      onChange={(e) => handleManualPaymentChange(e)}
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
              </div>

              <button
                className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white"
                onClick={() => {
                  handleAddPaymentToOrder();
                }}
              >
                Tambahkan Cash In
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default PaymentDialog;
