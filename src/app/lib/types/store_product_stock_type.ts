import { Types } from "mongoose";
import { StoreProductBookingType } from "./store_product_booking_type";
import { ClientStoreOrderType } from "./store_order_type";

export type StockStatus =
  | "available"
  | "maintenance"
  | "rented"
  | "broken"
  | "lost"
  | "booked";

export interface StockHistory {
  status: StockStatus;
  orderId?: string;
  timestamp?: Date;
  note?: string;
}

export type StoreProductStockType = {
  _id: string;
  storeId?: string;
  belongToProductId: string;
  title: string;
  status: StockStatus;
  bookingIds: Types.ObjectId[];
  rentedByOrderId?: string;
  salesIds: Types.ObjectId[];
  history: StockHistory[];
};

export type ClientStoreProductStockType = StoreProductStockType & {
  stockBookingDetails: StoreProductBookingType[];
  rentedByOrderDetail: ClientStoreOrderType[];
};
