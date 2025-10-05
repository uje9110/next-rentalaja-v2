"use client";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { OrderByUserType } from "@/app/lib/types/store_order_type";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function useUser() {
  const { AuthEndpoint, APIEndpoint } = useAPIContext();
  const { data: session } = useSession();
  const [membership, setMembership] = useState<Record<string, string>>({
    membershipName: "",
  });
  const [menuDisplay, setMenuDisplay] = useState<string>("Order");
  const [settingMenu, setSettingMenu] = useState("personal-info");
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [text, setText] = useState<string[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState<{
    oldPassword: string;
    newPassword: string;
    email: string;
  }>({
    email: session?.user.email as string,
    oldPassword: "",
    newPassword: "",
  });
  const [userFormData, setUserFormData] = useState<{
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
  }>({
    userID: "",
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    address: {
      city: "",
      street: "",
      district: "",
      province: "",
    },
  });
  const [userOrders, setUserOrders] = useState<OrderByUserType | []>([]);

  const handleMenu = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuDisplay(e.target.value);
  };

  const handleSettingMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    setSettingMenu(target.dataset.settingmenu || "");
  };

  return {
    session,
    AuthEndpoint,
    APIEndpoint,
    isUserVerified,
    setIsUserVerified,
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
  };
}
