import Hero from "@/components/sections/Hero";
import StatementSection from "@/components/ui/StatementSection";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import EngineeringNotes from "@/components/sections/EngineeringNotes";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <StatementSection />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <EngineeringNotes />
      <Certifications />
      <Contact />
    </>
  );
}
