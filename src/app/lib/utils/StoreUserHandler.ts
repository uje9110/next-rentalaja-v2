import axios from "axios";
import { ClientStoreUserType } from "../types/store_user_type";

export class StoreUserHandler {
  static async getSingleStoreUser(
    userId: string,
    storeId: string,
  ): Promise<ClientStoreUserType> {
    const storeUser = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/user/${userId}`,
      { headers: { "x-store-id": storeId } },
    );
    return storeUser.data.json;
  }
}
