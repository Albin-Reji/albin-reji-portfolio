"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header masked reveal
      gsap.fromTo(
        ".exp-header-line",
        { y: "115%", opacity: 0, skewY: 3 },
        {
          y: "0%",
          opacity: 1,
          skewY: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".exp-header-trigger",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Progressive vertical line draw scaleY(0 -> 1)
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".exp-timeline-container",
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
            },
          }
        );
      }

      // Experience entries staggered reveal
      document.querySelectorAll(".exp-timeline-entry").forEach((entry) => {
        gsap.fromTo(
          entry.querySelectorAll(".exp-item-fade"),
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-14 md:py-20 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      {/* ═══ Section Heading ═══ */}
      <div className="exp-header-trigger px-6 md:px-12 max-w-[1728px] mx-auto mb-8 md:mb-12">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-4 border-b border-[#F5F5F0]/15 pb-3">
          <span className="text-[#D7FF00] font-bold">[TRACK // 04]</span>
          <span>PROFESSIONAL TIMELINE</span>
          <span className="flex-1" />
          <span>PRODUCTION BACKGROUND</span>
        </div>

        <div className="overflow-hidden">
          <h2 className="exp-header-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#F5F5F0]">
            ENGINEERING
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="exp-header-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#D7FF00]">
            LOG<span className="text-[#F5F5F0]">.</span>
          </h2>
        </div>
      </div>

      {/* ═══ Timeline Container with progressive vertical line ═══ */}
      <div className="exp-timeline-container px-6 md:px-12 max-w-[1728px] mx-auto relative">
        {/* Progressive vertical line (desktop) */}
        <div
          ref={timelineLineRef}
          className="hidden md:block absolute left-[33.333%] top-0 bottom-0 w-px bg-[#D7FF00] origin-top pointer-events-none"
          aria-hidden="true"
        />

        <div className="space-y-10 md:space-y-14">
          {experiences.map((exp, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            return (
              <div
                key={`${exp.company}-${exp.duration}`}
                className="exp-timeline-entry grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start relative"
              >
                {/* Left: Duration, Company, Location (4 cols) */}
                <div className="md:col-span-4 space-y-3 md:text-right md:pr-12">
                  <span className="exp-item-fade font-mono text-xs font-bold text-[#D7FF00] tracking-[0.25em] block">
                    {exp.duration}
                  </span>
                  <div className="exp-item-fade space-y-1">
                    <p className="font-mono text-base uppercase tracking-wider text-[#F5F5F0] font-bold">
                      {exp.company}
                    </p>
                    {exp.location && (
                      <p className="font-mono text-xs uppercase tracking-wider text-[#8A8A8A]">
                        {exp.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Role, Responsibilities, Tech (8 cols) */}
                <div className="md:col-span-8 space-y-6 md:pl-12 border-t md:border-t-0 border-[#F5F5F0]/15 pt-6 md:pt-0">
                  <div className="exp-item-fade space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#D7FF00] font-bold">
                        // 0{num}
                      </span>
                      <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold uppercase tracking-tight text-[#F5F5F0]">
                        {exp.role}
                      </h3>
                    </div>

                    {exp.project && (
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#D7FF00]">
                        INITIATIVE // {exp.project}
                      </p>
                    )}
                  </div>

                  <ul className="exp-item-fade space-y-3 font-light text-sm md:text-base text-[#B5B5B5]">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li
                        key={rIdx}
                        className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[#D7FF00] leading-relaxed"
                      >
                        {resp}
                      </li>
                    ))}
                  </ul>

                  <div className="exp-item-fade pt-2 flex flex-wrap gap-2">
                    {exp.techTags.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] uppercase tracking-wider border border-[#F5F5F0]/15 px-3 py-1 text-[#8A8A8A] hover:border-[#D7FF00] hover:text-[#D7FF00] transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
