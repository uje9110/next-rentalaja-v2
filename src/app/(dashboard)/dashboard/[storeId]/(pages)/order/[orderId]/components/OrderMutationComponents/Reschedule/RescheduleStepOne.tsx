import { Dispatch, FC, SetStateAction } from "react";
import { RescheduleDialogContentProps } from "./RescheduleDialogContent";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";

interface RescheduleStepOneProps extends RescheduleDialogContentProps {
  oldItemData: StoreOrderItemType[];
  setOldItemData: Dispatch<SetStateAction<StoreOrderItemType[]>>;
}

export const RescheduleStepOne: FC<RescheduleStepOneProps> = ({
  orderData,
  oldItemData,
  setOldItemData,
}) => {
  const handleChecked = (item: StoreOrderItemType) => {
    const isItemExist = oldItemData.some(
      (newItem) => newItem.itemID === item.itemID,
    );

    let updatedItems;

    if (isItemExist) {
      // Remove item
      updatedItems = oldItemData.filter(
        (newItem) => newItem.itemID !== item.itemID,
      );
    } else {
      // Add item
      updatedItems = [...oldItemData, item];
    }

    setOldItemData(updatedItems);
  };
  return (
    <div className="items-between flex h-full w-full flex-col justify-between gap-2">
      <div className="flex h-full flex-col gap-2">
        <p className="text-sm">
          Terdapat {orderData.items.length} alat disewa dalam order ini.
          Silahkan pilih item yang jadwal sewanya akan diatur ulang:
        </p>
        <div className="flex h-full w-full flex-col gap-2">
          <div className="flex h-full w-full flex-col items-start justify-start gap-2">
            {orderData.items.map((item) => {
              const isChecked = oldItemData.some((newItem) => {
                return newItem.itemID === item.itemID;
              });

              return (
                <div key={item.itemID} className="w-full">
                  <Label
                    key={item.itemID}
                    htmlFor={item.itemID}
                    className={`group flex w-full cursor-pointer items-center space-x-4 rounded-md border border-blue-600/50 p-4 transition-colors ${isChecked ? "bg-sky-100" : ""}`}
                  >
                    <Checkbox
                      value={item.itemID}
                      id={item.itemID}
                      checked={isChecked}
                      className="peer" // hide the radio itself but keep it accessible
                      onCheckedChange={() => {
                        handleChecked(item);
                      }}
                    />

                    {/* Label text */}
                    <span className="text-sm">{item.itemName}</span>
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
