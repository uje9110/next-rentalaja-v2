import axios from "axios";
import { ClientStoreOrderType } from "../../types/store_order_type";
import { ApiHandlerParams } from "../../types/api_handler_type";

export class StoreOrderHandler {
  static async getOneStoreOrder({
    isFromClient,
    orderId,
    storeId,
  }: ApiHandlerParams & {
    orderId: string;
    storeId: string;
  }): Promise<ClientStoreOrderType> {
    const baseEndpoint = `/api/order/${orderId}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const response = await axios.get(endpoint, {
      headers: {
        // Authorization: `Bearer ${session?.user.token}`,
        "x-store-id": storeId,
      },
    });
    return response.data.json;
  }
}
