"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logoWhite from "../../../assets/img/logo/logo-rental-aja-white.png";
import {
  handleScrollFrontPageHeader,
  useScrollFrontPageHeader,
} from "../../hooks/useScroll_FrontPageHeader";
import { LogOut, SearchCheck, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SearchAndCheckDialog from "../../../lib/components/ProductSearchAndCheckDialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const AppHeader = () => {
  const { data: session } = useSession();

  const loginWrapper = useRef<HTMLDivElement>(null);
  const searchbarWrapper = useRef<HTMLDivElement>(null);
  const [overScrollY, setOverScrollY] = useState(false);

  useScrollFrontPageHeader(() => handleScrollFrontPageHeader(setOverScrollY));

  return (
    <nav
      className={`z-50 flex w-full justify-center phone:pb-4 ${overScrollY ? "phone:sticky phone:top-1 lg:top-4" : "relative w-full"}`}
    >
      <div
        className={`bg-colorPrimary flex h-16 flex-row items-center justify-between transition-all duration-400 ${overScrollY ? "phone:w-[94%] rounded-md p-3 lg:w-[59%]" : "phone:px-4 phone:w-full lg:w-full lg:px-12"}`}
      >
        <div className="relative h-14 w-64">
          <Link
            href="/"
            className="phone:w-25 phone:h-7 absolute top-1/2 flex h-10 w-40 -translate-y-1/2 items-center"
          >
            <Image
              src={logoWhite.src}
              fill
              alt="Logo"
              className="phone:object-fill object-cover"
            />
          </Link>
        </div>

        <div className="flex gap-1 lg:w-[35%]">
          {/* Search */}
          <div
            ref={searchbarWrapper}
            className={`${overScrollY ? "relative flex-1" : "phone:absolute phone:top-14 phone:left-1/2 phone:-translate-x-1/2 phone:w-[94%] flex lg:relative lg:top-0 lg:left-0 lg:translate-x-0"} transition-all duration-300`}
          >
            <Dialog>
              <DialogTrigger className="w-full">
                <div
                  className={`relative flex h-10 flex-1 items-center justify-between overflow-hidden rounded-full border-2 border-gray-200 bg-white`}
                >
                  <span
                    className={`ml-4 text-gray-500 phone:text-xs ${overScrollY ? "phone:truncate w-36" : ""}`}
                  >
                    Cari atau cek jadwal alat
                  </span>
                  <p className="mr-1 rounded-full bg-teal-400 p-1 text-xs text-white shadow-sm">
                    <SearchCheck />
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent className="phone:w-5/6 lg:w-2/5">
                <DialogTitle>Cari & Cek Jadwal Alat</DialogTitle>
                <SearchAndCheckDialog />
              </DialogContent>
            </Dialog>
          </div>

          <div
            ref={loginWrapper}
            className={`${!overScrollY ? "flex items-center gap-2" : "hidden"}`}
          >
            <a
              href="/login"
              className="flex items-center gap-2 rounded-full border border-white px-2 text-sm text-white lg:h-[40px]"
            >
              <User className="phone:w-4" />
              <span className="phone:text-xs">
                {" "}
                {session?.user.firstName ? session?.user.firstName : "Login"}
              </span>
            </a>
            <LogOut
              onClick={() => signOut()}
              className="phone:w-4 cursor-pointer text-white"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;
