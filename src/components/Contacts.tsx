import { EmailClipboardNotificationContext } from "@/EmailClipboardNotificationContext";
import { GitHub, LinkedIn, Mail } from "@mui/icons-material";

import { useContext, useEffect, useRef, useState } from "react";

export default function Contacts() {
  const { update: setIsCopied } = useContext(EmailClipboardNotificationContext);
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timeoutId.current);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("s.delacomble@gmail.com");
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
        <span className="opacity-text font-mono text-sm">Github</span>
        <GitHub />
      </a>

      <a
        href="https://linkedin.com/in/stanislas-de-la-comble-514221203"
        target="_blank"
        className="flex gap-2 items-center hover:underline"
      >
        <span className="opacity-text font-mono text-sm">LinkedIn</span>
        <LinkedIn />
      </a>

      <div
        className="flex gap-2 items-center hover:underline cursor-pointer"
        onClick={handleCopyEmail}
      >
        <span className="opacity-text font-mono text-sm">Email</span>
        <Mail />
      </div>
    </div>
  );
}
