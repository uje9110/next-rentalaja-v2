"use client";

import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAPIContext } from "../context/ApiContext";
import { GlobalUserType } from "../types/global_user_type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientCheckoutType } from "../types/client_checkout_type";

type CheckoutBillingProp = {
  isUsingDashboard?: boolean;
  hasAccount?: string | null;
  setHasAccount?: Dispatch<SetStateAction<"yes" | "no">>;
  retainingCustomer?: string | null;
  setRetainingCustomer?: Dispatch<SetStateAction<"yes" | "no">>;
  setCheckout?: Dispatch<SetStateAction<ClientCheckoutType>>;
  handleCheckoutBillingChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const RadioSelector = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <RadioGroup
      onValueChange={(val) => onChange(val)}
      value={value ?? ""}
      className="flex gap-3"
    >
      {options.map((option) => (
        <Label
          key={option.value}
          htmlFor={option.value}
          className={cn(
            "cursor-pointer rounded-sm border px-4 py-1 text-sm font-medium transition-all",
            "flex items-center justify-center gap-2",
            value === option.value
              ? "border-teal-400 bg-teal-400 text-white shadow-md"
              : "border-accent-custom bg-white hover:bg-teal-50",
          )}
        >
          <RadioGroupItem
            value={option.value}
            id={option.value}
            className="hidden"
          />
          {option.label}
        </Label>
      ))}
    </RadioGroup>
  </div>
);

function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function useRetainingCustomers(APIEndpoint: string, email: string) {
  const debouncedEmail = useDebounce(email, 500);

  return useQuery({
    queryKey: ["retainingCustomerList", debouncedEmail],
    queryFn: async (): Promise<GlobalUserType[]> => {
      const res = await axios.get(
        `${APIEndpoint}/global/user?email=${debouncedEmail}`,
      );
      return res.data.json;
    },
    enabled: !!debouncedEmail, // only run when debounced value exists
  });
}

export const CheckoutBilling: FC<CheckoutBillingProp> = ({
  isUsingDashboard = false,
  hasAccount,
  setHasAccount,
  retainingCustomer,
  setRetainingCustomer,
  handleCheckoutBillingChange,
  setCheckout,
}) => {
  const { APIEndpoint } = useAPIContext();

  const [isCustomerListOpen, setIsCustomerListOpen] = useState<boolean>(false);
  const [retainingCustomerEmail, setRetainingCustomerEmail] =
    useState<string>("");

  const { data: retainingCustomerList = [] } = useRetainingCustomers(
    APIEndpoint,
    retainingCustomerEmail,
  );

  const handleCustomerSelect = (customerData: GlobalUserType) => {
    if (setCheckout) {
      setCheckout((prev) => {
        return {
          ...prev,
          billing: {
            ...prev.billing,
            isAccountAlreadyMade: "yes",
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
            socialMedia: customerData.socialMedia,
            telephone: customerData.telephone,
          },
        };
      });
    }
    setRetainingCustomerEmail(customerData.email);
    setIsCustomerListOpen(false);
  };

  return (
    <Card className="border-accent-custom w-full overflow-hidden rounded-md p-0 pb-4 shadow-sm">
      <CardHeader className="gap-0 bg-sky-100 px-4 py-2">
        <CardTitle className="text-sm">Informasi Akun</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Step 1: Account / Customer */}
        {!isUsingDashboard ? (
          <RadioSelector
            label="Apakah Anda sudah memiliki akun?"
            value={hasAccount as string}
            onChange={(val) => setHasAccount?.(val as "yes" | "no")}
            options={[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ]}
          />
        ) : (
          <RadioSelector
            label="Apakah customer pernah menyewa?"
            value={retainingCustomer as string}
            onChange={(val) => setRetainingCustomer?.(val as "yes" | "no")}
            options={[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ]}
          />
        )}

        {/* Step 2a: Existing Account */}
        {hasAccount === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="email">Akun Terdaftar</Label>
            <Input
              id="email"
              name="email"
              placeholder="Masukkan email terdaftar Anda"
              className="border-accent-custom text-sm focus-visible:ring-2 focus-visible:ring-sky-200"
              onChange={handleCheckoutBillingChange}
            />
          </div>
        )}

        {/* Step 2b: Retaining Customer */}
        {retainingCustomer === "yes" && (
          <div className="w-full space-y-2">
            <Label htmlFor="email">Akun Terdaftar</Label>
            <div className="w-full">
              <Popover
                open={isCustomerListOpen}
                onOpenChange={setIsCustomerListOpen}
              >
                <PopoverTrigger className="w-full">
                  <Input
                    id="email"
                    name="email"
                    value={retainingCustomerEmail}
                    placeholder="Cari customer"
                    className="border-accent-custom text-sm focus-visible:ring-2 focus-visible:ring-sky-200"
                    onChange={(e) => setRetainingCustomerEmail(e.target.value)}
                  />
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="border-accent-custom w-full border p-1 text-xs"
                  onOpenAutoFocus={(event) => event.preventDefault()}
                >
                  <ScrollArea className="h-64">
                    <div className="w-full space-y-1">
                      {retainingCustomerList.length ? (
                        retainingCustomerList.map((cust) => (
                          <div
                            key={cust._id as string}
                            className="cursor-pointer rounded px-2 py-1 hover:bg-teal-50"
                            onClick={() => {
                              handleCustomerSelect(cust);
                            }}
                          >
                            {cust.firstName} {cust.lastName}
                          </div>
                        ))
                      ) : (
                        <div>Customer tidak ditemukan</div>
                      )}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Step 2c: New Account / New Customer */}
        {(hasAccount === "no" || retainingCustomer === "no") && (
          <div className="space-y-3 text-sm">
            {[
              { id: "firstName", label: "Nama Depan", placeholder: "Budi" },
              {
                id: "lastName",
                label: "Nama Belakang",
                placeholder: "Santoso",
              },
              {
                id: "email",
                label: "Email",
                placeholder: "anda@email.com",
                type: "email",
              },
              {
                id: "telephone",
                label: "Nomor Telepon",
                placeholder: "+62 812-3456-7890",
                type: "tel",
              },
              {
                id: "socialMedia",
                label: "Media Sosial",
                placeholder: "@username",
              },
            ].map(({ id, label, placeholder, type }) => (
              <div key={id} className="flex flex-col gap-1">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  onChange={handleCheckoutBillingChange}
                  className="border-accent-custom text-sm focus-visible:ring-2 focus-visible:ring-sky-200"
                  id={id}
                  name={id}
                  type={type ?? "text"}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
