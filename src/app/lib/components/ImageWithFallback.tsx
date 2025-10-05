"use client";
import Image from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  fallbackSrc: string;
};

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  className,
  fallbackSrc,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc || fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
