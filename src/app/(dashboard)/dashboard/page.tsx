"use client";

import { useSession } from "next-auth/react";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GlobalStoreType } from "@/app/lib/types/global_store_types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();
  const { APIEndpoint } = useAPIContext();

  const [authorizedStore, setAuthorizedStore] = useState<GlobalStoreType[]>([]);

  const { data: stores = [] } = useQuery({
    queryKey: ["authorizedStores"],
    queryFn: async (): Promise<GlobalStoreType[]> => {
      const res = await axios.get(`${APIEndpoint}/global/stores`);
      return res.data.json;
    },
    enabled: session?.user?.roleId === "001",
  });

  useEffect(() => {
    if (session?.user?.roleId === "001") {
      setAuthorizedStore(stores);
    } else if (session?.user?.authorizedStore) {
      setAuthorizedStore(session.user.authorizedStore);
    }
  }, [session?.user?.roleId, stores]);

  return (
    <main className="flex h-screen w-full items-center justify-center bg-sky-50">
      <Card className="border-accent-custom w-full max-w-3xl gap-0 overflow-hidden border p-0 shadow-sm">
        <CardHeader className="border-accent-custom gap-0 border-0 border-b bg-sky-100 py-4 [.border-b]:pb-4">
          <CardTitle className="text-center text-2xl font-semibold">
            Pilih store
          </CardTitle>
        </CardHeader>

        <CardContent className="py-4">
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {authorizedStore.map((store) => {
                  return (
                    <Link
                      href={`/dashboard/${store.storeId}`}
                      key={store.storeId}
                      className="w-full justify-start text-center transition-all border border-accent-custom py-2 rounded-md text-sm shadow bg-sky-100"
                    >
                      {store.storeName}
                    </Link>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
}
