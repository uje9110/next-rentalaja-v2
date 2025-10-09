import { Model } from "mongoose";
import { ClientStoreOrderType } from "./store_order_type";
import { XenditPaymentRequestResponse } from "./xendit_type";
import { StoreOrderBillingType } from "./store_order_billing_type";

export type ClientStorePaymentRequest = {
  paymentAmount?: number;
  paymentMethod?: string;
  paymentType?: string;
  paymentDesc?: string;
};

export type StoreOrderPaymentType = {
  _id?: string;
  storeId?: string;
  type?: "income" | "outcome";
  createdBy?: string;
  paidBy?: string;
  orderID?: string;
  paymentAmount: number;
  paymentMethod?: string;
  paymentType?: string;
  paymentDesc?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isUsingXendit?: boolean;
  xenditPayment?: XenditPaymentRequestResponse | null;
  qrLink: string | null;
  creatorDetail?: {
    firstName: string;
    lastName: string;
  };
};

export type ClientStoreOrderPaymentType = StoreOrderPaymentType & {
  orderDetail: ClientStoreOrderType;
};

export type StoreOrderPaymentStaticsType = {
  createOneStorePayment: (paymentData: {
    byAdmin: {
      isByAdmin: boolean;
      adminId?: string;
    };
    orderId: string;
    storeId: string;
    subtotal?: number;
    paymentRequest: ClientStorePaymentRequest;
    billing: StoreOrderBillingType;
  }) => Promise<StoreOrderPaymentType>;
  getAllStorePayments: (
    searchParams: URLSearchParams,
  ) => Promise<ClientStoreOrderPaymentType[]>;
};

export type StoreOrderPaymentModelType = Model<StoreOrderPaymentType> &
  StoreOrderPaymentStaticsType;
