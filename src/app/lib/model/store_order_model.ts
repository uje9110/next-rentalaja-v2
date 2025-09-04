import mongoose, { ObjectId, Schema } from "mongoose";
import {
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
import { StoreOrderDiscountType } from "../types/store_order_dicount_type";
import { createStoreOrderDiscountModel } from "./store_discount_model";
import { createStoreUserModel } from "./store_user_model";

const StoreOrderSchema = new Schema<StoreOrderType>(
  {
    _id: {
      type: String,
    },
    storeDetail: {
      type: Object,
    },
    byAdmin: {
      type: Boolean,
      default: false,
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
  billing: StoreOrderBillingType,
  customerID: ObjectId,
  storeDetail: GlobalStoreType,
  items: StoreOrderItemType[],
  coupons: GlobalCouponType[],
  orderCount: number,
  options: { session?: mongoose.ClientSession } = {},
) {
  const _id = `ORDER-${orderCount}`;
  const subtotal = CurrencyHandlers.calculateOrderItemSubtotal(items);
  const discount = CurrencyHandlers.calculateDiscount(coupons, subtotal);
  const total = subtotal - discount;

  const orderData: StoreOrderType = {
    _id,
    billing,
    customerID,
    storeDetail,
    items,
    subtotal,
    total,
  };

  // Pass session if provided
  const order = await this.create([orderData], {
    session: options.session,
  });

  // .create() with array returns an array
  return order[0];
};

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

/**** DISCOUNT CREATION */
StoreOrderSchema.post("save", async function () {
  if (!this.discounts || this.discounts.length === 0) return;

  const storeConnection = await dbConnect(this.storeDetail?.storeId);
  const StoreOrderDiscountModel =
    createStoreOrderDiscountModel(storeConnection);
  const StoreOrderModel = createStoreOrderModel(storeConnection);

  const discountDocs: Partial<StoreOrderDiscountType>[] = this.discounts.map(
    (coupon) => {
      const { couponValue, couponType } = coupon;
      const discountTotal =
        coupon.couponType === "percentage"
          ? (this.subtotal * couponValue) / 100
          : couponValue;
      return {
        fromOrderId: this._id,
        fromCouponId: coupon._id,
        discountTotal: discountTotal,
        discountType: couponType,
      };
    },
  );

  // 1. Insert all discounts
  const createdDiscounts =
    await StoreOrderDiscountModel.insertMany(discountDocs);

  // 2. Collect IDs
  const discountIds = createdDiscounts.map((d) => d._id);

  // 3. Attach them back to the order
  await StoreOrderModel.findByIdAndUpdate(this._id, {
    $push: { discountIds: { $each: discountIds } },
  });
});

/**** STORE USER PURCHASE HISTORY UPDATE */
StoreOrderSchema.post("save", async function () {
  const storeConnection = await dbConnect(this.storeDetail?.storeId);
  const StoreUserModel = createStoreUserModel(storeConnection);
  await StoreUserModel.findByIdAndUpdate(this.customerID, {
    $push: { purchaseHistory: this._id },
  });
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
