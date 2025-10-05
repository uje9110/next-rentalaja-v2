import { ClientCheckoutType } from "@/app/lib/types/client_checkout_type";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type UseCheckoutBillingProps = {
  isUsingDashboard?: boolean;
  setCheckout: Dispatch<SetStateAction<ClientCheckoutType>>;
};

export function useCheckoutBilling({
  setCheckout,
  isUsingDashboard = false,
}: UseCheckoutBillingProps) {
  const [hasAccount, setHasAccount] = useState<"yes" | "no">("yes");
  const [retainingCustomer, setRetainingCustomer] = useState<"yes" | "no">(
    "yes",
  );

  const handleCheckoutBillingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setCheckout((prevState) => {
      return {
        ...prevState,
        billing: {
          ...prevState.billing,
          [name]: value,
        },
      };
    });
  };

  useEffect(() => {
    if (isUsingDashboard) {
      setCheckout((prevState) => {
        return {
          ...prevState,
          billing: {
            ...prevState.billing,
            isAccountAlreadyMade: retainingCustomer,
          },
        };
      });
    } else {
      setCheckout((prevState) => {
        return {
          ...prevState,
          billing: {
            ...prevState.billing,
            isAccountAlreadyMade: hasAccount,
          },
        };
      });
    }
  }, [hasAccount, retainingCustomer]);

  return {
    handleCheckoutBillingChange,
    hasAccount,
    setHasAccount,
    retainingCustomer,
    setRetainingCustomer,
  };
}
