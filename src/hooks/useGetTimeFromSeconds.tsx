import { useMemo } from "react";

export const useGetTimeFromSeconds = (seconds: number) => {
  return useMemo(() => {
    const time = new Date(seconds * 1000);

    return {
      hours: time.getUTCHours(),
      minutes: time.getUTCMinutes(),
      seconds: time.getUTCSeconds(),
    };
  }, [seconds]);
};
