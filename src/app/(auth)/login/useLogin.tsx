"use client";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

type LoginData = {
  email: string;
  password: string;
};

export function useLogin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);

  // ✅ Safe client-side URL param reading
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setRedirect(params.get("redirect"));
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: redirect ?? "/", // use dynamic redirect if exists
        ...loginData,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        throw new Error(result.error);
      }

      const session = await getSession();
      if (session?.user.roleId !== "999") {
        localStorage.setItem("STORE_ID", "RENTALAJA_GARUT");
      }

      if (result?.ok && result.url) {
        window.location.href = result.url;
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
