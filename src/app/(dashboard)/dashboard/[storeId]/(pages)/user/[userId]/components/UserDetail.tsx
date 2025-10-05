"use client";

import { useAPIContext } from "@/app/lib/context/ApiContext";
import { GlobalStoreType } from "@/app/lib/types/global_store_types";
import { GlobalUserType } from "@/app/lib/types/global_user_type";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface StoresInterface {
  _id: string;
  cityStores: GlobalStoreType[];
}

const FormField: FC<{
  label: string;
  name: string;
  value: string;
  setUserData: Dispatch<SetStateAction<GlobalUserType | undefined>>;
}> = ({ label, name, value, setUserData }) => {
  const onChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setUserData((prevState) => {
      if (!prevState) {
        return undefined;
      }

      if (name.includes(".")) {
        const [parentKey, childKey] = name.split(".");
        return {
          ...prevState,
          [parentKey]: {
            ...(prevState[parentKey as keyof GlobalUserType] as Record<
              string,
              string
            >),
            [childKey]: value,
          },
        };
      }

      return { ...prevState, [name]: value };
    });
  };
  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={name}
        className="w-1/3 text-sm font-medium text-slate-600"
      >
        {label}
      </label>
      <Input
        id={name}
        name={name}
        defaultValue={value}
        className="w-2/3 text-sm"
        onChange={(e) => onChanged(e)}
      />
    </div>
  );
};

