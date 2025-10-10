import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createOTPModel } from "@/app/lib/model/otp_model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connection = await dbConnect(null);
    const { orderId } = await req.json();
    const supervisorEmail = process.env.NEXT_PUBLIC_SUPERVISOR_EMAIL;

    // Basic validation
    if (!orderId || !supervisorEmail) {
      return NextResponse.json(
        { error: "Order ID dan email wajib diisi" },
        { status: 400 },
      );
    }

    const normalizedEmail = supervisorEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 },
      );
    }

    const OTPModel = createOTPModel(connection);

    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Upsert OTP
    await OTPModel.findOneAndUpdate(
      { orderId, email: normalizedEmail },
      { otp: generatedOtp, expires: expires },
      { upsert: true, new: true },
    );

    // Send email via external service
    await axios.post(
      "https://service.rentalaja.co.id/service/v1/notification/email/reschedule_otp",
      {
        email: normalizedEmail,
        generatedOtp,
        orderId,
      },
    );

    return NextResponse.json({
      message: "OTP berhasil dibuat dan email terkirim",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
