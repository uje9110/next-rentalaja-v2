/* eslint-disable react-hooks/exhaustive-deps */
import CustomDataTable from "@/app/lib/components/CustomDataTable";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { StoreProductVariationType } from "@/app/lib/types/store_product_variation_type";
import { useMutation } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import clsx from "clsx";
import { Edit, Plus, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface DataTableProps {
  storeId: string;
  data: StoreProductVariationType[];
  getColumns: (
    isEditing: boolean,
    setVariationsArray: React.Dispatch<
      React.SetStateAction<StoreProductVariationType[]>
    >,
  ) => ColumnDef<StoreProductVariationType>[];
}

const DataTable = ({ data, getColumns, storeId }: DataTableProps) => {
  const { data: session } = useSession();
  const { APIEndpoint } = useAPIContext();
  const { productId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [variationsArray, setVariationsArray] =
    useState<StoreProductVariationType[]>(data);
  const variationsArrayMemo =
    useRef<StoreProductVariationType[]>(variationsArray);

  const columns = useMemo(
    () => getColumns(isEditing, setVariationsArray),
    [isEditing, setVariationsArray],
  );

  const table = useReactTable({
    data: variationsArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const variationsMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.patch(
        `${APIEndpoint}/product/${productId}/edit-variations`,
        variationsArray,
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "x-store-id": storeId,
          },
        },
      );
      return response.data.variations; // <-- Return updated data
    },
    mutationKey: ["variationsDetail"],
    onError: async () => {
      toast(
        "Pastikan data kamu terkoneksi ke internet atau data yang kamu kirim",
      );
    },
    onSuccess: async (updatedData: StoreProductVariationType[]) => {
      toast("Pembaharuan data variasi sewa telah berhasil");
      setVariationsArray(updatedData); // <-- Update the local state
      setIsEditing(false);
    },
  });

  const cancelEditing = () => {
    setIsEditing(false);
    setVariationsArray(variationsArrayMemo.current);
  };

  const addVariation = () => {
    setVariationsArray((prev) => {
      return [
        ...prev,
        {
          _id: String(Math.floor(Math.random() * 500)),
          title: "",
          status: "available",
          variationTitle: "",
          variationPrice: 0,
          productId: prev[0].productId,
          variationAvaibility: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          hoursValue: 0,
          variationBonus: {
            title: "",
            hoursValue: 0,
          },
          storeId: localStorage.getItem("STORE_ID") as string,
        },
      ];
    });
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex w-full justify-end">
        <div className="flex gap-1">
          <button
            className={clsx(
              "rounded-md border px-4 py-1",
              isEditing
                ? "bg-green-300 text-white"
                : "bg-yellow-400 text-slate-600",
            )}
            onClick={() =>
              isEditing ? variationsMutation.mutate() : setIsEditing(true)
            }
          >
            {isEditing ? (
              <p className="flex items-center justify-center gap-2">
                <Save size={18} strokeWidth={2} /> Save
              </p>
            ) : (
              <p className="flex items-center justify-center gap-2">
                <Edit size={18} strokeWidth={2} /> Edit
              </p>
            )}
          </button>
          {isEditing ? (
            <button
              className="flex items-center justify-center gap-1 rounded-md border bg-red-400 px-4 py-1 text-white"
              onClick={() => cancelEditing()}
            >
              <X size={18} strokeWidth={2} />
              <p>Cancel</p>
            </button>
          ) : null}
        </div>
      </div>
      <div className="rounded-md border-[1px] border-slate-400/50">
        <CustomDataTable table={table} columns={columns} />
      </div>
      {isEditing ? (
        <button
          className="flex w-full items-center justify-center gap-1 rounded-md bg-green-300 py-1 text-white"
          onClick={() => addVariation()}
        >
          <Plus size={18} strokeWidth={2} /> <p>Tambah Variasi</p>
        </button>
      ) : null}
    </div>
  );
};

export default DataTable;
