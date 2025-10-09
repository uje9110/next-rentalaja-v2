import { StoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import React, { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

interface PaymentRefundProps {
  orderData: ClientStoreOrderType;
  existedPaymentAction: string | undefined;
  setExistedPaymentAction: Dispatch<SetStateAction<string | undefined>>;
  paymentRefundData: StoreOrderPaymentType;
  setPaymentRefundData: Dispatch<SetStateAction<StoreOrderPaymentType>>;
  setPaymentChanneledOrderNum: Dispatch<SetStateAction<number>>;
}

const PaymentRefund: FC<PaymentRefundProps> = ({
  orderData,
  existedPaymentAction,
  setExistedPaymentAction,
  paymentRefundData,
  setPaymentRefundData,
  setPaymentChanneledOrderNum,
}) => {
  const handleChanneledPaymentOrderNum = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPaymentChanneledOrderNum(Number(value));
  };

  const handlePaymentRefundChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "paymentAmount") {
      const maxValue = orderData.total; // Assuming orderData.total is your max value

      // Ensure the value is numeric before applying Math.min
      const numericValue = Number(value);

      // Ensure the value does not exceed the max or fall below the min
      const newValue = Math.min(Math.max(numericValue, 0), maxValue); // Also ensures value doesn't go below 0

      setPaymentRefundData((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));
    } else {
      setPaymentRefundData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleExistedPaymentAction = (value: string) => {
    setExistedPaymentAction(value);
  };

  return (
    <div className="flex w-full flex-col gap-1 text-xs">
      {orderData.paymentDetails.length > 0 ? (
        // PAYMENT ACTIONS WRAPPER
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <p
              onClick={() => handleExistedPaymentAction("refund")}
              className="w-1/2 cursor-pointer border-b-2 py-1 text-center text-[10px]"
              style={
                existedPaymentAction === "refund"
                  ? { borderColor: "#07BEAF" }
                  : {}
              }
            >
              Refund Pembayaran
            </p>
            <p
              onClick={() => handleExistedPaymentAction("channel")}
              className="w-1/2 cursor-pointer border-b-2 py-1 text-center text-[10px]"
              style={
                existedPaymentAction === "channel"
                  ? { borderColor: "#07BEAF" }
                  : {}
              }
            >
              Pindahkan Pembayaran
            </p>
          </div>

          {/* PAYMENTS SUMMARY */}
          <p className="text-[10px] text-sky-500">
            Terdapat {orderData.paymentDetails.length} pembayaran dalam order
            ini, dengan total{" "}
            {CurrencyHandlers.changeToLocaleCurrency(
              orderData.paymentDetails.reduce((total, payment) => {
                return total + payment.paymentAmount;
              }, 0),
            )}
            .
          </p>

          <div className="flex w-full flex-col text-xs">
            {existedPaymentAction === "refund" ? (
              <form
                id="refund-payment-form"
                className="flex w-full flex-col gap-1"
              >
                {/* PAYMENT ORDER ID  */}
                <div className="flex w-full flex-row items-center gap-2">
                  <label htmlFor="orderID" className="w-1/2 text-slate-600">
                    Order ID :
                  </label>
                  <input
                    name="orderID"
                    id="orderID"
                    type="text"
                    disabled
                    value={paymentRefundData.orderID}
                    onChange={(e) => handlePaymentRefundChange(e)}
                    className="w-1/2 rounded-md bg-white p-1"
                  />
                </div>
                {/* PAYMENT AMOUNT */}
                <div className="flex w-full flex-row items-center gap-2">
                  <label
                    htmlFor="paymentAmount"
                    className="w-1/2 text-slate-600"
                  >
                    Jumlah Refund :
                  </label>
                  <div className="relative w-full bg-white">
                    <input
                      required
                      placeholder="Contoh: Rp.20.000"
                      min={0}
                      max={paymentRefundData?.paymentAmount}
                      name="paymentAmount"
                      id="paymentAmount-input"
                      type="number"
                      className="w-full rounded-md border-2 px-2 py-1 text-white"
                      onChange={(e) => handlePaymentRefundChange(e)}
                    />
                    <span className="absolute top-1/2 left-2 -translate-y-1/2 text-black">
                      {paymentRefundData?.paymentAmount
                        ? CurrencyHandlers.changeToLocaleCurrency(
                            paymentRefundData?.paymentAmount,
                          )
                        : ""}
                    </span>
                  </div>
                </div>
                {/* PAYMENT METHOD */}
                <div className="flex w-full flex-row items-center gap-2">
                  <label
                    htmlFor="paymentMethod"
                    className="w-1/2 text-slate-600"
                  >
                    Metode Refund :
                  </label>
                  <select
                    name="paymentMethod"
                    id="paymentMethod"
                    onChange={(e) => handlePaymentRefundChange(e)}
                    className="w-1/2 rounded-md border-2 border-slate-300 bg-white p-[2px] text-xs disabled:border-[0px]"
                  >
                    <option value="">Pilih metode refund</option>
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                {/* PAYMENT AMOUNT */}
                <div className="flex w-full flex-col items-start gap-2">
                  <label htmlFor="paymentDesc" className="w-1/2 text-slate-600">
                    Deskripsi Refund :
                  </label>
                  <textarea
                    name="paymentDesc"
                    id="paymentDesc"
                    onChange={(e) => handlePaymentRefundChange(e)}
                    className="w-full rounded-md border-2 border-slate-300 bg-white p-1 text-xs"
                  />
                </div>
              </form>
            ) : (
              <div className="flex w-full flex-col gap-1">
                <p className="flex w-full items-center gap-2 text-[10px]">
                  <span className="text-red-500">
                    Jika ingin memindahkan pembayaran, order yang ingin dituju
                    harus dibuat terlebih dahulu
                  </span>
                </p>
                <div className="flex w-full flex-row items-center gap-2">
                  <label
                    htmlFor="channeledPaymentOrderNum"
                    className="w-1/2 text-slate-600"
                  >
                    Nomer Order Pemindahan :
                  </label>
                  <input
                    placeholder="Nomor Order"
                    name="channeledPaymentOrderNum"
                    id="channeledPaymentOrderNum"
                    type="number"
                    onChange={(e) => handleChanneledPaymentOrderNum(e)}
                    className="w-1/2 rounded-md border-2 border-slate-300 bg-white p-1 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Tidak ada pembayaran untuk order ini</p>
      )}
    </div>
  );
};

export default PaymentRefund;
