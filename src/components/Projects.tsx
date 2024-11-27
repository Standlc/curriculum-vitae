import { GitHub, Language } from "@mui/icons-material";
import { useAnimateOnScreen } from "@/hooks/useAnimateOnScreen";

const PROJECTS: {
  title: string;
  description: string;
  skills: string;
  links: {
    url: string;
    icon: any;
  }[];
}[] = [
  {
    title: "Front-end developer at Cyberjobs",
    description:
      "Developement of the chat, back office and other user-centric interfaces.",
    skills: "React, .NET, SignalR",
    links: [
      {
        url: "https://cyberjobs.fr",
        icon: <Language />,
      },
    ],
  },
  {
    title: "Notion Clone",
    description: "Note taking app with basic Notion functions.",
    skills: "React",
    links: [
      {
        url: "https://github.com/Standlc/Notion-clone",
        icon: <GitHub />,
      },
      {
        url: "https://notion-clone-standlc.vercel.app/",
        icon: <Language />,
      },
    ],
  },
  {
    title: "Minishell",
    description: "Shell in C with builtins and pipes.",
    skills: "C",
    links: [
      {
        url: "https://github.com/Standlc/Minishell",
        icon: <GitHub />,
      },
    ],
  },
  {
    title: "MiniRT",
    description: "Single threaded ray tracing engine in C.",
    skills: "C, Minilibx",
    links: [
      {
        url: "https://github.com/Standlc/miniRT",
        icon: <GitHub />,
      },
    ],
  },
  {
    title: "Webserv",
    description:
      "HTTP web server in C++ with static file serving and uploading and HTTP/CGI proxies.",
    skills: "C++",
    links: [
      {
        url: "https://github.com/Standlc/Webserv",
        icon: <GitHub />,
      },
    ],
  },
  {
    title: "View",
    description:
      "Full-stack development of a 'twitter-like' website featuring posts and comments as threads.",
    skills: "React, Fastify, Docker, PostgreSQL",
    links: [
      {
        url: "https://github.com/Standlc/View-social",
        icon: <GitHub />,
      },
    ],
  },
  {
    title: "Distro",
    description:
      "Full-stack development of an online pong game with a chat, leveraging WebSockets for real-time features.",
    skills: "React, Nest, Docker, PostgreSQL",
    links: [
      {
        url: "https://github.com/Standlc/transcendence",
        icon: <GitHub />,
      },
    ],
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
      <h1 ref={element as unknown as undefined} className="font-bold text-3xl">
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
  links,
}: (typeof PROJECTS)[number]) => {
  const { element } = useAnimateOnScreen({
    entranceRatio: 0.8,
    unique: true,
  });

  return (
    <div
      ref={element as unknown as undefined}
      className="flex items-start justify-between gap-10"
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-mono font-semibold">
          {title}
          <span className="font-normal text"> ({skills})</span>
        </h1>
        <span className="font-mono opacity-text text-base">{description}</span>
      </div>

      <div className="flex gap-5 items-center">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            className="flex gap-2 items-center hover:underline opacity-text hover:opacity-100 transition-opacity"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
};
