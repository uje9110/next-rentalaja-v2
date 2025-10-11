import React from "react";
import axios from "axios";
import { QueryHandler } from "@/app/lib/utils/QueryHandler";
import { ClientStoreUserType } from "@/app/lib/types/store_user_type";
import UserTable from "./components/UserTable";

const Page = async ({
  params,
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const resolvedSearchParam = await searchParams;
  const Query = QueryHandler.fromSearchParams(resolvedSearchParam);

  const getUsers = async (): Promise<ClientStoreUserType[]> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/user`,
        {
          headers: {
            "x-store-id": storeId,
          },
          params: Query.getParams(),
        },
      );
      return response.data.json;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const users = await getUsers();

  return (
    <div className="phone:px-2">
      <UserTable users={users} />;
    </div>
  );
};

export default Page;
