import axios from "axios";

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
}
