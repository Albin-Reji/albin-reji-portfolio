"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { aboutText, coreTechnologies, education } from "@/data/portfolio";
import MarqueeTicker from "@/components/ui/MarqueeTicker";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading masked reveal
      gsap.fromTo(
        ".about-title-line",
        { y: "115%", opacity: 0, skewY: 3 },
        {
          y: "0%",
          opacity: 1,
          skewY: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-heading-trigger",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Workflow pipeline container fade in
      gsap.fromTo(
        ".about-pipeline-container",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-pipeline-container",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Content blocks stagger
      gsap.fromTo(
        ".about-content-fade",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-content-trigger",
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 md:py-32 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      {/* ═══ Terminal Status Bar & Section Heading ═══ */}
      <div className="about-heading-trigger px-6 md:px-12 max-w-[1728px] mx-auto mb-10 md:mb-14">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between font-mono text-xs text-[#8A8A8A] mb-8 pb-4 border-b border-[#F5F5F0]/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] block" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8A8A8A]">&gt;_</span>
              <span className="text-[#F5F5F0] font-medium">albin@process-mesh:~</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8A8A8A]">
              {"SYSTEM // "}<span className="text-[#F5F5F0] font-bold">ALBIN REJI</span>
            </span>
            <div className="w-6 h-6 rounded-full border border-[#F5F5F0]/20 flex items-center justify-center font-bold text-[10px] text-[#F5F5F0]">
              N
            </div>
          </div>
        </div>

        {/* Large Statement Title */}
        <div className="overflow-hidden">
          <h2 className="about-title-line text-[clamp(2.5rem,7vw,7.2rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-[#F5F5F0]">
            I DON&apos;T JUST WRITE CODE.
          </h2>
        </div>
        <div className="overflow-hidden mt-1">
          <h2 className="about-title-line text-[clamp(2.5rem,7vw,7.2rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-[#F5F5F0]">
            I DESIGN <span className="text-[#D7FF00]">SYSTEMS.</span>
          </h2>
        </div>

        {/* Page Indicator Tag */}
        <div className="mt-8 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-[#8A8A8A]">
          <span className="text-[#8A8A8A]">ABOUT</span>
          <span className="text-[#D7FF00] font-bold">{"//"}</span>
          <span className="text-[#F5F5F0] font-semibold">ENGINEERING PHILOSOPHY</span>
        </div>
      </div>

      {/* ═══ Engineering Philosophy Manifesto ═══ */}
      <div className="about-pipeline-container px-6 md:px-12 max-w-[1728px] mx-auto mb-20 md:mb-32">
        <div className="relative overflow-hidden rounded-xl border border-[#F5F5F0]/15 bg-[#000000] p-6 sm:p-10 md:p-14 lg:p-16 shadow-2xl transition-all duration-500 hover:border-[#D7FF00]/30 group">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#D7FF00]/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#D7FF00]/[0.02] rounded-full blur-3xl pointer-events-none" />

          {/* Precision Corner Crosshair Accents */}
          <div className="absolute top-3 left-3 font-mono text-[10px] text-[#8A8A8A]/30 select-none pointer-events-none">
            +
          </div>
          <div className="absolute top-3 right-3 font-mono text-[10px] text-[#8A8A8A]/30 select-none pointer-events-none">
            +
          </div>
          <div className="absolute bottom-3 left-3 font-mono text-[10px] text-[#8A8A8A]/30 select-none pointer-events-none">
            +
          </div>
          <div className="absolute bottom-3 right-3 font-mono text-[10px] text-[#8A8A8A]/30 select-none pointer-events-none">
            +
          </div>

          {/* Main Philosophical Quote Block with Indented Attribution */}
          <div className="relative">
            {/* Watermark Quote Symbol */}
            <span
              className="text-[#D7FF00]/10 font-serif text-7xl sm:text-8xl md:text-9xl leading-none absolute -top-8 sm:-top-10 -left-3 sm:-left-6 select-none pointer-events-none font-black"
              aria-hidden="true"
            >
              “
            </span>

            <blockquote className="relative z-10 pl-2 sm:pl-4 md:pl-6 space-y-4 sm:space-y-6">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-[1.85rem] xl:text-[2.1rem] text-[#F5F5F0] font-light leading-relaxed sm:leading-relaxed md:leading-[1.4] tracking-tight">
                &ldquo;Great engineering isn&apos;t just about syntax or shipping features on a deadline—it&apos;s about{" "}
                <span className="text-[#F5F5F0] font-normal">anticipating failure</span>,{" "}
                <span className="text-[#D7FF00] font-semibold">engineering for scale</span>, and building{" "}
                <span className="text-[#F5F5F0] font-normal">resilient architectures</span> that outlast tech stacks. Every line of code is a commitment to{" "}
                <span className="text-[#D7FF00] font-semibold">performance</span>,{" "}
                <span className="text-[#F5F5F0] font-normal">clarity</span>, and{" "}
                <span className="text-[#F5F5F0] font-normal">maintainability</span>, transforming complex business logic into seamless, high-velocity digital ecosystems.&rdquo;
              </p>
              <div className="pl-6 sm:pl-12 md:pl-20 lg:pl-88">
                <span className="font-mono text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#D7FF00] block">
                  — A developer who just successfully explained their bug to a rubber duck
                </span>
              </div>
            </blockquote>
          </div>
        </div>
      </div>

      {/* ═══ Narrative Story & Core Stack ═══ */}
      <div className="about-content-trigger px-6 md:px-12 max-w-[1728px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="about-content-fade space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#D7FF00] block">
                {"// ENGINEERING NARRATIVE"}
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl text-[#F5F5F0] font-light leading-snug tracking-tight">
                {aboutText}
              </p>
            </div>

            {/* Core Stack 8-box Matrix */}
            <div className="about-content-fade border-t border-[#F5F5F0]/15 pt-8">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-5">
                <span>CORE TECHNOLOGICAL ANCHORS</span>
                <span>8 PILLARS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {coreTechnologies.map((tech, idx) => (
                  <div
                    key={tech}
                    className="group border border-[#F5F5F0]/15 p-4 bg-[#F5F5F0]/[0.02] hover:border-[#D7FF00] hover:bg-[#D7FF00]/5 transition-all cursor-default"
                  >
                    <span className="block font-mono text-[9px] text-[#8A8A8A] group-hover:text-[#D7FF00] mb-1 transition-colors">
                      0{idx + 1}
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Architecture & Credential Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="about-content-fade border border-[#F5F5F0]/15 p-6 md:p-8 bg-[#050505] space-y-6">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/15 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D7FF00] font-bold">
                  {"EDUCATION // CREDENTIAL"}
                </span>
                <span className="font-mono text-[10px] text-[#8A8A8A]">MITE</span>
              </div>

              <div>
                <p className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[#F5F5F0] leading-snug">
                  {education.degree}
                </p>
                <p className="mt-2 font-mono text-xs uppercase text-[#8A8A8A]">
                  {education.institution}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-[#F5F5F0]/15 py-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8A8A] block">PERIOD</span>
                  <span className="text-[#F5F5F0] font-medium uppercase">{education.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8A8A] block">LOCATION</span>
                  <span className="text-[#F5F5F0] font-medium uppercase">{education.location}</span>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8A8A] block">
                  TECHNICAL FOCUS
                </span>
                <p className="font-mono text-sm font-bold uppercase text-[#D7FF00]">
                  Full-Stack Architecture &amp; High-Throughput Microservices
                </p>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="about-content-fade border border-[#F5F5F0]/15 p-5 bg-[#F5F5F0]/[0.02] flex items-center justify-between hover:border-[#D7FF00] transition-colors group">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] font-bold">
                  LOOKING FOR A BACKEND / FULL STACK DEV?
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]">
                  Open to exciting engineering challenges
                </p>
              </div>
              <a
                href="#contact"
                className="p-3 border border-[#F5F5F0]/15 text-[#F5F5F0] group-hover:border-[#D7FF00] group-hover:text-[#D7FF00] transition-colors"
                aria-label="Contact"
              >
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Capabilities Marquee Ticker ═══ */}
      <div className="mt-24 md:mt-36 border-t border-b border-[#F5F5F0]/15 py-3.5 bg-[#050505]/70 backdrop-blur-md">
        <MarqueeTicker
          items={[
            "BACKEND ARCHITECTURE",
            "MICROSERVICES",
            "HIGH-CONCURRENCY APIS",
            "REACT WEB APPS",
            "POSTGRESQL TUNING",
            "DOCKER / K8S CLUSTERS",
            "SPRING SECURITY JWT",
          ]}
          speed={42}
          reverse
          separator="•"
          className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#F5F5F0]/30"
        />
      </div>
    </section>
  );
}
