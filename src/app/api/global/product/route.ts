import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalProductModel } from "@/app/lib/model/global_product_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const queryString = searchParams.toString();

  try {
    const connection = await dbConnect(null);
    const GlobalProductModel = createGlobalProductModel(connection);
    const globalProducts = await GlobalProductModel.getAll(queryString);

    return NextResponse.json(
      { json: globalProducts },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
