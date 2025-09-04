import { Connection, Schema } from "mongoose";
import {
  StoreOrderDiscountModelType,
  StoreOrderDiscountStaticsType,
  StoreOrderDiscountType,
} from "../types/store_order_dicount_type";

const StoreOrderDiscountSchema = new Schema<StoreOrderDiscountType>(
  {
    discountTotal: {
      type: Number,
    },
    discountType: {
      type: String,
    },
    discountStatus: {
      type: String,
      enum: ["settled", "unsettled"],
      default: "unsettled",
    },
    fromCouponId: {
      type: String,
    },
    fromOrderId: {
      type: String,
    },
  },
  { timestamps: true },
);

export const createStoreOrderDiscountModel = (
  connection: Connection,
): StoreOrderDiscountModelType => {
  return (
    (connection.models.discounts as StoreOrderDiscountModelType) ||
    connection.model<StoreOrderDiscountType, StoreOrderDiscountStaticsType>(
      "discounts",
      StoreOrderDiscountSchema,
    )
  );
};
