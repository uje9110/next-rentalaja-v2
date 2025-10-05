"use client";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type LoginData = {
  email: string;
  password: string;
};

export function useLogin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const searchParam = useSearchParams();
  const redirect = searchParam.get("redirect");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const result = await signIn("credentials", {
        redirect: false, // prevent automatic redirect
        callbackUrl: redirect ?? "/",
        ...loginData,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        throw new Error(result.error); //
      }

      const session = await getSession();
      if (session?.user.roleId !== "999") {
        localStorage.setItem("STORE_ID", "RENTALAJA_GARUT");
      }

      // manually redirect if login was successful
      if (result?.ok && result.url) {
        window.location.href = result.url;
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };
  return {
    isPasswordVisible,
    setIsPasswordVisible,
    loginData,
    setLoginData,
    errorMessage,
    setErrorMessage,
    handleChange,
    handleSubmit,
    loginMutation,
  };
}
