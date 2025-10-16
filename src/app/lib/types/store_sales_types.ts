import { Model } from "mongoose";
import { ClientStoreOrderType, StoreOrderType } from "./store_order_type";
import { StoreProductType } from "./store_product_type";

export type StoreSalesType = {
  storeId: string;
  fromOrderId: string;
  belongToProductId: string;
  soldAmount: number;
  profit: number;
  netProfit: number;
  createdAt: Date;
  UpdatedAt: Date;
};

export type ClientStoreSalesType = {
  _id: string;
  totalProfit: number;
  totalSoldAmount: number;
  createdAt: string;
  products: {
    netProfit: number;
    productId: string;
    soldAmount: number;
    profit: number;
    dateCreated: string;
    timeCreated: string;
    productDetails: StoreProductType;
  }[];
  orderDetail: ClientStoreOrderType;
};

export type ClientSalesAnalyticPerPeriodeType = {
  _id: {
    hour: string;
  };
  label: string;
  totalProfit: number;
  totalNetProfit: number;
  totalSales: number;
  documents: ClientStoreSalesType[];
};

export type ClientSalesAnalyticPerProductType = {
  _id: string;
  productDetail: { title: string };
  sales: ClientStoreSalesType[];
  totalNetProfit: number;
  totalProfit: number;
  totalSales: number;
};

export type ClientSalesAnalyticPerUserType = {
  _id: string;
  firstName: string;
  lastName: string;
  totalRenting: number;
};

export type StoreSalesStaticsType = {
  createSalesByOrder: (orderData: StoreOrderType) => Promise<void>;
  deleteSalesByOrder: (orderData: StoreOrderType) => Promise<void>;
  getAllStoreSales: (
    searchParams: URLSearchParams,
  ) => Promise<ClientStoreSalesType[]>;
  getSalesAnalyticPerPeriode: (
    searchParams: URLSearchParams,
  ) => Promise<ClientSalesAnalyticPerPeriodeType[]>;
  getSalesAnalyticPerProduct: (
    searchParams: URLSearchParams,
  ) => Promise<ClientSalesAnalyticPerProductType[]>;
  getSalesAnalyticPerUser: (
    searchParams: URLSearchParams,
  ) => Promise<ClientSalesAnalyticPerUserType[]>;
};

export type StoreSalesModelType = Model<StoreSalesType> & StoreSalesStaticsType;
