"use client";

import { useAPIContext } from "@/app/lib/context/ApiContext";
import { GlobalStoreType } from "@/app/lib/types/global_store_types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Store } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

interface StoresDataType {
  _id: string;
  cityStores: GlobalStoreType[];
}

const SelectStore = () => {
  const router = useRouter();
  const params = useParams();
  const { APIEndpoint } = useAPIContext();

  const currentStoreId = params.storeId as string;

  const getStores = async (): Promise<StoresDataType[]> => {
    try {
      const response = await axios.get(`${APIEndpoint}/global/store`);
      return response.data.json;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleStoreChange = (value: string) => {
    // Change the route instead of localStorage
    const newPath = window.location.pathname.replace(currentStoreId, value);
    router.push(newPath);
  };

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  return (
    <div className="input-wrapper phone:w-full flex w-full items-center justify-between gap-2">
      <Select defaultValue={currentStoreId} onValueChange={handleStoreChange}>
        <SelectTrigger className="flex w-fit justify-start gap-2 border-0 text-xs shadow-none focus:border-0">
          <Store size={16} />
          <SelectValue placeholder="Pilih Store" className="text-xs" />
        </SelectTrigger>
        <SelectContent>
          {stores.map(({ _id, cityStores }) => (
            <SelectGroup key={_id}>
              <SelectLabel className="text-xs">{_id}</SelectLabel>
              {cityStores.map(({ storeId, storeName }) => (
                <SelectItem key={storeId} value={storeId} className="text-xs">
                  {storeName}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectStore;
