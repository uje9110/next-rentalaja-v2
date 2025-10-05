import { dbConnect } from "@/app/lib/connection/dbConnect";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StoreProductVariationType } from "@/app/lib/types/store_product_variation_type";
import { createStoreProductModel } from "@/app/lib/model/store_product_model";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const storeId = request.headers.get("x-store-id");
    const incomingVariations: StoreProductVariationType[] =
      await request.json();

    const connection = await dbConnect(storeId);
    const StoreProductModel = createStoreProductModel(connection);
    const updatedVariations =
      await StoreProductModel.editStoreProductVariations(
        storeId as string,
        productId,
        incomingVariations,
      );

    return NextResponse.json(
      { json: updatedVariations },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    console.error(error);
    return handleApiError(error);
  }
}
