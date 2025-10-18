import { ObjectId } from "mongodb";
import mongoose, { PipelineStage, Schema } from "mongoose";
import {
  IsOrderByAdminType,
  StoreOrderDoc,
  StoreOrderModelType,
  StoreOrderStaticsType,
  StoreOrderType,
} from "../types/store_order_type";
import { Connection } from "mongoose";
import { GlobalStoreType } from "../types/global_store_types";
import { StoreOrderItemType } from "../types/store_order_item_type";
import { StoreOrderBillingType } from "../types/store_order_billing_type";
import { CurrencyHandlers } from "../utils/CurrencyHandler";
import { dbConnect } from "../connection/dbConnect";
import { createStoreProductStockModel } from "./store_stock_model";
import { createStoreProductBookingModel } from "./store_booking_model";
import { StoreProductBookingType } from "../types/store_product_booking_type";
import { AnyBulkWriteOperation } from "mongoose";
import { StoreProductStockType } from "../types/store_product_stock_type";
import { createStoreOrderDiscountModel } from "./store_discount_model";
import { createStoreUserModel } from "./store_user_model";
import { createStorePaymentModel } from "./store_payment_model";
import { GlobalCouponType } from "../types/global_coupon_type";
import { ClientStorePaymentRequest } from "../types/store_order_payment_type";
import { QueryHandler, QueryValue } from "../utils/QueryHandler";
import { StoreOrderUpdateLogType } from "../types/store_order_updateLogs_type";
import { createStoreOrderNoteModel } from "./store_order_note_model";
import { StoreOrderNoteType } from "../types/store_order_note_type";
import { createStoreSalesModel } from "./store_sales_model";

