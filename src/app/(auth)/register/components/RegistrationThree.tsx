import { FC, useState } from "react";
import { RegistrationFormProps } from "./RegistrationFormProps";
import { Check, Eye, EyeClosed, Loader, Send } from "lucide-react";

export const RegistrationThree: FC<RegistrationFormProps> = ({
  errorMessage,
  handleInputChange,
  registerData,
  registerMutation,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <div className="input-wrapper relative flex flex-col">
        <input
          required
          value={registerData.password}
          type={isPasswordVisible ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Buat Password..."
          className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
          onChange={(e) => handleInputChange(e)}
        />
        <span
          className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <EyeClosed size={14} /> : <Eye size={14} />}
        </span>
      </div>

      <div className="bg-colorPrimary from-colorSecondary to-colorPrimary flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full border bg-gradient-to-br p-2 text-white shadow-md">
        {registerMutation?.isPending ? (
          <>
            <p className="animate-spin text-white">
              <Loader size={14} />
            </p>
            <p className="text-white">Loading...</p>
          </>
        ) : registerMutation?.isSuccess ? (
          <>
            <>
              <p className="text-white">
                <Check size={14} />
              </p>
              <p className="text-white">Selamat Anda Terdaftar!</p>
            </>
          </>
        ) : (
          <>
            <p className="text-white">
              <Send size={14} />
            </p>
            <input
              required
              type="submit"
              value="Daftar Sekarang"
              className="fle relative"
            />
          </>
        )}
      </div>
      {errorMessage ? (
        <div className="flex w-full items-center justify-center rounded-md bg-red-500 p-2">
          <p className="text-sm text-white">{errorMessage}</p>
        </div>
      ) : null}
    </>
  );
};
