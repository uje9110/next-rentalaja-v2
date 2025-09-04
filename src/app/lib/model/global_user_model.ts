import mongoose, { Connection, Schema } from "mongoose";
import {
  GlobalUserType,
  GlobalUserStaticsType,
  GlobalUserModelType,
} from "../types/global_user_type";
import bcryptjs from "bcryptjs";
import { UserNotFoundError } from "../utils/CustomErrorClasses";

const GlobalUserSchema = new Schema<GlobalUserType, GlobalUserModelType>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: "rentalaja123" },
    birthDate: { type: String },
    address: {
      street: { type: String },
      district: { type: String },
      city: { type: String },
      province: { type: String },
    },
    socialMedia: { type: String, default: "" },
    profilePic: {
      name: { type: String, default: "placeholder" },
      link: { type: String, default: "" },
    },
    roleId: {
      type: String,
      enum: ["001", "002", "003", "004", "005", "999"],
      default: "999",
    },
    membershipId: {
      type: String,
      enum: ["NO-MEMBERSHIP", "MEMBERSHIP_01", "STAFF_MEMBERSHIP", ""],
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    authorizedStore: { type: Schema.Types.Mixed },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

/* Middleware */
GlobalUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

/* Statics */
GlobalUserSchema.statics.findOneGlobalUser = async function (email: string) {
  return this.findOne({ email });
};

GlobalUserSchema.statics.createOneGlobalUser = async function (
  userData: Partial<GlobalUserType>,
  options: { session?: mongoose.ClientSession },
) {
  const createdUser = await this.create([userData], {
    session: options.session,
  });
  return createdUser[0];
};

GlobalUserSchema.statics.findOrCreateCheckoutUser = async function (
  billing,
  options,
) {
  if (billing.isAccountAlreadyMade === "yes") {
    const user = await this.findOneGlobalUser(billing.email);
    if (!user) throw new UserNotFoundError(billing.email);
    return user;
  }
  return this.createOneGlobalUser(
    {
      firstName: billing.firstName,
      lastName: billing.lastName,
      email: billing.email,
      telephone: billing.telephone,
      socialMedia: billing.socialMedia,
    },
    options ? { session: options.session } : {},
  );
};

/* Model factory */
export const createGlobalUserModel = (
  connection: Connection,
): GlobalUserModelType => {
  return (
    (connection.models.global_users as GlobalUserModelType) ||
    connection.model<GlobalUserType, GlobalUserModelType>(
      "global_users",
      GlobalUserSchema,
    )
  );
};
