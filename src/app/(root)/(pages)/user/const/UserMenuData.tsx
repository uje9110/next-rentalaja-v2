import { CreditCard, Heart, List, Settings } from "lucide-react";

export const UserMenuData = [
  { title: "Order", link: "/user/order", icon: <List /> },
  { title: "Membership", link: "/user/membership", icon: <CreditCard /> },
  { title: "Favorite", link: "/user/favorite", icon: <Heart /> },
  { title: "Setting", link: "/user/setting", icon: <Settings /> },
] as const;
