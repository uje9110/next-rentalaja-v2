import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStorePaymentModel } from "@/app/lib/model/store_payment_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const storeId = req.headers.get("x-store-id");
  const { searchParams } = new URL(req.url);

  try {
    const storeConnection = await dbConnect(storeId);
    const StoreOrderPayment = createStorePaymentModel(storeConnection);
    const storePayments =
      await StoreOrderPayment.getAllStorePayments(searchParams);
    return NextResponse.json(
      { json: storePayments },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
