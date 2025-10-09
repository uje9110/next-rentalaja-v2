import mongoose, { Model } from "mongoose";

export type StoreOrderNoteType = {
  _id?: mongoose.Types.ObjectId | string;
  fromOrderId: string;
  userId: mongoose.Types.ObjectId | string;
  note: string;
  userEmail: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type StoreOrderNoteStaticType = {
  placeholder: string;
};

export type StoreOrderNoteModelType = Model<StoreOrderNoteType> &
  StoreOrderNoteStaticType;
