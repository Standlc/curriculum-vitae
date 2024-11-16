import { useAnimateOnScreen } from "@/useAnimateOnScreen";
import { GitHub, LinkedIn, Mail } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

export default function Contact() {
  const { element } = useAnimateOnScreen({
    entranceRatio: 0.8,
    unique: true,
  });

  const [isCopied, setIsCopied] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);

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

  useEffect(() => {
    return () => clearTimeout(timeoutId.current);
  }, []);

  return (
    <div
      className="h-screen w-full flex items-center justify-center"
      id="contact"
    >
      {isCopied && (
        <div className="font-mono fixed bottom-[50px] animate-clipboard-animation rounded-2xl border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-black bg-opacity-50 z-30 backdrop-blur-lg flex items-center gap-3">
          <Mail style={{ fontSize: 20 }} />
          <span className="text-base">You&apos;ve got my email copied!</span>
        </div>
      )}

      <div ref={element as unknown as undefined} className="flex flex-col gap-7 items-center">
        <h1 className="font-bold text-3xl">Let&apos;s get in touch</h1>

        <span className="opacity-text font-mono text-center whitespace-pre-line">
          {
            "Explore my open-source projects on Github,\nview my LinkedIn profile, or email me."
          }
        </span>

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
      </div>
    </div>
  );
}
