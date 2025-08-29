import { ClientGlobalProductType } from "@/app/lib/types/global_product_types";
import React, { FC } from "react";
import ProductCard from "../../../components/ProductCard";

type ProductsSectionProps = {
  products: ClientGlobalProductType[];
};

const ProductsSection: FC<ProductsSectionProps> = ({ products }) => {
  return (
    <div className="flex w-full flex-row flex-wrap justify-between gap-3 px-4 lg:w-[60%] lg:justify-center lg:gap-4 lg:p-4">
      {products.map((product) => {
        return <ProductCard productData={product} key={product._id} />;
      })}
    </div>
  );
};

export default ProductsSection;
