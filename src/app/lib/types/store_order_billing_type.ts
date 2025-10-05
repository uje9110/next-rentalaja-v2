export type StoreOrderBillingType = {
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  socialMedia: string;
  membershipId?: string;
  address?: {
    city?: string;
    district?: string;
    province?: string;
    street?: string;
  };
};
