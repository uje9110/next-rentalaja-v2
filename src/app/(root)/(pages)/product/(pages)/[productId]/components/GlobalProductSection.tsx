import { FrontPagePictureSlider } from "@/app/(root)/components/FrontPagePictureSlider";
import { ClientGlobalProductType } from "@/app/lib/types/global_product_types";
import React, { FC } from "react";

type GlobalProductSectionProps = {
  globalProduct: ClientGlobalProductType;
};

const GlobalProductSection: FC<GlobalProductSectionProps> = ({
  globalProduct,
}) => {
  return (
    <div className="flex w-full flex-col gap-4 pt-4 lg:flex lg:w-[60%] lg:flex-row lg:gap-5">
      {/* ----- Gambar ----- */}
      <FrontPagePictureSlider
        showButton={false}
        images={[globalProduct.primaryImage, ...globalProduct.images]}
        height="h-120 lg:h-120 phone:h-90"
      />

      <div className="phone:flex phone:flex-col phone:gap-3 lg:w-1/2">
        {/* ----- Judul ----- */}
        <div className="z-20 mx-4 flex flex-col gap-1 lg:justify-end">
          <h1 className="product-info phone:text-base text-xl font-semibold text-black lg:text-xl">
            {globalProduct.title}
          </h1>
          <div className="product-category flex flex-row gap-1">
            {globalProduct.categoriesIds.map((item) => {
              return (
                <p
                  key={item}
                  className="bg-colorSecondary phone:text-[10px] rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm lg:text-xs"
                >
                  {item}
                </p>
              );
            })}
          </div>
        </div>

        {/* ----- Dekripsi ----- */}
        <div className="border-accent-custom z-20 mx-4 flex flex-col gap-1 rounded-md bg-white p-3 shadow-sm lg:justify-end">
          <h3 className="subheader-custom phone:text-sm">Deksripsi</h3>
          {globalProduct.descHTML ? (
            <div
              dangerouslySetInnerHTML={{
                __html: globalProduct.descHTML,
              }}
              className="phone:text-xs list-disc text-sm font-light"
            />
          ) : (
            <p className="phone:text-xs text-sm font-light">
              {globalProduct.desc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalProductSection;
