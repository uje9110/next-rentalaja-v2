import { Model } from "mongoose";
import { StoreOrderType } from "./store_order_type";

export type StoreOrderDiscountType = {
  _id: string;
  discountTotal: number;
  discountType: string;
  discountStatus: string;
  fromCouponId: string;
  fromOrderId: string;
  createdAt?: Date;
  updateAt?: Date;
};
export type StoreOrderDiscountStaticsType = {
  settleDiscountByOrder: (orderData: StoreOrderType) => Promise<void>;
};

export type StoreOrderDiscountModelType = Model<StoreOrderDiscountType> &
  StoreOrderDiscountStaticsType;
