import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { GitHub } from "@mui/icons-material";
import { useAnimateOnScreen } from "@/useAnimateOnScreen";

const PROJECTS: {
  title: string;
  description: string;
  skills: string;
  link: {
    url: string;
    icon: any;
  };
}[] = [
  {
    title: "Front-end developer at Cyberjobs",
    description: "Developement of the chat, back office and other modules.",
    skills: "React, .NET, SignalR",
    link: {
      url: "https://cyberjobs.fr",
      icon: <ArrowOutwardIcon />,
    },
  },
  {
    title: "Minishell",
    description: "Shell in C with builtins and pipes.",
    skills: "C",
    link: {
      url: "https://github.com/Standlc/miniRT",
      icon: <GitHub />,
    },
  },
  {
    title: "MiniRT",
    description: "Single threaded ray tracing engine in C.",
    skills: "C, Minilibx",
    link: {
      url: "https://github.com/Standlc/miniRT",
      icon: <GitHub />,
    },
  },
  {
    title: "WebServ",
    description: "HTTP web server in C++.",
    skills: "C++",
    link: {
      url: "https://github.com/Standlc/miniRT",
      icon: <GitHub />,
    },
  },
  {
    title: "View",
    description: "Full-stack development of a 'twitter-like' website.",
    skills: "React, Fastify, Docker, Postgresql",
    link: {
      url: "https://github.com/Standlc/miniRT",
      icon: <GitHub />,
    },
  },
  {
    title: "Distro",
    description: "Full-stack development of an online pong game.",
    skills: "React, Nest, Docker, Postgresql",
    link: {
      url: "https://github.com/Standlc/miniRT",
      icon: <GitHub />,
    },
  },
];

export default function Projects() {
  const { element } = useAnimateOnScreen({
    entranceRatio: 0.8,
    unique: true,
  });

  return (
    <div
      className="min-h-screen py-20 w-full flex justify-center flex-col gap-10"
      id="projects"
    >
      <h1 ref={element as any} className="font-sans font-bold text-3xl">
        Projects and Positions
      </h1>

      <div className="flex flex-col gap-10">
        {PROJECTS.map((project, index) => (
          <Project key={index} {...project} />
        ))}
      </div>
    </div>
  );
}

const Project = ({
  title,
  description,
  skills,
  link,
}: (typeof PROJECTS)[number]) => {
  const { element } = useAnimateOnScreen({
    entranceRatio: 0.8,
    unique: true,
  });

  return (
    <div ref={element as any} className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl">
          {title}
          <span className="font-thin text-lg"> ({skills})</span>
        </h1>
        <span className="font-mono opacity-text text-base">{description}</span>
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
