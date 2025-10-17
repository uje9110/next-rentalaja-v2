import { Connection, PipelineStage, Schema } from "mongoose";
import {
  StoreSalesModelType,
  StoreSalesType,
} from "../types/store_sales_types";
import { QueryHandler, QueryValue } from "../utils/QueryHandler";
import moment from "moment-timezone";
import { StoreOrderType } from "../types/store_order_type";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { CurrencyHandlers } from "../utils/CurrencyHandler";
import { createStoreProductModel } from "./store_product_model";
import { dbConnect } from "../connection/dbConnect";
import { createGlobalProductModel } from "./global_product_model";

const StoreSalesSchema = new Schema<StoreSalesType>(
  {
    storeId: {
      type: String,
    },
    fromOrderId: {
      type: String,
    },
    belongToProductId: {
      type: String,
    },
    soldAmount: {
      type: Number,
    },
    profit: {
      type: Number,
    },
    netProfit: {
      type: Number,
    },
  },
  { timestamps: true },
);

StoreSalesSchema.statics.createSalesByOrder = async function (
  orderData: StoreOrderType,
) {
  const storeConnection = await dbConnect(orderData.storeDetail.storeId);
  const ProductModel = createStoreProductModel(storeConnection);
  const createSalesPromises = orderData.items.map(async (item) => {
    const profit = item.itemAmount * item.itemVariation.variationPrice;
    const discount = CurrencyHandlers.calculateDiscount(
      orderData.discounts,
      orderData.subtotal,
    );
    const netProfit = profit - discount;
    const sale = await this.create({
      createdAt: new Date(item.rentalDetails.rentalStartInLocaleMs),
      fromOrderId: orderData._id,
      belongToProductId: item.itemID,
      soldAmount: item.itemAmount,
      profit,
      netProfit,
    });
    await ProductModel.findByIdAndUpdate(item.itemID, {
      $push: { salesIds: sale._id },
    });
  });

  await Promise.all(createSalesPromises);
};

StoreSalesSchema.statics.deleteSalesByOrder = async function (
  orderData: StoreOrderType,
) {
  const storeConnection = await dbConnect(orderData.storeDetail.storeId);
  const ProductModel = createStoreProductModel(storeConnection);

  const existingSales = await this.find({ fromOrderId: orderData._id });
  if (existingSales.length > 0) {
    const deletedSalesArray = [];
    for (const sale of existingSales) {
      const deletedSale = await this.findByIdAndDelete({
        _id: sale._id,
      });
      deletedSalesArray.push(deletedSale);
    }
    // DELETE SALE ID FROM PRODUCT SALES FIELD
    for (const sale of deletedSalesArray) {
      if (!sale) {
        return;
      }
      await ProductModel.findOneAndUpdate(
        { _id: sale.belongToProductId },
        { $pull: { salesIds: sale._id } },
      );
    }
  }
};

