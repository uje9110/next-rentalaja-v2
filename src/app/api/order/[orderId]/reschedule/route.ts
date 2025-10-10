import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createStoreProductBookingModel } from "@/app/lib/model/store_booking_model";
import { createStoreOrderModel } from "@/app/lib/model/store_order_model";
import { createStoreProductStockModel } from "@/app/lib/model/store_stock_model";
import { GlobalCouponType } from "@/app/lib/types/global_coupon_type";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import { ClientStoreOrderPaymentType } from "@/app/lib/types/store_order_payment_type";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const body: { newItemData: StoreOrderItemType[]; updatedBy: string } =
    await req.json();
  const storeId = req.headers.get("x-store-id");
  try {
    const connection = await dbConnect(storeId);
    const BookingModel = createStoreProductBookingModel(connection);
    const OrderModel = createStoreOrderModel(connection);
    const StockModel = createStoreProductStockModel(connection);

    // #region OLDER BOOKINGS THAT NEED TO BE DELETED
    // const oldOrderBookings = await BookingModel.find({ fromOrderId: orderId });
    // const oldOrderBookingsIds = oldOrderBookings.map((booking) => booking._id);
    // #endregion

    // #region NEW BOOKINGS DATA THAT WILL BE CREATED
    const newOrderBookingData = body.newItemData.map((item) => {
      const { rentalDetails, itemVariation } = item;
      const { rentalStartInLocaleMs, rentalEndInLocaleMs } = rentalDetails;
      const hoursValue = itemVariation?.hoursValue ?? 0;
      const bonusHours = itemVariation?.variationBonus?.hoursValue ?? 0;
      const bookingDuration = (hoursValue + bonusHours) * 3600 * 1000;
      return item.stockIds.map((stockId) => {
        return {
          belongToStockId: stockId,
          dateStart: rentalStartInLocaleMs,
          dateEnd: rentalEndInLocaleMs,
          duration: bookingDuration,
          belongToProductId: item.itemID,
          fromOrderId: orderId,
        };
      });
    });
    const flattenedNewBookingsData = newOrderBookingData.flat();
    // #endregion

    // #region NEW ORDER DATA
    const order = await OrderModel.aggregate([
      { $match: { _id: orderId } },
      {
        $lookup: {
          localField: "paymentIds",
          foreignField: "_id",
          as: "paymentDetails",
          from: "payments",
        },
      },
    ]);
    const newOrderSubtotal = body.newItemData.reduce((total, item) => {
      return item.itemSubtotal + total;
    }, 0);
    const orderDiscount = order[0]?.discounts.reduce(
      (total: number, discount: GlobalCouponType) => {
        if (discount.couponType === "fixed") {
          return discount.couponValue + total;
        } else if (discount.couponType === "percentage") {
          return (discount.couponValue / 100) * order[0].subtotal + total;
        }
        return 0;
      },
      0,
    );
    const newOrderTotal = newOrderSubtotal - (orderDiscount as number);
    const orderPayment = order[0].paymentDetails.reduce(
      (total: number, payment: ClientStoreOrderPaymentType) => {
        if (
          payment.paymentType === "Denda" ||
          payment.paymentType === "Refund" ||
          (payment.isUsingXendit &&
            payment.xenditPayment?.status !== "SUCCEEDED")
        ) {
          return 0;
        }
        return payment.paymentAmount + total;
      },
      0,
    );
    const newOrderPaymentStatus =
      newOrderTotal - orderPayment === 0 ? "fully-paid" : "partially-paid";
    // #endregion

    const session = await connection.startSession();
    session.startTransaction();
    try {
      // #region DELETE OLD BOOKING AND UPDATE STOCK
      /** FIND OLD BOOKINGS */
      const oldBookings = await BookingModel.find(
        { fromOrderId: orderId },
        null,
        { session },
      );
      const oldOrderBookingsIds = oldBookings.map((b) => b._id);

      /** GROUP OLD BOOKINGS BY STOCK */
      const oldBookingsByStock = new Map<string, string[]>();
      for (const booking of oldBookings) {
        if (!booking.belongToStockId) continue;
        const stockId = booking.belongToStockId.toString();
        if (!oldBookingsByStock.has(stockId))
          oldBookingsByStock.set(stockId, []);
        oldBookingsByStock.get(stockId)!.push(booking._id as string);
      }

      /** DELETE OLD BOOKINGS */
      await BookingModel.deleteMany(
        { _id: { $in: oldOrderBookingsIds } },
        { session },
      );

      /** PULL OLD BOOKING IDS FROM STOCKS */
      if (oldBookingsByStock.size) {
        const deleteOps = Array.from(oldBookingsByStock.entries()).map(
          ([stockId, bookingIds]) => ({
            updateOne: {
              filter: { _id: stockId },
              update: { $pull: { bookingIds: { $in: bookingIds } } },
            },
          }),
        );
        await StockModel.bulkWrite(deleteOps, { session });
      }
      // #endregion

      // #region CREATE NEW BOOKING AND UPDATE STOCK
      /** CREATE NEW BOOKINGS */
      const newBookings = await BookingModel.insertMany(
        flattenedNewBookingsData,
        { session },
      );

      /** GROUP NEW BOOKINGS BY STOCK */
      const newBookingsByStock = new Map<string, string[]>();
      for (const booking of newBookings) {
        const stockId = booking.belongToStockId!.toString();
        if (!newBookingsByStock.has(stockId))
          newBookingsByStock.set(stockId, []);
        newBookingsByStock.get(stockId)!.push(booking._id as string);
      }

      /** PUSH NEW BOOKING IDS TO STOCKS */
      if (newBookingsByStock.size) {
        const insertOps = Array.from(newBookingsByStock.entries()).map(
          ([stockId, bookingIds]) => ({
            updateOne: {
              filter: { _id: stockId },
              update: { $push: { bookingIds: { $each: bookingIds } } },
            },
          }),
        );
        await StockModel.bulkWrite(insertOps, { session });
      }
      // #endregion

      // #region UPDATE ORDER
      await OrderModel.findByIdAndUpdate(
        orderId,
        {
          items: body.newItemData,
          subtotal: newOrderSubtotal,
          total: newOrderTotal,
          paymentStatus: newOrderPaymentStatus,
          $push: {
            updateLogs: {
              updatedBy: body.updatedBy,
              updateTime: Date.now(),
              updateInfo: `Item ${order[0].items.map((item: StoreOrderItemType) => item.itemName).join(", ")} direschedule`,
            },
          },
        },
        { session },
      );
      // #endregion

      /** COMMIT */
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({ success: true }, { status: StatusCodes.OK });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      return NextResponse.json(
        { error: err },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
