import Home from "@/components/home";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Background from "@/components/Background";
import ScrollBar from "@/components/ScrollBar";
import { EmailClipboardNotificationProvider } from "@/EmailClipboardNotificationContext";
import ClipboardEmailNotification from "@/components/ClipboardEmailNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const VISIT_UPDATE_INTERVAL = 2000;

export default function Index() {
  const queryClient = useQueryClient();

  useQuery({
    queryKey: ["visitId"],
    queryFn: async () => {
      const res = await axios.post("/api/visit", {
        time: new Date().toISOString(),
        referrer: document.referrer,
      });
      return res.data.visitId;
    },
  });

  const updateVisit = useMutation({
    mutationKey: ["updateVisit"],
    mutationFn: async (visitId: number) => {
      const res = await axios.put("/api/visit", {
        time: new Date().toISOString(),
        visitId: visitId,
      });
      return res.data;
    },
  });

  useEffect(() => {
    let start = false;

    const timeoutId = setTimeout(() => {
      start = true;
    }, VISIT_UPDATE_INTERVAL);

    const intervalId = setInterval(() => {
      if (!start) return;

      const visitId = queryClient.getQueryData<number>(["visitId"]);
      if (visitId !== undefined) {
        // console.log(visitId);
        updateVisit.mutate(visitId);
      }
    }, VISIT_UPDATE_INTERVAL);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [updateVisit, queryClient]);

  return (
    <EmailClipboardNotificationProvider>
      <div className="w-full">
        <ClipboardEmailNotification />

        <div className="w-full px-10 max-w-[600px] m-auto flex flex-col items-center">
          <ScrollBar />
          <Home />
          <Background />
          <Projects />
          <Contact />
        </div>
        <div className="bg-gradient-to-b from-[var(--background)] pointer-events-none to-transparent z-20 fixed top-0 left-0 w-full h-[80px]"></div>
        <div className="bg-gradient-to-t from-[var(--background)] pointer-events-none to-transparent z-20 fixed bottom-0 left-0 w-full h-[80px]"></div>
      </div>
    </EmailClipboardNotificationProvider>
  );
}