StoreSalesSchema.statics.getAllStoreSales = async function (
  searchParams: URLSearchParams,
) {
  const Query = new QueryHandler(searchParams.toString());
  let filters: Record<string, QueryValue> = Query.getFilterParams([
    "categoriesIds",
  ]);

  const categoryId = filters.categoriesIds;
  delete filters.categoriesIds;

  const { limit, page, sortBy, sortOrder } = Query.getPaginationParams();
  const { dateStart, dateEnd, dateBy } = Query.getDateParams();

  if (dateBy) {
    switch (dateBy) {
      case "createdAt":
        filters = {
          ...filters,
          createdAt: {
            $gte: dateStart,
            $lte: dateEnd,
          },
        };
        break;
      default:
        filters = {
          ...filters,
        };
        break;
    }
  }

  const pipeline: PipelineStage[] = [
    {
      $match: filters,
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "belongToProductId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
    },
    ...(categoryId
      ? [
          {
            $match: {
              "productDetails.categoriesIds": { $in: [categoryId] },
            },
          },
        ]
      : []),
    {
      $lookup: {
        from: "orders",
        localField: "fromOrderId",
        foreignField: "_id",
        as: "orderDetail",
      },
    },
    { $unwind: { path: "$orderDetail", preserveNullAndEmptyArrays: true } },
    // Lookup discounts based on orderDetail.discountIds
    {
      $lookup: {
        from: "discounts",
        let: { discountIds: "$orderDetail.discountIds" },
        pipeline: [{ $match: { $expr: { $in: ["$_id", "$$discountIds"] } } }],
        as: "orderDetail.discountDetails",
      },
    },

    // Lookup payments based on orderDetail.paymentIds
    {
      $lookup: {
        from: "payments",
        let: { paymentIds: "$orderDetail.paymentIds" },
        pipeline: [{ $match: { $expr: { $in: ["$_id", "$$paymentIds"] } } }],
        as: "orderDetail.paymentDetails",
      },
    },
    // Group by fromOrderId to accumulate sales per order
    {
      $group: {
        _id: "$fromOrderId",
        totalProfit: { $sum: "$profit" },
        totalSoldAmount: { $sum: "$soldAmount" },
        products: {
          $push: {
            netProfit: "$netProfit",
            productId: "$belongToProductId",
            soldAmount: "$soldAmount",
            profit: "$profit",
            dateCreated: "$dateCreatedLocale",
            timeCreated: "$timeCreatedLocale",
            productDetails: "$productDetails",
          },
        },
        orderDetail: { $first: "$orderDetail" }, // Includes populated discountDetails
        createdAt: { $first: "$createdAt" }, // Keep createdAt for sorting
      },
    },
    { $sort: { [sortBy]: sortOrder } },
  ];

  const sales = await this.aggregate(pipeline);
  return sales;
};

