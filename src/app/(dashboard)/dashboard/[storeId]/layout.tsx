"use client";

import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "lucide-react";
import DashboardSidebar from "../../components/DashboardSidebar";
import { DashboardContextProvider } from "@/app/lib/context/DashboardContext";
import { useDashboardSidebar } from "@/app/(dashboard)/hook/useDashboardSidemenu";
import DashboardHeader from "../../components/DashboardHeader";
import { usePageLoading } from "@/app/lib/hooks/usePageLoading";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { storeId } = useParams();
  const { isPageLoading } = usePageLoading();
  const { SidebarMenuAdmin, SidebarMenuCashier, SidebarMenuCustomerService } =
    useDashboardSidebar({ storeId: storeId as string });

  return session ? (
    <main className="flex max-h-fit min-h-screen bg-sky-50">
      <DashboardContextProvider>
        <Toaster />
        <SidebarProvider>
          <DashboardSidebar
            SidebarMenuAdmin={SidebarMenuAdmin}
            SidebarMenuCashier={SidebarMenuCashier}
            SidebarMenuCustomerService={SidebarMenuCustomerService}
          />
          <section className="flex flex-grow flex-col gap-2 p-2 pl-1">
            <DashboardHeader />
            {isPageLoading ? (
              <div className="flex flex-grow items-center justify-center">
                <Loader size={32} className="animate-spin text-sky-600" />
              </div>
            ) : (
              children
            )}
          </section>
        </SidebarProvider>
      </DashboardContextProvider>
    </main>
  ) : null;
};

export default Layout;
