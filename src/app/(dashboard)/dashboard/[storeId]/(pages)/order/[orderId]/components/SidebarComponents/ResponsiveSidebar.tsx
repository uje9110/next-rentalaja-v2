"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SingleOrderSidebar from "./SingleOrderSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

type ResponsiveSidebarProps = {
  orderData: any;
};

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ orderData }) => {
  // Detect if viewport width is less than 640px (mobile)
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger className="px-2">
          <Button className="w-full border border-slate-400/50 bg-white text-black shadow-sm">
            Buka Detail Order
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85vw] overflow-y-auto sm:w-96">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>
          <SingleOrderSidebar orderData={orderData} />
        </SheetContent>
      </Sheet>
    );
  }

  // Normal sidebar on larger screens
  return (
    <aside className="hidden lg:flex lg:w-72">
      <SingleOrderSidebar orderData={orderData} />
    </aside>
  );
};

export default ResponsiveSidebar;
