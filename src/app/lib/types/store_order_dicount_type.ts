import { Model } from "mongoose";

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
  placeholder: string;
};

export type StoreOrderDiscountModelType = Model<StoreOrderDiscountType> &
  StoreOrderDiscountStaticsType;
