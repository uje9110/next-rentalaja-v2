import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalUserRole } from "@/app/lib/model/global_userroles_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const globalConnection = await dbConnect(null);
    const GlobalUserRoleModel = createGlobalUserRole(globalConnection);
    const userRoles = await GlobalUserRoleModel.find();
    return NextResponse.json({ json: userRoles }, { status: StatusCodes.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
