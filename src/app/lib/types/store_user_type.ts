import mongoose, { Model, ObjectId } from "mongoose";

export type StoreUserType = {
  _id: ObjectId;
  globalUserId: mongoose.Types.ObjectId;
  purchaseHistory: string[];
  email: string;
  firstName: string;
  lastName: string;
  membershipId: string;
};

export type StoreUserStaticsType = {
  findOrCreateStoreUser: (
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      membershipId: string;
      globalUserId: ObjectId;
    },
    options: { session: mongoose.ClientSession },
  ) => Promise<StoreUserType>;
};

export type StoreUserModelType = Model<StoreUserType> & StoreUserStaticsType;
