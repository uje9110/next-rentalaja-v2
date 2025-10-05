import React, { useRef } from "react";
import moment from "moment";
import logoBlack from "@/app/assets/img/logo/logo-rental-aja-black.png";
import { Session } from "next-auth";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

interface InvoiceInterface {
  order: ClientStoreOrderType;
  session: Session;
}

const Invoice: React.FC<InvoiceInterface> = ({ order, session }) => {
  const paymentTotal = order.paymentDetails.reduce((total, item) => {
    return total + item.paymentAmount;
  }, 0);

  const contentToPrint = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: "invoice",
    contentRef: contentToPrint,
    onBeforePrint: async () => {
      console.log("before printing...");
      return Promise.resolve(); // Ensures it returns a Promise<void>
    },
    onAfterPrint: async () => {
      console.log("after printing...");
      return Promise.resolve(); // Ensures it returns a Promise<void>
    },
  });

  const closeInvoice = () => {
    const invoice = document.getElementById(
      "invoice-modal",
    ) as HTMLDialogElement;
    if (invoice) {
      invoice.close();
    }
  };

  return (
    <dialog
      id="invoice-modal"
      className="min-h-scren max-h-full w-[300px] flex-col items-center justify-center gap-2 rounded-lg bg-white p-1 shadow-lg"
    >
      <div
        ref={contentToPrint}
        className="min-h-scren mt-8 flex max-h-full w-[250px] flex-col items-center justify-center gap-2 bg-white p-1 text-xs"
      >
        {/* <div className="flex w-full flex-col items-center justify-between">
          {order.qrCodeImage ? (
            <Image
              width={100}
              height={100}
              src={order.qrCodeImage}
              alt=""
              className="w-[60%]"
            />
          ) : null}
        </div> */}
        <div className="flex flex-col items-center justify-center">
          <Image width={100} height={100} src={logoBlack.src} alt="" />
          <h3 className="w-full text-center text-base font-semibold">
            Invoice Penyewaan
          </h3>
          <p>{moment(Date.now()).format("DD-MM-YYYY, HH:mm")}</p>
          <p>
            Cashier: &nbsp; {session.user.firstName} {session.user.lastName}
          </p>
        </div>

        {/* ORDER STATUS & ID */}
        <p className="text-center">--------------------</p>
        <div className="flex flex-col gap-2">
          <div className="my-4 flex justify-between">
            <div className="flex flex-col justify-between">
              <p className="font font-semibold">Status</p>
              <p>{order.status}</p>
            </div>
            <div className="flex flex-col justify-between">
              <p className="font text-end font-semibold">Order ID</p>
              <p>{order._id}</p>
            </div>
          </div>

          {/* CUSTOMER BILLING */}
          <p className="text-center">--------------------</p>
          <div className="flex flex-col justify-between gap-2">
            <p className="font text-center text-lg font-semibold">
              Billing Penyewa
            </p>
            <div className="flex flex-col items-start gap-2">
              <p className="flex w-full flex-col justify-between text-left">
                <span className="font-medium">Nama: </span>
                <span>
                  {order.billing.firstName} {order.billing.lastName}
                </span>
              </p>
              <p className="flex w-full flex-col justify-between text-left">
                <span className="font-medium">Email: </span>
                <span>{order.billing.email}</span>
              </p>
              <p className="flex w-full flex-col justify-between text-left">
                <span className="font-medium">Telp : </span>
                <span>{order.billing.telephone}</span>
              </p>
              <p className="flex w-full flex-col justify-between text-left">
                <span className="font-medium">Alamat: </span>
                <span className="text-left">
                  {order?.billing?.address?.street},{" "}
                  {order?.billing?.address?.district},{" "}
                  {order?.billing?.address?.city},{" "}
                  {order?.billing?.address?.province}.
                </span>
              </p>
            </div>
          </div>

          {/* ITEMS DETAIL */}
          <p className="text-center">--------------------</p>
          <div className="flex flex-col justify-between gap-2">
            <p className="font text-center text-lg font-semibold">
              Item Rental
            </p>
            <div className="flex flex-col gap-4">
              {order.items.map((item, index) => {
                const { itemName, itemVariation, itemAmount, rentalDetails } =
                  item;
                const { variationName, variationPrice } = itemVariation;
                return (
                  <div key={index} className="flex flex-col gap-2 rounded-md">
                    <div className="flex flex-row justify-between">
                      <p className="flex w-2/4 flex-col">
                        <span className="font-medium">{itemName}</span>
                        <span>{variationName}</span>
                      </p>
                      <p className="flex w-1/4 flex-col items-end justify-center">
                        {variationPrice.toLocaleString("ID-id", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        })}
                      </p>
                      <p className="flex w-1/4 flex-col items-end justify-center">
                        x{itemAmount}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between font-semibold">
                      <span>Waktu Rental:</span>
                      <span>
                        {moment(rentalDetails.rentalStartInLocaleMs).format(
                          "DD-MM-YYYYTHH:mm",
                        )}
                        {" - "}
                        {moment(rentalDetails.rentalEndInLocaleMs).format(
                          "DD-MM-YYYYTHH:mm",
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-center">--------------------</p>
          <div className="flex flex-row justify-between">
            <p className="font font-semibold">Subtotal</p>
            <p>
              {order.subtotal.toLocaleString("ID-id", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font font-semibold">Diskon</p>
            <p>
              {CurrencyHandlers.calculateDiscount(
                order.discounts,
                order.subtotal,
              ).toLocaleString("ID-id", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font font-semibold">Total</p>
            <p>
              {order.total.toLocaleString("ID-id", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font font-semibold">Uang Muka</p>
            <div className="flex flex-col">
              {order.paymentDetails.length > 0 ? (
                order.paymentDetails.map((item) => {
                  const { paymentAmount, _id } = item;
                  return (
                    <p key={_id}>
                      - &nbsp;
                      {paymentAmount.toLocaleString("ID-id", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  );
                })
              ) : (
                <p>Rp. 0</p>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font font-semibold">Sisa Pembayaran</p>
            <p>
              {(order.total - paymentTotal).toLocaleString("ID-id", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          <p className="text-center">--------------------</p>
        </div>
        <div className="my-4">
          <p className="text-center font-semibold">One Stop Rental Service</p>
          <p className="text-center">rentalaja.co.id</p>
        </div>
      </div>
      <button
        className="w-full bg-green-400 p-4 text-center font-semibold text-white"
        onClick={() => {
          handlePrint();
        }}
      >
        PRINT INVOICE
      </button>
      <button
        className="w-full bg-red-500 p-4 text-center font-semibold text-white"
        onClick={closeInvoice}
      >
        TUTUP INVOICE
      </button>
    </dialog>
  );
};

export default Invoice;
