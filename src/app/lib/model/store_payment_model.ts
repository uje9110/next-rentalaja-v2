import { Schema } from "mongoose";
import {
  StoreOrderPaymentModelType,
  StoreOrderPaymentStaticsType,
  StoreOrderPaymentType,
} from "../types/store_order_payment_type";
import { Connection } from "mongoose";
import { StoreOrderType } from "../types/store_order_type";

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

PaymentScema.statics.createOneStorePayment = async function (
  subtotal: number,
  paymentRequest: {
    paymentAmount: number;
    paymentType: string;
    paymentMethod: string;
  },
  order: StoreOrderType,
) {
  const { paymentType, paymentMethod, paymentAmount } = paymentRequest;
  let newPaymentAmount;
  if (paymentType === "full-payment") {
    newPaymentAmount = subtotal;
  } else if (paymentType === "partial-payment") {
    newPaymentAmount = subtotal * 0.2;
  } else {
    newPaymentAmount = paymentAmount;
  }

  // const paymentData: StoreOrderPaymentType = {
  //   paymentAmount: newPaymentAmount,
  //   paymentType,
  //   paymentMethod,
  //   orderID: order._id,
  // };
  const payment = await this.create();
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
