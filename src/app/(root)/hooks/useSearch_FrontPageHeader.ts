// hooks/useProductSearch.ts
import { ClientGlobalProductType } from "@/app/lib/types/global_product_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export function useProductSearch(APIEndpoint: string) {
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: searchProducts = [] } = useQuery({
    queryKey: ["searchProducts", search],
    queryFn: async (): Promise<ClientGlobalProductType[]> => {
      const response = await axios.get(`${APIEndpoint}/product`, {
        params: { search },
      });
      return response.data.products;
    },
  });

  return {
    search,
    setSearch,
    openDialog,
    setOpenDialog,
    isSearching,
    setIsSearching,
    searchProducts,
  };
}
