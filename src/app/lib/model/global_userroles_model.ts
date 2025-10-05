import { Connection, Model, Schema } from "mongoose";
import {
  UserRoleModelType,
  UserRoleStaticsType,
  UserRoleType,
} from "../types/global_userroles_type";

const UserRoleSchema = new Schema<UserRoleType>(
  {
    roleName: {
      type: String,
      required: true,
      unique: true, // Each role should have a unique name
      trim: true,
    },
    roleId: {
      type: String,
      required: true,
      unique: true, // Each role should have a unique ID
      enum: ["001", "002", "003", "004", "999"], // Restrict to certain IDs (e.g., '001' for admin, '999' for customer)
    },
    permissions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

export const createGlobalUserRole = (
  connection: Connection,
): UserRoleModelType => {
  return (
    (connection.models.global_userroles as UserRoleModelType) ||
    connection.model<UserRoleType, UserRoleStaticsType>(
      "global_userroles",
      UserRoleSchema,
    )
  );
};
