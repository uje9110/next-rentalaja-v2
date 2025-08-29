import { Model } from "mongoose";

export type GlobalCategoryType = {
  _id: string;
  title: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
  globalProductsIds: string[];
};

export type GlobalCategoryStatics = {
  getAll(): Promise<GlobalCategoryType[]>; // ✅ fixed
};

export type GlobalCategoryModelType = Model<GlobalCategoryType> &
  GlobalCategoryStatics;
