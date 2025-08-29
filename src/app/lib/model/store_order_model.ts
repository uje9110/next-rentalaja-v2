import { Schema } from "mongoose";
import moment from "moment";
import { StoreOrderType } from "../types/store_order_type";

const StoreOrderSchema = new Schema<StoreOrderType>(
  {
    _id: {
      type: String,
    },
    storeDetail: {
      type: Object,
    },
    dateCreatedLocale: {
      type: String,
      default: moment().format("DD-MM-YYYY"),
    },
    timeCreatedLocale: {
      type: String,
      default: moment().format("HH:mmm"),
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
          required: [true, "Nama kota belum terisi"],
        },
        district: {
          ref: "user",
          type: String,
          required: [true, "Nama kecamatan belum terisi"],
        },
        province: {
          ref: "user",
          type: String,
          required: [true, "Nama provinsi belum terisi"],
        },
        street: {
          ref: "user",
          type: String,
          required: [true, "Nama jalan belum terisi"],
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
