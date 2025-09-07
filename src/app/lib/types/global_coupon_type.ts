import { Model } from "mongoose";

export type GlobalCouponType = {
  _id?: string;
  storeId: string;
  couponDesc: string;
  couponExpire: Date;
  couponName: string;
  couponType: string;
  couponValue: number;
  isAvailableWithOther: boolean;
  forMembership: {
    isForMembership: boolean;
    membershipId: string | null;
  };
};

export type GlobalCouponStaticsType = {};

export type GlobalCouponModelType = Model<GlobalCouponType> &
  GlobalCouponStaticsType;
