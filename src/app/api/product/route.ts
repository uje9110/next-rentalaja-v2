import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreProductModel } from "@/app/lib/model/store_product_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const storeId = req.headers.get("x-store-id");
  const { searchParams } = new URL(req.url);

  try {
    const storeConnection = await dbConnect(storeId);
    const StoreProductModel = createStoreProductModel(storeConnection);
    const order = await StoreProductModel.getAllStoreProduct(searchParams);
    return NextResponse.json({ json: order }, { status: StatusCodes.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
