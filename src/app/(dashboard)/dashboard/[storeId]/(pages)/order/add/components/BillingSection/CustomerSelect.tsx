/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { Loader, User } from "lucide-react";
import { StoreOrderType } from "@/app/lib/types/store_order_type";
import { GlobalUserType } from "@/app/lib/types/global_user_type";
import { useSession } from "next-auth/react";
import { StoreOrderBillingType } from "@/app/lib/types/store_order_billing_type";

interface CustomerSelectTypes {
  orderData: StoreOrderType;
  setOrderData: Dispatch<SetStateAction<StoreOrderType>>;
  billingData: StoreOrderBillingType;
  setBillingData: Dispatch<SetStateAction<StoreOrderBillingType>>;
}

const CustomerSelect: FC<CustomerSelectTypes> = ({
  orderData,
  setOrderData,
  billingData,
  setBillingData,
}) => {
  const { APIEndpoint } = useAPIContext();
  const { data: session } = useSession();

  const [customerSearchInput, setSearchCustomerSearchInput] =
    useState<string>("");
  const [customerOptions, setCustomerOptions] = useState<GlobalUserType[]>([]);
  const [customerOptionsLoading, setCustomerOptionsLoading] =
    useState<boolean>(false);

  const handleSearchCustomerInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const customerOptionsModal = document.getElementById(
      "customer-options",
    ) as HTMLDialogElement;
    if (customerOptionsModal) {
      customerOptionsModal.show();
    }

    const { value } = e.target;
    setSearchCustomerSearchInput(value);
  };

  const handleCustomerChange = async (userId: string) => {
    const customerID = userId;

    const customerOptionsModal = document.getElementById(
      "customer-options",
    ) as HTMLDialogElement;
    if (customerOptionsModal) {
      customerOptionsModal.close();
    }

    if (customerID) {
      setOrderData({ ...orderData, customerID: customerID });

      const thisCustomerData = customerOptions.find((user) => {
        return user._id === customerID;
      });

      if (!thisCustomerData) {
        return;
      }

      setBillingData({
        ...billingData,
        firstName: thisCustomerData.firstName,
        lastName: thisCustomerData.lastName,
        email: thisCustomerData.email,
        telephone: thisCustomerData.telephone,
        socialMedia: thisCustomerData.socialMedia,
        address: {
          city: thisCustomerData.address?.city as string,
          street: thisCustomerData.address?.street as string,
          province: thisCustomerData.address?.province as string,
          district: thisCustomerData.address?.district as string,
        },
      });
    } else {
      setBillingData({
        ...billingData,
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        socialMedia: "",
        address: {
          city: "",
          street: "",
          province: "",
          district: "",
        },
      });
    }
  };

  const getCustomerOptions = async (searchString: string) => {
    if (!searchString) {
      setCustomerOptions([]);
    }
    try {
      setCustomerOptionsLoading(true);
      const customerSearchResponse = await axios(`${APIEndpoint}/global/user`, {
        params: { search: searchString },
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      if (customerSearchResponse.status === 200) {
        setCustomerOptions(customerSearchResponse.data.json);
        setCustomerOptionsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setCustomerOptionsLoading(false);
    }
  };

  useEffect(() => {
    if (!customerSearchInput) {
      return;
    }

    const debounceCustomerOptions = setTimeout(() => {
      getCustomerOptions(customerSearchInput);
    }, 500);

    return () => clearTimeout(debounceCustomerOptions);
  }, [customerSearchInput]);

  useEffect(() => {
    setOrderData((prevState) => {
      return { ...prevState, billing: billingData };
    });
  }, [billingData]);

  return (
    <div className="customer-select phone:p-2 flex h-fit w-full flex-row items-center justify-between rounded-lg border border-slate-400/50 bg-white p-4 shadow-sm">
      <div className="customer-select-title flex items-center justify-center gap-4">
        <User size={24} />
        <span className="font-semibold capitalize">Pilih data customer</span>
      </div>
      <div className="relative w-2/5">
        <input
          type="text"
          className="w-full rounded-md border-2 px-2 py-2"
          placeholder="Cari dengan email pelanggan..."
          onChange={(e) => handleSearchCustomerInput(e)}
        />

        {/*CUST OPTIONS */}
        <dialog
          autoFocus={false}
          id="customer-options"
          className={`absolute -bottom-64 left-0 z-50 h-64 w-full translate-y-2 overflow-auto rounded-md border-2 border-slate-300 bg-white shadow-lg`}
          open={customerSearchInput.length > 0 ? true : false}
        >
          {customerOptionsLoading ? (
            <p className="flex h-full w-full items-center justify-center gap-2">
              <span className="animate-spin">
                <Loader size={14} />
              </span>
              <span>Loading</span>
            </p>
          ) : customerOptions.length > 0 ? (
            customerOptions.map((user) => {
              return (
                <p
                  key={user._id as string}
                  className="cursor-pointer border-b-2 border-slate-300 px-2 py-1 first:pt-2 last:border-b-0 hover:bg-slate-300"
                  onClick={() => handleCustomerChange(user._id as string)}
                >
                  {user?.firstName} {user?.lastName}
                </p>
              );
            })
          ) : (
            <p className="flex h-full w-full items-center justify-center gap-2">
              User tidak ditemukan
            </p>
          )}
        </dialog>
      </div>
    </div>
  );
};

export default CustomerSelect;
