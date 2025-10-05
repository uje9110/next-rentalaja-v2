import { ClientSearchProductResultType } from "@/app/lib/types/store_product_type";
import Link from "next/link";
import React from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import imagePlaceholder from "@/app/assets/img/icon/image-placeholder.jpg";

type ProductSearchResultProps = {
  products: ClientSearchProductResultType[];
  searchFilter: {
    bookingStart?: string;
    bookingEnd?: string;
    categoriesIds?: string;
    storeId?: string;
  };
};

const ProductSearchResult: React.FC<ProductSearchResultProps> = ({
  products,
  searchFilter,
}) => {
  return (
    <div className="flex w-full flex-col gap-4 lg:flex lg:flex-row">
      {products.map((product) => {
        const { productDetail, availableStockCount } = product;

        return (
          <div
            key={product._id}
            className="border-accent-custom flex gap-4 rounded-md bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            {/* Image */}
            <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <ImageWithFallback
                src={productDetail.primaryImage.link}
                alt=""
                fallbackSrc={imagePlaceholder.src}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">{productDetail.title}</h2>
                <p className="text-sm text-sky-400">
                  Stock tersedia: {availableStockCount}
                </p>
              </div>
              <Link
                href={`/product/${product._id}?bookingStart=${searchFilter.bookingStart}&bookingEnd=${searchFilter.bookingEnd}&storeId=${searchFilter.storeId}`}
                target="__blank"
                className="w-fit rounded-md bg-teal-400 px-4 py-2 text-xs font-semibold text-white shadow"
              >
                Booking Alat ini
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductSearchResult;
