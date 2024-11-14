import { useEffect, useRef } from "react";

export const useAnimateOnScreen = ({
  entranceRatio,
  unique,
  delay,
}: {
  entranceRatio: number;
  unique?: boolean;
  delay?: number;
}) => {
  const hiddenStyle = {
    opacity: "0",
    transform: "scale(0.97) translateY(10px)",
    transformOrigin: "top",
    filter: "blur(3px)",
  };
  const shownStyle = {
    opacity: "1",
    transform: "scale(1) translateY(0px)",
    filter: "blur(0px)",
  };

  const element = useRef<HTMLElement>(null);

  const hideElement = (element: HTMLElement) => {
    Object.assign(element.style, hiddenStyle);
  };

  const showElement = (element: HTMLElement) => {
    Object.assign(element.style, shownStyle);
  };

  useEffect(() => {
    if (!element.current) return;

    hideElement(element.current);

    element.current.style.transition =
      "opacity 1s cubic-bezier(0.5,0,0,1), transform 1s cubic-bezier(0.5,0,0,1), filter 1s cubic-bezier(0.5,0,0,1)";

    if (delay) {
      element.current.style.transitionDelay = `${delay}s, ${delay}s, ${delay}s`;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!element.current) return;

          if (
            !entry.isIntersecting &&
            entry.boundingClientRect.top > window.innerHeight * entranceRatio
          ) {
            hideElement(element.current);
          } else {
            showElement(element.current);
            if (unique) {
              observer.disconnect();
            }
          }
        });
      },
      {
        root: null,
        rootMargin: `-${(1 - entranceRatio) * 100}%`,
        threshold: 0,
      }
    );
    observer.observe(element.current);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return { element, hiddenStyle };
};
