import { Schema, Connection } from "mongoose";
import {
  GlobalProductModelType,
  GlobalProductTypes,
} from "../types/global_product_types";
import { QueryHandler } from "../utils/QueryHandler";

const GlobalProductSchema = new Schema<GlobalProductTypes>(
  {
    _id: { type: String, required: true },
    storeId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published", "unpublished"],
    },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    prices: { type: [Number], default: [] },
    categoriesIds: { type: [String], default: [] },
    primaryImage: { title: { type: String }, link: { type: String } },
    images: [{ title: { type: String }, link: { type: String } }],
    storeDetail: {
      storeName: { type: String },
      storeId: { type: String },
      storeStrings: { type: String },
    },
    totalSales: { type: Number, default: 0 },
    availableIn: { type: [String], required: true },
  },
  { timestamps: true },
);

import { PipelineStage } from "mongoose";

GlobalProductSchema.statics.getAll = function (queryStrings: string) {
  const Query = new QueryHandler(queryStrings);

  const whitelistParams = [
    "status",
    "title",
    "desc",
    "storeId",
    "categoriesIds",
    "createdAt",
    "totalSales",
  ];

  const filter: Record<string, unknown> =
    Query.getFilterParams(whitelistParams);
  const { page, limit, sortBy, sortOrder } = Query.getPaginationParams();

  const isAvailableExist = Query.getParams().availableIn;

  const pipeline: PipelineStage[] = [
    { $match: filter },
    ...(isAvailableExist
      ? [{ $match: { availableIn: { $in: [isAvailableExist] } } }]
      : []),
    { $sort: { [sortBy]: sortOrder as 1 | -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  return this.aggregate(pipeline);
};

GlobalProductSchema.statics.findByProductId = async function (id: string) {
  const result = await this.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: "stores",
        localField: "availableIn",
        foreignField: "storeId",
        as: "availableStores",
      },
    },
    {
      $limit: 1, // only keep first match
    },
  ]);

  return result[0] || null; // unwrap array
};

export const createGlobalProductModel = (connection: Connection) => {
  return (
    (connection.models.global_products as GlobalProductModelType) ||
    connection.model<GlobalProductTypes, GlobalProductModelType>(
      "global_products",
      GlobalProductSchema,
    )
  );
};
