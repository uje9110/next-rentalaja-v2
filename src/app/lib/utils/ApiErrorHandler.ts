import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

// Mongo duplicate key error shape
interface MongoServerError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoServerError(error: unknown): error is MongoServerError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "number"
  );
}

export function handleApiError(error: unknown) {
  // ---- Handle Mongoose Validation Errors ----
  if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json(
      {
        type: "MongooseValidationError",
        message: "Validation failed",
        details: Object.values(error.errors).map((err) => err.message),
      },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  // ---- Handle Cast Errors (wrong ObjectId, wrong type) ----
  if (error instanceof mongoose.Error.CastError) {
    return NextResponse.json(
      {
        type: "MongooseCastError",
        message: `Invalid value for field "${error.path}"`,
        value: error.value,
      },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  // ---- Handle Duplicate Key Errors ----
  if (isMongoServerError(error) && error.code === 11000) {
    return NextResponse.json(
      {
        type: "MongooseDuplicateKeyError",
        message: "Duplicate key error",
        keyValue: error.keyValue,
      },
      { status: StatusCodes.CONFLICT },
    );
  }

  // ---- Handle Unknown Errors ----
  console.error("Unexpected error:", error);
  return NextResponse.json(
    {
      type: "UnknownError",
      message: error instanceof Error ? error.message : "Something went wrong",
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR },
  );
}
