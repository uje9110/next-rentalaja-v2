import { FC, useEffect, useState } from "react";
import { RescheduleStepOne } from "./RescheduleStepOne";
import { RescheduleStepTwo } from "./RescheduleStepTwo";
import RescheduleStepThree from "./RescheduleStepThree";
import { RescheduleSteps } from "./RescheduleStep";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { StoreOrderItemType } from "@/app/lib/types/store_order_item_type";

export interface RescheduleDialogContentProps {
  orderData: ClientStoreOrderType;
}

const RescheduleDialogContent: FC<RescheduleDialogContentProps> = ({
  orderData,
}) => {
  const [stepAmount, setStepAmount] = useState<number>(2);
  const [rescheduleStep, setRescheduleStep] = useState<number>(1);
  const [oldItemData, setOldItemData] = useState<StoreOrderItemType[]>([]);
  const [newItemData, setNewItemData] = useState<StoreOrderItemType[]>([]);

  useEffect(() => {
    setStepAmount(oldItemData.length + 2);
  }, [oldItemData]);

  useEffect(() => {
    if (oldItemData.length > 0) {
      setNewItemData(oldItemData.map((item) => ({ ...item }))); // shallow clone
    }
  }, [oldItemData]);

  const renderStep = () => {
    if (rescheduleStep === 1) {
      return (
        <RescheduleStepOne
          orderData={orderData}
          oldItemData={oldItemData}
          setOldItemData={setOldItemData}
        />
      );
    }

    if (rescheduleStep >= 2 && rescheduleStep <= oldItemData.length + 1) {
      const index = rescheduleStep - 2;
      const item = oldItemData[index];

      return (
        <RescheduleStepTwo
          key={`${index}-${item.itemID}`} // unique key!
          orderData={orderData}
          itemID={item.itemID}
          setNewItemData={setNewItemData}
          itemIndex={index} // pass this down
        />
      );
    }

    if (rescheduleStep === newItemData.length + 2) {
      return (
        <RescheduleStepThree newItemData={newItemData} orderData={orderData} />
      );
    }

    return <p>Step tidak ditemukan.</p>;
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 overflow-y-auto">{renderStep()}</div>
      <RescheduleSteps
        setRescheduleStep={setRescheduleStep}
        stepAmount={stepAmount}
        currentStep={rescheduleStep}
      />
    </div>
  );
};

export default RescheduleDialogContent;
