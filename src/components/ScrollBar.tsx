import { useEffect, useRef, useState } from "react";
import Burger from "./Burger";

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
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollBar, setShowScrollBar] = useState(false);
  const animationFrameId = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      if (document.body.offsetWidth <= 800) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setShow(false);
        setIsClosing(false);
      }
    };

    const observer = new ResizeObserver(handler);
    observer.observe(document.body);

    return () => {
      observer.disconnect();
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

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
  }, [isMobile]);

  const handleClick = () => {
    if (isClosing) return;

    if (show) {
      setIsClosing(true);

      if (divRef.current && containerRef.current) {
        divRef.current.style.animation = "undefined";
        containerRef.current.style.animation = "undefined";

        animationFrameId.current = requestAnimationFrame(() => {
          if (!divRef.current || !containerRef.current) return;

          divRef.current.style.animation =
            "fade-in-right 0.5s cubic-bezier(0.5,0,0,1) reverse both";
          containerRef.current.style.animation =
            "menu-fade-in 0.5s cubic-bezier(0.5,0,0,1) reverse both";
        });
      }
    } else {
      document.body.style.setProperty("overflow", "hidden");
      document.body.style.setProperty("touch-action", "none");
      setIsClosing(false);
      setShow(true);
    }
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-[30px] right-[30px] z-50">
          <Burger onClick={handleClick} isOpen={show && !isClosing} />
        </div>
      )}

      {(!isMobile || show) && (
        <div
          ref={containerRef}
          onClick={isMobile ? handleClick : undefined}
          className={
            isMobile
              ? "[background:linear-gradient(to_left,var(--background),transparent)] animate-menu-fade-in w-full left-0 fixed top-0 h-full z-40 py-[20vh] flex items-center justify-end px-10"
              : `${
                  showScrollBar ? "opacity-100" : "opacity-0"
                } hover:opacity-100 fixed top-0 h-full z-10 py-[30vh] pointer-events-none px-10 w-full flex justify-end [transition:opacity_1s_cubic-bezier(0.5,0,0,1)]`
          }
        >
          <div
            ref={divRef}
            className={`${
              isMobile ? `animate-fade-in-right` : ""
            } w-min h-full flex flex-col items-end gap-1 group hover:opacity-100 [transition:opacity_1s,transform_1s_cubic-bezier(0.5,0,0,1)] cursor-pointer pointer-events-auto`}
            onAnimationEnd={() => {
              if (isClosing) {
                setShow(false);
                setIsClosing(false);
                document.body.style.removeProperty("overflow");
                document.body.style.removeProperty("touch-action");
              }
            }}
          >
            <SectionProgress id="home" />
            <SectionProgress id="background" />
            <SectionProgress id="projects" />
            <SectionProgress id="contact" />
          </div>
        </div>
      )}
    </>
  );
}

const SectionProgress = ({ id }: { id: string }) => {
  const { scrollProgress, isCurrent, sectionHeight } = useScrollProgress(id);
  const containerClassname = !isCurrent ? "opacity-50" : "opacity-100";

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
      className={`${containerClassname} group/parent hover:opacity-100 [transition:opacity_0.6s] flex gap-5 items-center justify-end`}
    >
      <div
        className={`phone:opacity-0 phone:group-hover:opacity-100 group-hover/parent:opacity-100 phone:group-hover:translate-x-0 translate-x-[6px] flex items-center font-mono mt-auto capitalize h-full text-xs font-semibold [transition:opacity_0.6s,transform_0.6s]`}
      >
        {id}
      </div>
      <div
        className={`bg-white w-[5px] rounded-sm overflow-hidden h-full bg-opacity-10 phone:group-hover:scale-x-100 phone:scale-x-50 origin-right [transition:transform_0.6s]`}
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