StoreSalesSchema.statics.getSalesAnalyticPerPeriode = async function (
  searchParams: URLSearchParams,
) {
  const Query = new QueryHandler(searchParams.toString());

  let filters: Record<string, QueryValue> & {
    createdAt?: { $gte?: string | Date; $lte?: string | Date };
  } = Query.getFilterParams(["categoriesIds"]);

  const categoryId = filters.categoriesIds;
  delete filters.categoriesIds;

  const { limit, page } = Query.getPaginationParams();
  const { dateStart, dateEnd, dateBy } = Query.getDateParams();

  if (dateBy) {
    switch (dateBy) {
      case "createdAt":
        filters = {
          ...filters,
          createdAt: {
            $gte: dateStart,
            $lte: dateEnd,
          },
        };
        break;
      default:
        filters = {
          ...filters,
        };
        break;
    }
  }

  const start = moment(filters.createdAt?.$gte);
  const end = moment(filters.createdAt?.$lte);
  let groupBy;

  if (end.diff(start, "days") === 0) {
    groupBy = "hour";
  } else if (end.diff(start, "weeks") < 1) {
    groupBy = "day";
  } else {
    groupBy = "week";
  }

  const pipeline: PipelineStage[] = [
    { $match: filters },
    {
      $lookup: {
        from: "products",
        as: "productDetails",
        localField: "belongToProductId",
        foreignField: "_id",
      },
    },
    {
      $unwind: "$productDetails",
    },
    ...(categoryId
      ? [{ $match: { "productDetails.categoriesIds": { $in: [categoryId] } } }]
      : []),
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $project: {
        createdAtLocal: { $add: ["$createdAt", 7 * 60 * 60 * 1000] }, // Convert to UTC+7
        soldAmount: 1,
        profit: 1,
        netProfit: 1,
        originalDocument: "$$ROOT", // Store the entire document
      },
    },
  ];

  if (groupBy === "hour") {
    pipeline.push(
      {
        $group: {
          _id: { hour: { $hour: "$createdAtLocal" } },
          totalSales: { $sum: "$soldAmount" },
          totalProfit: { $sum: "$profit" },
          documents: { $push: "$originalDocument" },
          totalNetProfit: { $sum: "$netProfit" },
        },
      },
      {
        $project: {
          _id: 1,
          totalSales: 1,
          totalProfit: 1,
          totalNetProfit: 1,
          documents: 1,
          label: {
            $concat: [
              {
                $cond: {
                  if: { $lt: ["$_id.hour", 10] },
                  then: { $concat: ["0", { $toString: "$_id.hour" }] },
                  else: { $toString: "$_id.hour" },
                },
              },
              ":00",
            ],
          },
        },
      },
      { $sort: { "_id.hour": 1 } },
    );
  } else if (groupBy === "day") {
    pipeline.push(
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAtLocal" },
          },
          soldAmount: 1,
          profit: 1,
          netProfit: 1,
          originalDocument: "$$ROOT",
        },
      },
      {
        $group: {
          _id: "$date",
          totalSales: { $sum: "$soldAmount" },
          totalProfit: { $sum: "$profit" },
          totalNetProfit: { $sum: "$netProfit" },
          documents: { $push: "$originalDocument" },
        },
      },
      {
        $project: {
          date: "$_id",
          totalSales: 1,
          totalProfit: 1,
          totalNetProfit: 1,
          documents: 1,
          dayOfWeek: { $dayOfWeek: { $toDate: "$_id" } }, // Get day index (1 = Sunday, 7 = Saturday)
        },
      },
      {
        $project: {
          date: 1,
          totalSales: 1,
          totalProfit: 1,
          totalNetProfit: 1,
          documents: 1,
          label: {
            $concat: [
              {
                $arrayElemAt: [
                  ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
                  { $subtract: ["$dayOfWeek", 1] },
                ],
              },
              ", ",
              "$date",
            ],
          },
        },
      },

      { $sort: { date: 1 } },
    );
  } else if (groupBy === "week") {
    pipeline.push(
      {
        $project: {
          year: { $year: "$createdAtLocal" },
          month: { $month: "$createdAtLocal" },
          dayOfMonth: { $dayOfMonth: "$createdAtLocal" },
          soldAmount: 1,
          profit: 1,
          netProfit: 1,
          originalDocument: "$$ROOT",
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            week: {
              $floor: {
                $divide: [{ $subtract: ["$dayOfMonth", 1] }, 7],
              },
            },
          },
          totalSales: { $sum: "$soldAmount" },
          totalProfit: { $sum: "$profit" },
          totalNetProfit: { $sum: "$netProfit" },
          startDate: { $min: "$dayOfMonth" },
          endDate: { $max: "$dayOfMonth" },
          // documents: { $push: "$originalDocument" },
        },
      },
      {
        $project: {
          label: {
            $concat: [
              "Week ",
              { $toString: { $add: ["$_id.week", 1] } },
              " (",
              { $toString: "$startDate" },
              "-",
              { $toString: "$endDate" },
              ")",
            ],
          },
          totalSales: 1,
          totalProfit: 1,
          totalNetProfit: 1,
          startDate: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$startDate",
            },
          },
          endDate: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$endDate",
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    );
  }

  return this.aggregate(pipeline);
};

