"use client";
import { ColumnDef } from "@tanstack/react-table";
import imagePlaceholder from "@/app/assets/img/icon/image-placeholder.jpg";
import moment from "moment";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import { GlobalCategoryType } from "@/app/lib/types/global_category_types";
import { StoreProductStockType } from "@/app/lib/types/store_product_stock_type";

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-400";
    case "unpublished":
      return "bg-red-400";
    case "draft":
      return "bg-slate-400";
    default:
      return "bg-slate-300";
  }
};

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc: string;
};

function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}

export const getColumns = (
  storeId: string,
): ColumnDef<ClientStoreProductType>[] => {
  return [
    {
      accessorKey: "no",
      header: () => {
        return <p className="text-xs">No.</p>;
      },
      cell: ({ row }) => {
        const value = row.index + 1;
        return <p className="pl-2 text-xs">{value}</p>;
      },
    },
    {
      accessorKey: "title",
      header: () => {
        return <p className="text-xs">Nama</p>;
      },
      cell: ({ row }) => {
        const productId = row.original._id;
        const title = row.getValue("title") as string;
        const categories: GlobalCategoryType[] =
          row.original.categoriesDetails.sort();
        const primaryImage = row.original.primaryImage;
        return (
          <div
            className="phone:w-fit flex cursor-pointer flex-row gap-3"
            onClick={() =>
              (window.location.href = `/dashboard/${storeId}/product/${productId}`)
            }
          >
            <ImageWithFallback
              width={100}
              height={100}
              src={primaryImage.link || imagePlaceholder.src}
              alt={title}
              className="aspect-square h-10 w-10 rounded-md object-cover"
              fallbackSrc={imagePlaceholder.src}
            />
            <div className="flex flex-col gap-1">
              <p className="text-xs">{title}</p>
              <div className="flex flex-row gap-1">
                {categories.map((category) => (
                  <p
                    key={category._id}
                    className="rounded-md bg-slate-200 px-2 text-[10px] text-slate-500"
                  >
                    {category.title}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => {
        return <p className="text-xs">Tgl Dibuat</p>;
      },
      cell: ({ row }) => {
        const value = moment(row.getValue("createdAt")).format("DD MMM YYYY");
        return <p className="text-xs">{value}</p>;
      },
    },
    {
      accessorKey: "stocksDetail",
      header: () => {
        return <p className="text-center text-xs">Semua Unit</p>;
      },
      cell: ({ row }) => {
        const value: StoreProductStockType[] = row.getValue("stocksDetail");
        const stocksLength = value.length;
        return <p className="text-center text-xs">{stocksLength}</p>;
      },
    },
    {
      accessorKey: "stocksAvailable",
      header: () => {
        return <p className="text-center text-xs">Unit Tersedia</p>;
      },
      cell: ({ row }) => {
        const value: StoreProductStockType[] = row.getValue("stocksDetail");
        const stocksLength = value.filter(
          (stock) => stock.status === "available",
        ).length;
        return <p className="text-center text-xs">{stocksLength}</p>;
      },
    },
    {
      accessorKey: "totalSales",
      header: () => {
        return <p className="text-center text-xs">Unit Tersewa</p>;
      },
      cell: ({ row }) => {
        const value = row.getValue("totalSales") as string;
        return <p className="text-center text-xs">{value}</p>;
      },
    },
    {
      accessorKey: "status",
      header: () => {
        return <p className="text-center text-xs">Status</p>;
      },
      cell: ({ row }) => {
        const value = row.getValue("status") as string;
        return (
          <p
            className={clsx(
              "w-full rounded-md py-2 text-center text-xs font-semibold text-white capitalize",
              getStatusColor(value),
            )}
          >
            {value}
          </p>
        );
      },
    },
  ];
};
