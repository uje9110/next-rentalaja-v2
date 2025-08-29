"use client";
import React, { useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import logoWhite from "../../assets/img/logo/logo-rental-aja-white.png";

import { useProductSearch } from "../hooks/useSearch_FrontPageHeader";
import {
  useHandleScrollFrontPageHeader,
  useScrollFrontPageHeader,
} from "../hooks/useScroll_FrontPageHeader";
import { useAPIContext } from "@/app/lib/context/ApiContext";
import { LogOut, Search, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useIsMobile } from "../hooks/useIsMobile";

const AppHeader = () => {
  const isMobile = useIsMobile();
  const { APIEndpoint } = useAPIContext();
  //   const { data: session } = useSession();

  const nav = useRef<HTMLDivElement>(null);
  const headerWrapper = useRef<HTMLDivElement>(null);
  const loginWrapper = useRef<HTMLDivElement>(null);
  const searchbarWrapper = useRef<HTMLDivElement>(null);
  const [overScrollY, setOverScrollY] = useState(false);

  useScrollFrontPageHeader(() =>
    useHandleScrollFrontPageHeader(setOverScrollY),
  );

  // const {
  //   search,
  //   setSearch,
  //   openDialog,
  //   setOpenDialog,
  //   isSearching,
  //   setIsSearching,
  //   searchProducts,
  // } = useProductSearch(APIEndpoint);

  return (
    <nav
      className={`z-50 flex w-full justify-center ${overScrollY ? "phone:sticky phone:top-1 lg:top-4" : "relative w-full"}`}
    >
      <div
        className={`bg-colorPrimary flex h-16 flex-row items-center justify-between transition-all duration-400 ${overScrollY ? "phone:w-[94%] rounded-md p-3 lg:w-[59%]" : "phone:px-4 phone:w-full lg:w-full lg:px-12"}`}
      >
        <div className="relative h-14 w-64">
          <Link
            href="/"
            className="absolute top-1/2 flex h-10 w-40 -translate-y-1/2 items-center"
          >
            <Image
              src={logoWhite.src}
              fill
              alt="Logo"
              className="object-cover"
            />
          </Link>
        </div>
        <div className="flex gap-1">
          {/* Search */}
          <div
            ref={searchbarWrapper}
            className={`${overScrollY ? "relative flex-1" : "phone:absolute phone:top-14 phone:left-1/2 phone:-translate-x-1/2 phone:w-[94%] flex lg:relative lg:top-0 lg:left-0 lg:translate-x-0"} transition-all duration-300`}
          >
            <div
              className={`relative flex h-10 flex-1 rounded-full border-2 border-gray-200 bg-white ${overScrollY ? "lg:w-full" : "lg:w-[50%]"} `}
            >
              <input
                // value={search}
                // onChange={(e) => {
                //   setSearch(e.target.value);
                //   setOpenDialog(true);
                //   setIsSearching(true);
                // }}
                className="h-full w-full rounded-full p-2"
                placeholder="Cari nama alat..."
              />
              {/* {isSearching ? (
                <X
                  onClick={() => {
                    setSearch("");
                    setOpenDialog(false);
                    setIsSearching(false);
                  }}
                  className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer rounded-full bg-red-500 p-2 text-white"
                />
              ) : (
                <Search className="bg-colorSecondary absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer rounded-full p-2 text-white" />
              )} */}
            </div>

            {/* <HeaderSearchModal
              products={searchProducts}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              search={search}
              overScrollY={overScrollY}
            /> */}
          </div>

          <div
            ref={loginWrapper}
            className={`${!overScrollY ? "flex items-center gap-2" : "hidden"}`}
          >
            <a
              href="/login"
              className="flex items-center gap-2 rounded-full border-2 border-white px-2 text-sm text-white lg:h-[40px]"
            >
              <User />
              <span>{"Login"}</span>
            </a>
            <LogOut
              onClick={() => signOut()}
              className="cursor-pointer text-white"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;
