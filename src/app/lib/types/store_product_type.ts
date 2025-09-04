import { Model } from "mongoose";
import { GlobalCategoryType } from "./global_category_types";
import { GlobalStoreType } from "./global_store_types";
import { ProductImageTypes } from "./product_image_types";
import { ClientStoreProductStockType } from "./store_product_stock_type";
import { StoreProductVariationType } from "./store_product_variation_type";

export type StoreProductType = {
  _id: string;
  productType: "single" | "package";
  includedProductIds?: string[];
  status: "draft" | "published" | "unpublished";
  storeId: string;
  title: string;
  desc: string;
  descHTML: string;
  primaryImage: ProductImageTypes;
  images: ProductImageTypes[];
  categoriesIds: string[];
  variationsIds: string[];
  salesIds: string[];
  stockIds: string[];
  storeDetail: GlobalStoreType;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ClientStoreProductType = StoreProductType & {
  variationsDetails: StoreProductVariationType[];
  categoriesDetails: GlobalCategoryType[];
  stocksDetails: ClientStoreProductStockType[];
};

export type StoreProductStaticsType = {
  getAllStoreProduct(): Promise<StoreProductType[]>;
  getOneStoreProduct(
    productId: string,
    store: GlobalStoreType,
  ): Promise<ClientStoreProductType>;
};

export type StoreProductModelType = Model<StoreProductType> &
  StoreProductStaticsType;
