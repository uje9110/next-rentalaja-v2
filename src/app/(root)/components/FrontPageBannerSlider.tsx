// ConditionalSlider.tsx
"use client";

import { usePathname } from "next/navigation";
import { FrontPagePictureSlider } from "./FrontPagePictureSlider";
import { bannerImages } from "../const/bannerImages";

export default function FrontPageBannerSlider() {
  const pathname = usePathname();

  // ❌ hide on all /product/* EXCEPT /product/search
  if (pathname.startsWith("/product/") && pathname !== "/product/search") {
    return null;
  }

  return (
    <div className="phone:pt-6">
      <FrontPagePictureSlider
        images={bannerImages}
        height="lg:h-[280px] phone:h-[150px]"
        maxWidth="lg:max-w-[60%] phone:max-w-full"
      />
    </div>
  );
}
