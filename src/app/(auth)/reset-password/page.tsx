"use client";

import React, { FC, useState } from "react";
import logo from "../../assets/img/logo/logo-rentalaja.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import axios from "axios";

type ResetPassResMsgType = {
  message: string;
};

const Page: FC = () => {
  const { APIEndpoint } = useAPIContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resMsg, setResMsg] = useState<ResetPassResMsgType>({ message: "" });

  const handleResetEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setResetEmail(value);
  };

  const submitResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resetEmailRes = await axios.post(
        `${APIEndpoint}/auth/reset-password`,
        {
          email: resetEmail,
        },
      );

      if (resetEmailRes.status === 200) {
        setLoading(false);
        setResMsg(resetEmailRes.data);
      }
    } catch (error: unknown) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        // ✅ Safely access error.response.data
        setResMsg(
          error.response?.data ?? { message: "Unknown error occurred" },
        );
      } else {
        // Handle non-Axios errors
        setResMsg({ message: "Something went wrong. Please try again." });
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
          Masukan email anda yang telah terdaftar di <b>Rentalaja</b>
        </p>

        {/* RESET EMAIL INPUTS */}
        <div className="flex h-fit w-full flex-col gap-2">
          <Input
            onChange={(e) => handleResetEmailInput(e)}
            className="h-fit w-full rounded-lg border border-slate-400/50 p-2 py-2 text-sm"
            type="text"
            name="email"
            id="email"
            placeholder="Tulis email anda..."
          />
          <button
            onClick={(e) => {
              submitResetEmail(e);
            }}
            disabled={loading ? true : false}
            className="from-colorSecondary to-colorPrimary h-fit w-full rounded-full bg-gradient-to-br py-2 text-sm font-semibold text-white disabled:bg-slate-600"
          >
            Reset Password
          </button>
        </div>

        {/* RESET EMAIL STATUS */}
        {resMsg.message ? (
          <div className="w-full rounded-md bg-slate-300 p-2 text-center text-sm text-white">
            {resMsg.message}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Page;
