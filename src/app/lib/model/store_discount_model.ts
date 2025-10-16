import { Connection, Schema, Types } from "mongoose";
import {
  StoreOrderDiscountModelType,
  StoreOrderDiscountStaticsType,
  StoreOrderDiscountType,
} from "../types/store_order_dicount_type";
import { StoreOrderType } from "../types/store_order_type";

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

StoreOrderDiscountSchema.statics.settleDiscountByOrder = async function (
  orderData: StoreOrderType,
) {
  if (!orderData.discountIds) {
    return;
  }
  const settleDiscountPromise = orderData.discountIds.map(async (id) => {
    return this.findByIdAndUpdate(new Types.ObjectId(id), {
      createdAt: new Date(
        orderData.items[0].rentalDetails.rentalStartInLocaleMs,
      ),
      discountStatus: "settled",
    });
  });
  await Promise.all(settleDiscountPromise);
};

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
