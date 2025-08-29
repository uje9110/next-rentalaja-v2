import { Model } from "mongoose";

export type GlobalStoreType = {
  storeId: string;
  storeName: string;
  storeStrings: string;
  storeImage: {
    name: string;
    link: string;
  };
  storeAddress: {
    province: string;
    city: string;
    district: string;
    address: string;
  };
};

export type ByCityGlobalStoreType = {
  _id: string;
  cityStores: GlobalStoreType[];
};

export type GlobalStoreStaticType = {
  getAll(): Promise<ByCityGlobalStoreType[]>;
};

export type GlobalStoreModelType = Model<GlobalStoreType> &
  GlobalStoreStaticType;
