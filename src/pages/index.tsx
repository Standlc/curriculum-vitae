import { ScrollProvider } from "@/scrollContext";
import Home from "@/components/home";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Background from "@/components/Background";

export default function Index() {
  return (
    <ScrollProvider>
      <div className="w-[600px] m-auto">
        <Home />
        <Background />
        <Projects />
        <Contact />
      </div>
    </ScrollProvider>
  );
}
