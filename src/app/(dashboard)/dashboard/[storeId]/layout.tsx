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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const param = useParams();

  const { storeId } = param;

  useEffect(() => {
    if (session?.user.roleId === "999") {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  if (status === "unauthenticated") {
    router.push(`/login?redirect=${pathname}`);
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full flex-row items-center justify-center">
        <p className="animate-spin">
          <Loader size={32} strokeWidth={2} />
        </p>
      </div>
    );
  }

  if (session?.user.roleId === "999") {
    return null;
  }

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
          <section className="flex flex-grow flex-col p-2 pl-1">
            {children}
          </section>
        </SidebarProvider>
      </DashboardContextProvider>
    </main>
  ) : null;
};

export default Layout;
