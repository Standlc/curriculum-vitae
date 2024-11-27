import Home from "@/components/home";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Background from "@/components/Background";
import ScrollBar from "@/components/ScrollBar";
import { EmailClipboardNotificationProvider } from "@/EmailClipboardNotificationContext";
import ClipboardEmailNotification from "@/components/ClipboardEmailNotification";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { useIsBotCrawling } from "@/hooks/useIsBotCrawling";
import { VisitCreateType, VisitUpdateType } from "@/backend/apiTypes";

const VISIT_UPDATE_INTERVAL = 2000;

export default function Index() {
  const isBotCrawling = useIsBotCrawling();
  const isVisitInitiated = useRef(false);

  useQuery({
    queryKey: ["visit"],
    queryFn: async () => {
      if (isBotCrawling) return null;

      if (!isVisitInitiated.current) {
        isVisitInitiated.current = true;

        const res = await axios.post("/api/visit", {
          time: new Date().toISOString(),
          referrer: document.referrer,
        } satisfies VisitCreateType);

        return res.data;
      } else {
        const res = await axios.put("/api/visit", {
          time: new Date().toISOString(),
        } satisfies VisitUpdateType);

        return res.data;
      }
    },
    refetchInterval: (query) => (query.state.error ? 0 : VISIT_UPDATE_INTERVAL),
  });

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
