import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreProductStockModel } from "@/app/lib/model/store_stock_model";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { StatusCodes } from "http-status-codes";
import { PipelineStage } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const Query = new QueryHandler(searchParams.toString());
  const { bookingStart, bookingEnd, category, storeId } = Query.getParams();

  const inputDateStartInMs = new Date(bookingStart as string).getTime();
  const inputDateEndInMs = new Date(bookingEnd as string).getTime();

  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "products",
        localField: "belongToProductId",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    { $unwind: "$productDetail" },
    {
      $match: {
        $or: [{ status: "available" }, { status: "rented" }],
        "productDetail.status": "published",
        "productDetail.categoriesIds": { $in: [category] },
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "bookingIds",
        foreignField: "_id",
        as: "bookingDetail",
      },
    },
    {
      $match: {
        bookingDetail: {
          $not: {
            $elemMatch: {
              dateStart: { $lt: inputDateEndInMs },
              dateEnd: { $gt: inputDateStartInMs },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$productDetail._id",
        availableStockCount: { $sum: 1 },
        productDetail: {
          $first: {
            _id: "$productDetail._id",
            title: "$productDetail.title",
            desc: "$productDetail.desc",
            descHTML: "$productDetail.descHTML",
            status: "$productDetail.status",
            categoriesIds: "$productDetail.categoriesIds",
            primaryImage: "$productDetail.primaryImage",
            images: "$productDetail.images",
            stockIds: "$productDetail.stockIds",
            storeDetail: "$productDetail.storeDetail",
            createdAt: "$productDetail.createdAt",
            updatedAt: "$productDetail.updatedAt",
            __v: "$productDetail.__v",
          },
        },
      },
    },
  ];

  try {
    const storeConnection = await dbConnect(storeId as string);
    const StoreProductStockModel =
      createStoreProductStockModel(storeConnection);

    const productStocks = await StoreProductStockModel.aggregate(pipeline);

    return NextResponse.json(
      { json: productStocks },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
