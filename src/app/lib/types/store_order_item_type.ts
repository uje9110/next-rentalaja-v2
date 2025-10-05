import { ObjectId } from "mongoose";
import { GlobalStoreType } from "./global_store_types";

export type OrderItemRentalDetailsType = {
  rentalStartDate: string;
  rentalStartTime: string;
  rentalEndDate: string;
  rentalEndTime: string;
  rentalStartInLocaleMs: number;
  rentalEndInLocaleMs: number;
};

export type OrderItemVariationType = {
  variationID: string;
  variationName: string;
  variationPrice: number;
  hoursValue: number;
  variationBonus: {
    title: string;
    hoursValue: number;
  };
};

export type StoreOrderItemType = {
  _id?: string | ObjectId;
  itemID: string;
  itemName: string;
  itemAmount: number;
  stockIds: string[];
  itemImage: string;
  itemVariation: OrderItemVariationType;
  rentalDetails: OrderItemRentalDetailsType;
  itemSubtotal: number;
  storeDetail: GlobalStoreType;
  pickupAndReturnDetails: {
    pickupDateTimeInMs: number;
    returnDateTimeInMs: number;
  };
};
