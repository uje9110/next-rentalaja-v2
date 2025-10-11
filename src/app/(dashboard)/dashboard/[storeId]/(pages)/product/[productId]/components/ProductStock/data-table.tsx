import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useMemo, useRef, useState } from "react";
import { getColumns } from "./columns";
import { Edit, Plus, Save, X } from "lucide-react";
import clsx from "clsx";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { StoreProductStockType } from "@/app/lib/types/store_product_stock_type";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { toast } from "sonner";
import CustomDataTable from "@/app/lib/components/CustomDataTable";

const DataTable = ({
  stocksData,
  storeId,
}: {
  stocksData: StoreProductStockType[];
  storeId: string;
}) => {
  const { APIEndpoint } = useAPIContext();
  const router = useRouter();
  const { productId } = useParams();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [stocksArray, setStocksArray] =
    useState<StoreProductStockType[]>(stocksData);
  const stocksArrayMemo = useRef<StoreProductStockType[]>(stocksArray);

  const columns = useMemo(
    () => getColumns(isEditing, setStocksArray),
    [isEditing],
  );

  const table = useReactTable({
    data: stocksArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const cancelEditing = () => {
    setIsEditing(false);
    setStocksArray(stocksArrayMemo.current);
  };

  const addStock = () => {
    setStocksArray((prev) => {
      const [firstStock] = prev;
      const prevId = firstStock._id as string;
      const baseParts = prevId.split("_");

      const baseId =
        baseParts.length > 2 ? `${baseParts[0]}_${baseParts[1]}` : baseParts[0];

      const baseTitle = firstStock.title?.split("_")[0] ?? "";
      const count = prev.length + 1;
      const number = count.toString().padStart(3, "0");

      const newId = `${baseId}_${number}`;
      const newTitle = `${baseTitle}_${number}`;

      return [
        ...prev,
        {
          _id: newId,
          belongToProductId: baseId,
          title: newTitle,
          status: "available",
          bookingIds: [],
          rentedByOrderId: "",
          storeId: localStorage.getItem("STORE_ID") ?? "",
          stockBookingDetails: [],
          rentedByOrderDetail: [],
          salesIds: [],
          history: [],
        },
      ];
    });
  };

  const stockMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.patch(
        `${APIEndpoint}/product/${productId}/edit-stocks`,
        stocksArray,
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "x-store-id": storeId,
          },
        },
      );
      if (response.status === 200) {
        router.refresh();
      }
      return response.data.json; // <-- Return updated data
    },
    mutationKey: ["stocksDetails"],
    onError: async () => {
      toast(
        "Pastikan data kamu terkoneksi ke internet atau data yang kamu kirim",
      );
    },
    onSuccess: async (updatedData: StoreProductStockType[]) => {
      toast("Pembaharuan data variasi sewa telah berhasil");
      setStocksArray(updatedData); // <-- Update the local state
      setIsEditing(false);
    },
  });

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
              isEditing ? stockMutation.mutate() : setIsEditing(true)
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
          onClick={() => addStock()}
        >
          <Plus size={18} strokeWidth={2} /> <p>Tambah Stock</p>
        </button>
      ) : null}
    </div>
  );
};

export default DataTable;
