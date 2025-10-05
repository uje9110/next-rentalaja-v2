import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalCategoryModel } from "@/app/lib/model/global_category_model";
import { createGlobalProductModel } from "@/app/lib/model/global_product_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const connection = await dbConnect(null);
    const GlobalCategoryModel = createGlobalCategoryModel(connection);
    const globalCategory = await GlobalCategoryModel.aggregate([
      { $sort: { title: 1 } },
    ]);

    return NextResponse.json(
      { json: globalCategory },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
