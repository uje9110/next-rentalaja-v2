import { Connection, Schema } from "mongoose";
import {
  GlobalStoreModelType,
  GlobalStoreStaticType,
  GlobalStoreType,
} from "../types/global_store_types";

const GlobalStoreSchema = new Schema<GlobalStoreType>({
  storeId: {
    type: String,
  },
  storeName: {
    type: String,
  },
  storeImage: {
    name: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  storeAddress: {
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    district: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  storeStrings: {
    type: String,
  },
});

GlobalStoreSchema.statics.getAll = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$storeAddress.city", // Grouping by the city field
        cityStores: { $push: "$$ROOT" }, // Pushing all fields of each doc into an array
      },
    },
  ]);
};

export const createGlobalStoreModel = (
  connection: Connection,
): GlobalStoreModelType => {
  return (
    (connection.models.stores as GlobalStoreModelType) ||
    connection.model<GlobalStoreType, GlobalStoreStaticType>(
      "stores",
      GlobalStoreSchema,
    )
  );
};
