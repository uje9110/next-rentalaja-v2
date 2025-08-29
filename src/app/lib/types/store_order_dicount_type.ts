export type StoreOrderDiscountType = {
  _id: string;
  discountTotal: number;
  discountType: string;
  discountStatus: string;
  fromCouponId: string;
  fromOrderId: string;
  dateCreatedLocale: string;
  timeCreatedLocale: string;
  createdAt: Date;
  updateAt: Date;
};