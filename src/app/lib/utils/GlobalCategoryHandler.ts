import axios from "axios";
import { GlobalCategoryType } from "../types/global_category_types";

export class GlobalCategoryHandler {
  static async getGlobalCategories(
    urlSearchParam?: string,
  ): Promise<GlobalCategoryType[]> {
    const globalCategories = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/global/category?${urlSearchParam}`,
    );
    return globalCategories.data.json;
  }
}
