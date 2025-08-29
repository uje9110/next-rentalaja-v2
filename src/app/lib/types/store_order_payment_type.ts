import { ClientStoreOrderType } from "./store_order_type";

export type StoreOrderPaymentType = {
  storeId?: string;
  type?: "income" | "outcome";
  createdBy?: string;
  paidBy?: string;
  orderID?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentType?: string;
  paymentDesc?: string;
  paymentProof?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isUsingXendit?: boolean;
  xenditPayment?: PaymentRequest;
  qrLink: string;
  isSettled: boolean;
};

export type ClientStoreOrderPaymentType = StoreOrderPaymentType & {
  creatorDetail?: {
    firstName: string;
    lastName: string;
  };
  orderDetail: ClientStoreOrderType;
};
