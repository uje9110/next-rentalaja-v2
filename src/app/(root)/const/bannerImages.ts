import BannerATV from "../../assets/img/Banner/Banner ATV.png";
import BannerPopocamera from "../../assets/img/Banner/Banner Popocamera.jpg";
import BannerGameinaja from "../../assets/img/Banner/Banner Gameinaja.jpg";
import BannerIphoneaja from "../../assets/img/Banner/Banner Iphoneaja.jpg";
import BannerPergipiknik from "../../assets/img/Banner/Banner Pergi Piknik.jpg";
import BannerSewaMotor from "../../assets/img/Banner/Banner-wesbite-Sewa-Motor.png";
import BannerSewaMobil from "../../assets/img/Banner/Banner-wesbite-Sewa-Mobil.png";
import { StaticImageData } from "next/image";

export const bannerImages: { title: string; link: string | StaticImageData }[] =
  [
    {
      title: "Banner ATV",
      link: BannerATV,
    },
    {
      title: "Banner Popocamera",
      link: BannerPopocamera,
    },
    {
      title: "Banner Gameinaja",
      link: BannerGameinaja,
    },
    {
      title: "Banner Pergi Piknik",
      link: BannerPergipiknik,
    },
    {
      title: "Banner Iphoneaja",
      link: BannerIphoneaja,
    },
    {
      title: "Banner Sewa Motor",
      link: BannerSewaMotor,
    },
    {
      title: "Banner Sewa Mobil",
      link: BannerSewaMobil,
    },
  ] as const;
