import { GitHub, LinkedIn } from "@mui/icons-material";

const Home = () => {
  // const scrollY = useScroll();
  // const sectionRef = useRef<HTMLDivElement>(null);
  // const [blur, setBlur] = useState(0);

  return (
    <div className="h-screen w-full">
      <div className="h-full flex items-center top-0 left-0 w-full">
        <div
          className={`flex flex-col gap-5`}
          //   style={{ filter: `blur(${0}px)`, opacity: `${blur}` }}
        >
          <h1 className={`font-sans font-bold text-4xl`}>Stan de La Comble</h1>
          <span className="font-mono opacity-85">
            Software Ingeneer passionate for innovation and design.
          </span>

          <div className="self-end mt-10 flex gap-7">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
