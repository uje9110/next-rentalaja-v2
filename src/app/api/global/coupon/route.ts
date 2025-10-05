import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalCouponModel } from "@/app/lib/model/global_coupon_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  try {
    const globalConnection = await dbConnect(null);
    const GlobalCouponModel = createGlobalCouponModel(globalConnection);
    const coupons = await GlobalCouponModel.getAllGlobalCoupon(searchParams);
    return NextResponse.json({ json: coupons }, { status: StatusCodes.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
