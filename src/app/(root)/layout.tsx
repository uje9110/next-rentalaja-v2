"use client";

import React from "react";
import FrontPageNavigationBar from "./components/FrontPageNavigationBar";
import FrontPageHeader from "./components/FrontPageHeader/FrontPageHeader";
import FrontPageBannerSlider from "./components/FrontPageBannerSlider";
import { SessionProvider } from "next-auth/react";
import { CartContextProvider } from "../lib/context/CartContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <CartContextProvider>
        <div className="bg-defaultBackground">
          <FrontPageHeader />
          <FrontPageBannerSlider /> {/* only in non-product pages */}
          {children}
          <FrontPageNavigationBar />
        </div>
      </CartContextProvider>
    </SessionProvider>
  );
};

export default Layout;