const StoreOrderSchema = new Schema<StoreOrderType>(
  {
    _id: {
      type: String,
    },
    storeDetail: {
      type: Object,
    },
    byAdmin: {
      isByAdmin: {
        type: Boolean,
        default: false,
      },
      adminId: {
        type: String,
        default: "",
      },
    },
    customerID: {
      type: Schema.Types.ObjectId,
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal order tidak ada"],
    },
    total: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "canceled",
        "pending",
        "confirmed",
        "processing",
        "in-use",
        "completed",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially-paid", "fully-paid"],
      default: "unpaid",
    },
    items: [
      {
        itemID: {
          type: String,
          required: [true, "ID item belum terisi"],
        },
        stockIds: [
          {
            type: String,
          },
        ],
        itemName: {
          type: String,
        },
        itemAmount: {
          type: Number,
        },
        itemVariation: {
          variationID: {
            type: String,
          },
          variationName: {
            type: String,
          },
          variationPrice: {
            type: Number,
          },
          hoursValue: {
            type: Number,
          },
          variationBonus: {
            title: {
              type: String,
            },
            hoursValue: {
              type: Number,
            },
          },
        },
        itemSubtotal: {
          type: String,
          required: [true, "Subtotal item belum terisi"],
        },
        rentalDetails: {
          rentalStartDate: {
            type: String,
            required: [true, "Tanggal mulai rental belum terisi"],
          },
          rentalStartTime: {
            type: String,
            required: [true, "Waktu mulai rental belum terisi"],
          },
          rentalEndDate: {
            type: String,
            required: [true, "Tanggal akhir rental belum terisi"],
          },
          rentalEndTime: {
            type: String,
            required: [true, "Waktu akhir rental belum terisi"],
          },
          rentalStartInLocaleMs: {
            type: Number,
            required: [
              true,
              "Waktu mulai rental dalam miliseconds Belum terisi",
            ],
          },
          rentalEndInLocaleMs: {
            type: Number,
            required: [
              true,
              "Waktu selesai rental dalam miliseconds Belum terisi",
            ],
          },
        },
        pickupAndReturnDetails: {
          pickupDateTimeInMs: {
            type: Number,
            default: 0,
          },
          returnDateTimeInMs: {
            type: Number,
            default: 0,
          },
        },
      },
    ],
    additionalItems: [
      {
        itemID: {
          type: String,
          required: [true, "ID item belum terisi"],
        },
        stockIds: [
          {
            type: String,
          },
        ],
        itemName: {
          type: String,
        },
        itemAmount: {
          type: Number,
        },
        rentalDetails: {
          rentalDate: {
            type: String,
            required: [true, "Tanggal rental belum terisi"],
          },
          rentalTime: {
            type: String,
            required: [true, "Waktu rental belum terisi"],
          },
          rentalStartDate: {
            type: String,
            required: [true, "Tanggal mulai rental belum terisi"],
          },
          rentalStartTime: {
            type: String,
            required: [true, "Waktu mulai rental belum terisi"],
          },
          rentalEndDate: {
            type: String,
            required: [true, "Tanggal akhir rental belum terisi"],
          },
          rentalEndTime: {
            type: String,
            required: [true, "Waktu akhir rental belum terisi"],
          },
          rentalStartInLocaleMs: {
            type: Number,
            required: [
              true,
              "Waktu mulai rental dalam miliseconds Belum terisi",
            ],
          },
          rentalEndInLocaleMs: {
            type: Number,
            required: [
              true,
              "Waktu selesai rental dalam miliseconds Belum terisi",
            ],
          },
        },
      },
    ],
    billing: {
      firstName: {
        ref: "user",
        type: String,
        required: [true, "Nama depan belum terisi"],
      },
      lastName: {
        ref: "user",
        type: String,
        required: [true, "Nama belakan belum terisi"],
      },
      telephone: {
        ref: "user",
        type: String,
        required: [true, "No telepon belum terisi"],
      },
      email: {
        ref: "user",
        type: String,
        required: [true, "Email belum terisi"],
      },
      address: {
        city: {
          ref: "user",
          type: String,
        },
        district: {
          ref: "user",
          type: String,
        },
        province: {
          ref: "user",
          type: String,
        },
        street: {
          ref: "user",
          type: String,
        },
      },
    },
    paymentIds: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    discounts: [],
    discountIds: [],
    orderNoteIds: {
      type: [String],
    },
    updateLogs: [
      {
        updatedBy: {
          type: String,
        },
        updateInfo: {
          type: String,
        },
        updateTime: {
          type: Date,
        },
      },
    ],
    qrCodeImage: {
      type: String,
    },
  },
  { timestamps: true },
);

/** MIDDLEWARE */
StoreOrderSchema.statics.createOneStoreOrder = async function (
  orderData: {
    billing: StoreOrderBillingType;
    customerID: ObjectId | string;
    storeDetail: GlobalStoreType;
    items: StoreOrderItemType[];
    coupons: GlobalCouponType[];
    orderCount: number;
  },
  byAdmin: {
    isByAdmin: boolean;
    adminId?: string;
  },
  isSkippingPayment: boolean,
  paymentRequest?: ClientStorePaymentRequest,
  options?: { session?: mongoose.ClientSession },
) {
  const { orderCount, billing, customerID, storeDetail, items, coupons } =
    orderData;

  const { isByAdmin, adminId } = byAdmin;

  const newId = `ORDER-${orderCount}`;
  const updateLog: StoreOrderUpdateLogType = {
    updatedBy: isByAdmin ? "Admin" : `${billing.firstName} ${billing.lastName}`,
    updateInfo: "Order dibuat",
    updateTime: new Date(),
  };
  const subtotal = CurrencyHandlers.calculateOrderItemSubtotal(items);
  const discount = CurrencyHandlers.calculateDiscount(coupons, subtotal);
  const total = subtotal - discount;

  const newOrderData: StoreOrderType = {
    _id: newId,
    billing,
    customerID: customerID as string,
    storeDetail,
    items,
    subtotal,
    total,
    updateLogs: [updateLog],
    discounts: coupons,
    byAdmin: { isByAdmin, adminId },
  };

  // Create a doc instance instead of using .create()
  const orderDoc = new this(newOrderData);

  // Attach locals so it's available in post("save")
  orderDoc.$locals.isSkippingPayment = isSkippingPayment;
  orderDoc.$locals.paymentRequest = paymentRequest;

  // Save with session
  await orderDoc.save({ session: options?.session });

  return orderDoc;
};

