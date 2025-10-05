import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Eye, EyeClosed, Save } from "lucide-react";

type UpdatedPasswordType = {
  oldPassword: string;
  newPassword: string;
  email: string;
};

type PasswordSettingType = {
  APIEndpoint: string;
  passwordVisible: boolean;
  setPasswordVisible: Dispatch<SetStateAction<boolean>>;
  updatedPassword: UpdatedPasswordType;
  setUpdatedPassword: Dispatch<SetStateAction<UpdatedPasswordType>>;
  session: Session;
};

const PasswordSetting: React.FC<PasswordSettingType> = ({
  APIEndpoint,
  passwordVisible,
  setPasswordVisible,
  updatedPassword,
  setUpdatedPassword,
  session,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUpdatedPassword({ ...updatedPassword, [name]: value });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${APIEndpoint}/user/changepassword/${session.user.id}`,
        updatedPassword,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        },
      );
      if (response.status === 200) {
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
        <label className="flex w-2/6 items-center" htmlFor="oldPassword">
          Password Lama
        </label>
        <div className="relative w-4/6">
          <input
            onChange={(e) => handleInputChange(e)}
            value={updatedPassword.oldPassword}
            required
            type={passwordVisible ? "text" : "password"}
            name="oldPassword"
            id="oldPassword"
            className="border-colorPrimary/40 w-full rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          {passwordVisible ? (
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="text-colorPrimary absolute top-1/2 right-4 -translate-y-1/2 text-lg"
            >
              <Eye size={14} />
            </span>
          ) : (
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="text-colorPrimary absolute top-1/2 right-4 -translate-y-1/2 text-lg"
            >
              <EyeClosed size={14} />
            </span>
          )}
        </div>
      </div>
      <div className="input-wrapper relative flex w-full flex-row justify-between">
        <label className="flex w-2/6 items-center" htmlFor="newPassword">
          Password Baru
        </label>
        <div className="relative w-4/6">
          <input
            onChange={(e) => handleInputChange(e)}
            value={updatedPassword.newPassword}
            required
            type={passwordVisible ? "text" : "password"}
            name="newPassword"
            id="newPassword"
            className="border-colorPrimary/40 w-full rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
          />
          {passwordVisible ? (
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="text-colorPrimary absolute top-1/2 right-4 -translate-y-1/2 text-lg"
            >
              <Eye size={14} />
            </span>
          ) : (
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="text-colorPrimary absolute top-1/2 right-4 -translate-y-1/2 text-lg"
            >
              <EyeClosed size={14} />
            </span>
          )}
        </div>
      </div>
      <button
        onClick={(e) => handleUpdatePassword(e)}
        className="flex justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 font-semibold text-white"
      >
        <span className="flex h-4 flex-row items-center justify-center">
          <Save size={14} />
        </span>
        <span className="flex h-4 flex-row items-center justify-center">
          Update Password
        </span>
      </button>
    </form>
  );
};

export default PasswordSetting;
