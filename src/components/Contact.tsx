import { GitHub, LinkedIn, Mail } from "@mui/icons-material";

export default function Contact() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col gap-10 items-center">
        <h1 className="font-sans font-bold text-3xl">Let's get in touch</h1>

        <div className="flex gap-5">
          <a
            href="https://github.com/Standlc"
            target="_blank"
            className="flex gap-2 items-center hover:underline"
          >
            <span className="opacity-85 font-mono text-sm">Github</span>
            <GitHub />
          </a>

          <a
            href="https://github.com/Standlc"
            target="_blank"
            className="flex gap-2 items-center hover:underline"
          >
            <span className="opacity-85 font-mono text-sm">LinkedIn</span>
            <LinkedIn />
          </a>

          <div className="flex gap-2 items-center hover:underline cursor-pointer">
            <span className="opacity-85 font-mono text-sm">Email</span>
            <Mail />
          </div>
        </div>
      </div>
    </div>
  );
}
