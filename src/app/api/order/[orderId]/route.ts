import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreOrderModel } from "@/app/lib/model/store_order_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const storeId = request.headers.get("x-store-id");

  try {
    const connection = await dbConnect(storeId);
    const StoreOrderModel = createStoreOrderModel(connection);
    const order = await StoreOrderModel.getOneStoreOrder(orderId);

    return NextResponse.json({ json: order }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const storeId = request.headers.get("x-store-id");
  const body = await request.json();

  try {
    const connection = await dbConnect(storeId);
    const StoreOrderModel = createStoreOrderModel(connection);
    const order = await StoreOrderModel.findByIdAndUpdate(orderId, body, {
      new: true,
    });

    return NextResponse.json({ json: order }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
}
