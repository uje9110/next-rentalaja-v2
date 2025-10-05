import { ObjectId } from "mongodb";
import { PipelineStage, Schema } from "mongoose";
import {
  StoreOrderPaymentModelType,
  StoreOrderPaymentStaticsType,
  StoreOrderPaymentType,
  ClientStorePaymentRequest,
} from "../types/store_order_payment_type";
import { Connection } from "mongoose";
import { ClientCartType } from "../types/client_cart_types";
import { dbConnect } from "../connection/dbConnect";
import { createGlobalUserModel } from "./global_user_model";
import {
  DynamicXenditPaymentRequestBody,
  XenditPaymentRequestResponse,
} from "../types/xendit_type";
import axios from "axios";
import { QrCodeHandler } from "../utils/QrCodeHandler";
import { StoreOrderBillingType } from "../types/store_order_billing_type";
import { QueryHandler, QueryValue } from "../utils/QueryHandler";

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
  orderId: string;
  storeId: string;
  subtotal?: number;
  paymentRequest: ClientStorePaymentRequest;
  billing: StoreOrderBillingType;
}) {
  const { paymentRequest, orderId, storeId, byAdmin, billing, subtotal } =
    paymentData;
  // PAYMENT AMOUNT
  const { paymentType, paymentMethod, paymentDesc, paymentAmount } =
    paymentRequest;

  let newPaymentAmount: number = paymentAmount ?? 0;

  if (!newPaymentAmount && subtotal) {
    if (paymentType === "full-payment") {
      newPaymentAmount = subtotal;
    } else if (paymentType === "partial-payment") {
      newPaymentAmount = subtotal * 0.2;
    }
  }

  // PAYMENT DESC
  let newPaymentDesc: string = paymentDesc
    ? paymentDesc
    : `${paymentType} untuk order ${orderId} store ${storeId}`;

  // PAID BY
  const newPaidBy = `${billing.firstName} ${billing.lastName}`;

  // CREATED BY
  let newCreatedBy: string = `${billing.firstName} ${billing.lastName}`;
  if (byAdmin.isByAdmin) {
    const storeConnection = await dbConnect(storeId);
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
      reference_id: orderId,
      channel_code: paymentMethod,
      request_amount: String(newPaymentAmount),
      orderId: orderId,
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
    orderID: orderId,
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

PaymentScema.statics.getAllStorePayments = async function (
  searchParams: URLSearchParams,
) {
  const Query = new QueryHandler(searchParams.toString());

  let filters: Record<string, QueryValue> = Query.getFilterParams([
    "paymentType",
    "paymentMethod",
  ]);

  const { limit, page, sortBy, sortOrder } = Query.getPaginationParams();
  const { dateStart, dateEnd, dateBy } = Query.getDateParams();

  if (dateBy) {
    switch (dateBy) {
      case "createdAt":
        filters = {
          ...filters,
          createdAt: {
            $gte: dateStart,
            $lte: dateEnd,
          },
        };
        break;
      default:
        filters = {
          ...filters,
        };
        break;
    }
  }

  const pipeline: PipelineStage[] = [
    {
      $match: filters,
    },
    { $sort: { [sortBy]: sortOrder } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  return this.aggregate(pipeline);
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
