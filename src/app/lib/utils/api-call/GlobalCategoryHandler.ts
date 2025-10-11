import axios from "axios";
import { GlobalCategoryType } from "../../types/global_category_types";
import { ApiHandlerParams } from "../../types/api_handler_type";

export class GlobalCategoryHandler {
  static async getGlobalCategories({
    urlSearchParam,
    isFromClient,
  }: ApiHandlerParams): Promise<GlobalCategoryType[]> {
    const baseEndpoint = `/api/global/category?${urlSearchParam}`;
    let endpoint;
    if (isFromClient) {
      endpoint = baseEndpoint;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_URL}${baseEndpoint}`;
    }
    const globalCategories = await axios.get(endpoint);
    return globalCategories.data.json;
  }
}
