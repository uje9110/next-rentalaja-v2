"use client";

import {
  Camera,
  CameraOff,
  Gamepad2,
  ShoppingBasket,
  Smartphone,
  Bike,
  Car,
  Shirt,
} from "lucide-react";
import { JSX } from "react";

interface CategoryButtonType {
  icon?: JSX.Element; // React icons
  link: string;
  title: string;
  color: string;
}

// Category Arrays
const categoryArr: CategoryButtonType[] = [
  {
    icon: <Camera />,
    link: "./product?categoriesIds=KAMERA",
    title: "Kamera",
    color: "#FF7B39",
  },
  {
    icon: <CameraOff />, // closest for "Lens"
    link: "./product?categoriesIds=LENSA",
    title: "Lensa",
    color: "#EB4E00",
  },
  {
    icon: <Gamepad2 />,
    link: "./product?categoriesIds=PLAYSTATION",
    title: "Playstation",
    color: "#083269",
  },
  {
    icon: <ShoppingBasket />,
    link: "./product?categoriesIds=ALAT-PIKNIK",
    title: "Piknik",
    color: "#7F3916",
  },
  {
    icon: <Smartphone />,
    link: "./product?categoriesIds=IPHONE",
    title: "Iphone",
    color: "#149494",
  },
  {
    icon: <Car />,
    link: "./product?categoriesIds=ATVAJA",
    title: "ATV",
    color: "#414535",
  },
  {
    icon: <Bike />,
    link: "./product?categoriesIds=MOTOR",
    title: "Motor",
    color: "#69A2B0",
  },
  {
    icon: <Car />,
    link: "./product?categoriesIds=MOBIL",
    title: "Mobil",
    color: "#08415C",
  },
  {
    icon: <Shirt />,
    link: "./product?categoriesIds=FASHIONAJA",
    title: "Jas Kebaya",
    color: "#E05263",
  },
];

const HomepageCategoryButtons = () => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-2 lg:w-[60%] lg:flex-nowrap lg:justify-center">
      {categoryArr.map((item) => {
        const { link, icon, title, color } = item;
        return (
          <a
            href={link}
            key={`${title}`}
            className="flex w-[31%] items-center gap-2 rounded-full border-[1px] border-slate-400/70 bg-gradient-to-b from-white to-gray-200/50 px-3 py-1 shadow-sm"
          >
            <span
              className="flex items-center justify-center text-xs lg:text-[20px]"
              style={{ color: color, height: "15px", width: "15px" }}
            >
              {icon}
            </span>

            <p className="truncate text-[10px] font-semibold text-slate-600 lg:text-xs">
              {title}
            </p>
          </a>
        );
      })}
    </div>
  );
};

export default HomepageCategoryButtons;
