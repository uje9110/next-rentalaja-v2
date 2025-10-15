"use client";

import React, { FC, useEffect, useState } from "react";
import { StaticImageData } from "next/image";
import { ChevronLeftCircle, ChevronRightCircle, Circle } from "lucide-react";
import imagePlaceholder from "@/app/assets/img/icon/image-placeholder.jpg";
import { ImageWithFallback } from "@/app/lib/components/ImageWithFallback";

type PictureSliderImageType = {
  title: string;
  link: StaticImageData | string;
};

type PictureSliderProps = {
  images: PictureSliderImageType[];
  showButton?: boolean;
  aspect?: string; // Tailwind aspect class (e.g. "aspect-video")
  height?: string; // Tailwind height class (e.g. "h-[400px]")
  maxWidth?: string; // Tailwind max-width class (e.g. "max-w-6xl")
  autoPlayInterval?: number; // autoplay speed in ms
};

export const FrontPagePictureSlider: FC<PictureSliderProps> = ({
  showButton = true,
  images,
  aspect,
  height,
  maxWidth = "max-w-5xl",
  autoPlayInterval = 3000,
}) => {
  const [imageIndex, setImageIndex] = useState<number>(0);

  const prevImage = () => {
    setImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const nextImage = () => {
    setImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  return (
    <div className="bg-defaultBackground flex h-auto items-center justify-center px-4 pt-4 lg:w-1/2 lg:p-0">
      <div
        className={`slider relative flex w-full overflow-hidden rounded-xl border-2 shadow-md ${maxWidth}`}
      >
        {images.map((item) => (
          <div
            key={item.title}
            className={`relative w-full shrink-0 duration-500 ease-in ${
              aspect ? aspect : height ? height : "h-64"
            }`}
            style={{ transform: `translateX(-${imageIndex * 100}%)` }}
          >
            <ImageWithFallback
              fill
              fallbackSrc={imagePlaceholder.src}
              src={typeof item.link === "string" ? item.link : item.link.src}
              alt={item.title}
              className="object-cover"
            />
          </div>
        ))}

        {/* Prev button */}
        {showButton ? (
          <div
            className="absolute top-0 left-0 z-20 flex h-full cursor-pointer flex-col items-center justify-center"
            onClick={prevImage}
          >
            <ChevronLeftCircle className="text-white" size={32} />
          </div>
        ) : null}

        {/* Next button */}
        {showButton ? (
          <div
            className="absolute top-0 right-0 z-20 flex h-full cursor-pointer flex-col items-center justify-center"
            onClick={nextImage}
          >
            <ChevronRightCircle className="text-white" size={32} />
          </div>
        ) : null}

        {/* Dots */}
        <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 flex-row gap-2 pb-2">
          {images.map((_, index) => (
            <div
              key={index}
              className="flex h-2 w-2 items-center justify-center rounded-full border-2 border-white"
            >
              <Circle
                size={16}
                className={imageIndex === index ? "opacity-100" : "opacity-0"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
