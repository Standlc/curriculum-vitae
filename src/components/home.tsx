import { GitHub, LinkedIn } from "@mui/icons-material";
import { TypeWriterText } from "./TypeWriterText";
// import { useAnimateOnScreen } from "@/useAnimateOnScreen";

const Home = () => {
  // const { element, hiddenStyle } = useAnimateOnScreen({
  //   entranceRatio: 1,
  //   unique: true,
  //   delay: 0.6,
  // });

  return (
    <div className="h-screen w-full" id="home">
      <div className="h-full flex items-center top-0 left-0 w-full">
        <div
          // ref={element as any}
          // style={hiddenStyle}
          className={`w-full flex flex-col gap-5 animate-fade-in [animation-delay:0.6s]`}
        >
          <div className="flex gap-8 flex-col items-start sm:flex-row sm:items-center">
            <div className="sm:min-w-[100px] sm:w-[100px] sm:h-[100px] w-[30%] aspect-square rounded-full overflow-hidden">
              <img
                className="h-full w-full"
                src={"https://avatars.githubusercontent.com/u/92372490?v=4"}
              />
            </div>

            <div className="flex flex-col gap-3">
              <h1 className={`font-bold text-3xl`}>Stan de La Comble</h1>
              <div className="flex items-center opacity-text">
                <TypeWriterText
                  ogText={
                    "Software Ingeneer passionate for innovation and design."
                  }
                />
              </div>
            </div>
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
