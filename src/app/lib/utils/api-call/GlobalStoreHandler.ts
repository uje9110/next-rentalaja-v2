import axios from "axios";
import { ByCityGlobalStoreType } from "../../types/global_store_types";
import { ApiHandlerParams } from "../../types/api_handler_type";

export class GlobalStoreHandler {
  static async getGlobalStores({
    urlSearchParam,
    isFromClient,
  }: ApiHandlerParams): Promise<ByCityGlobalStoreType[]> {
    const baseEndpoint = `/api/global/store?${urlSearchParam}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const globalStores = await axios.get(endpoint);
    return globalStores.data.json;
  }
}
