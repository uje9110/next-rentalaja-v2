import mongoose, { Model, ObjectId } from "mongoose";
import { GlobalStoreType } from "./global_store_types";

export type GlobalUserType = {
  _id?: ObjectId | string;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  password: string;
  birthDate?: string;
  address?: {
    city?: string;
    district?: string;
    province?: string;
    street?: string;
  };
  roleId?: string;
  membershipId: string;
  profilePic?: {
    name: string;
    link: string;
  };
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  verificationToken?: string | null;
  isVerified?: boolean;
  socialMedia: string;
  authorizedStore?: GlobalStoreType[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
};

export interface GlobalUserStaticsType {
  findOneGlobalUser(email: string): Promise<GlobalUserType | null>;
  createOneGlobalUser(
    userData: Partial<GlobalUserType>,
    options: { session?: mongoose.ClientSession },
  ): Promise<GlobalUserType>;
  findOrCreateCheckoutUser(
    billing: {
      isAccountAlreadyMade: "yes" | "no";
      email: string;
      firstName?: string;
      lastName?: string;
      telephone?: string;
      socialMedia?: string;
    },
    options?: { session?: mongoose.ClientSession },
  ): Promise<{ user: GlobalUserType; isNew: boolean }>;
}

// Merge custom statics into Mongoose Model
export type GlobalUserModelType = Model<GlobalUserType> & GlobalUserStaticsType;
