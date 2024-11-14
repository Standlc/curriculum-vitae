import { useAnimateOnScreen } from "@/useAnimateOnScreen";
import { GitHub, LinkedIn } from "@mui/icons-material";
import { TypeWriterText } from "./TypeWriterText";

const Home = () => {
  const { element, hiddenStyle } = useAnimateOnScreen({
    entranceRatio: 1,
    unique: true,
    delay: 0.6,
  });

  return (
    <div className="h-screen w-full" id="home">
      <div className="h-full flex items-center top-0 left-0 w-full">
        <div
          ref={element as any}
          style={hiddenStyle}
          className={`w-full flex flex-col gap-5`}
        >
          <h1 className={`font-sans font-bold text-4xl`}>Stan de La Comble</h1>
          <div className="flex items-center opacity-text">
            <TypeWriterText
              ogText={"Software Ingeneer passionate for innovation and design."}
            />
          </div>

          <div className="self-end mt-10 flex gap-7">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
