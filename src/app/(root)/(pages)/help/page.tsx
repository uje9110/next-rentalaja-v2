"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import customerServiceImg from "@/app/assets/img/Thumbnail/customer_service.png";
import Image from "next/image";
import { X } from "lucide-react";

const Page = () => {
  const queryString = new URLSearchParams();
  const [msg, setMsg] = useState<string>("");
  const waNumber = "6285141203495";

  const handleMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const handleMsgSubmit = () => {
    const waAPIEndpoint = `https://api.whatsapp.com/send?${queryString.toString()}`;
    window.open(waAPIEndpoint, "_blank");
    setMsg("");
  };

  const deleteMsg = () => {
    setMsg("");
  };

  useEffect(() => {
    queryString.set("phone", waNumber);
    queryString.set("text", msg);
  }, [msg]);

  return (
    <main className="checkout-page bg-defaultBackground relative flex h-full w-full flex-col items-center gap-4 p-4 pt-5 pb-40 lg:h-full">
      <div className="border-accent-custom flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:w-1/3">
        <div className="flex flex-col items-center">
          <Image
            width={200}
            height={200}
            src={customerServiceImg.src}
            alt="customer help"
            className="aspect-fit h-full w-full"
          />
          <p className="from-colorSecondary to-colorPrimary -mt-2 rounded-full bg-gradient-to-br px-4 py-1 font-semibold text-white">
            Ada yang bisa kami bantu?
          </p>
          <div className="flex w-full flex-col gap-2 pt-2 text-sm">
            <p className="text-center text-xs">
              Punya pertanyaan? Chat kami sekarang juga dengan mengetik
              pertanyaan anda dan mengklik tombol kirim di bawah ini.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative w-full">
            <input
              value={msg}
              onChange={(e) => handleMsg(e)}
              type="text"
              className="border-colorPrimaryHalf bg-defaultBackground w-full rounded-md border p-2 text-sm"
            />
            <span
              onClick={deleteMsg}
              className="absolute top-[50%] right-0 flex h-8 w-8 -translate-x-1 -translate-y-[52%] items-center justify-center rounded-md bg-red-500 p-2 text-base text-white"
            >
              <X size={16} />
            </span>
          </div>
          <button
            onClick={handleMsgSubmit}
            className="bg-colorSecondary w-full rounded-lg py-2 text-sm text-white font-medium"
          >
            Kirim Pesan
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
