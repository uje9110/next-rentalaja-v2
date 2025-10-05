"use client";

import React, { FC, useState } from "react";
import logo from "../../../assets/img/logo/logo-rentalaja.png";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { Eye, EyeClosed, RectangleEllipsis } from "lucide-react";
import axios from "axios";

const Page: FC = () => {
  const params = useParams();
  const token = params.token as string;
  const { APIEndpoint } = useAPIContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [resetPassword, setResetPassword] = useState<string>("");
  const [resMsg, setResMsg] = useState<{ message: string }>({ message: "" });

  const handleResetPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setResetPassword(value);
  };

  const submitResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resetPasswordRes = await axios.post(
        `${APIEndpoint}/auth/reset-password/${token}`,
        { newPassword: resetPassword },
      );
      if (resetPasswordRes.status === 200) {
        setLoading(false);
        setResMsg(resetPasswordRes.data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error: unknown) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        // ✅ Safely access error.response?.data?.error
        setResMsg({
          message:
            (error.response?.data as { error?: string })?.error ??
            "Terjadi kesalahan pada server",
        });
      } else {
        // Handle non-Axios errors
        setResMsg({ message: String(error) });
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <main className="bg-defaultBackground flex h-screen w-full flex-col items-center justify-center gap-8">
      <div className="flex h-fit w-3/4 flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-lg">
        <Image
          width={100}
          height={100}
          src={logo.src}
          alt="Rentalaja"
          className="mb-4 w-1/3"
        />
        <p className="text-center text-sm">
          Ganti password anda dengan yang baru
        </p>

        {/* RESET EMAIL INPUTS */}
        <div className="flex h-fit w-full flex-col gap-2">
          <div className="input-wrapper relative flex flex-col">
            <Input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="login-password"
              placeholder="Password..."
              className="login-form bg-defaultBackground rounded-md border border-slate-400/50 p-2 text-sm"
              onChange={(e) => handleResetPasswordInput(e)}
            />
            <p className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
              {resetPassword.length > 0 ? (
                <span onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? (
                    <EyeClosed size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </span>
              ) : (
                <RectangleEllipsis size={14} />
              )}
            </p>
          </div>
          <button
            onClick={(e) => {
              submitResetPassword(e);
            }}
            disabled={loading ? true : false}
            className="from-colorSecondary to-colorPrimary h-fit w-full rounded-full bg-gradient-to-br py-2 text-sm font-semibold text-white disabled:bg-slate-600"
          >
            Update Password
          </button>
        </div>

        {/* RESET EMAIL STATUS */}
        {resMsg.message ? (
          <p className="w-full rounded-md bg-slate-300 p-2 text-center text-sm text-white">
            {resMsg.message}
          </p>
        ) : null}
      </div>
    </main>
  );
};

export default Page;
