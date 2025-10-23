import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { NextRequest, NextResponse } from "next/server";
import { kledo_single_auth } from "./util/kledo-single-auth";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const accessToken = await kledo_single_auth();
    const endpoint = `${process.env.KLEDO_HOST}/finance/invoices`;
    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const invoices = res.data;
    return NextResponse.json({ invoices });
  } catch (error) {
    console.log(error);
    return handleApiError(error);
  }
}
