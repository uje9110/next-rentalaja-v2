import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalUserModel } from "@/app/lib/model/global_user_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const globalConnection = await dbConnect(null);
  const GlobalUserModel = createGlobalUserModel(globalConnection);
  const { searchParams } = new URL(req.url);
  const Query = new QueryHandler(searchParams.toString());
  let filters = Query.getFilterParams(["email"]);
  if (filters.email) {
    filters = {
      ...filters,
      email: { $regex: filters.email, $options: "i" },
    };
  }
  try {
    const globalUser = await GlobalUserModel.aggregate([{ $match: filters }]);
    return NextResponse.json({ json: globalUser }, { status: StatusCodes.OK });
  } catch (error) {
    return handleApiError(error);
  }
}
