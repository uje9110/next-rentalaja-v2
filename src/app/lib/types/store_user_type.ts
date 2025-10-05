import mongoose, { Model, ObjectId } from "mongoose";
import { GlobalUserType } from "./global_user_type";

export type StoreUserType = {
  _id: ObjectId | string;
  globalUserId: mongoose.Types.ObjectId;
  purchaseHistory: string[];
  email: string;
  firstName: string;
  lastName: string;
  membershipId: string;
};

export type ClientStoreUserType = StoreUserType & {
  globalUserDetails: GlobalUserType;
};

export type StoreUserStaticsType = {
  findOrCreateStoreUser: (
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      membershipId: string;
      globalUserId: ObjectId | string;
    },
    options: { session: mongoose.ClientSession },
  ) => Promise<StoreUserType>;
  getAllStoreUser: (
    searchParams: URLSearchParams,
  ) => Promise<ClientStoreUserType[]>;
  getOneStoreUser: (userId: string) => Promise<ClientStoreUserType>;
};

export type StoreUserModelType = Model<StoreUserType> & StoreUserStaticsType;
