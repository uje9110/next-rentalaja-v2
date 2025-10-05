"use client";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { ChangeEvent, FormEvent, useState } from "react";
import { RegistrationDataType } from "../components/RegistrationFormProps";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signIn } from "next-auth/react";

export function useRegistration() {
  const { APIEndpoint } = useAPIContext();
  const [registrationStep, setRegistrationStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [registerData, setRegisterData] = useState<RegistrationDataType>({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    socialMedia: "",
    address: {
      province: "",
      city: "",
      district: "",
      street: "",
    },
    password: "",
  });

  const registerMutation = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async () => {
      const response = await axios.post(
        `${APIEndpoint}/register`,
        registerData,
      );
      return response.data.user; // Make sure this includes credentials like email/password
    },
    onSuccess: async () => {
      setErrorMessage("");
      // Trigger automatic sign-in using credentials provider
      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/", // or wherever you want to go after login
        email: registerData.email,
        password: registerData.password,
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data;

        if (apiError?.message) {
          setErrorMessage(apiError.message);
        } else {
          setErrorMessage("An unknown error occurred.");
        }

        console.error("Registration failed:", apiError);
      } else {
        setErrorMessage("An unexpected error occurred.");
        console.error("Non-Axios error:", error);
      }
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setRegisterData((prevState) => {
      if (name.includes(".")) {
        const [parentKey, childKey] = name.split(".");
        return {
          ...prevState,
          [parentKey]: {
            ...(prevState[parentKey as keyof typeof prevState] as object),
            [childKey]: value,
          },
        };
      }
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  const handleNextForm = () => {
    setRegistrationStep((prevState) => {
      if (prevState > 2) {
        return 1;
      }
      return prevState + 1;
    });
  };

  const handlePrevForm = () => {
    setRegistrationStep((prevState) => {
      if (prevState <= 1) {
        return 3;
      }
      return prevState - 1;
    });
  };

  return {
    registerMutation,
    registerData,
    registrationStep,
    errorMessage,
    handleInputChange,
    handlePrevForm,
    handleNextForm,
    handleSubmit,
  };
}
