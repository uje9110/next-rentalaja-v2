import { Connection, Schema } from "mongoose";
import {
  StoreProductBookingModelType,
  StoreProductBookingStaticType,
  StoreProductBookingType,
} from "../types/store_product_booking_type";
import { StoreOrderType } from "../types/store_order_type";
import { dbConnect } from "../connection/dbConnect";
import { createStoreProductStockModel } from "./store_stock_model";

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

StoreProductBookingSchema.statics.deleteBookingFromCanceledOrder =
  async function (orderData: StoreOrderType) {
    const storeConnection = await dbConnect(orderData.storeDetail?.storeId);
    const StockModel = createStoreProductStockModel(storeConnection);

    // 1. Find all bookings related to this order
    const deletedBookings: StoreProductBookingType[] = await this.find({
      fromOrderId: orderData._id,
    });

    // 2. Delete them from the bookings collection
    await this.deleteMany({ fromOrderId: orderData._id });

    // 3. Remove their references from stocks
    if (deletedBookings.length) {
      await Promise.all(
        deletedBookings.map((booking) =>
          StockModel.findByIdAndUpdate(booking.belongToStockId, {
            $pull: { bookingIds: booking._id },
          }),
        ),
      );
    }
  };

export const createStoreProductBookingModel = (
  connection: Connection,
): StoreProductBookingModelType => {
  return (
    (connection.models.bookings as StoreProductBookingModelType) ||
    connection.model<StoreProductBookingType, StoreProductBookingStaticType>(
      "bookings",
      StoreProductBookingSchema,
    )
  );
};
