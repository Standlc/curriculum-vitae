import { isBotCrawling } from "@/isBotCrawling";
import { useMemo } from "react";

export const useIsBotCrawling = () => {
  const isBrowser = typeof window !== "undefined";

  const result = useMemo(() => {
    const userAgent = navigator?.userAgent;
    return isBotCrawling(userAgent);
  }, [isBrowser]);

  return result;
};
