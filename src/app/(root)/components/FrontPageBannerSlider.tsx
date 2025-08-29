// ConditionalSlider.tsx
"use client";

import { usePathname } from "next/navigation";
import { FrontPagePictureSlider } from "./FrontPagePictureSlider";
import { bannerImages } from "../const/bannerImages";

export default function FrontPageBannerSlider() {
  const pathname = usePathname();

  if (pathname.startsWith("/product/")) return null;

  return (
    <FrontPagePictureSlider
      images={bannerImages}
      height="lg:h-[200px] phone:h-[150px]"
      maxWidth="lg:max-w-[60%] phone:max-w-full"
    />
  );
}
