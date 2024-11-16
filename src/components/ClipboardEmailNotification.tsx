import { EmailClipboardNotificationContext } from "@/EmailClipboardNotificationContext";
import { Mail } from "@mui/icons-material";
import { useContext } from "react";

export default function ClipboardEmailNotification() {
  const { isCopied } = useContext(EmailClipboardNotificationContext);

  if (!isCopied) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-red-400 flex justify-center z-30">
      <div className="font-mono absolute bottom-[50px] animate-clipboard-animation rounded-2xl border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-black bg-opacity-30 backdrop-blur-lg flex items-center gap-3">
        <Mail style={{ fontSize: 20 }} />
        <span className="text-base">You&apos;ve got my email copied!</span>
      </div>
    </div>
  );
}
