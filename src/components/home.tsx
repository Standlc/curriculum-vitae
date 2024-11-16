import { TypeWriterText } from "./TypeWriterText";
import Contacts from "./Contacts";

const Home = () => {
  return (
    <div className="h-screen w-full" id="home">
      <div className="h-full flex items-center top-0 left-0 w-full">
        <div
          className={`w-full flex flex-col gap-7 animate-fade-in [animation-delay:0.6s]`}
        >
          <div className="flex gap-8 flex-col items-start sm:flex-row sm:items-center">
            <div className="sm:min-w-[100px] sm:w-[100px] sm:h-[100px] w-[40%] aspect-square rounded-full overflow-hidden">
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
                    "Software developer passionate about innovation and design."
                  }
                />
              </div>
            </div>
          </div>

          <div className="self-end w-min">
            <Contacts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
