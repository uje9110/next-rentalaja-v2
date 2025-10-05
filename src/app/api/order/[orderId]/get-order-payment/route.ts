import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreOrderModel } from "@/app/lib/model/store_order_model";
import { StoreOrderBillingType } from "@/app/lib/types/store_order_billing_type";
import { ClientStorePaymentRequest } from "@/app/lib/types/store_order_payment_type";
import { IsOrderByAdminType } from "@/app/lib/types/store_order_type";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const storeId = req.headers.get("x-store-id");
  const { orderId } = await params;

  try {
    const connection = await dbConnect(storeId);
    const StoreOrderModel = createStoreOrderModel(connection);
    const order = await StoreOrderModel.getStoreOrderPayments(
      orderId,
      storeId as string,
    );

    return NextResponse.json({ json: order }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
}
