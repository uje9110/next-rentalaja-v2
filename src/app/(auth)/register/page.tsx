"use client";
import Image from "next/image";
import React from "react";
import logo from "@/app/assets/img/logo/logo-rentalaja.png";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import { RegistrationOne } from "./components/RegistrationOne";
import { RegistrationTwo } from "./components/RegistrationTwo";
import { RegistrationThree } from "./components/RegistrationThree";
import { useRegistration } from "./hook/useRegister";

const page = () => {
  const {
    registerMutation,
    registerData,
    registrationStep,
    errorMessage,
    handleInputChange,
    handlePrevForm,
    handleNextForm,
    handleSubmit,
  } = useRegistration();
  return (
    <main className="bg-defaultBackground flex h-screen w-full flex-col items-center justify-center">
      <section className="login-card shadow-defaultShadow flex max-h-[full] min-h-3/4 w-4/5 flex-col justify-around gap-10 rounded-xl bg-white p-5 lg:w-1/4">
        <div className={"flex h-full w-full flex-col justify-around gap-4"}>
          <div className="login-header flex w-full flex-col items-center justify-center gap-2">
            <Image
              width={100}
              height={100}
              src={logo.src}
              alt="Rentalaja"
              className="mb-4 w-[100px] lg:w-[100px]"
            />
            <h3 className="text-xl font-semibold">Selamat Datang!</h3>
            <span className="text-center text-sm font-light text-gray-400/80">
              Silahkan daftar akun anda dengan data diri yang sesuai dengan KTP
              Anda
            </span>
          </div>

          <div className="login-body flex w-full flex-col gap-8">
            <form id="login-form" onSubmit={(e) => handleSubmit(e)}>
              <div className="login-form-wrapper flex min-h-56 flex-col gap-5">
                {registrationStep === 1 ? (
                  <RegistrationOne
                    handleInputChange={handleInputChange}
                    registerData={registerData}
                  />
                ) : null}
                {registrationStep === 2 ? (
                  <RegistrationTwo
                    handleInputChange={handleInputChange}
                    registerData={registerData}
                  />
                ) : null}
                {registrationStep === 3 ? (
                  <RegistrationThree
                    errorMessage={errorMessage}
                    handleInputChange={handleInputChange}
                    registerData={registerData}
                    registerMutation={registerMutation}
                  />
                ) : null}
              </div>
            </form>
            <div className="flex flex-row justify-between text-sm">
              <button
                onClick={() => handlePrevForm()}
                disabled={registrationStep === 1 ? true : false}
                className="bg-colorSecondary flex items-center justify-center rounded-full px-4 py-2 text-xs text-white disabled:bg-gray-500"
              >
                <ChevronLeft size={14} /> Sebelumnya
              </button>

              <button
                onClick={() => handleNextForm()}
                disabled={registrationStep === 3 ? true : false}
                className="bg-colorSecondary flex items-center justify-center rounded-full px-4 py-2 text-xs text-white disabled:bg-gray-500"
              >
                Selanjutnya <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="login-footer flex w-full flex-col items-center justify-center">
            <span className="flex w-full flex-col text-center text-xs text-gray-400">
              Ada pertanyaan?
            </span>
            <Link
              href={`https://api.whatsapp.com/send?phone=6285141203495&text=Halo Admin! Saya mau bertanya`}
              className="flex w-full flex-row justify-center gap-2"
            >
              <p className="flex w-auto items-center justify-center gap-2 rounded-full p-1 text-sm font-semibold text-sky-400">
                Hubungi Kami <Phone size={18} />
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
