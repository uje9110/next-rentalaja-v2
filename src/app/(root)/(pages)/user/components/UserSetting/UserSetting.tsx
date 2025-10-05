"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Session } from "next-auth";
import PersonalInfoSetting from "./components/PersonalInfoSetting";
import PasswordSetting from "./components/PasswordSetting";
import ProfileSetting from "./components/ProfilePictureSetting";

type UpdatedPasswordType = {
  oldPassword: string;
  newPassword: string;
  email: string;
};

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

type UserSettingType = {
  settingMenu: string;
  handleSettingMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  APIEndpoint: string;
  profilePic: string | null;
  setProfilePic: Dispatch<SetStateAction<string | null>>;
  passwordVisible: boolean;
  setPasswordVisible: Dispatch<SetStateAction<boolean>>;
  updatedPassword: UpdatedPasswordType;
  setUpdatedPassword: Dispatch<SetStateAction<UpdatedPasswordType>>;
  userFormData: NewUserDataType;
  setUserFormData: Dispatch<SetStateAction<NewUserDataType>>;
  session: Session;
};

const UserSetting: React.FC<UserSettingType> = ({
  settingMenu,
  handleSettingMenu,
  APIEndpoint,
  profilePic,
  setProfilePic,
  passwordVisible,
  setPasswordVisible,
  updatedPassword,
  setUpdatedPassword,
  userFormData,
  setUserFormData,
  session,
}) => {
  const checkActiveMenu = () => {
    const menus = document.querySelectorAll(
      ".setting-menu",
    ) as NodeListOf<HTMLDivElement>;
    const activeClass = ["border-b-2", "border-colorPrimary/50"];
    menus.forEach((item) => {
      if (item.dataset.settingmenu === settingMenu) {
        item.classList.add(...activeClass);
      } else {
        item.classList.remove(...activeClass);
      }
    });
  };

  useEffect(() => {
    checkActiveMenu();
  }, [settingMenu]);

  return (
    <div className="flex max-h-full min-h-48 w-full flex-col gap-8 rounded-lg bg-white p-4 text-sm shadow-xl">
      <div className="flex w-full flex-row justify-between gap-4">
        <div
          onClick={(e) => handleSettingMenu(e)}
          data-settingmenu={"personal-info"}
          className="setting-menu flex w-1/3 justify-center pb-1 transition-all duration-200"
        >
          Data Diri
        </div>
        <div
          onClick={(e) => handleSettingMenu(e)}
          data-settingmenu={"password"}
          className="setting-menu flex w-1/3 justify-center pb-1 transition-all duration-200"
        >
          Password
        </div>
        <div
          onClick={(e) => handleSettingMenu(e)}
          data-settingmenu={"profile-pic"}
          className="setting-menu flex w-1/3 justify-center pb-1 transition-all duration-200"
        >
          Profile
        </div>
      </div>
      <div>
        {settingMenu === "personal-info" ? (
          <PersonalInfoSetting
            session={session}
            userFormData={userFormData}
            setUserFormData={setUserFormData}
            APIEndpoint={APIEndpoint}
          />
        ) : null}
        {settingMenu === "password" ? (
          <PasswordSetting
            APIEndpoint={APIEndpoint}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            updatedPassword={updatedPassword}
            setUpdatedPassword={setUpdatedPassword}
            session={session}
          />
        ) : null}
        {settingMenu === "profile-pic" ? (
          <ProfileSetting
            session={session}
            APIEndpoint={APIEndpoint}
            profilePic={profilePic}
            setProfilePic={setProfilePic}
          />
        ) : null}
      </div>
    </div>
  );
};

export default UserSetting;
