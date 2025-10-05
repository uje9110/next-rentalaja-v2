import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreOrderNoteModel } from "@/app/lib/model/store_order_note_model";
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
    const storeConnection = await dbConnect(storeId);
    const OrderNoteModel = createStoreOrderNoteModel(storeConnection);
    const orderNote = await OrderNoteModel.aggregate([
      {
        $match: {
          fromOrderId: orderId,
        },
      },
    ]);

    return NextResponse.json({ json: orderNote }, { status: StatusCodes.OK });
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
}
