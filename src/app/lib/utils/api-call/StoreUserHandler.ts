import axios from "axios";
import { ClientStoreUserType } from "../../types/store_user_type";
import { ApiHandlerParams } from "../../types/api_handler_type";

export class StoreUserHandler {
  static async getSingleStoreUser({
    isFromClient,
    userId,
    storeId,
  }: ApiHandlerParams & {
    userId: string;
    storeId: string;
  }): Promise<ClientStoreUserType> {
    const baseEndpoint = `/api/user/${userId}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const storeUser = await axios.get(endpoint, {
      headers: { "x-store-id": storeId },
    });
    return storeUser.data.json;
  }
}
