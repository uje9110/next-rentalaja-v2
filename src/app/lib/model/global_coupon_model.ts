import { Connection, PipelineStage, Schema } from "mongoose";
import {
  GlobalCouponModelType,
  GlobalCouponType,
} from "../types/global_coupon_type";
import { QueryHandler, QueryValue } from "../utils/QueryHandler";

const GlobalCouponSchema = new Schema<GlobalCouponType>({
  _id: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
  },
  couponName: {
    type: String,
    unique: true,
    required: true,
  },
  couponDesc: {
    type: String,
    required: true,
  },
  couponType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  couponValue: {
    type: Number,
    required: true,
  },
  couponExpire: {
    type: Date,
    required: true,
  },
  isAvailableWithOther: {
    type: Boolean,
    required: true,
  },
  forMembership: {
    isForMembership: {
      type: Boolean,
    },
    membershipId: {
      type: String || null,
    },
  },
});

GlobalCouponSchema.statics.getAllGlobalCoupon = async function (
  searchParams: URLSearchParams,
) {
  const Query = new QueryHandler(searchParams.toString());
  let filters: Record<string, QueryValue> = Query.getFilterParams([]);

  const { limit, page, sortBy, sortOrder } = Query.getPaginationParams();

  const pipeline: PipelineStage[] = [
    {
      $match: filters,
    },
    { $sort: { [sortBy]: sortOrder } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const coupons = await this.aggregate(pipeline);

  return coupons;
};

export const createGlobalCouponModel = (
  connection: Connection,
): GlobalCouponModelType => {
  return (
    (connection.models.global_coupons as GlobalCouponModelType) ||
    connection.model<GlobalCouponType, GlobalCouponModelType>(
      "global_coupons",
      GlobalCouponSchema,
    )
  );
};
