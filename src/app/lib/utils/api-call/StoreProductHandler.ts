import axios from "axios";
import { ClientSearchProductResultType } from "../../types/store_product_type";
import { ApiHandlerParams } from "../../types/api_handler_type";

export class StoreProductHandler {
  static async getStoreProducts({
    urlSearchParam,
    isFromClient,
  }: ApiHandlerParams) {
    const baseEndpoint = `/api/product?${urlSearchParam}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const storeProducts = await axios.get(endpoint);
    return storeProducts.data.json;
  }

  static async getSingleStoreProduct({
    isFromClient,
    productId,
    storeId,
  }: ApiHandlerParams & { productId: string; storeId: string }) {
    const baseEndpoint = `/api/product/${productId}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const storeProduct = await axios.get(endpoint, {
      headers: { "x-store-id": storeId },
    });
    return storeProduct.data.json;
  }

  static async getProductSearch({
    urlSearchParam,
    isFromClient,
  }: ApiHandlerParams): Promise<ClientSearchProductResultType[]> {
    const baseEndpoint = `/api/product/search?${urlSearchParam}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const storeProduct = await axios.get(endpoint);
    return storeProduct.data.json;
  }
}
