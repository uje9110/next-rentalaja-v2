import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useRef,
} from "react";

interface ItemAmountInputType {
  availableStock: string[];
  itemData: StoreOrderItemType;
  setItemData: Dispatch<SetStateAction<StoreOrderItemType>>;
}

const ItemAmountInput: FC<ItemAmountInputType> = ({
  availableStock,
  itemData,
  setItemData,
}) => {
  const itemAmount = useRef(null);

  const handleItemAmountChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "itemAmount") {
      const newAmount = parseInt(value) || 0;
      const variationPrice = itemData.itemVariation.variationPrice || 0;
      const newItemSubtotal = variationPrice * newAmount;

      setItemData({
        ...itemData,
        stockIds: availableStock.slice(0, newAmount),
        itemAmount: newAmount,
        itemSubtotal: newItemSubtotal,
      });
    } else {
      setItemData({
        ...itemData,
        [name]: value,
      });
    }
  };

  return (
    <div id="amount-input-wrapper" className="flex flex-col gap-2">
      <h3 className="text-md self-start font-semibold">Pilih Jumlah Unit</h3>
      <p className="text-xs">
        Maks. (<span className="font-semibold">{availableStock.length}</span>)
        Unit bisa disewa dalam periode sewa yang dipilih.
      </p>
      <div className="input-wrapper relative flex flex-col">
        <select
          required
          name="itemAmount"
          id="itemAmount"
          ref={itemAmount}
          onChange={(e) => {
            handleItemAmountChange(e);
          }}
          className="border-colorPrimary/40 rounded-lg border-2 bg-white p-2 py-2 text-sm shadow-sm"
        >
          <option value="">
            {availableStock.length > 0
              ? "Pilih Jumlah Item Yang Akan Disewa"
              : "Item Tidak Tersedia Untuk Tanggal Yang Dipilih"}
          </option>
          {Array.from({ length: availableStock.length }, (_, i) => i).map(
            (item) => {
              return (
                <option key={item + 1} value={item + 1}>
                  {item + 1}
                </option>
              );
            },
          )}
        </select>
      </div>
    </div>
  );
};

export default ItemAmountInput;
