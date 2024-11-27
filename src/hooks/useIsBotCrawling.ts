import { isBotCrawling } from "@/isBotCrawling";
import { useMemo } from "react";

export const useIsBotCrawling = () => {
  const isBrowser = typeof window !== "undefined";

  const result = useMemo(() => {
    if (!isBrowser) return false;

    const userAgent = navigator?.userAgent;
    return isBotCrawling(userAgent);
  }, [isBrowser]);

  return result;
};
