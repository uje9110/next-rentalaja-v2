import { Schema } from "mongoose";
import { StoreProductBookingType } from "../types/store_product_booking_type";

const StoreProductBookingSchema = new Schema<StoreProductBookingType>(
  {
    storeId: {
      type: String,
    },
    fromOrderId: {
      type: String,
    },
    dateStart: {
      type: Number,
    },
    dateEnd: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    belongToProductId: {
      type: String,
    },
    belongToStockId: {
      type: String,
    },
  },
  { timestamps: true },
);
