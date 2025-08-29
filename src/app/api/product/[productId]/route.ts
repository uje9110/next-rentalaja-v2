import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalStoreModel } from "@/app/lib/model/global_store_model";
import { createStoreProductModel } from "@/app/lib/model/store_product_model";
import { GlobalStoreType } from "@/app/lib/types/global_store_types";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

async function getStoreDetail(
  storeId: string,
): Promise<GlobalStoreType | null> {
  const GlobalConnection = await dbConnect(null); // ✅ Connect to Global DB

  try {
    const GlobalStoreModel = createGlobalStoreModel(GlobalConnection);
    const store = await GlobalStoreModel.findOne({ storeId: storeId });
    return store;
  } catch (error) {
    console.error("Error fetching store detail:", error);
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const storeId = req.headers.get("x-store-id");
  try {
    const globalStore = await getStoreDetail(storeId as string);
    const { productId } = await params;
    const connection = await dbConnect(storeId);
    const StoreProductModel = createStoreProductModel(connection);
    if (!globalStore) {
      return NextResponse.json(
        { json: { message: "Store Not Found" } },
        { status: StatusCodes.OK },
      );
    }
    const storeProduct = await StoreProductModel.getOneStoreProduct(
      productId,
      globalStore,
    );
    return NextResponse.json(
      { json: storeProduct },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
