import { GlobalStoreType } from "./global_store_types";
import { StoreOrderItemType } from "./store_order_item_type";

export type ClientCartType = {
  store: GlobalStoreType;
  items: StoreOrderItemType[];
  subtotal: number;
  total: number;
};

export interface CartBookingConflictsType {
  [key: string]: boolean;
}

export interface CartBookingValidationLoadingType {
  status: boolean;
  itemID: string;
}
