import { Instagram, Mail, PencilLine, Phone } from "lucide-react";
import React, { FC } from "react";
import { RegistrationFormProps } from "./RegistrationFormProps";

export const RegistrationOne: FC<RegistrationFormProps> = ({
  handleInputChange,
  registerData,
}) => {
  return (
    <>
      <div className="input-wrapper relative flex w-full flex-col">
        <input
          required
          value={registerData.firstName}
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Nama Depan..."
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <PencilLine size={14} />
        </span>
      </div>

      <div className="input-wrapper relative flex w-full flex-col">
        <input
          required
          value={registerData.lastName}
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Nama Belakang..."
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <PencilLine size={14} />
        </span>
      </div>

      <div className="input-wrapper relative flex flex-col">
        <input
          required
          value={registerData.telephone}
          type="number"
          name="telephone"
          id="telephone"
          placeholder="No Whataspp..."
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <Phone size={14} />
        </span>
      </div>

      <div className="input-wrapper relative flex flex-col">
        <input
          required
          value={registerData.email}
          type="email"
          name="email"
          id="email"
          placeholder="Email..."
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <Mail size={14} />
        </span>
      </div>

      {/* SOCIAL MEDIA */}
      <div className="input-wrapper relative flex flex-col">
        <input
          required
          value={registerData.socialMedia}
          type="socialMedia"
          name="socialMedia"
          id="socialMedia"
          placeholder="Instagram..."
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
          <Instagram size={14} />
        </span>
      </div>
    </>
  );
};
