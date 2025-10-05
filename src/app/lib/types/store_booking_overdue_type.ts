import { Schema } from "mongoose";

export type OrderNotificationType = {
  store: string;
  orderId: string;
  orderStatus: string;
  message: string;
};

export type BookingOverdueNotificationType = {
  _id?: Schema.Types.ObjectId;
  orderId: string;
  storeId: string;
  status: string;
  bookings: {
    _id: Schema.Types.ObjectId;
    belongToProductId: string;
    dateEnd: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};
