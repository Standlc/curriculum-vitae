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
  const menuCloseTimeoutId = useRef<NodeJS.Timeout>();
  const menuRef = useRef<HTMLDivElement>(null);
  const containerClassName = showScrollBar ? "opacity-100" : "opacity-0";

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

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

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
      clearTimeout(menuCloseTimeoutId.current);
    };
  }, [isMobile]);

  const handleClick = () => {
    if (menuCloseTimeoutId.current !== undefined) {
      return;
    }

    if (show) {
      if (menuRef.current) {
        menuRef.current.style.opacity = "0";
      }

      setShow(false);
      setIsClosing(true);

      menuCloseTimeoutId.current = setTimeout(() => {
        setIsClosing(false);
        menuCloseTimeoutId.current = undefined;
      }, 500);

      document.body.style.removeProperty("overflow");
    } else {
      setShow(true);
      document.body.style.overflow = "hidden";
    }
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-[30px] right-[30px] z-50">
          <Burger onClick={handleClick} isOpen={show} />
        </div>
      )}

      {(!isMobile || show || isClosing) && (
        <div
          onClick={isMobile ? handleClick : undefined}
          ref={menuRef}
          className={
            isMobile
              ? "w-full left-0 fixed top-0 backdrop-blur-[50px] h-full z-40 bg-[rgba(0,0,0,0.4)] py-[20vh] flex items-center justify-center animate-menu-fade-in [transition:opacity_0.5s_cubic-bezier(0.5,0,0,1)]"
              : `fixed top-0 h-full z-10 py-[30vh] pointer-events-none px-10 w-full flex justify-end`
          }
        >
          <div
            className={`${
              !isMobile ? containerClassName : "animate-fade-in"
            } w-min h-full flex flex-col items-end gap-1 group hover:opacity-100 [transition:opacity_1s] cursor-pointer pointer-events-auto`}
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
      className={`${containerClassname} group/parent hover:opacity-100 [transition:opacity_1s] flex gap-5 items-center justify-end`}
    >
      <div
        className={`phone:opacity-0 group-hover:opacity-100 group-hover/parent:opacity-100 phone:group-hover:translate-x-0 translate-x-[6px] flex items-center font-mono mt-auto capitalize h-full phone:text-xs font-semibold [transition:opacity_1s,transform_1s]`}
      >
        {id}
      </div>
      <div
        className={`bg-white w-[5px] h-full bg-opacity-10 phone:group-hover:scale-x-100 phone:scale-x-50 origin-right [transition:transform_1s,box-shadow_1s] group-hover/parent:shadow-[0_0_50px_rgba(255,255,255,0.4)]`}
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
