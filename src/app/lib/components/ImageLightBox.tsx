// components/ImageLightbox.tsx
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ReactNode } from "react";

type ImageLightboxProps = {
  fullImageSrc: string;
  trigger: ReactNode;
  alt?: string;
};

export function ImageLightbox({
  fullImageSrc,
  trigger,
  alt = "Image",
}: ImageLightboxProps) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-5xl border-none bg-white/20 p-0 shadow-none">
        <DialogTitle></DialogTitle>
        <div className="phone:w-screen relative h-[80vh] w-[800px]">
          <Image
            src={fullImageSrc}
            alt={alt}
            layout="fill"
            objectFit="contain"
            className="rounded"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
