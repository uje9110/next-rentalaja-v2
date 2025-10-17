import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import moment from "moment-timezone";
import { BcaPayment } from "./BcaPayment";
import { QrisPayment } from "./QrisPayment";
import CashPayment from "./CashPayment";
import { ClientCheckoutDetailActions } from "./ClientCheckoutDetailAction";

export const CheckoutDetail: React.FC<{
  orderData: ClientStoreOrderType;
  index: number;
}> = ({ orderData, index }) => {
  return (
    <div className="lg:flex lg:w-[850px] lg:flex-row lg:gap-4 phone:flex phone:flex-col phone:gap-4">
      <ClientCheckoutDetailActions orderData={orderData} />
      <div
        key={`${orderData._id}-${index}`}
        className="flex flex-col gap-4 lg:w-1/2"
      >
        <div className="flex flex-col gap-0 rounded-md border border-slate-400/50 bg-white">
          <p className="border-b border-slate-400/50 px-4 py-4 text-sm font-medium">
            Riwayat Pembayaran
          </p>
          <Accordion type="single" collapsible>
            {orderData.paymentDetails.map((payment, index) => (
              <AccordionItem
                className="px-4"
                key={payment._id}
                value={`payment-${index + 1}`}
              >
                <AccordionTrigger className="font-normal">
                  <div className="flex w-full items-center justify-between">
                    <p>
                      {index + 1}.{" "}
                      {CurrencyHandlers.changePaymentTypeName(
                        payment.paymentType as string,
                      )}{" "}
                      :{" "}
                      {CurrencyHandlers.changeToLocaleCurrency(
                        payment.paymentAmount,
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">Klik detail</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {payment.isUsingXendit ? (
                    payment.paymentMethod === "BCA_VA" ? (
                      <BcaPayment payment={payment} />
                    ) : payment.paymentMethod === "QRIS" ? (
                      <QrisPayment orderData={orderData} payment={payment} />
                    ) : null
                  ) : (
                    <CashPayment payment={payment} />
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-lg border border-slate-400/50 bg-white p-4 text-xs shadow-xl lg:flex lg:w-full lg:flex-col lg:justify-center lg:gap-8">
          <div className="billing-body flex flex-col gap-2">
            <h5 className="pb-4 text-center font-semibold">
              Informasi Billing
            </h5>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Nama Toko</p>
              <p className="text-colorPrimary text-right font-semibold">
                {orderData?.storeDetail?.storeName}
              </p>
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Order ID</p>
              <p className="text-right font-semibold">{orderData._id}</p>
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Status Order</p>
              <p className="text-right font-semibold uppercase">
                {orderData.status}
              </p>
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Status Pembayaran</p>
              <p className="text-right font-semibold uppercase">
                {orderData.paymentStatus}
              </p>
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Nama Pelanggan</p>
              <p className="text-right">
                {orderData.billing.firstName} {orderData.billing.lastName}
              </p>
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Email</p>
              <p className="text-right">{orderData.billing.email}</p>
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Telephone</p>
              <p className="text-right">{orderData.billing.telephone}</p>
            </div>
          </div>
          <div className="table-body pb-4">
            <h5 className="pt-4 pb-4 text-center font-semibold">
              Informasi Penyewaan
            </h5>
            <table className="w-full table-auto">
              <thead>
                <tr className="">
                  <th className="w-[10%] border border-slate-400/70 p-2">
                    No.
                  </th>
                  <th className="w-[60%] border border-slate-400/70 p-2">
                    Alat & Paket Sewa
                  </th>
                  <th className="w-[10%] border border-slate-400/70 p-2">
                    Jumlah
                  </th>
                  <th className="w-[30%] border border-slate-400/70 p-2">
                    Harga
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => {
                  const {
                    itemName,
                    itemAmount,
                    itemVariation,
                    rentalDetails,
                    itemSubtotal,
                    itemID,
                  } = item;
                  return [
                    <tr key={`${itemID}-detail`}>
                      <td
                        rowSpan={3}
                        className="border border-slate-400/70 p-2"
                      >
                        {index + 1}.
                      </td>
                      <td className="border border-slate-400/70 p-2">
                        <span className="font-semibold">{itemName}</span> -{" "}
                        {itemVariation.variationName} (
                        {CurrencyHandlers.changeToLocaleCurrency(
                          itemVariation.variationPrice,
                        )}
                        )
                        <br />
                      </td>
                      <td className="border border-slate-400/70 p-2">
                        x{itemAmount}
                      </td>
                      <td className="border border-slate-400/70 p-2">
                        {CurrencyHandlers.changeToLocaleCurrency(itemSubtotal)}
                      </td>
                    </tr>,
                    <tr key={`${itemID}-rentalStartDetail`}>
                      <td className="border border-slate-400/70 p-2 font-semibold">
                        Waktu Mulai Sewa:
                      </td>
                      <td
                        className="border border-slate-400/70 p-2"
                        colSpan={2}
                      >
                        {moment(rentalDetails.rentalStartInLocaleMs).tz("Asia/Jakarta").format(
                          "DD MMMM YYYY, HH:mm",
                        )}
                      </td>
                    </tr>,
                    <tr key={`${itemID}-rentalEndDetail`}>
                      <td className="border border-slate-400/70 p-2 font-semibold">
                        Waktu Berakhir Sewa:
                      </td>
                      <td
                        className="border border-slate-400/70 p-2"
                        colSpan={2}
                      >
                        {moment(rentalDetails.rentalEndInLocaleMs).tz("Asia/Jakarta").format(
                          "DD MMMM YYYY, HH:mm",
                        )}
                      </td>
                    </tr>,
                  ];
                })}
              </tbody>
            </table>
          </div>
          <div className="billing-body flex flex-col gap-2">
            <h5 className="pb-4 text-center font-semibold">
              Informasi Pembayaran
            </h5>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Subtotal</p>
              <p className="text-right">
                {CurrencyHandlers.changeToLocaleCurrency(orderData.subtotal)}
              </p>
            </div>
            <div className="row-wrapper flex flex-col justify-between gap-2">
              <p className="font-semibold">Diskon :</p>
              {orderData.discounts.map((item, index) => {
                const { couponName, couponType, couponValue } = item;
                return (
                  <div key={index} className="flex flex-row justify-between">
                    <p className="font-regular">{couponName}</p>
                    <p className="text-right">
                      -
                      {couponType === "percentage"
                        ? CurrencyHandlers.changeToLocaleCurrency(
                            (orderData.subtotal * couponValue) / 100,
                          )
                        : null}
                      {couponType === "fixed"
                        ? CurrencyHandlers.changeToLocaleCurrency(couponValue)
                        : null}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Total</p>
              <p className="text-right">
                {CurrencyHandlers.changeToLocaleCurrency(orderData.total)}
              </p>
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Pembayaran Masuk</p>
              <p className="text-right">
                -{" "}
                {CurrencyHandlers.changeToLocaleCurrency(
                  orderData.paymentDetails.reduce(
                    (totalPayment, currPayment) => {
                      if (currPayment.isUsingXendit) {
                        if (currPayment.xenditPayment?.status === "SUCCEEDED") {
                          return totalPayment + currPayment.paymentAmount;
                        }
                        return totalPayment + 0;
                      }
                      return totalPayment + currPayment.paymentAmount;
                    },
                    0,
                  ),
                )}
              </p>
            </div>
            <div className="row-wrapper flex justify-between">
              <p className="font-semibold">Sisa Pembayaran</p>
              <p className="text-right">
                {CurrencyHandlers.changeToLocaleCurrency(
                  orderData.total -
                    orderData.paymentDetails.reduce(
                      (totalPayment, currPayment) => {
                        if (currPayment.isUsingXendit) {
                          if (
                            currPayment.xenditPayment?.status === "SUCCEEDED"
                          ) {
                            return totalPayment + currPayment.paymentAmount;
                          }
                          return totalPayment + 0;
                        }
                        return totalPayment + currPayment.paymentAmount;
                      },
                      0,
                    ),
                )}
              </p>
            </div>
          </div>
          <p className="mt-4 w-full text-center text-slate-400">
            Check email anda untuk melihat detail pembayaran dengan transfer
            bank
          </p>
        </div>
      </div>
    </div>
  );
};
