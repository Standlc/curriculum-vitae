import { EmailClipboardNotificationContext } from "@/EmailClipboardNotificationContext";
import { GitHub, LinkedIn, Mail } from "@mui/icons-material";

import { useContext, useEffect, useRef } from "react";

export default function Contacts() {
  const { update: setIsCopied } = useContext(EmailClipboardNotificationContext);
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timeoutId.current);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard?.writeText("s.delacomble@gmail.com");
      setIsCopied(true);

      if (timeoutId.current === undefined) {
        timeoutId.current = setTimeout(() => {
          setIsCopied(false);
          timeoutId.current = undefined;
        }, 5000);
      }
    } catch (error) {
      console.error("Failed to copy email to clipboard:", error);
    }
  };

  return (
    <div className="flex gap-5 w-full items-center justify-center">
      <a
        href="https://github.com/Standlc"
        target="_blank"
        className="flex gap-2 items-center hover:underline"
      >
        <span className="opacity-text font-mono text-sm">GitHub</span>
        <GitHub />
      </a>

      <a
        href="https://www.linkedin.com/in/stan-de-la-comble-514221203/"
        target="_blank"
        className="flex gap-2 items-center hover:underline"
      >
        <span className="opacity-text font-mono text-sm">LinkedIn</span>
        <LinkedIn />
      </a>

      <div className="flex items-center relative justify-center">
        <div
          onClick={handleCopyEmail}
          className="flex gap-2 items-center hover:underline cursor-pointer justify-center peer/email"
        >
          <span className="opacity-text font-mono text-sm">Email</span>
          <Mail />
        </div>
        <div className="[transition:opacity_0.3s_cubic-bezier(0.5,0,0,2),transform_0.3s_cubic-bezier(0.5,0,0,2)] peer-hover/email:opacity-100 peer-hover/email:-translate-y-[100%] opacity-0 absolute -top-[5px] font-semibold bg-[var(--background)] -translate-y-[90%] font-mono text-xs px-2 py-1 rounded-lg border border-[rgba(255,255,255,0.1)] z-20 min-w-max">
          Click to copy
        </div>
      </div>
    </div>
  );
}
