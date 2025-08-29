import React from "react";
import FrontPageNavigationBar from "./components/FrontPageNavigationBar";
import FrontPageHeader from "./components/FrontPageHeader";
import FrontPageBannerSlider from "./components/FrontPageBannerSlider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-defaultBackground">
      <FrontPageHeader />
      <FrontPageBannerSlider /> {/* only in non-product pages */}
      {children}
      <FrontPageNavigationBar />
    </div>
  );
};

export default Layout;
