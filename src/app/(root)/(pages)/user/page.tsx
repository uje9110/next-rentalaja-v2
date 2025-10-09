"use client";
import React from "react";
import IsUserVerifiedInfo from "./components/IsUserVerifiedInfo";
import { useUser } from "./hook/useUser";
import { UserMenu } from "./components/UserMenu";
import UserMembership from "./components/UserMembership";
import UserFavorite from "./components/UserFavorite";
import UserSetting from "./components/UserSetting/UserSetting";
import UserOrder from "./components/UserOrder";

const Page = () => {
  const {
    session,
    AuthEndpoint,
    APIEndpoint,
    isUserVerified,
    handleMenu,
    membership,
    setMembership,
    text,
    setText,
    menuDisplay,
    settingMenu,
    handleSettingMenu,
    profilePic,
    setProfilePic,
    passwordVisible,
    setPasswordVisible,
    updatedPassword,
    setUpdatedPassword,
    userFormData,
    setUserFormData,
    userOrders,
    setUserOrders,
  } = useUser();
  return (
    <main className="user-page bg-defaultBackground relative flex max-h-full min-h-screen w-full flex-col items-center gap-4 p-4 pt-5 pb-40 lg:h-full">
      {session?.user ? (
        <div className="flex w-full flex-col gap-4 lg:w-[60%]">
          {!isUserVerified && (
            <IsUserVerifiedInfo session={session} AuthEndpoint={AuthEndpoint} />
          )}
          <h1 className="text-center text-lg font-semibold">User Menu</h1>
          <div className="flex w-full flex-col gap-4 lg:flex lg:w-[90%] lg:flex-row lg:gap-0">
            <div className="w-full lg:w-[35%]">
              <UserMenu session={session} handleMenu={handleMenu} />
            </div>
            <div className="w-full lg:w-4/6">
              <div className="w-full rounded-lg p-0">
                {session && menuDisplay === "Order" ? (
                  <UserOrder
                    session={session}
                    userOrders={userOrders}
                    setUserOrders={setUserOrders}
                    APIEndpoint={APIEndpoint}
                  />
                ) : null}
                {session && menuDisplay === "Setting" ? (
                  <UserSetting
                    settingMenu={settingMenu}
                    handleSettingMenu={handleSettingMenu}
                    APIEndpoint={APIEndpoint}
                    profilePic={profilePic}
                    setProfilePic={setProfilePic}
                    passwordVisible={passwordVisible}
                    setPasswordVisible={setPasswordVisible}
                    updatedPassword={updatedPassword}
                    setUpdatedPassword={setUpdatedPassword}
                    userFormData={userFormData}
                    setUserFormData={setUserFormData}
                    session={session}
                  />
                ) : null}
                {session && menuDisplay === "Membership" ? (
                  <UserMembership
                    session={session}
                    APIEndpoint={APIEndpoint}
                    membership={membership}
                    setMembership={setMembership}
                    text={text}
                    setText={setText}
                  />
                ) : null}
                {session && menuDisplay === "Favorite" ? (
                  <UserFavorite />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white py-4 text-center shadow-md lg:w-[60%] lg:flex-col">
          <h1>Silahkan Login terlebih dahulu untuk menggunakan fitur ini</h1>
          <a
            href={"/login"}
            className="bg-colorPrimary rounded-lg px-4 py-1 text-white"
          >
            Klik untuk login
          </a>
        </div>
      )}
    </main>
  );
};

export default Page;
