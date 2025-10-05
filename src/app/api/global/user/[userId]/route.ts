import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalUserModel } from "@/app/lib/model/global_user_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const globalConnection = await dbConnect(null);
  const GlobalUserModel = createGlobalUserModel(globalConnection);
  try {
    const globalUser = await GlobalUserModel.findById(userId);
    return NextResponse.json({ json: globalUser }, { status: StatusCodes.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
