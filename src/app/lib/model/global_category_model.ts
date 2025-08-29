import { Schema } from "mongoose";
import {
  GlobalCategoryModelType,
  GlobalCategoryType,
} from "../types/global_category_types";
import { Connection } from "mongoose";

const GlobalCategorySchema = new Schema<GlobalCategoryType>(
  {
    _id: {
      type: String,
    },
    storeId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    globalProductsIds: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

GlobalCategorySchema.statics.getAll = function () {
  return this.find();
};

export const createGlobalCategoryModel = (
  connection: Connection,
): GlobalCategoryModelType => {
  return (
    (connection.models.global_categories as GlobalCategoryModelType) ||
    connection.model<GlobalCategoryType, GlobalCategoryModelType>(
      "global_categories",
      GlobalCategorySchema,
    )
  );
};
