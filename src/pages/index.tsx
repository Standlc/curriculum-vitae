import Home from "@/components/home";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Background from "@/components/Background";
import ScrollBar from "@/components/ScrollBar";

export default function Index() {
  return (
    <div className="w-full px-10 phone:w-[640px] m-auto">
      <ScrollBar />
      <Home />
      <Background />
      <Projects />
      <Contact />
    </div>
  );
}
