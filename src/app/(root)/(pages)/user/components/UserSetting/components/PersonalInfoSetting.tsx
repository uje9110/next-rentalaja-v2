/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Save } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React, { Dispatch, SetStateAction, useEffect } from "react";

type NewUserDataType = {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address?: {
    city?: string;
    street?: string;
    district?: string;
    province?: string;
  };
};

type PersonalInfoSettingType = {
  userFormData: NewUserDataType;
  setUserFormData: Dispatch<SetStateAction<NewUserDataType>>;
  APIEndpoint: string;
  session: Session;
};

const PersonalInfoSetting: React.FC<PersonalInfoSettingType> = ({
  userFormData,
  setUserFormData,
  APIEndpoint,
  session,
}) => {
  useEffect(() => {
    setUserFormData({
      userID: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      email: session.user.email,
      telephone: session.user.telephone,
      address: {
        city: session.user.address?.city,
        district: session.user.address?.district,
        province: session.user.address?.province,
        street: session.user.address?.address,
      },
    });
  }, []);

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserFormData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleBillingAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setUserFormData((prevState) => {
      return {
        ...prevState,
        address: {
          ...prevState.address,
          [name]: value,
        },
      };
    });
  };

  const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateResponse = await axios.patch(
        `${APIEndpoint}/user/${userFormData.userID}`,
        userFormData,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        },
      );
      if (updateResponse.status === 200) {
        signOut();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      id="form"
      className="flex w-full flex-col gap-4 transition-opacity duration-500"
    >
      <div className="input-wrapper relative flex w-full flex-row justify-between">
        <label className="flex w-2/6 items-center" htmlFor="firstName">
          Nama Depan
        </label>
        <input
          onChange={(e) => handleBillingInputChange(e)}
          value={userFormData.firstName}
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
          onChange={(e) => handleBillingInputChange(e)}
          value={userFormData.lastName}
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
          onChange={(e) => handleBillingInputChange(e)}
          value={userFormData.email}
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
          onChange={(e) => handleBillingInputChange(e)}
          value={userFormData.telephone}
          required
          type="text"
          name="telephone"
          id="telephone"
          className="border-colorPrimary/40 w-4/6 rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
        />
      </div>
      <div className="input-wrapper relative flex w-full flex-row justify-between">
        <h3 className="flex w-2/6 items-center">Alamat</h3>
        <div className="flex w-4/6 flex-row flex-wrap justify-between gap-2">
          <input
            onChange={(e) => handleBillingAddressInputChange(e)}
            placeholder="Provinsi"
            value={userFormData.address?.province}
            required
            type="text"
            name="province"
            id="province"
            className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          <input
            onChange={(e) => handleBillingAddressInputChange(e)}
            placeholder="Kota"
            value={userFormData.address?.city}
            required
            type="text"
            name="city"
            id="city"
            className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          <input
            onChange={(e) => handleBillingAddressInputChange(e)}
            placeholder="Kecamatan"
            value={userFormData.address?.district}
            required
            type="text"
            name="district"
            id="district"
            className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          <input
            onChange={(e) => handleBillingAddressInputChange(e)}
            placeholder="Alamat Lengkap"
            value={userFormData.address?.street}
            required
            type="text"
            name="street"
            id="street"
            className="border-colorPrimary/40 w-[48%] rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
        </div>
      </div>
      <button
        onClick={(e) => handleUpdatePersonalInfo(e)}
        className="flex justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-semibold text-white"
      >
        <span className="flex h-4 flex-row items-center justify-center">
          <Save />
        </span>
        <span className="flex h-4 flex-row items-center justify-center">
          Update Data Diri
        </span>
      </button>
    </form>
  );
};

export default PersonalInfoSetting;
