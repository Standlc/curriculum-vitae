import { useEffect, useState } from "react";

export const useScrollProgress = (id: string) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCurrent, setIsCurrent] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);

  useEffect(() => {
    const sectionRef = document.getElementById(id);
    if (!sectionRef) return;

    setSectionHeight(
      sectionRef.getBoundingClientRect().height /
        document.body.getBoundingClientRect().height
    );

    let animationId: number;

    const handler = () => {
      animationId = requestAnimationFrame(() => {
        const rect = sectionRef.getBoundingClientRect();

        const progress = (window.innerHeight - rect.top) / rect.height;

        setIsCurrent(progress > 0 && progress <= 1);
        setScrollProgress(progress > 1 ? 1 : progress < 0 ? 0 : progress);
      });
    };

    handler();

    document.addEventListener("scroll", handler);
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("scroll", handler);
    };
  }, [id]);

  return { scrollProgress, isCurrent, sectionHeight };
};

export default function ScrollBar() {
  const [showScrollBar, setShowScrollBar] = useState(false);
  const containerClassName = showScrollBar ? "opacity-100" : "opacity-0";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scrollHandler = () => {
      setShowScrollBar(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowScrollBar(false);
      }, 1000);
    };

    document.addEventListener("scroll", scrollHandler);
    return () => {
      clearInterval(timeoutId);
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <div className={` fixed right-10 top-0 h-full py-[30vh]`}>
      <div
        className={`${containerClassName} h-full w-full flex flex-col gap-1 group hover:opacity-100 [transition:opacity_1s] cursor-pointer`}
      >
        <SectionProgress id="home" />
        <SectionProgress id="background" />
        <SectionProgress id="projects" />
        <SectionProgress id="contact" />
      </div>
    </div>
  );
}

const SectionProgress = ({ id }: { id: string }) => {
  const { scrollProgress, isCurrent, sectionHeight } = useScrollProgress(id);
  const containerClassname = !isCurrent ? "opacity-50" : "opacity-100";
  const labelClassname = !isCurrent
    ? "group-hover:opacity-100"
    : "group-hover:opacity-100";

  const handleClick = () => {
    const section = document.getElementById(id);
    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        height: sectionHeight * 100 + "%",
      }}
      className={`${containerClassname} group/parent hover:opacity-100 [transition:opacity_1s] flex gap-5 items-center justify-end`}
    >
      <div
        className={`opacity-0 ${labelClassname} group-hover/parent:opacity-100 group-hover:translate-x-0 translate-x-2 flex items-center font-mono mt-auto capitalize h-full text-xs font-bold [transition:opacity_1s,transform_1s_cubic-bezier(0.4,0,0,0.8)]`}
      >
        {id}
      </div>
      <div
        className={`bg-white w-[2px] h-full bg-opacity-10 group-hover:w-[4px] [transition:width_1s,box-shadow_1s] group-hover/parent:shadow-[0_0_50px_rgba(255,255,255,0.3)]`}
      >
        <div
          className="bg-white opacity-50"
          style={{
            height: `${scrollProgress * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
