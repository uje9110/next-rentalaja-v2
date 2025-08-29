import { Model } from "mongoose";
import { ProductImageTypes } from "./product_image_types";
import { GlobalStoreType } from "./global_store_types";

export type GlobalProductTypes = {
  _id: string;
  storeId: string;
  status: "draft" | "published" | "unpublished";
  title: string;
  desc: string;
  descHTML?: string;
  prices: number[];
  categoriesIds: string[];
  primaryImage: ProductImageTypes;
  images: ProductImageTypes[];
  storeDetail: {
    storeName: string;
    storeId: string;
    storeStrings: string;
  };
  totalSales: number;
  availableIn: string[];
};

export type ClientGlobalProductType = GlobalProductTypes & {
  availableStores: GlobalStoreType[];
};

export type GlobalProductStatics = {
  getAll(queryString: string): Promise<GlobalProductTypes[]>;
  findByProductId(id: string): Promise<GlobalProductTypes | null>;
};

export type GlobalProductModelType = Model<GlobalProductTypes> &
  GlobalProductStatics;
