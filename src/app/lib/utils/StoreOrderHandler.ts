import axios from "axios";
import { ClientStoreOrderType } from "../types/store_order_type";

export class StoreOrderHandler {
  static async getOneStoreOrder(
    orderId: string,
    storeId: string,
  ): Promise<ClientStoreOrderType> {
    const orderEndpoint = `${process.env.NEXT_PUBLIC_URL}/api/order/${orderId}`;
    const response = await axios.get(orderEndpoint, {
      headers: {
        // Authorization: `Bearer ${session?.user.token}`,
        "x-store-id": storeId,
      },
    });
    return response.data.json;
  }
}
