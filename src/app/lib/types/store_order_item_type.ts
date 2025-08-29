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
  itemID: string;
  itemName: string;
  itemAmount: number;
  stockIds: string[];
  itemImage: string;
  itemVariation: OrderItemVariationType;
  rentalDetails: OrderItemRentalDetailsType;
  itemSubtotal: number;
  storeId: string;
  pickupAndReturnDetails: {
    pickupDateTimeInMs: number;
    returnDateTimeInMs: number;
  };
};
