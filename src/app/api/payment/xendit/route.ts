import { DynamicXenditPaymentRequestBody } from "@/app/lib/types/xendit_type";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const Query = new QueryHandler(searchParams.toString());
  let filters = Query.getFilterParams([]);
  const { limit } = Query.getPaginationParams();
  const { dateStart, dateEnd, dateBy } = Query.getDateParams();

  if (dateBy) {
    switch (dateBy) {
      case "created":
        filters = {
          ...filters,
          "created[gte]": dateStart,
          "created[lte]": dateEnd,
        };
        break;

      default:
        filters = { ...filters };
        break;
    }
  }

  const params = { ...filters, limit, reference_id: "ORDER", types: "PAYMENT" };

  try {
    const transactions = await axios.get("https://api.xendit.co/transactions", {
      headers: {
        Authorization: `Basic ${encodedAuth}`,
        "api-version": "2024-11-11",
      },
      params,
    });
    const response = {
      has_more: transactions.data.has_more,
      link: transactions.data.links,
      data: transactions.data.data,
      length: transactions.data.data.length,
    };
    return NextResponse.json(
      { json: response },
      {
        status: StatusCodes.OK,
      },
    );
  } catch (error) {
    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = {
      message: "Unexpected error while capturing transaction",
    };

    if (axios.isAxiosError(error)) {
      status = error.response?.status || status;
      message = error.response?.data || message;
    }

    console.error("Xendit error:", message);
    return NextResponse.json({ error: message }, { status });
  }
}
