import { useEffect, useState } from "react";

export const useProductStoreSelection = (defaultValue: string | undefined) => {
  const [selectedStore, setSelectedStore] = useState<string>(
    defaultValue || "",
  );
  const handleSelectStore = (storeId: string) => {
    setSelectedStore(storeId);
  };

  useEffect(() => {
    if (defaultValue) {
      setSelectedStore(defaultValue);
    }
  }, []);

  return { selectedStore, handleSelectStore };
};
