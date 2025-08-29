import { useState } from "react";

export const useProductStoreSelection = () => {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const handleSelectStore = (storeId: string) => {
    setSelectedStore(storeId);
  };

  return { selectedStore, handleSelectStore };
};
