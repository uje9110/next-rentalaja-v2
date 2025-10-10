import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createOTPModel } from "@/app/lib/model/otp_model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await dbConnect(null);
    const { orderId, otp } = await req.json();

    const supervisorEmail = process.env.NEXT_PUBLIC_SUPERVISOR_EMAIL;

    if (!orderId || !supervisorEmail || !otp) {
      return NextResponse.json(
        { error: "Order ID, email, and OTP are required" },
        { status: 400 },
      );
    }

    const OTPModel = createOTPModel(connection);

    // Find OTP by orderId + email
    const record = await OTPModel.findOne({ orderId, email: supervisorEmail });

    if (!record) {
      return NextResponse.json({ error: "OTP not found" }, { status: 404 });
    }

    // Check if OTP expired
    if (new Date() > record.expires) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Check if OTP matches
    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Optional: delete OTP after verification
    await OTPModel.deleteOne({ _id: record._id });

    return NextResponse.json({
      valid: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
