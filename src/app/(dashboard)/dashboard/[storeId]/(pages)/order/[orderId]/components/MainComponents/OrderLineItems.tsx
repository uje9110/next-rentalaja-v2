import moment from "moment";
import React, { FC } from "react";
import lunasImage from "@/app/assets/img/Element/lunas.png";
import Image from "next/image";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import { useDashboardSingleOrderUtility } from "../../hooks/useDashboardSingleOrder";

type OrderLineItemsProps = {
  orderData: ClientStoreOrderType;
};

const OrderLineItems: FC<OrderLineItemsProps> = ({ orderData }) => {
  const { getDuration } = useDashboardSingleOrderUtility();

  const totalPayments = CurrencyHandlers.calculateOrderPaymentTotal(
    orderData.paymentDetails,
  );

  const isOrderPaymentFullfilled = (
    paymentArr: ClientStoreOrderPaymentType[],
    total: number,
  ) => {
    const paymentTotal = paymentArr.reduce((total, item) => {
      const { paymentAmount } = item;
      return total + paymentAmount;
    }, 0);
    if (total - paymentTotal === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="phone:w-auto relative flex h-auto w-full flex-col items-start rounded-lg border border-slate-400/50 bg-white p-2 shadow">
      {/* ITEM LIST */}
      <div className="phone:flex phone:flex-col relative z-20 flex h-auto w-full flex-col items-start border-b-2 border-slate-400/50">
        {/* TABLE HEADER FOR DESKTOP */}
        <div className="table-header-wrapper phone:hidden phone:flex-col flex w-full font-semibold lg:flex lg:flex-row">
          <div className="phone:flex-col flex w-full lg:flex lg:flex-row">
            <p className="w-[25%] px-2 py-2 text-left text-xs">
              <span className="w-full">Nama Item</span>
            </p>
            <p className="w-[5%] px-2 py-2 text-left text-xs">
              <span className="w-full">Unit </span>
            </p>
            <p className="w-[25%] px-2 py-2 text-left text-xs">
              <span className="w-full">Durasi Sewa</span>
            </p>
            <p className="w-[30%] px-2 py-2 text-left text-xs">
              <span className="w-full">Rentang Tanggal Sewa</span>
            </p>
            <p className="w-[20%] px-2 py-2 text-left text-xs">
              <span className="w-full">Ambil & Kembali</span>
            </p>
            <p className="w-[10%] px-2 py-2 text-left text-xs">
              <span className="w-full">Subtotal</span>
            </p>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="table-body-wrapper flex w-full flex-col">
          {orderData.items.map((item) => {
            const {
              _id,
              itemName,
              itemAmount,
              itemVariation,
              itemSubtotal,
              rentalDetails,
              stockIds,
              pickupAndReturnDetails,
            } = item;
            const { variationName, variationBonus } = itemVariation;
            const { rentalStartInLocaleMs, rentalEndInLocaleMs } =
              rentalDetails;

            let pickupStatus;
            let returnStatus;

            if (
              pickupAndReturnDetails.pickupDateTimeInMs < rentalStartInLocaleMs
            ) {
              pickupStatus = {
                status: "early",
                differenceInMs:
                  rentalStartInLocaleMs -
                  pickupAndReturnDetails.pickupDateTimeInMs,
              };
            } else if (
              pickupAndReturnDetails.pickupDateTimeInMs > rentalStartInLocaleMs
            ) {
              pickupStatus = {
                status: "late",
                differenceInMs:
                  pickupAndReturnDetails.pickupDateTimeInMs -
                  rentalStartInLocaleMs,
              };
            } else {
              pickupStatus = {
                status: "exact",
                differenceInMs: pickupAndReturnDetails.pickupDateTimeInMs,
              };
            }

            if (
              pickupAndReturnDetails.returnDateTimeInMs < rentalEndInLocaleMs
            ) {
              returnStatus = {
                status: "early",
                differenceInMs:
                  rentalEndInLocaleMs -
                  pickupAndReturnDetails.returnDateTimeInMs,
              };
            } else if (
              pickupAndReturnDetails.returnDateTimeInMs > rentalEndInLocaleMs
            ) {
              returnStatus = {
                status: "late",
                differenceInMs:
                  pickupAndReturnDetails.returnDateTimeInMs -
                  rentalEndInLocaleMs,
              };
            } else {
              returnStatus = {
                status: "exact",
                differenceInMs: pickupAndReturnDetails.pickupDateTimeInMs,
              };
            }

            return (
              <div
                key={_id as string}
                id={`table-row-wrapper-${_id}`}
                className="table-row-wrapper phone:flex-col phone:first:border-t-0 flex w-full border-b-[2px] py-2 first:border-t-[2px] last:border-b-0 lg:flex lg:flex-row"
              >
                <div className="phone:flex-col flex w-full lg:flex lg:flex-row">
                  {/* ITEM NAME */}
                  <div className="phone:w-full flex w-[25%] flex-row justify-center gap-1 px-2 py-2 lg:flex lg:w-[25%] lg:flex-row lg:justify-start">
                    <p className="w-2/5 font-semibold sm:hidden md:hidden lg:hidden">
                      Nama Item :
                    </p>
                    <div className="phone:w-3/5 flex w-full flex-col justify-center gap-1">
                      <p className="flex w-auto items-center justify-start gap-1">
                        <span className="item-name w-full text-xs font-semibold text-slate-600">
                          {itemName}
                        </span>
                      </p>
                      <div className="flex w-full flex-col gap-1 text-[10px]">
                        {stockIds.map((stock) => {
                          return (
                            <p
                              key={stock}
                              className="w-fit rounded-sm border bg-sky-500 px-2 py-1 text-center text-[8px] font-semibold text-white"
                            >
                              {stock}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ITEM AMOUNT */}
                  <div className="phone:w-full phone:justify-center flex w-[5%] flex-row items-center justify-center px-2 py-2 lg:flex lg:w-[5%] lg:flex-row lg:justify-start">
                    <p className="w-2/5 font-semibold sm:hidden md:hidden lg:hidden">
                      Jumlah Item :
                    </p>
                    <p className="phone:w-3/5 w-full text-center">
                      {itemAmount}
                    </p>
                  </div>

                  {/* ITEM VARIATION */}
                  <div className="phone:w-full flex w-[25%] flex-row items-center justify-center px-2 py-2 lg:flex lg:w-[25%] lg:flex-row lg:justify-start">
                    <p className="w-2/5 font-semibold sm:hidden md:hidden lg:hidden">
                      Paket Sewa :
                    </p>
                    <div className="phone:w-3/5 flex w-full flex-col text-[10px]">
                      <p className="flex gap-2">
                        <span className="text-colorPrimary font-[500]">
                          Dur. Utama :
                        </span>
                        <span>{variationName}</span>
                      </p>
                      <p className="flex gap-2">
                        <span className="font-[500] text-yellow-700">
                          Dur. Bonus :
                        </span>
                        <span>{variationBonus?.title}</span>
                      </p>
                    </div>
                  </div>

                  {/* ITEM RENTAL */}
                  <div className="phone:w-full flex w-[30%] flex-row items-center justify-center px-2 py-2 lg:flex lg:w-[30%] lg:flex-row lg:justify-start">
                    <p className="w-2/5 font-semibold sm:hidden md:hidden lg:hidden">
                      Periode Sewa :
                    </p>
                    <div className="phone:w-3/5 flex w-full flex-col items-start text-[10px]">
                      <div className="flex w-full flex-row items-center justify-center gap-2">
                        <div className="flex w-full gap-1">
                          <p className="w-[30px] font-semibold text-green-600">
                            Start :
                          </p>
                          <p>
                            {moment(rentalStartInLocaleMs).format(
                              "DD MMMM YYYY, HH:mm",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full flex-row items-center justify-center gap-2">
                        <div className="flex w-full gap-1">
                          <span className="w-[30px] font-semibold text-red-600">
                            End :
                          </span>
                          <p>
                            {moment(rentalEndInLocaleMs).format(
                              "DD MMMM YYYY, HH:mm",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TAKEN &  RETURN */}
                  <div className="phone:w-full flex w-[20%] flex-row justify-center px-2 py-2 lg:flex lg:w-[20%] lg:flex-row lg:justify-start">
                    <p className="w-2/5 font-semibold sm:hidden md:hidden lg:hidden">
                      Ambil & Kembali :
                    </p>
                    <div className="phone:w-3/5 flex w-full flex-col items-start text-[10px]">
                      <div className="flex w-full flex-row items-center justify-start gap-2">
                        {!pickupAndReturnDetails.pickupDateTimeInMs ||
                        pickupAndReturnDetails.pickupDateTimeInMs === 0 ? (
                          <span>-</span>
                        ) : (
                          <div className="flex w-full flex-col gap-2">
                            <p className="flex gap-1">
                              <span className="w-[30px] font-semibold text-green-600">
                                {pickupStatus.status}:
                              </span>
                              <span>
                                {getDuration(pickupStatus.differenceInMs)}
                              </span>
                            </p>
                            <p className="-mt-2 font-semibold text-slate-400">
                              {moment(
                                pickupAndReturnDetails.pickupDateTimeInMs,
                              ).format("DD MM YYYY, HH:mm")}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex w-full flex-row items-center justify-start gap-2">
                        {!pickupAndReturnDetails.pickupDateTimeInMs ||
                        pickupAndReturnDetails.returnDateTimeInMs === 0 ? (
                          <span>-</span>
                        ) : (
                          <div className="flex w-full flex-col gap-2">
                            <p className="flex gap-1">
                              <span className="w-[30px] font-semibold text-red-600">
                                {returnStatus.status}:
                              </span>
                              <span>
                                {getDuration(returnStatus.differenceInMs)}
                              </span>
                            </p>
                            <p className="-mt-2 font-semibold text-slate-400">
                              {moment(
                                pickupAndReturnDetails.returnDateTimeInMs,
                              ).format("DD MM YYYY, HH:mm")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ITEM SUBTOTAL */}
                  <div className="phone:w-full flex w-[10%] flex-row justify-center px-2 py-2 lg:flex lg:w-[10%] lg:flex-row lg:justify-start">
                    <p className="w-2/5 font-semibold sm:hidden md:hidden lg:hidden">
                      Item Subtotal :
                    </p>
                    <p className="phone:w-3/5 flex w-full justify-end gap-2">
                      <span className="text-xs font-semibold">
                        {CurrencyHandlers.changeToLocaleCurrency(
                          itemSubtotal * itemAmount,
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex w-full">
        <div className="phone:hidden flex w-1/2 items-center justify-center lg:flex">
          {isOrderPaymentFullfilled(
            orderData.paymentDetails,
            orderData.total,
          ) ? (
            <Image
              width={100}
              height={100}
              src={lunasImage.src}
              alt=""
              className="opacity-30 lg:w-1/3"
            />
          ) : null}
        </div>

        {/* ITEM TOTAL */}
        <div className="phone:w-full relative z-20 flex h-auto w-1/2 justify-end pt-4 lg:w-1/2">
          <div className="phone:w-full phone:justify-end flex w-full flex-row gap-2">
            <div className="phone:w-full flex w-full flex-col items-end lg:w-1/3">
              <p className="phone:w-full p-2 font-semibold">Subtotal</p>
              <p className="phone:w-full p-2 font-semibold">Diskon</p>
              <p className="phone:w-full p-2 font-semibold">Total</p>
              <p className="phone:w-full p-2 font-semibold">Terbayar</p>
              <p className="phone:w-full p-2 font-semibold">Sisa Pembayaran</p>
              <p className="phone:w-full p-2 font-semibold">Denda</p>
            </div>

            <div className="phone:w-full flex w-full flex-col items-end lg:w-1/3">
              {/* ORDER SUBTOTAL */}
              <p className="p-2">
                {CurrencyHandlers.changeToLocaleCurrency(orderData.subtotal)}
              </p>

              {/* DISKON */}
              <p className="p-2">
                -{" "}
                {CurrencyHandlers.changeToLocaleCurrency(
                  orderData.discounts.reduce((total, item) => {
                    if (item.couponType === "percentage") {
                      return (
                        total + (orderData.subtotal * item.couponValue) / 100
                      );
                    } else if (item.couponType === "fixed") {
                      return total + item.couponValue;
                    }
                    return total;
                  }, 0),
                )}
              </p>
              <p className="p-2">
                {CurrencyHandlers.changeToLocaleCurrency(orderData.total)}
              </p>
              <p className="p-2">
                - {CurrencyHandlers.changeToLocaleCurrency(totalPayments)}
              </p>
              <p className="p-2">
                {CurrencyHandlers.changeToLocaleCurrency(
                  orderData.total - totalPayments,
                )}
              </p>
              <p className="p-2">
                {CurrencyHandlers.changeToLocaleCurrency(
                  orderData.paymentDetails
                    .filter((payment) => payment.paymentType === "Denda")
                    .reduce((totalPayment, currPayment) => {
                      return totalPayment + currPayment.paymentAmount;
                    }, 0),
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderLineItems;
