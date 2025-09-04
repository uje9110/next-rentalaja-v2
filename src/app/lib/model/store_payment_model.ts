import { Schema } from "mongoose";
import {
  StoreOrderPaymentModelType,
  StoreOrderPaymentStaticsType,
  StoreOrderPaymentType,
} from "../types/store_order_payment_type";
import { Connection } from "mongoose";

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
    paidBy: String,
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
    paymentProof: {
      type: String,
    },
    isUsingXendit: {
      type: Boolean,
    },
    xenditPayment: {
      type: Object || null,
    },
    qrLink: {
      type: String,
    },
  },
  { timestamps: true },
);

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
