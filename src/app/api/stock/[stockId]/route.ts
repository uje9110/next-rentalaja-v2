import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreProductStockModel } from "@/app/lib/model/store_stock_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ stockId: string }> },
) {
  const { stockId } = await params;
  const storeId = request.headers.get("x-store-id");
  const body = await request.json();

  try {
    const connection = await dbConnect(storeId);
    const StoreProductStockModel = createStoreProductStockModel(connection);
    const stock = await StoreProductStockModel.findByIdAndUpdate(stockId, body);

    return NextResponse.json({ json: stock }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
}
