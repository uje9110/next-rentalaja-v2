import { StoreOrderBillingType } from "@/app/lib/types/store_order_billing_type";
import { StoreOrderType } from "@/app/lib/types/store_order_type";
import React, { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

interface BillingFormType {
  orderData: StoreOrderType;
  handleCheckoutBillingChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const BillingForm: FC<BillingFormType> = ({
  orderData,
  handleCheckoutBillingChange,
}) => {
  return (
    <form
      id="form"
      className="flex w-full flex-col gap-4 rounded-md border border-slate-400/50 bg-white p-4 shadow"
    >
      <h3 className="font text-lg font-semibold">1. Billing Customer</h3>
      <div className="input-wrapper relative flex w-full flex-row justify-between">
        <label className="flex w-2/6 items-center" htmlFor="firstName">
          Nama Depan
        </label>
        <input
          onChange={(e) => handleCheckoutBillingChange(e)}
          value={orderData.billing.firstName}
          required
          type="text"
          name="firstName"
          id="firstName"
          className="border-colorPrimary/40 w-4/6 rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
        />
      </div>
      <div className="input-wrapper relative flex w-full flex-row justify-between">
        <label className="flex w-2/6 items-center" htmlFor="lastName">
          Nama Belakang
        </label>
        <input
          onChange={(e) => handleCheckoutBillingChange(e)}
          value={orderData.billing.lastName}
          required
          type="text"
          name="lastName"
          id="lastName"
          className="border-colorPrimary/40 w-4/6 rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
        />
      </div>
      <div className="input-wrapper relative flex w-full flex-row justify-between">
        <label className="flex w-2/6 items-center" htmlFor="email">
          Email
        </label>
        <input
          onChange={(e) => handleCheckoutBillingChange(e)}
          value={orderData.billing.email}
          required
          type="email"
          name="email"
          id="email"
          className="border-colorPrimary/40 w-4/6 rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
        />
      </div>
      <div className="input-wrapper relative flex w-full flex-row justify-between">
        <label className="flex w-2/6 items-center" htmlFor="telephone">
          No. Whatsapp
        </label>
        <input
          onChange={(e) => handleCheckoutBillingChange(e)}
          value={orderData.billing.telephone}
          required
          type="text"
          name="telephone"
          id="telephone"
          className="border-colorPrimary/40 w-4/6 rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
        />
      </div>
      <div className="input-wrapper relative flex w-full flex-row justify-between">
        <label className="flex w-2/6 items-center" htmlFor="socialMedia">
          Social Media
        </label>
        <input
          onChange={(e) => handleCheckoutBillingChange(e)}
          value={orderData.billing.socialMedia}
          required
          type="text"
          name="socialMedia"
          id="socialMedia"
          className="border-colorPrimary/40 w-4/6 rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
        />
      </div>
      {/* <div className="input-wrapper relative flex w-full flex-row justify-between">
        <h3 className="flex w-2/6 items-center">
          Alamat <span className="text-gray-500">(Optional)</span>
        </h3>
        <div className="flex w-4/6 flex-row flex-wrap justify-between gap-2">
          <input
            onChange={(e) => handleBillingInputChange(e)}
            value={
              orderData.billing.address
                ? orderData.billing.address.province
                : ""
            }
            placeholder="Provinsi"
            required
            type="text"
            name="province"
            id="province"
            className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          <input
            onChange={(e) => handleBillingInputChange(e)}
            value={
              orderData.billing.address ? orderData.billing.address.city : ""
            }
            placeholder="Kota"
            required
            type="text"
            name="city"
            id="city"
            className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          <input
            onChange={(e) => handleBillingInputChange(e)}
            value={
              orderData.billing.address
                ? orderData.billing.address.district
                : ""
            }
            placeholder="Kecamatan"
            required
            type="text"
            name="district"
            id="district"
            className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          <input
            onChange={(e) => handleBillingInputChange(e)}
            value={
              orderData.billing.address ? orderData.billing.address.street : ""
            }
            placeholder="Alamat Lengkap"
            required
            type="text"
            name="street"
            id="street"
            className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
        </div>
      </div> */}
    </form>
  );
};

export default BillingForm;
