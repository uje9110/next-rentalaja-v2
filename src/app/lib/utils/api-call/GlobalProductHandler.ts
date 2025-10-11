import axios from "axios";
import { ApiHandlerParams } from "../../types/api_handler_type";

export class GlobalProductHandler {
  static async getGlobalProducts({
    urlSearchParam,
    isFromClient,
  }: ApiHandlerParams) {
    const baseEndpoint = `/api/global/product?${urlSearchParam}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const globalProducts = await axios.get(endpoint);
    return globalProducts.data.json;
  }

  static async getSingleGlobalProduct({
    isFromClient,
    productId,
  }: ApiHandlerParams & { productId: string }) {
    const baseEndpoint = `/api/global/product/${productId}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const globalProduct = await axios.get(endpoint);
    return globalProduct.data.json;
  }
}
