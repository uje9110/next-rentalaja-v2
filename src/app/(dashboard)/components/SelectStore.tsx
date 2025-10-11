"use client";

import { useAPIContext } from "@/app/lib/context/ApiContext";
import {
  ByCityGlobalStoreType,
  GlobalStoreType,
} from "@/app/lib/types/global_store_types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Store } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SelectStore = () => {
  const router = useRouter();
  const params = useParams();
  const currentStoreId = params.storeId as string;

  const { data: session } = useSession();
  const { APIEndpoint } = useAPIContext();

  const [authorizedStore, setAuthorizedStore] = useState<GlobalStoreType[]>([]);

  const { data: stores = [] } = useQuery({
    queryKey: ["authorizedStores"],
    queryFn: async (): Promise<ByCityGlobalStoreType[]> => {
      const res = await axios.get(`${APIEndpoint}/global/store`);
      return res.data.json;
    },
    enabled: session?.user?.roleId === "001",
  });

  useEffect(() => {
    if (session?.user?.roleId === "001" && stores.length > 0) {
      const mappedStores = stores.flatMap(({ cityStores }) => {
        return [...cityStores];
      });
      setAuthorizedStore(mappedStores);
    } else if (session?.user?.authorizedStore) {
      setAuthorizedStore(session.user.authorizedStore);
    }
  }, [session?.user, stores]);

  const handleStoreChange = (value: string) => {
    // Change the route instead of localStorage
    const newPath = window.location.pathname.replace(currentStoreId, value);
    router.push(newPath);
  };

  return (
    <div className="input-wrapper phone:w-full flex w-full items-center justify-between gap-2">
      <Select defaultValue={currentStoreId} onValueChange={handleStoreChange}>
        <SelectTrigger className="phone:text-xs phone:py-0 border-accent-custom flex w-fit justify-start gap-2 rounded-full border shadow-none focus:border-0">
          <SelectValue placeholder="Pilih Store" />
        </SelectTrigger>
        <SelectContent>
          {authorizedStore.map(({ storeId, storeName }) => (
            <SelectItem
              key={storeId}
              value={storeId}
              className="phone:text-xs text-xs lg:text-xs"
            >
              {storeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectStore;
