import { StoreOrderItemType } from "../types/store_order_item_type";

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
}
