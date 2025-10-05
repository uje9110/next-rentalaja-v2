import { StoreProductStockType } from "@/app/lib/types/store_product_stock_type";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export const getColumns = (
  isEditing: boolean,
  setStocksArray: Dispatch<SetStateAction<StoreProductStockType[]>>,
): ColumnDef<StoreProductStockType>[] => {
  const handleChange = (
    id: string,
    name: string,
    value: string,
    set: Dispatch<SetStateAction<StoreProductStockType[]>>,
  ) => {
    set((prev) =>
      prev.map((stock) => {
        if (stock._id !== id) return stock;

        return {
          ...stock,
          [name]: value,
        };
      }),
    );
  };

  const deleteVariation = (stockId: string) => {
    setStocksArray((prevState) => {
      const stocksArray = prevState;
      const newStocksArray = stocksArray.filter(
        (stock) => stock._id !== stockId,
      );
      return newStocksArray;
    });
  };

  const baseColumns: ColumnDef<StoreProductStockType>[] = [
    {
      accessorKey: "number",
      header: () => <p className="bg-white/0 px-2 py-1">No.</p>,
      cell: ({ row }) => {
        const value = row.index + 1;
        return <p className="bg-white/0 px-2 py-1">{value}. </p>;
      },
    },
    {
      accessorKey: "_id",
      header: () => <p className="bg-white/0 px-2 py-1">ID Stock</p>,
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <input
            className={clsx(
              "w-full rounded-md bg-white/0 px-2 py-1 text-slate-600 focus:outline-1 focus:outline-blue-300",
              id ? "" : "border-[1px] border-red-300",
            )}
            name="id"
            value={row.original._id}
            disabled
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: () => <p className="bg-white/0 px-2 py-1">Nama Stock</p>,
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <input
            className={clsx(
              "w-full rounded-md bg-white/0 px-2 py-1 focus:outline-1 focus:outline-blue-300",
              id ? "" : "border-[1px] border-red-300",
            )}
            name="title"
            value={row.original.title}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange(
                id as string,
                e.target.name,
                e.target.value,
                setStocksArray,
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <p className="bg-white/0 px-2 py-1">Status</p>,
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <select
            className={clsx(
              "focus:outline-blue-3002 w-full rounded-md bg-white/0 px-2 py-1 capitalize focus:outline-1",
              id ? "" : "border-[1px] border-red-300",
            )}
            name="status"
            value={row.original.status}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange(
                id as string,
                e.target.name,
                e.target.value,
                setStocksArray,
              )
            }
          >
            <option value="">Pilih Status</option>
            <option value="available">Available</option>
            <option value="rented">Dirental</option>
            <option value="booked">Dibooking</option>
            <option value="lost">Hilang</option>
            <option value="maintenance">Maintenance</option>
            <option value="broken">Rusak</option>
          </select>
        );
      },
    },
  ];

  const deleteColumn: ColumnDef<StoreProductStockType> = {
    accessorKey: "delete",
    header: () => <p className="bg-white/0 px-2 py-1"></p>,
    cell: ({ row }) => {
      const id = row.original._id;
      return (
        <button
          className="rounded-md bg-red-400 p-1 text-white"
          onClick={() => deleteVariation(id as string)}
        >
          <Trash size={20} />
        </button>
      );
    },
  };
  return isEditing ? [...baseColumns, deleteColumn] : baseColumns;
};
