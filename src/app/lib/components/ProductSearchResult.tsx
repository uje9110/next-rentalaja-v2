"use client";
import { ClientSearchProductResultType } from "@/app/lib/types/store_product_type";
import Link from "next/link";
import React, { useState } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import imagePlaceholder from "@/app/assets/img/icon/image-placeholder.jpg";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

type ProductSearchResultProps = {
  products: ClientSearchProductResultType[];
  isUsingDashboard?: boolean;
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
  isUsingDashboard = false,
}) => {
  const params = useParams();

  const [filteredProduct, setFilteredProduct] =
    useState<ClientSearchProductResultType[]>(products);

  const handleFilterProductByTitle = (searchString: string) => {
    if (!searchString.trim()) {
      // if input is empty, show all products again
      setFilteredProduct(products);
      return;
    }

    const regex = new RegExp(searchString, "i");
    const filtered = products.filter((prod) =>
      regex.test(prod.productDetail.title),
    );

    setFilteredProduct(filtered);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Input
        className="border-accent-custom focus-visible:border-custom-accent focus:border-custom-accent border bg-white text-sm focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-200"
        placeholder="Cari alat berdasarkan nama"
        onChange={(e) => handleFilterProductByTitle(e.target.value)}
      />
      <div className="flex w-full flex-wrap gap-2 pb-24 lg:flex lg:flex-row">
        {filteredProduct.map((product) => {
          const { productDetail, availableStockCount } = product;
          let href;
          if (!isUsingDashboard) {
            href = `/product/${product._id}?bookingStart=${searchFilter.bookingStart}&bookingEnd=${searchFilter.bookingEnd}&storeId=${searchFilter.storeId}`;
          } else {
            href = `/dashboard/${params.storeId}/order/add?openItemModal=yes&productId=${product._id}&productName=${product?.productDetail?.title}&bookingStart=${searchFilter.bookingStart}&bookingEnd=${searchFilter.bookingEnd}`;
          }

          return (
            <div
              key={product._id}
              className="border-accent-custom phone:w-[49%] flex flex-col gap-4 rounded-md bg-white p-2 shadow-sm transition hover:shadow-md lg:w-[25%]"
            >
              {/* Image */}
              <div className="w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <ImageWithFallback
                  src={productDetail.primaryImage.link}
                  alt=""
                  fallbackSrc={imagePlaceholder.src}
                  width={100}
                  height={100}
                  className="aspect-square h-full w-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between gap-2">
                <div>
                  <h2 className="phone:text-base text-lg font-semibold lg:text-lg">
                    {productDetail.title}
                  </h2>
                  <p className="phone:text-xs text-sm text-sky-400 lg:text-sm">
                    Stock tersedia: {availableStockCount}
                  </p>
                </div>
                <Link
                  href={href as string}
                  target="__blank"
                  className="w-fit rounded-sm bg-teal-400 px-3 py-1 text-xs font-semibold text-white shadow"
                >
                  Booking Alat ini
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSearchResult;
