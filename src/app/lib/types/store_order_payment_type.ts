import mongoose, { Model } from "mongoose";
import { ClientStoreOrderType } from "./store_order_type";
import { XenditPaymentRequestResponse } from "./xendit_type";
import { ClientCartType } from "./client_cart_types";
import { CheckoutBillingType } from "./client_checkout_type";
import { GlobalUserType } from "./global_user_type";
import { StoreOrderBillingType } from "./store_order_billing_type";

export type ClientStorePaymentRequest = {
  paymentMethod: string;
  paymentType: string;
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
};

export type ClientStoreOrderPaymentType = StoreOrderPaymentType & {
  creatorDetail?: {
    firstName: string;
    lastName: string;
  };
  orderDetail: ClientStoreOrderType;
};

export type StoreOrderPaymentStaticsType = {
  createOneStorePayment: (paymentData: {
    byAdmin: {
      isByAdmin: boolean;
      adminId?: string;
    };
    cart: ClientCartType;
    paymentRequest: ClientStorePaymentRequest;
    orderID: string;
    billing: StoreOrderBillingType;
  }) => Promise<StoreOrderPaymentType>;
};

export type StoreOrderPaymentModelType = Model<StoreOrderPaymentType> &
  StoreOrderPaymentStaticsType;
