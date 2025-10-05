import React, { FC } from "react";
import { RegistrationFormProps } from "./RegistrationFormProps";
import { MapPinned } from "lucide-react";

export const RegistrationTwo: FC<RegistrationFormProps> = ({
  handleInputChange,
  registerData,
}) => {
  return (
    <>
      <div className="input-wrapper relative flex flex-col">
        <input
          required
          value={registerData.address.province}
          type="text"
          name="address.province"
          id="province"
          placeholder="Asal Provinsi (Opsional)"
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <MapPinned size={14} />
        </span>
      </div>

      <div className="input-wrapper relative flex flex-col">
        <input
          required
          value={registerData.address.city}
          type="text"
          name="address.city"
          id="city"
          placeholder="Asal Kota (Opsional)"
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <MapPinned size={14} />
        </span>
      </div>

      <div className="input-wrapper relative flex flex-col">
        <input
          required
          value={registerData.address.district}
          type="text"
          name="address.district"
          id="district"
          placeholder="Asal Kecamatan (Opsional)"
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <MapPinned size={14} />
        </span>
      </div>

      <div className="input-wrapper relative flex flex-col">
        <input
          required
          value={registerData.address.street}
          type="text"
          name="address.street"
          id="street"
          placeholder="Alamat Jalan (Opsional)"
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <MapPinned size={14} />
        </span>
      </div>
    </>
  );
};
