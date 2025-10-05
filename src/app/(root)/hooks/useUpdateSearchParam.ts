"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useUpdateSearchParam() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔹 Single param updater
  const updateSearchParam = useCallback(
    (name: string, value: string | Date | null) => {
      const params = new URLSearchParams(window.location.search); // always fresh

      if (value) {
        const stringValue =
          value instanceof Date ? value.toISOString() : String(value);
        params.set(name, stringValue);
      } else {
        params.delete(name);
      }

      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router],
  );

  // 🔹 Multi param updater
  const updateSearchParams = useCallback(
    (updates: Record<string, string | Date | null | undefined>) => {
      const params = new URLSearchParams(window.location.search); // always fresh

      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value === "") {
          params.delete(key);
        } else {
          const stringValue =
            value instanceof Date ? value.toISOString() : String(value);
          params.set(key, stringValue);
        }
      });

      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router],
  );

  return { updateSearchParam, updateSearchParams, searchParams };
}
