import axios from "axios";

export class GlobalStoreHandler {
  static async getGlobalStores(urlSearchParam: string) {
    const globalStores = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/global/store?${urlSearchParam}`,
    );
    return globalStores.data.json;
  }
}
