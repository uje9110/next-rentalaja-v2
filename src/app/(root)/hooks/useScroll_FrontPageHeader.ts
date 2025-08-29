// hooks/useScrollNav.ts
import { throttle } from "lodash";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

export function useScrollFrontPageHeader(
  callback: () => void,
  deps: React.DependencyList = [],
) {
  const throttled = useCallback(throttle(callback, 100), deps);

  useEffect(() => {
    window.addEventListener("scroll", throttled);
    return () => window.removeEventListener("scroll", throttled);
  }, [throttled]);
}

export const useHandleScrollFrontPageHeader = (
  setOverScrollY: Dispatch<SetStateAction<boolean>>,
): void => {
  const scrollY = window.scrollY;
  const SCROLL_Y_OFFSET = 56;

  if (scrollY === 0) {
    setOverScrollY(false);
  } else if (scrollY > SCROLL_Y_OFFSET) {
    setOverScrollY(true);
  }
};
