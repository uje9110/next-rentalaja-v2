import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalProductModel } from "@/app/lib/model/global_product_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const connection = await dbConnect(null);
    const GlobalProductModel = createGlobalProductModel(connection);
    const globalProduct = await GlobalProductModel.findByProductId(productId);
    return NextResponse.json(
      { json: globalProduct },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
