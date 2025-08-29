import axios from "axios";

export class GlobalCategoryHandler {
  static async getGlobalCategories(urlSearchParam: string) {
    const globalCategories = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/global/category?${urlSearchParam}`,
    );
    return globalCategories.data.json;
  }
}
