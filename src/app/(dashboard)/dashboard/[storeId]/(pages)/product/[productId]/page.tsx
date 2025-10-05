"use client";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookOpenText, FileBox, Layers } from "lucide-react";
import { useParams } from "next/navigation";
import React, { FC } from "react";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import ProductStocks from "./components/ProductStock/ProductStocks";
import ProductVariations from "./components/ProductVariation/ProductVariations";

const Page: FC = () => {
  const { productId, storeId } = useParams();
  const { APIEndpoint } = useAPIContext();

  const getProduct = async (): Promise<ClientStoreProductType | undefined> => {
    try {
      const response = await axios.get(`${APIEndpoint}/product/${productId}`, {
        headers: {
          "x-store-id": storeId,
        },
      });
      return response.data.json;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const {
    data: product,
    isError: isProductError,
    isLoading: isProductLoading,
  } = useQuery({
    queryKey: ["product"],
    queryFn: getProduct,
  });

  if (isProductLoading) {
    return (
      <div className="m-2 rounded-md border border-slate-400/50 bg-white p-2 shadow-sm">
        Loading..
      </div>
    );
  }

  if (isProductError) {
    return (
      <div className="m-2 rounded-md border border-slate-400/50 bg-white p-2 shadow-sm">
        Erorr Fetching Product
      </div>
    );
  }

  return (
    <div className="m-2 flex flex-col gap-2 overflow-hidden rounded-md">
      <Tabs defaultValue="productDetail" className="flex flex-col gap-2">
        <TabsList className="flex h-11 w-full flex-row justify-start gap-2 overflow-hidden rounded-md border border-slate-400/50 bg-white p-2">
          <TabsTrigger
            value="productDetail"
            className="flex items-center justify-center gap-2 font-normal"
          >
            <BookOpenText size={16} strokeWidth={1} /> Detail Produk
          </TabsTrigger>
          <TabsTrigger
            value="productStock"
            className="flex items-center justify-center gap-2 font-normal"
          >
            <FileBox size={16} strokeWidth={1} />
            Stok Produk
          </TabsTrigger>
          <TabsTrigger
            value="productVariation"
            className="flex items-center justify-center gap-2 font-normal"
          >
            <Layers size={16} strokeWidth={1} />
            Variasi Produk
          </TabsTrigger>
        </TabsList>
        <TabsContent value="productDetail">
          <ProductDetail product={product as ClientStoreProductType} />
        </TabsContent>
        <TabsContent value="productStock">
          <ProductStocks product={product as ClientStoreProductType} />
        </TabsContent>
        <TabsContent value="productVariation">
          <ProductVariations product={product as ClientStoreProductType} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
