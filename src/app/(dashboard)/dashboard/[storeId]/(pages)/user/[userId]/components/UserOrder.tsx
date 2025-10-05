"use client";
import React from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { ClientStoreOrderType } from "@/app/lib/types/store_order_type";
import { OrderTable } from "../../../order/components/OrderTable";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { columns } from "../../../order/components/Columns";
import CustomDataTable from "@/app/lib/components/CustomDataTable";

const UserOrder = () => {
  const { APIEndpoint } = useAPIContext();
  const { storeId, userId } = useParams();

  const getOrders = async (): Promise<ClientStoreOrderType[]> => {
    try {
      const response = await axios.get(
        `${APIEndpoint}/order?customerID=${userId}`,
        {
          headers: {
            "x-store-id": storeId,
          },
        },
      );
      return response.data.json;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: userOrders = [] } = useQuery<ClientStoreOrderType[]>({
    queryKey: ["userOrders"],
    queryFn: getOrders,
  });

  // const [orderData, setOrderData] = useState<ClientStoreOrderType[]>(orders);

  // useEffect(() => {
  //   if (orders.length > 0) {
  //     setOrderData(orders);
  //   }
  // }, [orders]);

  const table = useReactTable({
    data: userOrders,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border border-slate-400/50 bg-white p-2">
      <CustomDataTable table={table} columns={columns} />
    </div>
  );
};

export default UserOrder;
