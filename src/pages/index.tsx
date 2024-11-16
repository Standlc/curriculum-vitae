import Home from "@/components/home";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Background from "@/components/Background";
import ScrollBar from "@/components/ScrollBar";

export default function Index() {
  return (
    <div className="w-full">
      <div className="w-full px-10 max-w-[600px] m-auto flex flex-col items-center">
        <ScrollBar />
        <Home />
        <Background />
        <Projects />
        <Contact />
      </div>
      <div className="bg-gradient-to-b from-[var(--background)] pointer-events-none to-transparent z-20 fixed top-0 left-0 w-full h-[100px]"></div>
      <div className="bg-gradient-to-t from-[var(--background)] pointer-events-none to-transparent z-20 fixed bottom-0 left-0 w-full h-[100px]"></div>
    </div>
  );
}
