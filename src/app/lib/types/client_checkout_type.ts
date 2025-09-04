import { ClientCartType } from "./client_cart_types";

export type CheckoutBillingType = {
  isAccountAlreadyMade: "yes" | "no";
  email: string;
  firstName?: string;
  lastName?: string;
  socialMedia?: string;
  telephone?: string;
};

export type ClientCheckoutType = {
  billing: CheckoutBillingType;
  checkoutCartItems: ClientCartType[];
  discounts: GlobalCouponType[];
  paymentRequest: {
    paymentMethod: string;
    paymentType: string;
    paymentAmount: number;
  };
  subtotal: number;
  total: number;
};
