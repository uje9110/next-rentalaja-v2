import React from "react";
import imagePlaceholder from "@/app/assets/img/icon/image-placeholder.jpg";
import { ClientGlobalProductType } from "@/app/lib/types/global_product_types";
import { ImageContainerWithFallback } from "./ImageContainerWithFallback";
import { ChevronRight } from "lucide-react";
import { CurrencyHandlers } from "@/app/lib/utils/CurrencyHandler";

type ProductCardProps = {
  productData: ClientGlobalProductType;
};

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
  const {
    _id,
    primaryImage,
    title,
    // variationsDetail,
    // categoriesDetail,
    totalSales,
    prices,
  } = productData;

  return (
    <div
      key={_id}
      className="product-card border-colorPrimary/10 flex w-[48%] shrink-0 flex-col gap-1 rounded-xl border-2 bg-white shadow-md lg:w-1/6"
    >
      <a href={`/product/${_id}`}>
        <ImageContainerWithFallback
          key={primaryImage.title}
          src={primaryImage.link}
          alt={title}
          width={100}
          height={100}
          fallbackSrc={imagePlaceholder.src}
          className="aspect-square h-full w-full rounded-t-xl object-cover"
        />
      </a>
      <div className="flex flex-col p-2">
        {/* CATEGORIES DETAIL */}
        {/* <div className="flex justify-start gap-1 pb-1">
          {categoriesDetail.map((item) => {
            const { title, _id } = item;
            return (
              <a
                key={_id}
                href={`./store?categoriesIds=${_id}`}
                className="rounded-md bg-slate-400/60 px-[6px] py-[2px] text-[10px] font-[400] text-white"
              >
                {title}
              </a>
            );
          })}
        </div> */}

        <p className="truncate pt-1 text-sm font-semibold text-nowrap">
          {title}
        </p>

        {/* VARIATIONS DETAIL */}
        <div className="pb-2">
          {(() => {
            prices.sort((a, b) => a - b);
            const firstItem = prices[0];
            const lastItem = prices[prices.length - 1];
            if (prices.length === 0) {
              return null;
            } else if (prices.length === 1) {
              return (
                <div
                  key={_id}
                  className="flex w-full flex-col justify-between text-xs"
                >
                  <span>Harga sewa mulai dari :</span>
                  <span className="text-slate-600">
                    {CurrencyHandlers.changeToLocaleCurrency(firstItem)}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={_id}
                className="font-secondary flex w-full flex-col justify-between text-xs"
              >
                <span>Harga sewa mulai dari :</span>
                <span className="text-slate-600">
                  {CurrencyHandlers.changeToLocaleCurrency(firstItem)} -{" "}
                  {CurrencyHandlers.changeToLocaleCurrency(lastItem)}
                </span>
              </div>
            );
          })()}
        </div>

        <div className="flex">
          <a
            href={`/product/${_id}`}
            className="from-colorSecondary to-colorPrimary flex w-full items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md"
          >
            <span className="flex items-center justify-center py-1 text-xs font-light text-nowrap">
              Lihat Detail <ChevronRight size={14} />
            </span>
          </a>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {/* SALES DETAIL */}
          <span className="text-[11px] text-slate-500">
            Tersewa {totalSales} kali
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
