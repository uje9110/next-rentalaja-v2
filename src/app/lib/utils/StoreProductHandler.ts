import axios from "axios";
import { ClientSearchProductResultType } from "../types/store_product_type";

export class StoreProductHandler {
  static async getStoreProducts(urlSearchParam: string) {
    const storeProducts = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/product?${urlSearchParam}`,
    );
    return storeProducts.data.json;
  }

  static async getSingleStoreProduct(productId: string, storeId: string) {
    const storeProduct = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/product/${productId}`,
      { headers: { "x-store-id": storeId } },
    );
    return storeProduct.data.json;
  }

  static async getProductSearch(
    urlSearchParam: string,
  ): Promise<ClientSearchProductResultType[]> {
    const storeProduct = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/product/search?${urlSearchParam}`,
    );
    return storeProduct.data.json;
  }
}
