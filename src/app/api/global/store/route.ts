import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalStoreModel } from "@/app/lib/model/global_store_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import {  NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await dbConnect(null);
    const GlobalStoreModel = createGlobalStoreModel(connection);
    const globalStores = await GlobalStoreModel.getAll();

    return NextResponse.json(
      { json: globalStores },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
