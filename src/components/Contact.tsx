import { useAnimateOnScreen } from "@/useAnimateOnScreen";
import Contacts from "./Contacts";

export default function Contact() {
  const { element } = useAnimateOnScreen({
    entranceRatio: 0.8,
    unique: true,
  });

  return (
    <div
      className="h-screen w-full flex items-center justify-center"
      id="contact"
    >
      <div
        ref={element as unknown as undefined}
        className="flex flex-col gap-7 items-center"
      >
        <h1 className="font-bold text-3xl">Let&apos;s get in touch</h1>

        <span className="opacity-text font-mono text-center whitespace-pre-line">
          {
            "Explore my open-source projects on Github, check my LinkedIn profile, or email me."
          }
        </span>

        <Contacts />
      </div>
    </div>
  );
}
