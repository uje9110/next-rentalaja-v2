import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreSalesModel } from "@/app/lib/model/store_sales_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const storeId = req.headers.get("x-store-id");
  const { searchParams } = new URL(req.url);

  try {
    const storeConnection = await dbConnect(storeId);
    const StoreSalesModel = createStoreSalesModel(storeConnection);
    const sales = await StoreSalesModel.getAllStoreSales(searchParams);
    return NextResponse.json({ json: sales }, { status: StatusCodes.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
