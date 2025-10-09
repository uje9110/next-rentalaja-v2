import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreUserModel } from "@/app/lib/model/store_user_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const storeId = req.headers.get("x-store-id");
  const { userId } = await params;
  const storeConnection = await dbConnect(storeId);
  const StoreUserMode = createStoreUserModel(storeConnection);
  try {
    const storeUser = await StoreUserMode.getOneStoreUser(userId);
    return NextResponse.json({ json: storeUser }, { status: StatusCodes.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
