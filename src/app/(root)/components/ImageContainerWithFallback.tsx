"use client";

import Image from "next/image";
import { useState } from "react";

type ImageContainerWithFallbackProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc: string;
};

export function ImageContainerWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
}: ImageContainerWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
