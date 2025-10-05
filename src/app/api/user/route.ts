import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreUserModel } from "@/app/lib/model/store_user_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const storeId = req.headers.get("x-store-id");
  const { searchParams } = new URL(req.url);

  try {
    const storeConnection = await dbConnect(storeId);
    const StoreUserModel = createStoreUserModel(storeConnection);
    const users = await StoreUserModel.getAllStoreUser(searchParams);
    return NextResponse.json({ json: users }, { status: StatusCodes.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
