import { DynamicXenditPaymentRequestBody } from "@/app/lib/types/xendit_type";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.XENDIT_SECRET as string;
const encodedAuth = Buffer.from(`${secretKey}:`).toString("base64");

export async function POST(req: NextRequest) {
  const paymentRequestParam = {
    reference_id: "",
    type: "PAY",
    country: "ID",
    currency: "IDR",
    capture_method: "AUTOMATIC",
    channel_properties: {
      expires_at: new Date(Date.now() + 86400000),
    },
    metadata: {
      orderId: "",
    },
  };

  const body: DynamicXenditPaymentRequestBody = await req.json();

  const paymentData = {
    ...paymentRequestParam,
    reference_id: body.reference_id,
    channel_code: body.channel_code,
    request_amount: Number(body.request_amount),
    description: body.description,
    metadata: {
      ...paymentRequestParam.metadata,
      orderId: body.orderId,
    },
  };

  try {
    const paymentRequestResponse = await axios.post(
      "https://api.xendit.co/v3/payment_requests",
      paymentData,
      {
        headers: {
          Authorization: `Basic ${encodedAuth}`,
          "api-version": "2024-11-11",
        },
      },
    );
    return NextResponse.json(
      { json: paymentRequestResponse.data },
      {
        status: StatusCodes.OK,
      },
    );
  } catch (error: unknown) {
    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = {
      message: "Unexpected error while creating payment request",
    };

    if (axios.isAxiosError(error)) {
      status = error.response?.status || status;
      message = error.response?.data || message;
    }

    console.error("Xendit error:", message);
    return NextResponse.json({ error: message }, { status });
  }
}
