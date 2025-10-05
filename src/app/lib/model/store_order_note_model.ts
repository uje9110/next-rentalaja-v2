import { Connection, Schema } from "mongoose";
import {
  StoreOrderNoteModelType,
  StoreOrderNoteStaticType,
  StoreOrderNoteType,
} from "../types/store_order_note_type";

const OrderNoteSchema = new Schema<StoreOrderNoteType>(
  {
    fromOrderId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    note: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const createStoreOrderNoteModel = (
  connection: Connection,
): StoreOrderNoteModelType => {
  return (
    (connection.models.order_notes as StoreOrderNoteModelType) ||
    connection.model<StoreOrderNoteType, StoreOrderNoteStaticType>(
      "order_notes",
      OrderNoteSchema,
    )
  );
};
