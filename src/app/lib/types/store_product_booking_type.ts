import { Model, Schema } from "mongoose";
import { StoreOrderType } from "./store_order_type";

export type StoreProductBookingType = {
  _id: Schema.Types.ObjectId | string;
  storeId?: string;
  fromOrderId?: string;
  dateStart: number;
  dateEnd: number;
  duration: number;
  belongToProductId?: string;
  belongToStockId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type StoreProductBookingStaticType = {
  deleteBookingFromCanceledOrder: (orderData: StoreOrderType) => Promise<void>;
};

export type StoreProductBookingModelType = Model<StoreProductBookingType> &
  StoreProductBookingStaticType;
