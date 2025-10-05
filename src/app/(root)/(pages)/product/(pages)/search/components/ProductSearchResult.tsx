import { ClientSearchProductResultType } from "@/app/lib/types/store_product_type";
import Link from "next/link";
import React from "react";

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
    <div className="flex w-full flex-col gap-4">
      {products.map((product) => {
        const { productDetail, availableStockCount } = product;

        return (
          <div
            key={product._id}
            className="border-accent-custom flex gap-4 rounded-md bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            {/* Image */}
            <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {productDetail.primaryImage?.link ? (
                <img
                  src={productDetail.primaryImage.link}
                  alt={productDetail.primaryImage.title}
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md text-gray-400">
                  No Image
                </div>
              )}
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
