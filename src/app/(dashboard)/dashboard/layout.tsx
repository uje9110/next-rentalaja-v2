"use client";

import { CartContextProvider } from "@/app/lib/context/CartContext";
import { Loader } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Handle unauthenticated redirect inside effect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [status, pathname, router]);

  // ✅ Handle unauthorized role inside effect
  useEffect(() => {
    if (status === "authenticated" && session?.user.roleId === "999") {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  // ✅ Loading UI
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader
          size={32}
          strokeWidth={2}
          className="text-primary animate-spin"
        />
      </div>
    );
  }

  // ✅ Return null during redirect states
  if (status === "unauthenticated" || session?.user.roleId === "999") {
    return null;
  }

  // ✅ Normal layout rendering
  return (
    <SessionProvider>
      <CartContextProvider>{children}</CartContextProvider>
    </SessionProvider>
  );
}
