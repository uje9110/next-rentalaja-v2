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

export type GlobalCouponStaticsType = {
  getAllGlobalCoupon: (
    searchParam: URLSearchParams,
  ) => Promise<GlobalCouponType[]>;
};

export type GlobalCouponModelType = Model<GlobalCouponType> &
  GlobalCouponStaticsType;
