"use client";

import { useEffect, useRef, useState } from "react";

export function useSticky<T extends HTMLElement>(offset = 0) {
  const ref = useRef<T | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { rootMargin: `-${offset}px 0px 0px 0px` },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [offset]);

  return { ref, isSticky };
}
