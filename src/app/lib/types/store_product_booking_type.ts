import { Schema } from "mongoose";

export type StoreProductBookingType = {
  _id: Schema.Types.ObjectId;
  storeId?: string;
  fromOrderId?: string;
  dateStart?: number;
  dateEnd?: number;
  duration?: number;
  belongToProductId?: string;
  belongToStockId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
