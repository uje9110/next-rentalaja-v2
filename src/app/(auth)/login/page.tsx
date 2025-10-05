"use client";
import Image from "next/image";
import React from "react";
import logo from "@/app/assets/img/logo/logo-rentalaja.png";
import {
  Check,
  Eye,
  EyeClosed,
  Loader,
  Mail,
  Phone,
  RectangleEllipsis,
  Send,
  X,
} from "lucide-react";
import { useLogin } from "./useLogin";

const page = () => {
  const {
    loginMutation,
    isPasswordVisible,
    setIsPasswordVisible,
    loginData,
    errorMessage,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <main className="bg-defaultBackground flex h-screen w-full flex-col items-center justify-center gap-8">
      <section className="login-card phone:w-[80%] flex h-[60%] w-[50%] flex-col justify-around gap-10 rounded-xl border border-slate-400/50 bg-white p-5 shadow-sm lg:w-1/4">
        <div className={"flex h-full w-full flex-col justify-around"}>
          <div className="login-header flex w-full flex-col items-center justify-center gap-2">
            <div className="phone:h-[80px] phone:w-[80px] relative h-[120px] w-[120px]">
              <Image src={logo.src} alt="Rentalaja" fill />
            </div>
            <h3 className="text-xl font-semibold">Selamat Datang Kembali</h3>
            <span className="text-center text-sm font-light text-gray-400">
              Silahkan login dengan email dan password anda
            </span>
          </div>
          <div className="login-body w-full">
            <form id="login-form">
              <div className="login-form-wrapper flex flex-col gap-5">
                <div className="input-wrapper relative flex flex-col">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email..."
                    className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
                    onChange={(e) => handleChange(e)}
                  />
                  <span className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
                    <Mail size={14} />
                  </span>
                </div>
                <div className="input-wrapper relative flex flex-col">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    id="login-password"
                    placeholder="Password..."
                    className="login-form border-colorPrimaryHalf bg-defaultBackground rounded-md border p-2 text-sm"
                    onChange={(e) => handleChange(e)}
                  />
                  <p className="text-colorPrimaryHalf absolute top-1/2 right-2 -translate-y-1/2">
                    {loginData.password.length > 0 ? (
                      <span
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      >
                        {isPasswordVisible ? (
                          <Eye size={16} />
                        ) : (
                          <EyeClosed size={14} />
                        )}
                      </span>
                    ) : (
                      <RectangleEllipsis size={14} />
                    )}
                  </p>
                </div>
                <div className="input-wrapper bg-colorPrimary from-colorSecondary to-colorPrimary relative flex flex-row justify-center gap-2 rounded-full border bg-gradient-to-br p-2 shadow-md">
                  {loginMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-defaultBackground animate-spin">
                        <Loader size={14} />
                      </p>
                      <p className="text-white">Loading...</p>
                    </div>
                  ) : loginMutation.isSuccess ? (
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-defaultBackground">
                        <Check size={14} />
                      </p>
                      <p className="text-white">Berhasil Login!</p>
                    </div>
                  ) : loginMutation.isError ? (
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-defaultBackground">
                        <X size={14} />
                      </p>
                      <input
                        type="submit"
                        value="Gagal login, coba lagi"
                        className="font-regular h-full w-full text-sm text-white"
                        onClick={(e) => handleSubmit(e)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-defaultBackground">
                        <Send size={14} />
                      </span>
                      <input
                        type="submit"
                        value="LOGIN"
                        className="font-regular h-full w-full text-sm text-white"
                        onClick={(e) => handleSubmit(e)}
                      />
                    </div>
                  )}
                </div>
                {errorMessage ? (
                  <p className="rounded-md bg-red-500 p-2 text-center text-xs text-white">
                    {errorMessage}
                  </p>
                ) : (
                  ""
                )}
                <div className="flex justify-between">
                  <a
                    href={"/reset-password"}
                    className="text-xs font-semibold text-sky-400"
                  >
                    Reset Password
                  </a>
                  <a
                    href={"/register"}
                    className="text-xs font-semibold text-sky-400"
                  >
                    Daftar Sekarang
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <div className="login-footer flex w-full flex-col items-center justify-center">
        <span className="flex w-full flex-col text-center text-xs text-gray-400">
          Ada pertanyaan?
        </span>
        <a
          href={`https://api.whatsapp.com/send?phone=6285141203495&text=Halo Admin! Saya mau bertanya`}
          className="flex w-full flex-row justify-center gap-2"
        >
          <p className="flex w-auto items-center justify-center gap-2 rounded-full p-1 text-sm font-semibold text-sky-400 underline underline-offset-2">
            Hubungi Kami <Phone size={14} />
          </p>
        </a>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm">
          Kembali ke &nbsp;
          <a href={"/"} className="text-sky-400 underline">
            Beranda
          </a>
        </p>
      </div>
    </main>
  );
};

export default page;
