import mongoose, { Model, ObjectId } from "mongoose";
import { GlobalStoreType } from "./global_store_types";
import { StoreOrderItemType } from "./store_order_item_type";
import { StoreOrderBillingType } from "./store_order_billing_type";
import { StoreOrderUpdateLogType } from "./store_order_updateLogs_type";
import { StoreOrderDiscountType } from "./store_order_dicount_type";
import {
  ClientStoreOrderPaymentType,
  ClientStorePaymentRequest,
} from "./store_order_payment_type";
import { GlobalUserType } from "./global_user_type";
import { CheckoutBillingType } from "./client_checkout_type";
import { GlobalCouponType } from "./global_coupon_type";

export type StoreOrderType = {
  _id?: string;
  storeDetail: GlobalStoreType;
  byAdmin: {
    isByAdmin: boolean;
    adminId?: string;
  };
  customerID?: ObjectId;
  subtotal: number;
  total: number;
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
  paymentIds?: ObjectId[] | string[];
  discounts?: GlobalCouponType[];
  discountIds?: string[];
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

export type StoreOrderStaticsType = {
  createOneStoreOrder: (
    storeOrderData: {
      billing: StoreOrderBillingType;
      customerID: ObjectId;
      storeDetail: GlobalStoreType;
      items: StoreOrderItemType[];
      coupons: GlobalCouponType[];
      orderCount: number;
    },
    byAdmin: {
      isByAdmin: boolean;
      adminId?: string;
    },
    paymentRequest: ClientStorePaymentRequest,
    options: { session?: mongoose.ClientSession },
  ) => Promise<StoreOrderType>;
};

export type StoreOrderModelType = Model<StoreOrderType> & StoreOrderStaticsType;

type StoreOrderSchemaLocals = {
  paymentRequest: ClientStorePaymentRequest;
};

export type StoreOrderDoc = mongoose.Document &
  StoreOrderType & {
    $locals: StoreOrderSchemaLocals;
  };
