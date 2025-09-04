import mongoose, { Connection, Schema } from "mongoose";
import {
  StoreCounterModelType,
  StoreCounterType,
} from "../types/store_counter_type";

const CounterSchema = new Schema<StoreCounterType>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// get next sequence atomically
CounterSchema.statics.getNextSequence = async function (
  name: string,
  options: { session?: mongoose.ClientSession },
) {
  const counter = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session: options.session },
  );
  return counter.seq;
};

export const createStoreCounterModel = (
  connection: Connection,
): StoreCounterModelType => {
  return (
    (connection.models.counters as StoreCounterModelType) ||
    connection.model<StoreCounterType, StoreCounterModelType>(
      "counters",
      CounterSchema,
    )
  );
};
