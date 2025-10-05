"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { FC } from "react";
import geometricPattern from "@/app/assets/img/Element/cube-pattern.jpg";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { ImageWithFallback } from "@/app/lib/components/ImageWithFallback";
import customerPlaceholder from "@/app/assets/img/icon/customer-placeholder.webp";
import UserDetail from "./components/UserDetail";
import { GlobalUserType } from "@/app/lib/types/global_user_type";
import UserOrder from "./components/UserOrder";

const Page: FC = () => {
  const { userId } = useParams();
  const { data: session } = useSession();
  const { APIEndpoint } = useAPIContext();

  const { data: user, isLoading } = useQuery<GlobalUserType, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get(`${APIEndpoint}/global/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          "x-store-id": localStorage.getItem("STORE_ID") || "",
        },
      });
      return response.data.json as GlobalUserType;
    },
  });

  return (
    <div className="phone:h-[100vh] m-2 flex h-[calc(100vh-64px)] flex-col gap-2">
      <Tabs className="h-[calc(100vh-116px)]" defaultValue="userDetail">
        <div className="p- flex flex-col items-center justify-center gap-2 rounded-md border border-slate-400/50 bg-white p-2">
          <div
            style={{
              backgroundImage: `url(${geometricPattern.src})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-md p-4"
          >
            <div className="absolute top-0 left-0 z-10 h-[180px] w-full bg-black/40 backdrop-blur-[2px]" />
            <div className="z-20 flex flex-col items-center justify-center gap-4">
              <ImageWithFallback
                alt="profile"
                src={user?.profilePic?.link as string}
                fallbackSrc={customerPlaceholder.src}
                width={50}
                height={50}
              />

              <p className="text-lg font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <TabsList className="flex h-10 w-fit flex-row justify-start gap-2 overflow-hidden bg-white">
            <div className="flex items-center justify-center gap-4">
              <div className="phone:w-20 h-[2px] w-64 bg-slate-400/50" />
              <TabsTrigger value="userDetail" className="bg-gray-200/60">
                Detail User
              </TabsTrigger>
              <TabsTrigger value="userOrder" className="bg-gray-200/60">
                Order User
              </TabsTrigger>
              <div className="phone:w-20 h-[2px] w-64 bg-slate-400/50" />
            </div>
          </TabsList>
        </div>
        <TabsContent value="userDetail">
          <UserDetail user={user as GlobalUserType} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="userOrder">
          <div className="min-h-full">
            <UserOrder />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
