import { Connection, Model, Schema } from "mongoose";
import {
  StoreProductVariationModelType,
  StoreProductVariationType,
} from "../types/store_product_variation_type";

const StoreProductVariationSchema = new Schema<StoreProductVariationType>(
  {
    storeId: {
      type: String,
    },
    variationTitle: {
      type: String,
      required: true,
    },
    variationPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "draft"],
      default: "available",
    },
    productId: {
      type: String,
    },
    variationAvaibility: {
      type: Boolean,
      default: true,
    },
    hoursValue: {
      type: Number,
    },
    variationBonus: {
      type: {
        title: {
          type: String,
          default: "Tanpa Gratis Sewa",
        },
        hoursValue: {
          type: Number,
          default: 0,
        },
      },
      default: {
        title: "Tanpa Gratis Sewa",
        hoursValue: 0,
      },
    },
  },
  { timestamps: true },
);

export const createStoreProductVariatonModel = (connection: Connection) => {
  return (
    (connection.models.variations as StoreProductVariationModelType) ||
    connection.model<StoreProductVariationType, StoreProductVariationModelType>(
      "variations",
      StoreProductVariationSchema,
    )
  );
};
