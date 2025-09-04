import { ClientCheckoutType } from "@/app/lib/types/client_checkout_type";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type UseCheckoutBillingProps = {
  setCheckout: Dispatch<SetStateAction<ClientCheckoutType>>;
};

export function useCheckoutBilling({ setCheckout }: UseCheckoutBillingProps) {
  const [hasAccount, setHasAccount] = useState<"yes" | "no">("yes");

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
    setCheckout((prevState) => {
      return {
        ...prevState,
        billing: {
          isAccountAlreadyMade: hasAccount,
        },
      };
    });
  }, [hasAccount]);

  return { handleCheckoutBillingChange, hasAccount, setHasAccount };
}
