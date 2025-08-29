import { ObjectId } from "mongoose";
import { GlobalStoreType } from "./global_store_types";
import { StoreOrderItemType } from "./store_order_item_type";
import { StoreOrderBillingType } from "./store_order_billing_type";
import { StoreOrderUpdateLogType } from "./store_order_updateLogs_type";
import { StoreOrderDiscountType } from "./store_order_dicount_type";
import { ClientStoreOrderPaymentType } from "./store_order_payment_type";

export type StoreOrderType = {
  _id?: string;
  storeDetail?: GlobalStoreType;
  dateCreatedLocale?: string;
  timeCreatedLocale?: string;
  byAdmin?: boolean;
  customerID?: ObjectId;
  subtotal: number;
  total?: number;
  status?:
    | "canceled"
    | "pending"
    | "confirmed"
    | "processing"
    | "in-use"
    | "completed";
  paymentStatus?: "unpaid" | "partially-paid" | "fully-paid";
  items: StoreOrderItemType[];
  additionalItems?: StoreOrderItemType[];
  billing: StoreOrderBillingType;
  paymentIds?: ObjectId[];
  discounts?: any[];
  discountIds?: any[];
  orderNoteIds?: string[];
  updateLogs?: StoreOrderUpdateLogType[];
  qrCodeImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ClientStoreOrderType = StoreOrderType & {
  discountDetails: StoreOrderDiscountType[];
  paymentDetails: ClientStoreOrderPaymentType[];
};
