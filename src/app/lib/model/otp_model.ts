import mongoose, { Connection, Model } from "mongoose";

interface OtpDoc extends mongoose.Document {
  orderId: string;
  otp: string;
  expires: Date;
  email: string;
}

const OtpSchema = new mongoose.Schema<OtpDoc>({
  orderId: { type: String, required: true },
  email: { type: String, required: true }, // ✅ Added
  otp: { type: String, required: true },
  expires: { type: Date, required: true },
});

export const createOTPModel = (connection: Connection): Model<OtpDoc> => {
  return (
    connection.models["otps"] || connection.model<OtpDoc>("otps", OtpSchema)
  );
};