StoreSalesSchema.statics.getSalesAnalyticPerProduct = async function (
  searchParams: URLSearchParams,
) {
  const Query = new QueryHandler(searchParams.toString());

  let filters: Record<string, QueryValue> & {
    createdAt?: { $gte?: string | Date; $lte?: string | Date };
  } = Query.getFilterParams(["categoriesIds"]);

  const categoryId = filters.categoriesIds;
  delete filters.categoriesIds;

  const { limit, page } = Query.getPaginationParams();
  const { dateStart, dateEnd, dateBy } = Query.getDateParams();

  if (dateBy) {
    switch (dateBy) {
      case "createdAt":
        filters = {
          ...filters,
          createdAt: {
            $gte: dateStart,
            $lte: dateEnd,
          },
        };
        break;
      default:
        filters = {
          ...filters,
        };
        break;
    }
  }

  const pipeline: PipelineStage[] = [
    { $match: filters },
    {
      $lookup: {
        from: "products",
        as: "productDetail",
        localField: "belongToProductId",
        foreignField: "_id",
      },
    },
    { $unwind: "$productDetail" },
    ...(categoryId
      ? [{ $match: { "productDetail.categoriesIds": { $in: [categoryId] } } }]
      : []),
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $group: {
        _id: "$belongToProductId",
        productDetail: { $first: "$productDetail" },
        totalProfit: { $sum: "$profit" },
        totalNetProfit: { $sum: "$netProfit" },
        sales: {
          $push: {
            createdAt: "$createdAt",
            profit: "$profit",
            netProfit: "$netProfit",
            soldAmount: "$soldAmount",
          },
        },
        totalSales: { $sum: 1 },
      },
    },
    {
      $project: {
        "productDetail.title": 1,
        totalSales: 1,
        totalProfit: 1,
        totalNetProfit: 1,
        sales: 1,
      },
    },
    { $sort: { totalSales: -1 } },
  ];

  return this.aggregate(pipeline);
};

StoreSalesSchema.statics.getSalesAnalyticPerUser = async function (
  searchParams: URLSearchParams,
) {
  const Query = new QueryHandler(searchParams.toString());

  let filters: Record<string, QueryValue> & {
    createdAt?: { $gte?: string | Date; $lte?: string | Date };
  } = Query.getFilterParams(["categoriesIds"]);

  const categoryId = filters.categoriesIds;
  delete filters.categoriesIds;

  const { limit, page } = Query.getPaginationParams();
  const { dateStart, dateEnd, dateBy } = Query.getDateParams();

  if (dateBy) {
    switch (dateBy) {
      case "createdAt":
        filters = {
          ...filters,
          createdAt: {
            $gte: dateStart,
            $lte: dateEnd,
          },
        };
        break;
      default:
        filters = {
          ...filters,
        };
        break;
    }
  }

  const pipeline: PipelineStage[] = [
    { $match: filters },
    {
      $lookup: {
        from: "orders",
        localField: "fromOrderId",
        foreignField: "_id",
        as: "orderDetails",
      },
    },
    { $unwind: "$orderDetails" },
    {
      $lookup: {
        from: "users",
        localField: "orderDetails.billing.email",
        foreignField: "email",
        as: "customerDetails",
      },
    },
    { $unwind: "$customerDetails" },
    {
      $lookup: {
        as: "productDetail",
        from: "products",
        localField: "belongToProductId",
        foreignField: "_id",
      },
    },
    {
      $unwind: "$productDetail",
    },
    ...(categoryId
      ? [{ $match: { "productDetail.categoriesIds": { $in: [categoryId] } } }]
      : []),
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $group: {
        _id: "$customerDetails._id",
        firstName: { $first: "$customerDetails.firstName" },
        lastName: { $first: "$customerDetails.lastName" },
        totalRenting: { $sum: 1 },
      },
    },
    { $sort: { totalRenting: -1 } },
  ];

  return this.aggregate(pipeline);
};

/** POST PROCESSING */
/**** Global Product Sales Update */
StoreSalesSchema.post("save", async function () {
  const connection = await dbConnect(null);
  const GlobalProductModel = createGlobalProductModel(connection);
  await GlobalProductModel.findByIdAndUpdate(this.belongToProductId, {
    $inc: { totalSales: this.soldAmount },
  });
});

export const createStoreSalesModel = (connection: Connection) => {
  return (
    (connection.models.sales as StoreSalesModelType) ||
    connection.model<StoreSalesType, StoreSalesModelType>(
      "sales",
      StoreSalesSchema,
    )
  );
};
