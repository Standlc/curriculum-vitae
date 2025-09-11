import { EmailClipboardNotificationContext } from "@/EmailClipboardNotificationContext";
import { useContext, useMemo } from "react";

const phrases = [
  "Waiting for your email!",
  "You've got my email!",
  "Email copied! Time to send!",
];

export default function ClipboardEmailNotification() {
  const { isCopied } = useContext(EmailClipboardNotificationContext);
  const randomPhrase = useMemo(() => {
    if (!isCopied) {
      return undefined;
    }
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, [isCopied]);

  if (!randomPhrase) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-red-400 flex justify-center z-30">
      <div className="font-mono absolute bottom-[50px] animate-clipboard-animation rounded-2xl border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-black bg-opacity-30 backdrop-blur-lg flex items-center gap-3">
        <span className="text-base">{randomPhrase}</span>
      </div>
    </div>
  );
}
