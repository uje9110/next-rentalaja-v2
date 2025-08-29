import { Schema } from "mongoose";
import { StoreProductStockType } from "../types/store_product_stock_type";

const StoreProductStockSchema = new Schema<StoreProductStockType>({
  _id: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
  },
  belongToProductId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "maintenance", "rented", "broken", "lost", "booked"],
    default: "available",
  },
  rentedByOrderId: {
    type: String,
  },
  bookingIds: [
    {
      type: Schema.Types.ObjectId,
      default: [],
    },
  ],
  salesIds: [
    {
      type: Schema.Types.ObjectId,
      default: [],
    },
  ],
  history: [
    {
      status: {
        type: String,
        enum: [
          "available",
          "maintenance",
          "rented",
          "broken",
          "lost",
          "booked",
        ],
      },
      orderId: {
        type: String,
      },
      timestamp: { type: Date, default: Date.now },
      note: {
        type: String,
      },
    },
  ],
});
