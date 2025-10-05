import { ClientCartType } from "./client_cart_types";
import { GlobalCouponType } from "./global_coupon_type";
import { ClientStorePaymentRequest } from "./store_order_payment_type";
import { StoreOrderType } from "./store_order_type";

export type CheckoutBillingType = {
  isAccountAlreadyMade: "yes" | "no";
  email: string;
  firstName?: string;
  lastName?: string;
  socialMedia?: string;
  telephone?: string;
};

export type ClientCheckoutType = {
  byAdmin: {
    isByAdmin: boolean;
    adminId: string;
  };
  billing: CheckoutBillingType;
  checkoutCartItems: ClientCartType[];
  discounts: GlobalCouponType[];
  paymentRequest?: ClientStorePaymentRequest;
  isSkippingPayment: boolean;
  subtotal: number;
  total: number;
};

export type CheckoutResponse = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
  };
  orders: StoreOrderType[];
  status: string;
};
