import { Connection, Model, Schema } from "mongoose";
import { BookingOverdueNotificationType } from "../types/store_booking_overdue_type";

const BookingOverdueNotificationSchemaDef =
  new Schema<BookingOverdueNotificationType>(
    {
      orderId: {
        type: String,
      },

      storeId: {
        type: String,
      },

      status: {
        type: String,
      },
      bookings: [
        {
          _id: Schema.Types.ObjectId,
          belongToProductId: String,
          dateEnd: Number,
        },
      ],
    },
    { timestamps: true },
  );

export const createBookingOverdueNotificationModel = (
  connection: Connection,
): Model<BookingOverdueNotificationType> => {
  return (
    connection.models.booking_overdues_notifications ||
    connection.model<BookingOverdueNotificationType>(
      "booking_overdues_notification",
      BookingOverdueNotificationSchemaDef,
    )
  );
};
