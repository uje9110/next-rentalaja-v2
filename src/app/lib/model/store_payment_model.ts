import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";
import {
  StoreOrderPaymentModelType,
  StoreOrderPaymentStaticsType,
  StoreOrderPaymentType,
  ClientStorePaymentRequest,
} from "../types/store_order_payment_type";
import { Connection } from "mongoose";
import { StoreOrderType } from "../types/store_order_type";
import { CheckoutBillingType } from "../types/client_checkout_type";
import { ClientCartType } from "../types/client_cart_types";
import { dbConnect } from "../connection/dbConnect";
import { createGlobalUserModel } from "./global_user_model";
import {
  DynamicXenditPaymentRequestBody,
  XenditPaymentRequestResponse,
} from "../types/xendit_type";
import axios from "axios";
import { QrCodeHandler } from "../utils/QrCodeHandler";
import { GlobalUserType } from "../types/global_user_type";
import { StoreOrderBillingType } from "../types/store_order_billing_type";

const PaymentScema = new Schema<StoreOrderPaymentType>(
  {
    storeId: {
      type: String,
    },
    type: {
      type: String,
      enum: ["income", "outcome"],
      default: "income",
    },
    createdBy: {
      type: String,
      required: true,
    },
    paidBy: { type: String },
    orderID: {
      type: String,
    },
    paymentAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      default: "Bank",
    },
    paymentType: {
      type: String,
    },
    paymentDesc: {
      type: String,
    },
    isUsingXendit: {
      type: Boolean,
    },
    xenditPayment: {
      type: Object || null,
    },
    qrLink: {
      type: String || null,
    },
  },
  { timestamps: true },
);

PaymentScema.statics.createOneStorePayment = async function (paymentData: {
  byAdmin: {
    isByAdmin: boolean;
    adminId?: string;
  };
  cart: ClientCartType;
  paymentRequest: ClientStorePaymentRequest;
  orderID: string;
  billing: StoreOrderBillingType;
}) {
  const { cart, paymentRequest, orderID, byAdmin, billing } = paymentData;
  // PAYMENT AMOUNT
  const { paymentType, paymentMethod, paymentDesc } = paymentRequest;
  let newPaymentAmount: number = 0;
  if (paymentType === "full-payment") {
    newPaymentAmount = cart.subtotal;
  } else if (paymentType === "partial-payment") {
    newPaymentAmount = cart.subtotal * 0.2;
  }

  // PAYMENT DESC
  let newPaymentDesc: string = paymentDesc
    ? paymentDesc
    : `${paymentType} untuk order ${orderID} store ${cart.store.storeName}`;

  // PAID BY
  const newPaidBy = `${billing.firstName} ${billing.lastName}`;

  // CREATED BY
  let newCreatedBy: string = `${billing.firstName} ${billing.lastName}`;
  if (byAdmin.isByAdmin) {
    const storeConnection = await dbConnect(cart.store.storeId);
    const GlobalUserModel = createGlobalUserModel(storeConnection);
    const admin = await GlobalUserModel.findById(new ObjectId(byAdmin.adminId));
    newCreatedBy = admin
      ? `${admin?.firstName} ${admin?.lastName}`
      : "Admin Not Found";
  }

  // XENDIT DETAIL
  let isUsingXendit: boolean = false;
  let xenditPayment: XenditPaymentRequestResponse | null = null;
  let qrLink: string | null = null;

  if (paymentMethod === "QRIS") {
    const xenditPaymentRequestBody: DynamicXenditPaymentRequestBody = {
      reference_id: orderID,
      channel_code: paymentMethod,
      request_amount: String(newPaymentAmount),
      orderId: orderID,
      description: paymentDesc as string,
    };
    const xenditPaymentRequest = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/payment/xendit`,
      xenditPaymentRequestBody,
    );

    isUsingXendit = true;
    xenditPayment = xenditPaymentRequest.data.json;
    qrLink = await QrCodeHandler.createQrCode(
      xenditPaymentRequest.data.json.actions[0].value,
    );
  }

  const newPaymentData: StoreOrderPaymentType = {
    orderID,
    paymentAmount: newPaymentAmount,
    paymentType,
    paymentMethod,
    paymentDesc: newPaymentDesc,
    paidBy: newPaidBy,
    createdBy: newCreatedBy,
    isUsingXendit,
    xenditPayment,
    qrLink,
  };
  const payment = await this.create(newPaymentData);
  return payment;
};

export const createStorePaymentModel = (
  connection: Connection,
): StoreOrderPaymentModelType => {
  return (
    (connection.models.payments as StoreOrderPaymentModelType) ||
    connection.model<StoreOrderPaymentType, StoreOrderPaymentStaticsType>(
      "payments",
      PaymentScema,
    )
  );
};
