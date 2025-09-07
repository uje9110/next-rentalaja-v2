import { dbConnect } from "@/app/lib/connection/dbConnect";
import { createGlobalCouponModel } from "@/app/lib/model/global_coupon_model";
import { createGlobalUserModel } from "@/app/lib/model/global_user_model";
import { createStoreCounterModel } from "@/app/lib/model/store_counter_model";
import { createStoreOrderModel } from "@/app/lib/model/store_order_model";
import { createStorePaymentModel } from "@/app/lib/model/store_payment_model";
import { createStoreUserModel } from "@/app/lib/model/store_user_model";
import { ClientCheckoutType } from "@/app/lib/types/client_checkout_type";
import { GlobalCouponType } from "@/app/lib/types/global_coupon_type";
import { StoreOrderType } from "@/app/lib/types/store_order_type";
import { handleApiError } from "@/app/lib/utils/ApiErrorHandler";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ClientCheckoutType;
  const coupons = body.discounts;
  const admin = body.byAdmin;
  const paymentRequest = body.paymentRequest;

  const globalConnection = await dbConnect(null);
  const GlobalUserModel = createGlobalUserModel(globalConnection);
  const GlobalCouponModel = createGlobalCouponModel(globalConnection);

  const { user, isNew } = await GlobalUserModel.findOrCreateCheckoutUser(
    body.billing,
  );

  // ADD MEMBERSHIP DISCOUNT/COUPON IF APPLICABLE
  if (user.membershipId !== "NO-MEMBERSHIP") {
    const coupon = await GlobalCouponModel.findOne({
      "forMembership.membershipId": user.membershipId,
    });
    if (!coupon) {
      return;
    }
    coupons.push(coupon);
  }

  try {
    const orders: StoreOrderType[] = await Promise.all(
      body.checkoutCartItems.map(async ({ store, items, subtotal, total }) => {
        const storeConnection = await dbConnect(store.storeId);
        const storeSession = await storeConnection.startSession();

        try {
          storeSession.startTransaction();

          const StoreCounterModel = createStoreCounterModel(storeConnection);
          const StoreOrderModel = createStoreOrderModel(storeConnection);
          const StoreUserModel = createStoreUserModel(storeConnection);

          const orderCount = await StoreCounterModel.getNextSequence("order", {
            session: storeSession,
          });

          // STORE USER CREATION AND CUSTOMER ID ASSIGNATION
          const storeUser = await StoreUserModel.findOrCreateStoreUser(
            {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              membershipId: user.membershipId,
              globalUserId: user._id,
            },
            { session: storeSession },
          );

          const customerID = storeUser._id;

          // ORDER CREATION
          const order = await StoreOrderModel.createOneStoreOrder(
            {
              billing: user,
              customerID,
              storeDetail: store,
              items,
              coupons,
              orderCount,
            },
            admin,
            paymentRequest,
            { session: storeSession },
          );

          await storeSession.commitTransaction();
          return order;
        } catch (error) {
          await storeSession.abortTransaction();
          throw error;
        } finally {
          storeSession.endSession();
        }
      }),
    );

    return NextResponse.json(
      { user, orders, status: "OK" },
      { status: StatusCodes.OK },
    );
  } catch (error) {
    if (isNew) {
      await GlobalUserModel.findByIdAndDelete(user._id);
    }
    return handleApiError(error);
  }
}
