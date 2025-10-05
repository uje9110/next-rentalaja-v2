import mongoose, {
  AnyBulkWriteOperation,
  Connection,
  PipelineStage,
  Schema,
  Types,
} from "mongoose";
import {
  StoreProductModelType,
  StoreProductType,
} from "../types/store_product_type";
import { GlobalStoreType } from "../types/global_store_types";
import { QueryHandler, QueryValue } from "../utils/QueryHandler";
import { GlobalCategoryHandler } from "../utils/GlobalCategoryHandler";
import { dbConnect } from "../connection/dbConnect";
import { createStoreProductVariatonModel } from "./store_product_variation_model";
import { StoreProductVariationType } from "../types/store_product_variation_type";
import { StoreProductStockType } from "../types/store_product_stock_type";
import { createStoreProductStockModel } from "./store_stock_model";

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

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

StoreProductSchema.statics.getAllStoreProduct = async function (
  searchParams: URLSearchParams,
) {
  const categories = await GlobalCategoryHandler.getGlobalCategories();

  const Query = new QueryHandler(searchParams.toString());
  let filters: Record<string, QueryValue> = Query.getFilterParams([
    "search",
    "categoriesIds",
    "status",
  ]);

  const matchPipeline = (filters.search && {
    title: { $regex: filters.search, $options: "i" },
  }) || {
    ...(filters.status && { status: filters.status }),
    ...(filters.categoriesIds && {
      categoriesIds: filters.categoriesIds,
    }),
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
        from: "variations",
        localField: "variationsIds",
        foreignField: "_id",
        as: "variationsDetail",
      },
    },
    {
      $lookup: {
        from: "stocks",
        localField: "stockIds",
        foreignField: "_id",
        as: "stocksDetail",
      },
    },
    {
      $lookup: {
        from: "sales",
        localField: "salesIds",
        foreignField: "_id",
        as: "salesDetail",
      },
    },
    {
      $addFields: {
        totalSales: {
          $sum: {
            $map: {
              input: "$salesDetail",
              as: "saleDetail",
              in: "$$saleDetail.soldAmount",
            },
          },
        },
      },
    },
  ];

  const products = await this.aggregate(pipeline);

  const modifiedProducts = products.map((product) => {
    return {
      ...product,
      categoriesDetails: categories.filter((category) => {
        if (product.categoriesIds.includes(category._id)) {
          return category;
        }
      }),
    };
  });

  return modifiedProducts;
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

StoreProductSchema.statics.editStoreProductVariations = async function (
  storeId: string,
  productId: string,
  incomingVariations: StoreProductVariationType[],
) {
  const connection = await dbConnect(storeId);
  const variationModel = createStoreProductVariatonModel(connection);

  const existingVariations = await variationModel.find({ productId }).lean();

  const incomingMap = new Map(
    incomingVariations.map((doc) => [doc._id && doc._id.toString(), doc]),
  );

  const existingMap = new Map(
    existingVariations.map((doc) => [doc._id.toString(), doc]),
  );

  const bulkOps = [];

  // Insert or Update
  for (const doc of incomingVariations) {
    const idStr = doc._id?.toString();

    if (
      !isValidObjectId(idStr as string) ||
      !existingMap.has(idStr as string)
    ) {
      const { _id, ...rest } = doc;

      // @ts-nocheck
      console.log(_id);

      bulkOps.push({
        insertOne: {
          document: rest, // omit the invalid _id
        },
      });
    } else {
      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: doc },
        },
      });
    }
  }

  // Delete
  for (const existing of existingVariations) {
    const idStr = existing._id.toString();
    if (!incomingMap.has(idStr)) {
      bulkOps.push({
        deleteOne: { filter: { _id: existing._id } },
      });
    }
  }

  if (bulkOps.length > 0) {
    await variationModel.bulkWrite(bulkOps);
  }

  // Fetch fresh variations after update
  const updatedVariations = await variationModel
    .find({ productId })
    .sort({ field: "asc", variationTitle: 1 })
    .lean();

  const variationsIds = updatedVariations.map((v) => v._id);

  // Update product with new variationIds
  await this.updateOne({ _id: productId }, { $set: { variationsIds } });
  return updatedVariations;
};

StoreProductSchema.statics.editStoreProductStocks = async function (
  storeId: string,
  productId: string,
  incomingStocks: StoreProductStockType[],
) {
  const connection = await dbConnect(storeId);
  const stockModel = createStoreProductStockModel(connection);
  const existingStocks = await stockModel
    .find({ belongToProductId: productId })
    .lean();

  // Create lookup maps for efficient existence checks
  const incomingMap = new Map(
    incomingStocks.map((stock) => [stock._id?.toString(), stock]),
  );
  const existingMap = new Map(
    existingStocks.map((stock) => [stock._id.toString(), stock]),
  );

  const bulkOps: AnyBulkWriteOperation<StoreProductStockType>[] = [];

  // Handle inserts and updates
  for (const stock of incomingStocks) {
    const idStr = stock._id?.toString();
    if (!idStr) continue;

    if (!existingMap.has(idStr)) {
      bulkOps.push({ insertOne: { document: stock } });
    } else {
      bulkOps.push({
        updateOne: {
          filter: { _id: idStr },
          update: { $set: stock },
        },
      });
    }
  }

  // Handle deletions
  for (const stock of existingStocks) {
    const idStr = stock._id.toString();
    if (!incomingMap.has(idStr)) {
      bulkOps.push({
        deleteOne: { filter: { _id: stock._id } },
      });
    }
  }

  // Perform bulk operation if necessary
  if (bulkOps.length > 0) {
    await stockModel.bulkWrite(bulkOps);
  }

  // Fetch fresh variations after update
  const updatedStocks = await stockModel
    .find({ belongToProductId: productId })
    .sort({ field: "asc", title: 1 })
    .lean();

  const stockIds = updatedStocks.map((v) => v._id);

  // Update product with new variationIds
  await this.updateOne({ _id: productId }, { $set: { stockIds } });

  return updatedStocks;
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