const StoreAndRoleSetting: FC<{
  userData: GlobalUserType;
  selectedRole: string;
  setSelectedRole: Dispatch<SetStateAction<string>>;
  setUserData: Dispatch<SetStateAction<GlobalUserType | undefined>>;
}> = ({ userData, setSelectedRole, setUserData }) => {
  const { APIEndpoint } = useAPIContext();
  const { data: session } = useSession();

  const { data: userRoles = [] } = useQuery({
    queryKey: ["roleId"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${APIEndpoint}/global/userroles`, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        });
        return response.data.json;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });

  const { data: stores = [] } = useQuery<StoresInterface[], Error>({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axios.get(`${APIEndpoint}/global/store`);
      return response.data.json as StoresInterface[];
    },
  });

  const handleStoreToggle = (
    store: GlobalStoreType,
    checked: boolean | string,
  ) => {
    setUserData((prevState) => {
      if (!prevState) return undefined;

      const currentStores = Array.isArray(prevState.authorizedStore)
        ? prevState.authorizedStore
        : [];

      const isAlreadyChecked = currentStores.some(
        (s) => s.storeId === store.storeId,
      );

      let updatedStores = currentStores;

      if (checked && !isAlreadyChecked) {
        updatedStores = [...currentStores, store];
      } else if (!checked && isAlreadyChecked) {
        updatedStores = currentStores.filter(
          (s) => s.storeId !== store.storeId,
        );
      }

      return {
        ...prevState,
        authorizedStore: updatedStores,
      };
    });
  };

  return (
    <div className="phone:w-full flex w-1/2 shrink-0 flex-col gap-4 p-4">
      <p className="font-semibold">Peran User</p>
      <div className="flex flex-col gap-4 rounded-md">
        <div className="flex items-center justify-between">
          <label
            htmlFor="roleId"
            className="w-1/3 text-sm font-medium text-slate-600"
          >
            Peran
          </label>
          <Select
            value={userData?.roleId}
            onValueChange={(val) => setSelectedRole(val)}
          >
            <SelectTrigger className="w-2/3">
              <SelectValue placeholder="Pilih peran user" />
            </SelectTrigger>
            <SelectContent>
              {userRoles.map(
                ({
                  roleName,
                  roleId,
                }: {
                  roleName: string;
                  roleId: string;
                }) => (
                  <SelectItem key={roleId} value={roleId}>
                    {roleName}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        {userData?.roleId !== "999" &&
        userData?.roleId !== "001" &&
        userData?.roleId !== "005" ? (
          <div className="flex items-start justify-between">
            <label
              htmlFor="roleId"
              className="w-1/3 text-sm font-medium text-slate-600"
            >
              Otoritas
            </label>
            <div className="flex w-2/3 flex-col gap-2">
              <Popover>
                <PopoverTrigger className="flex flex-col gap-2">
                  <div className="flex flex-row flex-wrap gap-2">
                    {userData &&
                      userData.authorizedStore?.map((store) => (
                        <p
                          key={store.storeId}
                          className="rounded-md border border-slate-400/50 px-2 py-1 text-xs shadow-md"
                        >
                          {store.storeName}
                        </p>
                      ))}
                  </div>
                  <span className="text-start text-[10px] text-slate-500 italic">
                    Klik untuk menambah atau mengurangi cabang
                  </span>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-2 p-2">
                  {stores.map((cityStores) => (
                    <div key={cityStores._id} className="flex flex-col gap-2">
                      <p className="text-sm font-medium">{cityStores._id}</p>
                      {/* Assuming `cityName` is unique */}
                      {cityStores.cityStores.map((store) => {
                        const isChecked =
                          userData?.authorizedStore?.some(
                            (s) => s.storeId === store.storeId,
                          ) ?? false;

                        return (
                          <div
                            key={store.storeId}
                            className="flex items-center gap-1 text-xs"
                          >
                            <Checkbox
                              checked={isChecked}
                              id={store.storeId}
                              onCheckedChange={(checked) =>
                                handleStoreToggle(store, checked)
                              }
                            />
                            <label htmlFor={store.storeId}>
                              {store.storeName}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const UserDetail: FC<{ user: GlobalUserType; isLoading: boolean }> = ({
  user,
  isLoading,
}) => {
  const { APIEndpoint } = useAPIContext();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState<GlobalUserType | undefined>(user);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    setUserData(user);
    setSelectedRole(user?.roleId as string);
  }, [user]);

  useEffect(() => {
    setUserData((prevState) =>
      prevState ? { ...prevState, roleId: selectedRole } : undefined,
    );
  }, [selectedRole]);

  const userDetailFields = [
    { label: "Nama Depan", value: userData?.firstName, name: "firstName" },
    { label: "Nama Belakang", value: userData?.lastName, name: "lastName" },
    { label: "Email", value: userData?.email, name: "email" },
    {
      label: "Sosial Media",
      value: userData?.socialMedia,
      name: "socialMedia",
    },
    {
      label: "Telepon",
      value: userData?.telephone,
      name: "telephone",
    },
  ];

  const userAddressFields = [
    {
      label: "Provinsi",
      value: userData?.address?.province,
      name: "address.province",
    },
    {
      label: "Kota",
      value: userData?.address?.city,
      name: "address.city",
    },
    {
      label: "Kecamatan",
      value: userData?.address?.district,
      name: "address.district",
    },
    {
      label: "Alamat",
      value: userData?.address?.street,
      name: "address.address",
    },
  ];

  const userMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.patch(
          `${APIEndpoint}/user/store/${userData?._id}`,
          userData,
        );
        return response.data.user;
      } catch (error) {
        console.log(error);
        return {};
      }
    },
    onError: () => {
      toast.warning("Coba lagi atau periksa data yang diupload");
    },
    onSuccess: () => {
      toast.success("User berhasil diupdate");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-313px)] w-full flex-row gap-4">
        <div className="flex w-full flex-wrap items-center justify-center rounded-md border border-slate-400/50 bg-white p-4">
          <p className="flex flex-col gap-4">
            <LoaderCircle strokeWidth={1} size={64} className="animate-spin" />
            <span>Loading</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="phone:h-full flex h-[calc(100vh-313px)] w-full flex-row gap-4">
      <div className="flex w-full flex-wrap rounded-md border border-slate-400/50 bg-white p-4">
        <div className="phone:w-full flex w-1/2 shrink-0 flex-col gap-4 p-4">
          <p className="font-semibold">Data Diri User</p>
          <div className="flex flex-col gap-4 rounded-md">
            {userDetailFields.map(({ label, name, value }, index) => (
              <FormField
                value={value as string}
                name={name}
                label={label}
                key={`${name}-${index}`}
                setUserData={setUserData}
              />
            ))}
          </div>
        </div>
        <div className="phone:w-full flex w-1/2 shrink-0 flex-col gap-4 p-4">
          <p className="font-semibold">Alamat User</p>
          <div className="flex flex-col gap-4 rounded-md">
            {userAddressFields.map(({ label, name, value }, index) => (
              <FormField
                value={value as string}
                name={name}
                label={label}
                key={`${name}-${index}`}
                setUserData={setUserData}
              />
            ))}
          </div>
        </div>
        <StoreAndRoleSetting
          userData={userData as GlobalUserType}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          setUserData={setUserData}
        />
        <div className="flex w-1/2 shrink-0 flex-col items-start justify-start gap-4 p-4">
          <p className="phone:hidden font-semibold">Simpan Perubahan</p>

          <button
            onClick={() => {
              userMutation.mutate();
            }}
            className="w-fit rounded-md bg-green-300 px-4 py-1 font-medium text-white"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
