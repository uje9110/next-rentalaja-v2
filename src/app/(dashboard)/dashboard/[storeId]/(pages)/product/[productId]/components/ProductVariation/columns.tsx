import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { Trash } from "lucide-react";
import clsx from "clsx";
import { StoreProductVariationType } from "@/app/lib/types/store_product_variation_type";

export const getColumns = (
  isEditing: boolean,
  setVariationsArray: Dispatch<SetStateAction<StoreProductVariationType[]>>,
): ColumnDef<StoreProductVariationType>[] => {
  const handleChange = (
    id: string,
    name: string,
    value: string,
    set: Dispatch<SetStateAction<StoreProductVariationType[]>>,
  ) => {
    set((prev) =>
      prev.map((variation) => {
        if (variation._id !== id) return variation;

        if (name.startsWith("variationBonus.")) {
          const key = name.split(".")[1];
          return {
            ...variation,
            variationBonus: {
              ...variation.variationBonus,
              [key]: value,
            },
          };
        }

        return {
          ...variation,
          [name]: value,
        };
      }),
    );
  };

  const deleteVariation = (variationId: string) => {
    setVariationsArray((prevState) => {
      const variationsArray = prevState;
      const newVariationsArray = variationsArray.filter(
        (variation) => variation._id !== variationId,
      );
      return newVariationsArray;
    });
  };

  const baseColumns: ColumnDef<StoreProductVariationType>[] = [
    {
      accessorKey: "number",
      header: () => <p className="bg-white/0 px-2 py-1">No.</p>,
      cell: ({ row }) => {
        const value = row.index + 1;
        return <p className="bg-white/0 px-2 py-1">{value}.</p>;
      },
    },
    {
      accessorKey: "variationTitle",
      header: () => <p className="bg-white/0 px-2 py-1">Nama Variasi</p>,
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <input
            className={clsx(
              "w-full rounded-md bg-white/0 px-2 py-1 focus:outline-1 focus:outline-blue-300",
              id ? "" : "border-[1px] border-red-300",
            )}
            name="variationTitle"
            value={row.original.variationTitle}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange(
                id as string,
                e.target.name,
                e.target.value,
                setVariationsArray,
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "hoursValue",
      header: () => <p className="bg-white/0 px-2 py-1">Durasi Sewa</p>,
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <input
            className={clsx(
              "w-full rounded-md bg-white/0 px-2 py-1 focus:outline-1 focus:outline-blue-300",
              id ? "" : "border-[1px] border-red-300",
            )}
            name="hoursValue"
            value={row.original.hoursValue}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange(
                id as string,
                e.target.name,
                e.target.value,
                setVariationsArray,
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "variationPrice",
      header: () => <p className="bg-white/0 px-2 py-1">Harga</p>,
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <input
            name="variationPrice"
            className={clsx(
              "w-full rounded-md bg-white/0 px-2 py-1 focus:outline-1 focus:outline-blue-300",
              id ? "" : "border-[1px] border-red-300",
            )}
            value={row.original.variationPrice}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange(
                id as string,
                e.target.name,
                e.target.value,
                setVariationsArray,
              )
            }
          />
        );
      },
    },
    {
      accessorKey: "variationBonus",
      header: () => <p className="w-fit bg-white/0 px-2 py-1">Nama Bonus</p>,
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <div className="flex w-fit flex-row gap-1">
            <div className="flex flex-col gap-0">
              <label
                htmlFor="variationBonus.title"
                className="px-2 text-[10px] text-slate-400/60"
              >
                Nama Bonus
              </label>
              <input
                id="variationBonus.title"
                name="variationBonus.title"
                className={clsx(
                  "w-48 rounded-md bg-white/0 px-2 py-1 focus:outline-1 focus:outline-blue-300",
                  id ? "" : "border-[1px] border-red-300",
                )}
                value={row.original.variationBonus.title}
                disabled={!isEditing}
                onChange={(e) =>
                  handleChange(
                    id as string,
                    e.target.name,
                    e.target.value,
                    setVariationsArray,
                  )
                }
              />
            </div>
            <div className="flex flex-col gap-0">
              <label
                htmlFor="variationBonus.hoursValue"
                className="px-2 text-[10px] text-slate-400/60"
              >
                Durasi Bonus
              </label>
              <input
                name="variationBonus.hoursValue"
                className={clsx(
                  "w-24 rounded-md bg-white/0 px-2 py-1 focus:outline-1 focus:outline-blue-300",
                  id ? "" : "border-[1px] border-red-300",
                )}
                value={row.original.variationBonus.hoursValue}
                disabled={!isEditing}
                onChange={(e) =>
                  handleChange(
                    id as string,
                    e.target.name,
                    e.target.value,
                    setVariationsArray,
                  )
                }
              />
            </div>
          </div>
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
            className="w-full rounded-md bg-white/0 px-2 py-1 capitalize focus:outline-1 focus:outline-blue-300"
            name="status"
            value={row.original.status}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange(
                id as string,
                e.target.name,
                e.target.value,
                setVariationsArray,
              )
            }
          >
            <option value="">Pilih Status</option>
            <option value="available">Available</option>
            <option value="draft">Draft</option>
          </select>
        );
      },
    },
  ];

  const deleteColumn: ColumnDef<StoreProductVariationType> = {
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
