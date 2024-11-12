import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { GitHub } from "@mui/icons-material";

export default function Projects() {
  return (
    <div className="h-screen w-full flex justify-center flex-col gap-5">
      <h1 className="font-sans font-bold text-3xl">Projects and Positions</h1>
      <div className="flex flex-col gap-10">
        <Project
          title="Front-end developer at Cyberjobs"
          description="Developement of the chat, back office and other modules."
          skills="React, .NET, SignalR"
          link={{
            url: "https://cyberjobs.fr",
            icon: <ArrowOutwardIcon />,
          }}
        />
        <Project
          title="Minishell"
          description="Shell in C with builtins and pipes."
          skills="C"
          link={{
            url: "https://github.com/Standlc/miniRT",
            icon: <GitHub />,
          }}
        />
        <Project
          title="MiniRT"
          description="Single threaded ray tracing engine in C."
          skills="C, Minilibx"
          link={{
            url: "https://github.com/Standlc/miniRT",
            icon: <GitHub />,
          }}
        />
        <Project
          title="WebServ"
          description="HTTP web server in C++."
          skills="C++"
          link={{
            url: "https://github.com/Standlc/miniRT",
            icon: <GitHub />,
          }}
        />
        <Project
          title="View"
          description="Full-stack development of a 'twitter-like' website."
          skills="React, Fastify, Docker, Postgresql"
          link={{
            url: "https://github.com/Standlc/miniRT",
            icon: <GitHub />,
          }}
        />
        <Project
          title="Distro"
          description="Full-stack development of an online pong game."
          skills="React, Nest, Docker, Postgresql"
          link={{
            url: "https://github.com/Standlc/miniRT",
            icon: <GitHub />,
          }}
        />
      </div>
    </div>
  );
}

const Project = ({
  title,
  description,
  skills,
  link,
}: {
  title: string;
  description: string;
  skills: string;
  link: {
    url: string;
    icon: any;
  };
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl">
          {title}
          <span className="font-thin text-lg"> ({skills})</span>
        </h1>
        <span className="font-mono opacity-85 text-base">{description}</span>
      </div>

      <a
        href={link.url}
        target="_blank"
        className="flex gap-2 items-center hover:underline"
      >
        {link.icon}
      </a>
    </div>
  );
};
