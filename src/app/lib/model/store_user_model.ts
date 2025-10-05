import mongoose, { Connection, Model, Schema } from "mongoose";
import {
  StoreUserModelType,
  StoreUserStaticsType,
  StoreUserType,
} from "../types/store_user_type";
import { QueryHandler, QueryValue } from "../utils/QueryHandler";
import { PipelineStage } from "mongoose";
import { dbConnect } from "../connection/dbConnect";
import { createGlobalUserModel } from "./global_user_model";
import { GlobalUserType } from "../types/global_user_type";

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

StoreUserSchema.statics.getAllStoreUser = async function (
  searchParams: URLSearchParams,
) {
  const Query = new QueryHandler(searchParams.toString());
  let filters: Record<string, QueryValue> = Query.getFilterParams([
    "membershipId",
    "search",
    "status",
  ]);

  const matchPipeline = (filters.search && {
    email: { $regex: filters.search, $options: "i" },
  }) || {
    ...(filters && filters),
  };

  const { limit, page, sortBy, sortOrder } = Query.getPaginationParams();

  const pipeline: PipelineStage[] = [
    {
      $match: matchPipeline,
    },
    { $sort: { [sortBy]: sortOrder } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $lookup: {
        from: "orders",
        localField: "purchaseHistory",
        foreignField: "_id",
        as: "purchaseDetails",
      },
    },
    {
      $addFields: {
        totalOrder: { $size: "$purchaseDetails" },
      },
    },
  ];

  const users = await this.aggregate(pipeline);
  const globalUserIds = users.map((user) => user.globalUserId);

  const globalConnection = await dbConnect(null);
  const GlobalUserModel = createGlobalUserModel(globalConnection);
  const globalUsers = await GlobalUserModel.find({
    _id: { $in: globalUserIds },
  }).lean();

  const globalUserMap = globalUsers.reduce<Record<string, GlobalUserType>>(
    (map, user) => {
      map[String(user._id)] = user;
      return map;
    },
    {},
  );

  const modifiedUsers = users.map((user) => {
    const globalUserDetails = globalUserMap[user.globalUserId?.toString()];
    return {
      ...user,
      globalUserDetails,
    };
  });

  return modifiedUsers;
};

StoreUserSchema.statics.getOneStoreUser = async function (userId: string) {
  const storeUser = await this.findById(userId);

  // Fetch global user details if globalUserId is present
  const globalConnection = await dbConnect(null);
  const GlobalUserModel = createGlobalUserModel(globalConnection);
  let globalUserDetails = null;

  if (storeUser.globalUserId) {
    globalUserDetails = await GlobalUserModel.findOne({
      _id: new mongoose.Types.ObjectId(storeUser.globalUserId),
    });
  }

  // Respond with user details including global user details
  return { storeUser, globalUserDetails };
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
