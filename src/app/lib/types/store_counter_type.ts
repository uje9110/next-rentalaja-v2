import mongoose, { Model } from "mongoose";

export type StoreCounterType = {
  _id: string;
  seq: number;
};

export type StoreCounterStaticsType = {
  getNextSequence: (
    name: string,
    options: { session?: mongoose.ClientSession },
  ) => Promise<number>;
};

export type StoreCounterModelType = Model<StoreCounterType> &
  StoreCounterStaticsType;
