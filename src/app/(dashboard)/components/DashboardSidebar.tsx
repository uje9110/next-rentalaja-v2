"use client";
import React, { FC, useEffect, useState } from "react";
import clsx from "clsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import RentalajaLogo from "../../assets/img/logo/logo-rentalaja.png";
import UserPlaceholder from "../../assets/img/icon/customer-placeholder.webp";
import { LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useDashboardContext } from "@/app/lib/context/DashboardContext";
import { MenuItem } from "../hook/useDashboardSidemenu";
import Link from "next/link";

const getRoleName = (roleId: string | undefined) => {
  switch (roleId) {
    case "001":
      return "SuperAdmin";

    case "002":
      return "Admin";

    case "003":
      return "Cashier";

    case "004":
      return "Customer Service";

    default:
      return "";
  }
};

type DashboardSidebarProps = {
  SidebarMenuAdmin: MenuItem[];
  SidebarMenuCustomerService: MenuItem[];
  SidebarMenuCashier: MenuItem[];
};

const DashboardSidebar: FC<DashboardSidebarProps> = ({
  SidebarMenuAdmin,
  SidebarMenuCustomerService,
  SidebarMenuCashier,
}) => {
  const { notificationLength } = useDashboardContext();
  const { state } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarMenus, setSidebarMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (!session) return;

    if (session.user.roleId === "001" || session.user.roleId === "002") {
      setSidebarMenus(SidebarMenuAdmin);
    }
    if (session.user.roleId === "003") {
      setSidebarMenus(SidebarMenuCashier);
    }
    if (session.user.roleId === "004") {
      setSidebarMenus(SidebarMenuCustomerService);
    }
  }, [session]);
  
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-1 pt-3">
          <Image
            width={100}
            height={100}
            src={RentalajaLogo.src}
            alt="Logo"
            className="w-8"
          />
          <div
            className={clsx(
              "flex w-full flex-row items-center justify-between",
              state === "collapsed" && "hidden",
            )}
          >
            <p className="flex flex-col gap-0">
              <span className="text-lg leading-4 font-semibold">Rentalaja</span>
              <span className="text-xs font-light">Dashboard</span>
            </p>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenus.map((menu) => {
                const isActive = pathname.includes(menu.link);
                return (
                  <SidebarMenuItem key={menu.title} className="ml-0 list-none">
                    <SidebarMenuButton
                      tooltip={menu.title}
                      className={clsx(
                        "hover:text-colorSecondary flex justify-between pr-1 hover:bg-teal-100",
                        isActive && "text-colorSecondary bg-teal-100",
                      )}
                    >
                      <Link href={menu.link} className="flex flex-row gap-2">
                        {<menu.icon strokeWidth="1px" size={20} />}
                        <span className="text-sm font-normal capitalize">
                          {menu.title}
                        </span>
                      </Link>
                      {menu.title === "dashboard" && (
                        <div className="flex h-6 w-6 -translate-y-[1px] items-center justify-center self-center rounded-md bg-red-400 p-3 text-xs font-semibold text-white">
                          {notificationLength}
                        </div>
                      )}
                    </SidebarMenuButton>
                    {menu.subItems?.length ? (
                      <SidebarMenuSub>
                        {" "}
                        {menu.subItems.map((item) => {
                          return (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                                className="m-0 list-none text-xs text-slate-500"
                                asChild
                                isActive={item.isActive}
                              >
                                <Link
                                  href={item.link}
                                  className="bg-white capitalize"
                                >
                                  {item.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}{" "}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="w-full">
            <div className="flex items-center justify-start gap-2">
              <Image
                width={100}
                height={100}
                src={session?.user.profilePic.link || UserPlaceholder.src}
                alt="User Image"
                className={`${state === "collapsed" ? "h-8 w-8" : "h-10 w-10"} rounded-full border-[1px] border-slate-300`}
              />
              <div
                className={clsx(
                  "flex flex-col justify-center gap-0",
                  state === "collapsed" && "hidden",
                )}
              >
                <p className="text-xs font-semibold">
                  {session?.user.firstName} {session?.user.lastName}
                </p>
                <p className="text-xs">{getRoleName(session?.user.roleId)}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            style={{
              width: "var(--radix-popper-anchor-width)",
            }}
            className="mb-2 rounded-lg border-2 bg-sky-50"
          >
            <DropdownMenuItem>
              <p
                className="flex w-full items-center gap-4 p-2"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <p className="flex w-full items-center gap-4 p-2">
                <Settings size={16} />
                <span className="text-sm">Setting</span>
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
