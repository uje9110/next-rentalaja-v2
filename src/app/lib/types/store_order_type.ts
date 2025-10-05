import mongoose, { Model, ObjectId } from "mongoose";
import { GlobalStoreType } from "./global_store_types";
import { StoreOrderItemType } from "./store_order_item_type";
import { StoreOrderBillingType } from "./store_order_billing_type";
import { StoreOrderUpdateLogType } from "./store_order_updateLogs_type";
import { StoreOrderDiscountType } from "./store_order_dicount_type";
import {
  ClientStoreOrderPaymentType,
  ClientStorePaymentRequest,
  StoreOrderPaymentType,
} from "./store_order_payment_type";
import { GlobalCouponType } from "./global_coupon_type";
import { StoreOrderNoteType } from "./store_order_note_type";

export type IsOrderByAdminType = {
  isByAdmin: boolean;
  adminId?: string;
};

export type StoreOrderType = {
  _id?: string;
  storeDetail: GlobalStoreType;
  byAdmin: IsOrderByAdminType;
  customerID?: ObjectId | string;
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
  discounts: GlobalCouponType[];
  discountIds?: string[];
  orderNoteIds?: string[];
  updateLogs: StoreOrderUpdateLogType[];
  qrCodeImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ClientStoreOrderType = StoreOrderType & {
  discountDetails: StoreOrderDiscountType[];
  paymentDetails: ClientStoreOrderPaymentType[];
};

export type OrderByUserType = {
  storeDetail: GlobalStoreType;
  orders: StoreOrderType[];
}[];

export type StoreOrderStaticsType = {
  createOneStoreOrder: (
    storeOrderData: {
      billing: StoreOrderBillingType;
      customerID: ObjectId | string;
      storeDetail: GlobalStoreType;
      items: StoreOrderItemType[];
      coupons: GlobalCouponType[];
      orderCount: number;
    },
    byAdmin: {
      isByAdmin: boolean;
      adminId?: string;
    },
    isSkippinPayment: boolean,
    paymentRequest?: ClientStorePaymentRequest,
    options?: { session?: mongoose.ClientSession },
  ) => Promise<StoreOrderType>;
  getOneStoreOrder: (orderId: string) => Promise<ClientStoreOrderType>;
  getAllStoreOrder: (
    searchParams: URLSearchParams,
  ) => Promise<ClientStoreOrderType[]>;
  addPaymentToStoreOrder: (
    byAdmin: IsOrderByAdminType,
    storeId: string,
    orderId: string,
    paymentData: ClientStorePaymentRequest,
    orderTotal: number,
    billing: StoreOrderBillingType,
  ) => Promise<StoreOrderPaymentType>;
  getStoreOrderPayments: (
    orderId: string,
    storeId: string,
  ) => Promise<StoreOrderPaymentType[]>;
  addStoreOrderNote: (
    storeId: string,
    orderNoteData: Partial<StoreOrderNoteType>,
  ) => Promise<StoreOrderNoteType>;
};

export type StoreOrderModelType = Model<StoreOrderType> & StoreOrderStaticsType;

type StoreOrderSchemaLocals = {
  isSkippingPayment: boolean;
  paymentRequest: ClientStorePaymentRequest;
};

export type StoreOrderDoc = mongoose.Document &
  StoreOrderType & {
    $locals: StoreOrderSchemaLocals;
  };
