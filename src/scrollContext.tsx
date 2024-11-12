import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context to store the scroll position
const ScrollContext = createContext<number>(0);

// Create a provider component
export const ScrollProvider = ({ children }: { children: any }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollY}>{children}</ScrollContext.Provider>
  );
};

// Custom hook to use the scroll position
export const useScroll = () => {
  return useContext(ScrollContext);
};
