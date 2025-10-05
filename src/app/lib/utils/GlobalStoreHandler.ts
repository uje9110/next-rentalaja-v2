import axios from "axios";
import { ByCityGlobalStoreType } from "../types/global_store_types";

export class GlobalStoreHandler {
  static async getGlobalStores(
    urlSearchParam: string,
  ): Promise<ByCityGlobalStoreType[]> {
    const globalStores = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/global/store?${urlSearchParam}`,
    );
    return globalStores.data.json;
  }
}
