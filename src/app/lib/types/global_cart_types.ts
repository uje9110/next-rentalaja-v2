import { GlobalStoreType } from "./global_store_types";
import { StoreOrderBillingType } from "./store_order_billing_type";
import { StoreOrderItemType } from "./store_order_item_type";

type BillingType = StoreOrderBillingType;

export type ClientCartType = {
  storeId: string;
  items: StoreOrderItemType[];
  subtotal: number;
  total: number;
  discounts: GlobalCouponType[];
};

export type ClientCartArrayType = {
  billing: BillingType;
  carts: ClientCartType[];
};
