export type DynamicXenditPaymentRequestBody = {
  reference_id: string;
  channel_code: string;
  request_amount: string;
  orderId: string;
  description: string;
};

export type XenditPaymentRequestResponse = {
  payment_request_id: string;
  country: string;
  currency: string;
  business_id: string;
  reference_id: string;
  description: string;
  metadata: {
    orderId: string;
    [key: string]: string; // In case there are additional dynamic metadata fields
  };
  created: string; // ISO date string
  updated: string; // ISO date string
  status:
    | "PENDING"
    | "REQUIRES_ACTION"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELED"
    | "VOIDED"
    | "UNKNOWN";
  capture_method: "AUTOMATIC" | "MANUAL";
  latest_payment_id: string;
  channel_code: string; // e.g., "QRIS", "ID_OVO", etc.
  request_amount: number;
  channel_properties: {
    expires_at: string; // ISO date string
    [key: string]: string; // Allow for additional channel-specific fields
  };
  type: "PAY" | string;
  actions: Array<{
    type: "PRESENT_TO_CUSTOMER" | string;
    descriptor: string; // e.g., "QR_STRING", "REDIRECT_URL"
    value: string;
  }>;
};

export type XenditTransactionType =
  | "DISBURSEMENT"
  | "PAYMENT"
  | "REMITTANCE_PAYOUT"
  | "TRANSFER"
  | "REFUND"
  | "WITHDRAWAL"
  | "TOPUP"
  | "CONVERSION";

export type Currency =
  | "IDR"
  | "PHP"
  | "USD"
  | "VND"
  | "THB"
  | "MYR"
  | "SGD"
  | "EUR"
  | "GBP"
  | "HKD"
  | "AUD";

export type Cashflow = "MONEY_IN" | "MONEY_OUT";

export type TransactionStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "VOIDED"
  | "REVERSED";

export type ChannelCategory =
  | "BANK"
  | "CARDS"
  | "CARDLESS_CREDIT"
  | "CASH"
  | "DIRECT_DEBIT"
  | "EWALLET"
  | "PAYLATER"
  | "QR_CODE"
  | "RETAIL_OUTLET"
  | "VIRTUAL_ACCOUNT"
  | "XENPLATFORM"
  | "OTHER";

export type SettlementStatus = "PENDING" | "EARLY_SETTLED" | "SETTLED";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FeeObject = {
  // You may want to customize this depending on actual shape of fee object
  value: number;
  type: string;
  currency: Currency;
  [key: string]: any;
};

export type ProductData = {
  [key: string]: string | number | null | undefined;
};

export type XenditTransaction = {
  id: string;
  product_id: string;
  type: XenditTransactionType;
  channel_code: string;
  reference_id: string;
  account_identifier: string | null;
  currency: Currency;
  amount: number;
  net_amount: number;
  net_amount_currency: Currency;
  cashflow: Cashflow;
  status: TransactionStatus;
  channel_category: ChannelCategory;
  business_id: string;
  created: string; // ISO 8601 UTC timestamp
  updated: string; // ISO 8601 UTC timestamp
  fee: FeeObject;
  settlement_status: SettlementStatus | null;
  estimated_settlement_time: string | null;
  product_data: ProductData | null;
};

export type XenditTransactionRequest = {
  has_more: boolean;
  links: { href: string; rel: string; method: string }[];
  data: XenditTransaction[];
};
