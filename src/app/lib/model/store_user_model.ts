import mongoose, { Connection, Model, Schema } from "mongoose";
import {
  StoreUserModelType,
  StoreUserStaticsType,
  StoreUserType,
} from "../types/store_user_type";

const StoreUserSchema = new Schema<StoreUserType>(
  {
    globalUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    purchaseHistory: {
      type: [String],
      default: [],
    },
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    membershipId: {
      type: String,
    },
  },
  { timestamps: true },
);

/**POSSIBLE CALL OF THIS FUNCTION IS */
/**** 1. If the global user with coresponding data is not created yet, the function will create the store user */
/**** 2. If the global user with coresponding data is alredy created, the store will only create if the store user is not found in store database, the reason is most likely because the user had created order for some store but not yet for another user */
StoreUserSchema.statics.findOrCreateStoreUser = async function (
  userData: {
    email: string;
    firstName: string;
    lastName: string;
    membershipId: string;
    globalUserId: string;
  },
  options: { session: mongoose.ClientSession },
) {
  const user = await this.findOne({ email: userData.email }, null, {
    session: options.session,
  });

  if (!user) {
    const newUser = await this.create([userData], { session: options.session });
    return newUser[0];
  }

  return user;
};

export const createStoreUserModel = (
  connection: Connection,
): StoreUserModelType => {
  return (
    (connection.models.users as StoreUserModelType) ||
    connection.model<StoreUserType, StoreUserStaticsType>(
      "users",
      StoreUserSchema,
    )
  );
};