StoreOrderSchema.statics.getOneStoreOrder = async function (orderId: string) {
  const pipeline: PipelineStage[] = [
    { $match: { _id: orderId } },
    {
      $lookup: {
        from: "payments",
        localField: "paymentIds",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },
    {
      $lookup: {
        from: "discounts",
        localField: "discountIds",
        foreignField: "_id",
        as: "discountsDetails",
      },
    },
  ];

  const order = await this.aggregate(pipeline);
  return order[0];
};

StoreOrderSchema.statics.getAllStoreOrder = async function (
  searchParams: URLSearchParams,
) {
  const Query = new QueryHandler(searchParams.toString());

  let filters: Record<string, QueryValue | ObjectId> = Query.getFilterParams([
    "productId",
    "status",
    "search",
    "customerID",
  ]);

  const productId = filters.productId;

  const { limit, page, sortBy, sortOrder } = Query.getPaginationParams();
  const { dateBy, dateStart, dateEnd, dateStartInMs, dateEndInMs } =
    Query.getDateParams();

  if (typeof filters.customerID === "string") {
    filters.customerID = new ObjectId(filters.customerID);
  }

  let matchPipeline;

  if (filters.search) {
    matchPipeline = {
      "billing.firstName": {
        $regex: filters.search,
        $options: "i",
      },
    };
  } else if (productId) {
    delete filters.productId
    matchPipeline = {
      ...filters,
      "items.itemID": { $regex: productId, $options: "i" },
    };
  } else {
    matchPipeline = filters;
  }

  const pipeline: PipelineStage[] = [
    {
      $match: matchPipeline,
    },
    { $unwind: "$items" },
  ];

  if (dateBy) {
    switch (dateBy) {
      case "byRentalStartIs":
        pipeline.push({
          $match: {
            "items.rentalDetails.rentalStartInLocaleMs": {
              $gte: dateStartInMs,
              $lte: dateEndInMs,
            },
          },
        });
        break;
      case "byRentalEndIs":
        pipeline.push({
          $match: {
            "items.rentalDetails.rentalEndInLocaleMs": {
              $gte: dateStartInMs,
              $lte: dateEndInMs,
            },
          },
        });
        break;
      case "createdAt":
        pipeline.push({
          $match: {
            createdAt: {
              $gte: dateStart,
              $lte: dateEnd,
            },
          },
        });
        break;
      default:
        pipeline.push({
          $match: {
            ...filters,
          },
        });
        break;
    }
  }

  pipeline.push(
    {
      $group: {
        _id: "$_id",
        items: { $push: "$items" },
        paymentIds: { $first: "$paymentIds" },
        discountIds: { $first: "$discountIds" },
        createdAt: { $first: "$createdAt" },
        billing: { $first: "$billing" },
        total: { $first: "$total" },
        subtotal: { $first: "$subtotal" },
        status: { $first: "$status" },
        paymentStatus: { $first: "$paymentStatus" },
        storeDetail: { $first: "$storeDetail" },
      },
    },
    { $sort: { [sortBy]: sortOrder } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  );

  console.log(pipeline);

  const orders = await this.aggregate(pipeline);
  // console.log(orders);
  

  return orders;
};

StoreOrderSchema.statics.addPaymentToStoreOrder = async function (
  byAdmin: IsOrderByAdminType,
  storeId: string,
  orderId: string,
  paymentData: ClientStorePaymentRequest,
  orderTotal: number,
  billing: StoreOrderBillingType,
) {
  const storeConnection = await dbConnect(storeId);

  const StorePaymentModel = createStorePaymentModel(storeConnection);

  const payment = await StorePaymentModel.createOneStorePayment({
    byAdmin,
    orderId: orderId,
    storeId: storeId,
    paymentRequest: paymentData,
    billing: billing,
  });

  let newPaymentStatus;
  if (payment.paymentMethod === "Cash") {
    const amount = payment.paymentAmount ?? 0;
    newPaymentStatus = CurrencyHandlers.getOrderPaymentStatus(
      orderTotal,
      amount,
    );
  }

  await this.findByIdAndUpdate(
    { _id: orderId },
    {
      paymentStatus: newPaymentStatus,
      $push: {
        paymentIds: payment._id,
      },
    },
    { new: true },
  );

  return payment;
};

StoreOrderSchema.statics.getStoreOrderPayments = async function (
  orderId: string,
  storeId: string,
) {
  const storeConnection = await dbConnect(storeId);

  const StorePaymentModel = createStorePaymentModel(storeConnection);
  const orderPayments = await StorePaymentModel.aggregate([
    { $match: { orderID: orderId } },
    {
      $lookup: {
        from: "orders",
        localField: "orderID",
        foreignField: "_id",
        as: "orderDetail",
      },
    },
    { $unwind: "$orderDetail" },
  ]);

  return orderPayments;
};

StoreOrderSchema.statics.addStoreOrderNote = async function (
  storeId: string,
  orderNoteData: Partial<StoreOrderNoteType>,
) {
  const storeConnection = await dbConnect(storeId);
  const OrderNoteModel = createStoreOrderNoteModel(storeConnection);
  const orderNote = await OrderNoteModel.create(orderNoteData);

  await this.findByIdAndUpdate(
    { _id: orderNoteData.fromOrderId },
    { $push: { orderNoteIds: orderNote._id } },
  );

  return orderNote;
};

/** PRE PROCESSING */
/**** DISCOUNT CALCULATION */
StoreOrderSchema.pre("save", async function (next) {
  if (!this.discounts || this.discounts.length === 0) {
    return next();
  }
  const subtotal = this.subtotal;
  const discountTotal = CurrencyHandlers.calculateDiscount(
    this.discounts,
    subtotal,
  );
  this.total = subtotal - discountTotal;
  next();
});

/**** PAYMENT CREATION */
StoreOrderSchema.pre("save", async function (this: StoreOrderDoc) {
  if (this.total === 0) return;
  if (this.$locals.isSkippingPayment) return;

  const storeConnection = await dbConnect(this.storeDetail.storeId);

  const StorePaymentModel = createStorePaymentModel(storeConnection);

  const payment = await StorePaymentModel.createOneStorePayment({
    byAdmin: this.byAdmin,
    orderId: this._id as string,
    storeId: this.storeDetail.storeId,
    subtotal: this.subtotal,
    paymentRequest: this.$locals.paymentRequest,
    billing: this.billing,
  });

  let newPaymentStatus: "unpaid" | "partially-paid" | "fully-paid" = "unpaid";

  if (payment.paymentMethod === "CASH") {
    const amount = payment.paymentAmount ?? 0;
    newPaymentStatus = CurrencyHandlers.getOrderPaymentStatus(
      this.total,
      amount,
    );
  }

  this.paymentStatus = newPaymentStatus;
  this.paymentIds = payment ? [payment._id as string] : [];
});

/**** DISCOUNT CREATION */
StoreOrderSchema.pre("save", async function () {
  if (!this.discounts || this.discounts.length === 0) return;

  const storeConnection = await dbConnect(this.storeDetail?.storeId);
  const StoreOrderDiscountModel =
    createStoreOrderDiscountModel(storeConnection);

  const discountDocs = this.discounts.map((coupon) => {
    const { couponValue, couponType } = coupon;
    const discountTotal =
      coupon.couponType === "percentage"
        ? (this.subtotal * couponValue) / 100
        : couponValue;
    return {
      fromOrderId: this._id,
      fromCouponId: coupon._id,
      discountTotal,
      discountType: couponType,
    };
  });

  const createdDiscounts =
    await StoreOrderDiscountModel.insertMany(discountDocs);
  const newDiscountIds = createdDiscounts.map((d) => d._id);

  this.discountIds = newDiscountIds;
});

/** POST PROCESSING */
/**** BOOKING CREATION */
StoreOrderSchema.post("save", async function () {
  const storeConnection = await dbConnect(this.storeDetail?.storeId);
  const StoreStockModel = createStoreProductStockModel(storeConnection);
  const StoreBookingModel = createStoreProductBookingModel(storeConnection);
  const allBookings: Partial<StoreProductBookingType>[] = [];
  const stockUpdates: AnyBulkWriteOperation<StoreProductStockType>[] = [];

  for (const item of this.items) {
    const { rentalDetails, itemVariation, stockIds = [] } = item;
    const bookingHoursValue = itemVariation?.hoursValue ?? 0;
    const bookingBonusHoursValue =
      itemVariation?.variationBonus?.hoursValue ?? 0;

    const dateStart = rentalDetails.rentalStartInLocaleMs;
    const dateEnd = rentalDetails.rentalEndInLocaleMs;
    const bookingDuration =
      (bookingHoursValue + bookingBonusHoursValue) * 3600 * 1000;

    // Prepare booking docs for each stock
    for (const stockId of stockIds) {
      const bookingDoc = {
        belongToStockId: stockId,
        dateStart,
        dateEnd,
        duration: bookingDuration,
        belongToProductId: item.itemID,
        fromOrderId: this._id,
      };
      allBookings.push(bookingDoc);
    }
  }

  if (allBookings.length > 0) {
    const createdBookings = await StoreBookingModel.insertMany(allBookings);

    for (const booking of createdBookings) {
      stockUpdates.push({
        updateOne: {
          filter: { _id: booking.belongToStockId },
          update: { $push: { bookingIds: booking._id } },
        },
      });
    }

    if (stockUpdates.length > 0) {
      await StoreStockModel.bulkWrite(stockUpdates);
    }
  }
});

/**** STORE USER PURCHASE HISTORY UPDATE */
StoreOrderSchema.post("save", async function () {
  const storeConnection = await dbConnect(this.storeDetail?.storeId);
  const StoreUserModel = createStoreUserModel(storeConnection);
  await StoreUserModel.findByIdAndUpdate(this.customerID, {
    $push: { purchaseHistory: this._id },
  });
});

/**** SALES CREATION OR ORDER CANCELATION */
StoreOrderSchema.post(["findOneAndUpdate", "updateOne"], async function (doc) {
  const updatedDoc = doc || (await this.model.findOne(this.getQuery()));
  if (!updatedDoc) return;

  const storeConnection = await dbConnect(updatedDoc.storeDetail?.storeId);
  const StoreSalesModel = createStoreSalesModel(storeConnection);
  const StoreDiscountModel = createStoreOrderDiscountModel(storeConnection);
  const StoreBookingModel = createStoreProductBookingModel(storeConnection);

  if (["processing", "completed"].includes(updatedDoc.status)) {
    const existingSales = await StoreSalesModel.find({
      fromOrderId: updatedDoc._id,
    });

    if (existingSales.length < 1) {
      await StoreSalesModel.createSalesByOrder(updatedDoc);
    }

    if (updatedDoc.discountIds?.length) {
      await StoreDiscountModel.settleDiscountByOrder(updatedDoc);
    }
  } else if (["canceled"].includes(updatedDoc.status)) {
    await StoreSalesModel.deleteSalesByOrder(updatedDoc);
    await StoreBookingModel.deleteBookingFromCanceledOrder(updatedDoc);
  }
});

export const createStoreOrderModel = (
  connection: Connection,
): StoreOrderModelType => {
  return (
    (connection.models.orders as StoreOrderModelType) ||
    connection.model<StoreOrderType, StoreOrderStaticsType>(
      "orders",
      StoreOrderSchema,
    )
  );
};
