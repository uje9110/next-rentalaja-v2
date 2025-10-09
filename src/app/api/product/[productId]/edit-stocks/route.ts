import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreProductModel } from "@/app/lib/model/store_product_model";
import { StoreProductStockType } from "@/app/lib/types/store_product_stock_type";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const incomingStocks: StoreProductStockType[] = await request.json();
  const { productId } = await params;
  const storeId = request.headers.get("x-store-id");
  const connection = await dbConnect(storeId);
  const StoreProductModel = createStoreProductModel(connection);
  const updatedStocks = await StoreProductModel.editStoreProductStocks(
    storeId as string,
    productId,
    incomingStocks,
  );

  try {
    return NextResponse.json(
      { stocks: updatedStocks },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    console.error("Stock PATCH error:", error);
    return handleApiError(error);
  }
}
