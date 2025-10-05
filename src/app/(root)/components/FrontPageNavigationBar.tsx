"use client";
import React from "react";
import { Home, List, ShoppingCart, Phone, User } from "lucide-react";
import { useCartContext } from "@/app/lib/context/CartContext";

const navMenu = [
  {
    title: "Home",
    link: "/",
    icon: <Home size={20} />,
  },
  {
    title: "Store",
    link: "/product",
    icon: <List size={20} />,
  },
  {
    title: "Cart",
    link: "/cart",
    icon: <ShoppingCart size={20} />,
  },
  {
    title: "User",
    link: "/user",
    icon: <User size={20} />,
  },
  {
    title: "Call Us",
    link: "/help",
    icon: <Phone size={20} />,
  },
];

const FrontPageNavigationBar = () => {
  const { itemAmountInCart } = useCartContext();

  return (
    <section className="nav-menu phone:w-[90%] phone:left-1/2 phone:bottom-3 phone:-translate-x-1/2 fixed bottom-0 left-1/2 z-30 flex h-[64px] w-full -translate-x-1/2 flex-row items-center justify-center gap-2 rounded-lg bg-white p-2 shadow-sm lg:mb-3 lg:w-[20%] lg:rounded-xl lg:py-4">
      {navMenu.map((menu, index) => {
        const { title, icon, link } = menu;
        return (
          <a
            key={index}
            href={link}
            className="nav-menu-link group relative flex w-1/5 flex-col items-center justify-center gap-1 p-2"
          >
            <div className="relative flex flex-col items-center justify-center gap-1 p-2">
              <span className="absolute text-lg transition-colors group-[.active]:top-0 group-[.active]:-translate-y-2 group-[.active]:rounded-md group-[.active]:border-4 group-[.active]:border-transparent group-[.active]:bg-blue-200 group-[.active]:p-1">
                {icon}
              </span>
              <span className="text-xs text-gray-600 opacity-0 transition-all group-[.active]:z-10 group-[.active]:translate-y-5 group-[.active]:opacity-100">
                {title}
              </span>
              {title === "Cart" ? (
                <div className="absolute -top-2 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs">
                  <span key={"itemAmount"} className="text-white">
                    {itemAmountInCart ? itemAmountInCart : 0}
                  </span>
                </div>
              ) : null}
            </div>
          </a>
        );
      })}
    </section>
  );
};

export default FrontPageNavigationBar;
