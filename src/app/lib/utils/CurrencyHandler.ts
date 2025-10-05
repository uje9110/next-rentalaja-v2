import { GlobalCouponType } from "../types/global_coupon_type";
import { StoreOrderItemType } from "../types/store_order_item_type";
import {
  ClientStoreOrderPaymentType,
  StoreOrderPaymentType,
} from "../types/store_order_payment_type";

export class CurrencyHandlers {
  static changeToLocaleCurrency(amount: number | null | undefined) {
    if (amount === null || amount === undefined) return "no number inputted";
    return Number(amount).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  }
  static calculateDiscount = (
    discounts: GlobalCouponType[],
    subtotal: number,
  ) => {
    return discounts.reduce((total, item) => {
      if (item.couponType === "percentage") {
        return total + (subtotal * item.couponValue) / 100;
      } else if (item.couponType === "fixed") {
        return total + item.couponValue;
      }
      return total;
    }, 0);
  };
  static calculateOrderItemSubtotal = (items: StoreOrderItemType[]) => {
    const subtotal = items.reduce((total, item) => {
      return total + item.itemVariation.variationPrice * item.itemAmount;
    }, 0);
    return subtotal;
  };

  static calculateOrderPaymentTotal = (
    payments: StoreOrderPaymentType[] | ClientStoreOrderPaymentType[],
  ) => {
    const totalPayments =
      payments
        .filter(
          (payment) =>
            payment.paymentType !== "Denda" && payment.paymentType !== "Refund",
        )
        .filter((payment) => {
          if (payment.isUsingXendit) {
            return payment.xenditPayment?.status === "SUCCEEDED";
          }
          return payment;
        })
        .reduce((totalPayment, currPayment) => {
          return totalPayment + currPayment.paymentAmount;
        }, 0) -
      payments
        .filter((payment) => payment.paymentType === "Refund")
        .reduce((totalPayment, currPayment) => {
          return totalPayment + currPayment.paymentAmount;
        }, 0);
    return totalPayments;
  };

  static getOrderPaymentStatus = (
    total: number,
    paidAmount: number,
  ): "unpaid" | "partially-paid" | "fully-paid" => {
    const totalUnpaid = total - paidAmount;
    if (totalUnpaid > 0) {
      return "partially-paid";
    } else if (totalUnpaid === 0) {
      return "fully-paid";
    }
    return "unpaid";
  };

  static changePaymentTypeName = (type: string) => {
    if (type === "partial-payment") {
      return "Uang Muka";
    } else if (type === "full-payment") {
      return "Pelunasan";
    } else {
      return type;
    }
  };
}
