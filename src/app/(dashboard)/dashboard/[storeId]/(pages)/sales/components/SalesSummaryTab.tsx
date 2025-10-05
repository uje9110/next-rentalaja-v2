"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Eye } from "lucide-react";
import clsx from "clsx";
import { ClientStoreSalesType } from "@/app/lib/types/store_sales_types";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

const getSalesSummaryTabsData = (sales: ClientStoreSalesType[]) => {
  return [
    {
      filterOptions: "salesBruto",
      isClickable: false,
      title: "Sales Kotor",
      value: () =>
        sales.reduce((total, sale) => {
          return total + sale.totalProfit;
        }, 0),
    },
    {
      filterOptions: "discount",
      isClickable: true,
      title: "Diskon",
      value: () =>
        sales.reduce((total, sale) => {
          const orderTotalDiscount = sale.orderDetail.discountDetails?.reduce(
            (total, discount) => {
              return total + discount.discountTotal;
            },
            0,
          );
          if (!orderTotalDiscount) {
            return total;
          }
          return total + orderTotalDiscount;
        }, 0),
    },
    {
      filterOptions: "salesNetto",
      isClickable: false,
      title: "Sales Bersih",
      value: () => {
        const totalDiscount = sales.reduce((total, sale) => {
          const orderTotalDiscount = sale.orderDetail.discountDetails?.reduce(
            (total, discount) => {
              return total + discount.discountTotal;
            },
            0,
          );
          if (!orderTotalDiscount) {
            return total;
          }
          return total + orderTotalDiscount;
        }, 0);
        const netProfit = sales.reduce((total, sale) => {
          return total + sale.totalProfit;
        }, 0);
        return netProfit - totalDiscount;
      },
    },
    {
      filterOptions: "paidPayments",
      isClickable: true,
      title: "Uang Diterima",
      value: () => {
        const totalPayments = sales.reduce((total, sale) => {
          const orderPaymentTotal = sale.orderDetail.paymentDetails.reduce(
            (total, payment) => {
              if (payment.paymentType === "Denda") {
                return total;
              }
              if (payment.isUsingXendit) {
                if (payment.xenditPayment?.status === "SUCCEEDED") {
                  return total + payment.paymentAmount;
                } else {
                  return total;
                }
              }
              return total + payment.paymentAmount;
            },
            0,
          );
          if (!orderPaymentTotal) {
            return total;
          }
          return total + orderPaymentTotal;
        }, 0);
        return totalPayments;
      },
    },
    {
      filterOptions: "unpaidPayments",
      isClickable: true,
      title: "Sisa Pembayaran",
      value: () => {
        const totalOrder = sales.reduce((totalOrderFromSale, sale) => {
          return sale.orderDetail.total + totalOrderFromSale;
        }, 0);

        const totalPayments = sales.reduce((totalPaymentFromSales, sale) => {
          const salePaymentsTotal = sale.orderDetail.paymentDetails.reduce(
            (total, payment) => {
              const isCash = payment.paymentMethod === "Cash";
              const isQRIS = !isCash;

              // Common type check
              // const isFineOrRefund =
              //   payment.paymentType === "Denda" ||
              //   payment.paymentType === "Refund";

              let isValid = false;

              if (isCash) {
                // Cash is always valid
                isValid = true;
              } else if (isQRIS) {
                // QRIS needs Xendit success
                isValid =
                  payment.isUsingXendit === true &&
                  payment.xenditPayment?.status === "SUCCEEDED";
              }

              return isValid ? total + payment.paymentAmount : total;
            },
            0,
          );

          return totalPaymentFromSales + salePaymentsTotal;
        }, 0);

        return totalOrder - totalPayments;
      },
    },
    {
      filterOptions: "finedPayments",
      isClickable: true,
      title: "Denda",
      value: () => {
        const totalFined = sales.reduce((total, sale) => {
          const orderPaymentTotal = sale.orderDetail.paymentDetails.reduce(
            (total, payment) => {
              if (payment.paymentType !== "Denda") {
                return total;
              }
              return total + payment.paymentAmount;
            },
            0,
          );
          if (!orderPaymentTotal) {
            return total;
          }
          return total + orderPaymentTotal;
        }, 0);
        return totalFined;
      },
    },
  ];
};

const Tabs = ({
  filteredSaleState,
  title,
  value,
  filterOptions,
  filterSales,
}: {
  filteredSaleState: string;
  title: string;
  value: number;
  filterOptions: string;
  filterSales: (filterOptions: string) => void;
}) => {
  return (
    <div
      className={clsx(
        "phone:w-full flex h-24 w-1/6 flex-col justify-between gap-2 rounded-md border border-slate-400/50 p-4",
        filteredSaleState === filterOptions ? "bg-teal-100" : "bg-white",
      )}
    >
      <div className="flex flex-col gap-0">
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <p className="phone:text-sm text-lg">
          {CurrencyHandlers.changeToLocaleCurrency(value)}
        </p>
      </div>

      {filteredSaleState === filterOptions ? (
        <p className="h-[1px] w-20 bg-blue-400" />
      ) : (
        <p
          onClick={() => filterSales(filterOptions)}
          className="flex cursor-pointer flex-row items-center justify-start gap-2 text-xs text-blue-400"
        >
          <Eye size={16} />
          <span>Lihat</span>
        </p>
      )}
    </div>
  );
};

const SalesSummaryTabs = ({
  sales,
  setFilteredSales,
}: {
  sales: ClientStoreSalesType[];
  setFilteredSales: Dispatch<SetStateAction<ClientStoreSalesType[] | []>>;
}) => {
  const [filteredSaleState, setFilteredSaleState] = useState<string>("");

  const filterSales = (filterOptions: string) => {
    let filteredSales = sales;

    if (filterOptions === "discount") {
      filteredSales = sales.filter((sale) => {
        return sale.orderDetail.discountDetails?.some((discount) => {
          return discount.discountTotal > 0;
        });
      });
    }

    if (filterOptions === "paidPayments") {
      filteredSales = sales.filter((sale) => {
        return sale.orderDetail.paymentDetails.some((payment) => {
          return payment.paymentAmount > 0;
        });
      });
    }

    if (filterOptions === "finedPayments") {
      filteredSales = sales.filter((sale) => {
        return sale.orderDetail.paymentDetails.some((payment) => {
          return payment.paymentType === "Denda";
        });
      });
    }

    if (filterOptions === "unpaidPayments") {
      filteredSales = sales.filter((sale) => {
        return (
          sale.orderDetail.paymentStatus === "partially-paid" ||
          sale.orderDetail.paymentStatus === "unpaid"
        );
      });
    }

    setFilteredSales(filteredSales);
    setFilteredSaleState(filterOptions);
  };

  const salesSummaryTabsData = getSalesSummaryTabsData(sales);

  return (
    <div className="phone:grid phone:grid-cols-2 phone:gap-x-2 flex flex-row gap-2 lg:flex lg:flex-row">
      {salesSummaryTabsData.map(({ title, value, filterOptions }) => {
        return (
          <Tabs
            filteredSaleState={filteredSaleState}
            filterSales={filterSales}
            filterOptions={filterOptions}
            key={title}
            title={title}
            value={value()}
          />
        );
      })}
    </div>
  );
};

export default SalesSummaryTabs;
