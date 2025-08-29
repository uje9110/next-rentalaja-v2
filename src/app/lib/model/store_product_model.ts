import { Connection, Schema, Types } from "mongoose";
import {
  StoreProductModelType,
  StoreProductType,
} from "../types/store_product_type";
import { GlobalStoreType } from "../types/global_store_types";

const StoreProductSchema = new Schema<StoreProductType>(
  {
    _id: { type: String },
    productType: {
      type: String,
      enum: ["single", "package"],
    },
    includedProductIds: {
      type: [String],
      validate: {
        validator: function (value: string[]) {
          if (this.productType === "package") {
            return Array.isArray(value) && value.length > 0;
          }
          return true;
        },
        message:
          "includedProductIds is required for package products and should be a non-empty array.",
      },
    },
    status: {
      type: String,
      enum: ["draft", "published", "unpublished"],
      default: "published",
    },
    storeId: { type: String },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    descHTML: { type: String, required: true },
    primaryImage: {
      title: { type: String },
      link: { type: String },
    },
    images: [
      {
        title: { type: String },
        link: { type: String },
      },
    ],
    categoriesIds: [{ type: String }],
    variationsIds: [{ type: String }],
    salesIds: [{ type: Types.ObjectId }],
    stockIds: [{ type: String }],
    storeDetail: {
      storeName: { type: String },
      storeId: { type: String },
      storeStrings: { type: String },
    },
  },
  { timestamps: true },
);

StoreProductSchema.statics.getAllStoreProduct = async function () {
  return this.find();
};

StoreProductSchema.statics.getOneStoreProduct = async function (
  productId: string,
  store: GlobalStoreType,
) {
  const pipeline = [
    {
      $match: {
        _id: productId,
      },
    },
    {
      $addFields: {
        variationsIds: {
          $map: {
            input: "$variationsIds",
            as: "variationId",
            in: { $toObjectId: "$$variationId" },
          },
        },
        // salesIds: {
        //   $map: {
        //     input: "$salesIds",
        //     as: "salesId",
        //     in: { $toObjectId: "$$salesId" },
        //   },
        // },
        bookingIds: {
          $map: {
            input: "$bookingIds",
            as: "bookingId",
            in: { $toObjectId: "$$bookingId" },
          },
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoriesIds",
        foreignField: "_id",
        as: "categoriesDetails",
      },
    },
    {
      $lookup: {
        from: "variations",
        localField: "variationsIds",
        foreignField: "_id",
        as: "variationsDetails",
      },
    },
    // {
    //   $lookup: {
    //     from: "sales",
    //     localField: "salesIds",
    //     foreignField: "_id",
    //     as: "salesDetails",
    //   },
    // },
    {
      $lookup: {
        from: "stocks",
        localField: "stockIds",
        foreignField: "_id",
        as: "stocksDetails",
      },
    },
    {
      $unwind: "$stocksDetails", // Unwind to deal with each item individually
    },
    {
      $lookup: {
        from: "bookings",
        localField: "stocksDetails.bookingIds",
        foreignField: "_id",
        as: "stockBookingDetails",
      },
    },
    {
      $addFields: {
        storeDetail: store,
      },
    },
    {
      $group: {
        _id: "$_id",
        originalRoot: { $first: "$$ROOT" },
        stocksDetails: {
          $push: {
            $mergeObjects: [
              "$stocksDetails",
              { stockBookingDetails: "$stockBookingDetails" },
            ],
          },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$originalRoot", { stocksDetails: "$stocksDetails" }],
        },
      },
    },
    {
      $addFields: {
        totalSales: {
          $sum: {
            $map: {
              input: "$salesDetails",
              as: "saleDetails",
              in: "$$saleDetails.soldAmount",
            },
          },
        },
      },
    },
    {
      $project: {
        salesIds: 0,
        stockIds: 0,
        variationsIds: 0,
      },
    },
  ];
  const result = await this.aggregate(pipeline);
  return result[0] || null;
};

export const createStoreProductModel = (connection: Connection) => {
  return (
    (connection.models.products as StoreProductModelType) ||
    connection.model<StoreProductType, StoreProductModelType>(
      "products",
      StoreProductSchema,
    )
  );
};
