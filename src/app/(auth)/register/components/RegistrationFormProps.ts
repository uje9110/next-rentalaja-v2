import { UseMutationResult } from "@tanstack/react-query";
import { ChangeEvent } from "react";

export type RegistrationDataType = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  socialMedia: string;
  address: {
    province: string;
    city: string;
    district: string;
    street: string;
  };
  password: string;
};

export type RegistrationFormProps = {
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  registerData: RegistrationDataType;
  handleSubmit?: () => void;
  registerMutation?: UseMutationResult<void, Error, void>;
  errorMessage?: string;
};
