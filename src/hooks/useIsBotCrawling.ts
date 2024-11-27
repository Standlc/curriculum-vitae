import { isBotCrawling } from "@/isBotCrawling";
import { useMemo } from "react";

export const useIsBotCrawling = () => {
  return useMemo(() => {
    const userAgent = navigator?.userAgent;
    return isBotCrawling(userAgent);
  }, [navigator]);
};
