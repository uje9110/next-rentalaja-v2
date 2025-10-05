import { FrontPagePictureSlider } from "@/app/(root)/components/FrontPagePictureSlider";
import { ClientGlobalProductType } from "@/app/lib/types/global_product_types";
import { Store } from "lucide-react";
import React, { FC } from "react";
import SelectProductStore from "./SelectProductStore";

type GlobalProductSectionProps = {
  globalProduct: ClientGlobalProductType;
};

const GlobalProductSection: FC<GlobalProductSectionProps> = ({
  globalProduct,
}) => {
  return (
    <div className="flex w-full flex-col gap-4 pt-4 lg:flex lg:w-[60%] lg:gap-5">
      {/* ----- Gambar ----- */}
      <FrontPagePictureSlider
        showButton={false}
        images={[globalProduct.primaryImage, ...globalProduct.images]}
        height="h-120"
      />

      {/* ----- Judul ----- */}
      <div className="z-20 mx-4 flex flex-col gap-1 lg:justify-end">
        <h1 className="product-info text-xl font-semibold text-black lg:hidden lg:text-3xl">
          {globalProduct.title}
        </h1>
        <div className="product-category flex flex-row gap-1 lg:hidden">
          {globalProduct.categoriesIds.map((item) => {
            return (
              <span
                key={item}
                className="bg-colorSecondary rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm lg:text-lg"
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>

      {/* ----- Dekripsi ----- */}
      <div className="border-accent-custom z-20 mx-4 flex flex-col gap-1 rounded-md bg-white p-3 shadow-sm lg:justify-end">
        <h3 className="subheader-custom">Deksripsi</h3>
        {globalProduct.descHTML ? (
          <div
            dangerouslySetInnerHTML={{
              __html: globalProduct.descHTML,
            }}
            className="list-disc text-sm font-light"
          />
        ) : (
          <p className="text-sm font-light">{globalProduct.desc}</p>
        )}
      </div>
    </div>
  );
};

export default GlobalProductSection;
