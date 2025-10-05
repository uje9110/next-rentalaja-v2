// app/lib/hooks/usePageLoading.ts
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const usePageLoading = () => {
  const pathname = usePathname();
  const [isPageLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When pathname changes, show loading briefly
    setIsLoading(true);

    // Small delay to allow page render to complete
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 400); // adjust as you like

    return () => clearTimeout(timeout);
  }, [pathname]);

  return { isPageLoading };
};
