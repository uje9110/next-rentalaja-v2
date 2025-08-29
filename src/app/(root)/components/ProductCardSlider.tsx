"use client";
import { ClientGlobalProductType } from "@/app/lib/types/global_product_types";
import React from "react";
import CardSkeleton from "./CardSkeleton";
import ProductCard from "./ProductCard";

interface ProductCardSliderProps {
  products: ClientGlobalProductType[];
  isLoading: boolean;
}

const ProductCardSlider: React.FC<ProductCardSliderProps> = ({
  isLoading,
  products,
}) => {
  return (
    <div className="default-scrollbar flex flex-row gap-2 overflow-auto pb-4 lg:h-full">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={`skeleton-${index}`} />
          ))
        : products.map((item, index) => (
            <ProductCard productData={item} key={`product-${index}`} />
          ))}
    </div>
  );
};

export default ProductCardSlider;
