import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createBookingOverdueNotificationModel } from "@/app/lib/model/store_notification_model";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const storeId = request.headers.get("x-store-id");
  try {
    const connection = await dbConnect(storeId);
    const OverdueBookingModel =
      createBookingOverdueNotificationModel(connection);
    const overdueBookingNotifications = await OverdueBookingModel.find();
    return NextResponse.json(
      { overdueBookingNotifications },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
