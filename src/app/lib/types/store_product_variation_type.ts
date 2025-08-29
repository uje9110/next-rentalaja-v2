export type StoreProductVariationType = {
  _id?: string;
  title: string;
  status: string;
  productId: string;
  variationPrice: number;
  variationTitle: string;
  variationAvaibility: boolean;
  hoursValue: number;
  variationBonus: {
    title: string;
    hoursValue: number;
  };
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
};
