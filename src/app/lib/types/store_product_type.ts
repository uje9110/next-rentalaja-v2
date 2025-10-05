import { Model } from "mongoose";
import { GlobalCategoryType } from "./global_category_types";
import { GlobalStoreType } from "./global_store_types";
import { ProductImageTypes } from "./product_image_types";
import {
  ClientStoreProductStockType,
  StoreProductStockType,
} from "./store_product_stock_type";
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

export type ClientSearchProductResultType = {
  _id: string; // product _id
  availableStockCount: number;
  productDetail: {
    _id: string;
    title: string;
    desc: string;
    descHTML: string;
    status: "published" | "draft" | "archived"; // adjust based on your schema
    categoriesIds: string[];
    primaryImage: {
      title: string;
      link: string;
    };
    images: {
      title: string;
      link: string;
    }[];
    stockIds: string[];
    storeDetail: {
      storeName: string;
      storeId: string;
      storeStrings: string;
    };
    createdAt: string; // ISO string if coming from Mongo
    updatedAt: string;
    __v: number;
  };
};

export type StoreProductStaticsType = {
  getAllStoreProduct(
    searchParams: URLSearchParams,
  ): Promise<StoreProductType[]>;
  getOneStoreProduct(
    productId: string,
    store: GlobalStoreType,
  ): Promise<ClientStoreProductType>;
  editStoreProductVariations: (
    storeId: string,
    productId: string,
    incomingVariations: StoreProductVariationType[],
  ) => Promise<StoreProductVariationType>;
  editStoreProductStocks: (
    storeId: string,
    productId: string,
    incomingStocks: StoreProductStockType[],
  ) => Promise<StoreProductStockType>;
};

export type StoreProductModelType = Model<StoreProductType> &
  StoreProductStaticsType;
