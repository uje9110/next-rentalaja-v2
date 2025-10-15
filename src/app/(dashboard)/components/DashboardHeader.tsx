"use client";

import React, { useEffect, useRef, useState } from "react";
import { Clock, SearchCheck } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import moment from "moment";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SelectStore from "./SelectStore";
import SearchAndCheckDialog from "@/app/lib/components/ProductSearchAndCheckDialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DashboardHeader = () => {
  const { storeId } = useParams();

  const pathname = usePathname();

  const pageTitle = useRef<HTMLHeadingElement>(null);

  const [time, setTime] = useState(moment().format("HH:mm:ss"));

  // PAGE TITLE
  useEffect(() => {
    const pathnames = pathname.split("/");
    let title = pathnames.length > 3 ? pathnames[3] : pathnames[2];
    if (title.includes("_")) {
      title = title
        .toLocaleLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    if (!pageTitle.current) {
      return;
    }
    pageTitle.current.textContent = title;
  }, [pathname]);

  // CLOCK
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="phone:sticky phone:right-0 phone:top-2 phone:h-auto phone:w-[calc(100%-16px)] phone:py-2 phone:px-2 sticky top-0 right-0 z-10 mt-2 ml-2 flex h-10 w-[calc(100%-12px)] items-center rounded-md border-[1px] border-b-[1px] border-slate-400/50 bg-white px-4 shadow-sm lg:m-0 lg:w-full lg:py-2">
      <div className="phone:flex-col phone:items-start phone:gap-2 flex w-full items-center justify-between">
        <div className="phone:w-full phone:flex-row phone:flex-wrap phone:gap-1 flex w-full items-center justify-between gap-4 lg:gap-4">
          {/* TITLE */}
          <div className="phone:order-1 flex gap-0 lg:order-1">
            <span>
              <SidebarTrigger />
            </span>
            {/* PAGE TITLE */}
            <div className="phone:w-fit phone:flex phone:items-center flex w-24 gap-2">
              <h3
                id="page-title"
                ref={pageTitle}
                className="phone:text-sm text-lg font-semibold capitalize lg:text-lg"
              >
                Dashboard
              </h3>
            </div>
          </div>

          {/* SEARCH */}
          <div className="phone:order-3 phone:w-full lg:order-2 lg:ml-auto lg:w-80 lg:self-end">
            <Dialog>
              <DialogTrigger className="phone:w-full">
                <div
                  className={`phone:w-full border-accent-custom relative flex h-8 w-full flex-1 items-center justify-between overflow-hidden rounded-full border bg-white lg:h-10`}
                >
                  <span className={`phone:text-xs ml-4 text-gray-500`}>
                    Cari atau cek jadwal alat
                  </span>
                  <p className="mr-0.5 rounded-full bg-teal-400 p-1 text-white shadow-sm lg:p-2">
                    <SearchCheck size={18} />
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent className="phone:w-5/6 lg:w-1/5">
                <DialogTitle>Cari & Cek Jadwal Alat</DialogTitle>
                <SearchAndCheckDialog
                  isUsingDashboard={true}
                  storeId={storeId as string}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* OTHER */}
          <div className="phone:order-2 phone:gap-0 flex justify-end gap-2 lg:order-3 lg:gap-2">
            {/* CLOCK */}
            {/* <p className="phone:hidden flex items-center gap-2 text-sm lg:flex">
              <Clock className="phone:w-3 w-4 lg:w-4" />
              <span className="text-xs leading-1">{time}</span>
            </p> */}
            {/* DATABASE SELECT */}
            <div className="phone:w-fit phone:justify-start flex w-fit justify-end">
              <SelectStore />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
