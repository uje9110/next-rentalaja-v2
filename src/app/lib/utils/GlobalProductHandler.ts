import axios from "axios";

export class GlobalProductHandler {
  static async getGlobalProducts(urlSearchParam: string) {
    const globalProducts = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/global/product?${urlSearchParam}`,
    );
    return globalProducts.data.json;
  }

  static async getSingleGlobalProduct(productId: string) {
    const globalProduct = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/global/product/${productId}`,
    );
    return globalProduct.data.json;
  }
}
