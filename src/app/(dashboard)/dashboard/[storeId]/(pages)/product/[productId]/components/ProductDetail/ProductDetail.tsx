"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  BoxIcon,
  Edit,
  Image as ImageIcon,
  Plus,
  Trash,
  X,
} from "lucide-react";
import moment from "moment-timezone";
import React, { FC, FormEvent, useState } from "react";
import imagePlaceholder from "@/app/assets/img/icon/image-placeholder.jpg";
import ProductBookingCalendar from "./ProductBookingCalendar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ClientStoreProductType } from "@/app/lib/types/store_product_type";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { GlobalCategoryType } from "@/app/lib/types/global_category_types";
import { toast } from "sonner";
import RichText from "@/app/lib/components/RichTextEditor";
import { FormHandler } from "@/app/lib/utils/FormHandler";
import { ImageWithFallback } from "@/app/lib/components/ImageWithFallback";
import { useRouter } from "next/navigation";

type newProductDataTypes = {
  title?: string;
  desc?: string;
  categoriesIds?: string[];
  status?: string;
  primaryImage?: File;
  images?: FileList;
};

interface ProductDetailProps {
  product: ClientStoreProductType;
}

const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const { APIEndpoint } = useAPIContext();
  const [isNotEditing, setIsNotEditing] = useState<boolean>(true);
  const [newProductData, setNewProductData] = useState<newProductDataTypes>({
    categoriesIds: product.categoriesIds,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<GlobalCategoryType[] | undefined> => {
      try {
        const response = await axios.get(`${APIEndpoint}/global/category`, {
          headers: {
            "x-store-id": product.storeDetail.storeId,
          },
        });
        return response.data.json;
      } catch (error) {
        console.log(error);
        return;
      }
    },
  });

  const productMutatuion = useMutation({
    mutationFn: async (e: FormEvent) => {
      try {
        e.preventDefault();
        const formData = new FormData();
        FormHandler.appendFormInputs(formData, newProductData, "");
        const response = await axios.patch(
          `${APIEndpoint}/product/${product._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
              "x-store-id": localStorage.getItem("STORE_ID"),
            },
          },
        );
        if (response.status === 200) {
          router.refresh();
        }
        return response.data.json;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast("Product has been updated successfully");
      setIsNotEditing(true);
      setNewProductData({});
    },
    onError: () => {
      toast("Product has not been updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const productImageMutation = useMutation({
    mutationFn: async ({
      e,
      imageTitle,
    }: {
      e: React.FormEvent;
      imageTitle: string;
    }) => {
      e.preventDefault();
      console.log(imageTitle);
      try {
        const response = await axios.delete(
          `${APIEndpoint}/product/${product._id}/deleteImg/${imageTitle}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
              "x-store-id": localStorage.getItem("STORE_ID"),
            },
          },
        );
        // @ts-nocheck
        console.log(response);
        return;
      } catch (error) {
        console.log(error);
        return;
      }
    },
    onSuccess: () => {
      toast("Product image has been updated successfully");
      setIsNotEditing(true);
    },
    onError: () => {
      toast("Product image has not been updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <form
        key={product._id}
        className="phone:flex-col flex flex-row gap-4 lg:h-fit lg:flex-row"
        onSubmit={(e) => productMutatuion.mutate(e)}
      >
        {/* Product Detail */}
        <div className="phone:w-full phone:p-2 flex w-7/12 flex-col gap-2 rounded-md border border-slate-400/50 bg-white p-4 lg:w-7/12">
          {/*  */}
          <div className="phone:flex-col phone:gap-4 flex w-full flex-row items-center justify-between gap-2">
            <div className="phone:order-2 phone:w-full phone:justify-start flex flex-row items-center justify-start gap-2">
              <BoxIcon size={36} />
              <div className="flex flex-col gap-0">
                <p className="text-base font-medium">{product?._id}</p>
                <p className="text-xs text-slate-600">
                  Dibuat : {moment(product?.createdAt).tz("Asia/Jakarta").format("D MMMM YYYY")}
                </p>
              </div>
            </div>
            {isNotEditing ? (
              <button
                onClick={() => setIsNotEditing(false)}
                className="phone:order-1 phone:w-full flex items-center justify-center gap-2 rounded-md bg-green-400 p-2 text-sm font-medium text-white"
              >
                <Edit size={18} strokeWidth={2} />
                Edit Product
              </button>
            ) : (
              <div className="phone:w-full flex items-center justify-center gap-2">
                <button
                  className="phone:w-full flex items-center justify-center gap-2 rounded-md bg-red-400 p-2 text-sm font-medium text-white"
                  onClick={() => {
                    setIsNotEditing(true);
                  }}
                >
                  <X size={18} strokeWidth={2} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="phone:w-full flex items-center justify-center gap-2 rounded-md bg-green-400 p-2 text-sm font-medium text-white"
                >
                  <Edit size={18} strokeWidth={2} />
                  Save Product
                </button>
              </div>
            )}
          </div>
          {/*  */}
          <div className="text flex h-full w-full flex-col rounded-md border border-slate-400/50 text-sm">
            <div className="flex flex-row items-center gap-2 border-b px-2 py-2">
              <label className="w-2/6 border-r border-dashed border-slate-400/50 font-semibold text-slate-500">
                Nama Produk
              </label>
              <Input
                disabled={isNotEditing}
                defaultValue={product.title}
                onChange={(e) =>
                  FormHandler.handleStringInput(
                    "title",
                    e.target.value,
                    setNewProductData,
                  )
                }
                className="w-4/6 disabled:h-fit disabled:border-0 disabled:p-0 disabled:opacity-100 disabled:shadow-none"
              />
            </div>
            <div className="flex flex-row items-center gap-2 border-b px-2 py-2">
              <label className="w-2/6 border-r border-dashed border-slate-400/50 font-semibold text-slate-500">
                Status Produk
              </label>
              <Select
                disabled={isNotEditing}
                defaultValue={product.status}
                onValueChange={(value) =>
                  FormHandler.handleSelectInput(
                    "status",
                    value,
                    setNewProductData,
                  )
                }
              >
                <SelectTrigger className="w-4/6 capitalize disabled:h-fit disabled:border-0 disabled:p-0 disabled:opacity-100 disabled:shadow-none">
                  <SelectValue
                    placeholder={isNotEditing ? product.status : ""}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="unpublished">Unpublished</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row items-center gap-2 border-b px-2 py-2">
              <label className="w-2/6 border-r border-dashed border-slate-400/50 font-semibold text-slate-500">
                Kategori Produk
              </label>
              <div className="flex w-4/6 gap-1">
                <Popover>
                  <PopoverTrigger className="flex gap-2">
                    {product?.categoriesDetails.map((category) => (
                      <p
                        key={category._id}
                        className="w-fit rounded-md bg-slate-200 px-2 py-1 text-xs text-slate-600"
                      >
                        {category.title}
                      </p>
                    ))}
                    {!isNotEditing && (
                      <p className="flex w-fit items-center rounded-md bg-slate-600 px-2 py-1 text-xs text-white">
                        <Plus size={12} />
                      </p>
                    )}
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="grid grid-cols-2 gap-y-1 p-2"
                  >
                    {categories?.map((category) => {
                      const isChecked =
                        newProductData.categoriesIds &&
                        newProductData.categoriesIds.includes(category._id);

                      return (
                        <div
                          key={category._id}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Checkbox
                            checked={isChecked}
                            id={category._id}
                            onCheckedChange={(checked) =>
                              FormHandler.handleCheckboxInput(
                                "categoriesIds",
                                category._id,
                                checked,
                                setNewProductData,
                              )
                            }
                          />
                          <label htmlFor={category._id}>{category.title}</label>
                        </div>
                      );
                    })}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 px-2 py-2">
              <label className="w-2/6 border-slate-400/50 font-semibold text-slate-500">
                Deskripsi Produk
              </label>
              {!isNotEditing ? (
                <RichText
                  content={product.desc}
                  onChange={(value: string) =>
                    FormHandler.handleStringInput(
                      "desc",
                      value,
                      setNewProductData,
                    )
                  }
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: product.desc }} />
              )}
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="phone:w-full flex w-5/12 flex-col gap-2 rounded-md border border-slate-400/50 bg-white p-4 lg:w-5/12">
          <div className="flex flex-col">
            <p className="text-base font-semibold">Gambar Utama</p>
            <p className="flex items-center justify-start gap-1 text-xs text-slate-400">
              Gambar harus memiliki format JPG atau PNG
            </p>
          </div>
          {isNotEditing ? (
            <div className="phone:flex-col flex flex-row gap-2 lg:flex lg:flex-row">
              <div className="phone:h-full phone:w-full relative rounded-md object-cover lg:h-[255px] lg:w-1/2">
                <ImageWithFallback
                  className="object-cover"
                  fill={true}
                  alt=""
                  src={product?.primaryImage.link}
                  fallbackSrc={imagePlaceholder.src}
                />
              </div>
              <div className="grid grid-cols-3 grid-rows-2 gap-2 lg:w-1/2">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img) => (
                    <div key={img.title} className="aspect-square w-full">
                      <Image
                        width={100}
                        height={100}
                        src={img.link}
                        alt={img.title}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div
                    style={{ gridColumn: "1/4" }}
                    className="rounded-md text-start text-xs text-slate-400 italic"
                  >
                    Tidak ada galeri
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="phone:h-full phone:w-full">
                <div
                  style={{
                    backgroundImage: `url(${(newProductData.primaryImage && URL.createObjectURL(newProductData.primaryImage as Blob)) || product?.primaryImage.link})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="phone:h-full phone:w-full flex aspect-square h-[230px] w-[230px] items-center justify-center rounded-md border border-dotted border-slate-400/50 object-cover"
                >
                  <p
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-blue-300/50 p-2 text-xs text-white"
                    onClick={() =>
                      document.getElementById("primaryImage")?.click()
                    }
                  >
                    <ImageIcon strokeWidth={1} size={36} /> Ganti Foto
                  </p>
                </div>
                <Input
                  id="primaryImage"
                  name="primaryImage"
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    FormHandler.handleFilesInput(
                      "primaryImage",
                      e.target.files,
                      false,
                      setNewProductData,
                    )
                  }
                />
              </div>
              <div className="phone:hidden flex w-full flex-col gap-2 rounded-md border border-slate-400/50 bg-blue-100 p-2 text-xs">
                <div className="flex justify-between">
                  <p className="font-semibold text-slate-500">Nama :</p>
                  <p className="w-40 truncate text-end">
                    {(newProductData.primaryImage &&
                      newProductData.primaryImage.name) ||
                      "-"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold text-slate-500">Ukuran :</p>
                  <p>
                    {(newProductData.primaryImage &&
                      (newProductData.primaryImage.size / 1024).toFixed(1)) ||
                      "-"}{" "}
                    KB
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold text-slate-500">Format :</p>
                  <p>
                    {(newProductData.primaryImage &&
                      newProductData.primaryImage.type) ||
                      "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* gallery */}
          {isNotEditing ? null : (
            <div className="flex w-full gap-1">
              <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-400/50">
                <p
                  onClick={() => document.getElementById("images")?.click()}
                  className="flex flex-col items-center justify-center rounded-md bg-blue-100 px-3 py-2 text-[10px] leading-[12px]"
                >
                  <Plus size={24} /> Tambah <br /> Gambar
                </p>
                <Input
                  type="file"
                  multiple
                  id="images"
                  name="images"
                  className="hidden"
                  onChange={(e) =>
                    FormHandler.handleFilesInput(
                      "images",
                      e.target.files,
                      true,
                      setNewProductData,
                    )
                  }
                />
              </div>
              <div className="flex w-[100%-112px] gap-1 overflow-auto">
                {product.images.map((img) => (
                  <div
                    key={img.link}
                    className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center"
                  >
                    <Image
                      width={100}
                      height={100}
                      src={img.link}
                      alt={img.title}
                      className="absolute top-0 left-0 z-10 h-28 w-28 rounded-md"
                    />
                    <p
                      onClick={(e) =>
                        productImageMutation.mutate({
                          e,
                          imageTitle: img.title,
                        })
                      }
                      className="z-20 rounded-full bg-red-500/50 p-2 text-white"
                    >
                      <Trash size={20} />
                    </p>
                  </div>
                ))}
                {newProductData.images &&
                  Array.from(newProductData?.images).map((img) => {
                    const link = URL.createObjectURL(img);
                    return (
                      <div
                        key={link}
                        className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center"
                      >
                        <Image
                          width={100}
                          height={100}
                          src={link}
                          alt={img.name}
                          className="absolute top-0 left-0 z-10 h-28 w-28 rounded-md"
                        />
                        <p
                          onClick={() => {
                            setNewProductData((prevState) => {
                              if (!prevState.images) {
                                return prevState;
                              }
                              const filteredImages = Array.from(
                                prevState.images,
                              ).filter((oldImg) => oldImg.name !== img.name);
                              return {
                                ...prevState,
                                images:
                                  FormHandler.createFileList(filteredImages),
                              };
                            });
                          }}
                          className="z-20 rounded-full bg-red-500/50 p-2 text-white"
                        >
                          <Trash size={20} />
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </form>
      <div className="w-full overflow-auto">
        <ProductBookingCalendar stocksDetail={product.stocksDetails} />
      </div>
    </div>
  );
};

export default ProductDetail;
