import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreOrderModel } from "@/app/lib/model/store_order_model";
import { StoreOrderNoteType } from "@/app/lib/types/store_order_note_type";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const storeId = req.headers.get("x-store-id");

  const body: Partial<StoreOrderNoteType> = await req.json();

  try {
    const connection = await dbConnect(storeId);
    const StoreOrderModel = createStoreOrderModel(connection);
    const order = await StoreOrderModel.addStoreOrderNote(
      storeId as string,
      body,
    );

    return NextResponse.json({ json: order }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
}
