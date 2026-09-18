"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillGroups } from "@/data/portfolio";
import MarqueeTicker from "@/components/ui/MarqueeTicker";

gsap.registerPlugin(ScrollTrigger);

const ALL_SKILLS_FLAT = [
  "JAVA 21",
  "SPRING BOOT 3",
  "REACT.JS",
  "NEXT.JS",
  "MICROSERVICES",
  "POSTGRESQL",
  "DOCKER",
  "KUBERNETES",
  "RABBITMQ",
  "SPRING SECURITY",
  "JWT",
  "REST APIS",
  "HIBERNATE",
  "PYTHON",
  "REDIS",
  "GIT",
  "JENKINS",
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header masked reveal
      gsap.fromTo(
        ".stack-header-line",
        { y: "115%", opacity: 0, skewY: 3 },
        {
          y: "0%",
          opacity: 1,
          skewY: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".stack-header-trigger",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Category cards stagger
      gsap.fromTo(
        ".stack-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".stack-grid",
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
      id="skills"
      className="py-14 md:py-20 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      {/* ═══ Section Heading ═══ */}
      <div className="stack-header-trigger px-6 md:px-12 max-w-[1728px] mx-auto mb-8 md:mb-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#777771] mb-4 border-b border-[#F5F5F0]/15 pb-3">
          <span className="text-[#DDFE67] font-bold">[STACK // 05]</span>
          <span>OFF TRACK // ARCHITECTURAL REPERTOIRE</span>
          <span className="flex-1" />
          <span>{skillGroups.length} CORE MODULES</span>
        </div>

        <div className="overflow-hidden">
          <h2 className="stack-header-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#F5F5F0]">
            TECHNICAL
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="stack-header-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#DDFE67]">
            ARSENAL<span className="text-[#F5F5F0]">.</span>
          </h2>
        </div>
      </div>

      {/* ═══ Dual Kinetic Marquee Ribbons ═══ */}
      <div className="space-y-2 mb-10 md:mb-12">
        <div className="py-3 border-t border-b border-[#F5F5F0]/10 bg-[#000000]">
          <MarqueeTicker
            items={ALL_SKILLS_FLAT}
            speed={50}
            separator="///"
            className="font-mono text-sm md:text-lg font-black uppercase tracking-[0.2em] text-[#F5F5F0]"
          />
        </div>
        <div className="py-3 border-t border-b border-[#F5F5F0]/10 bg-[#000000]">
          <MarqueeTicker
            items={[
              "SPRING CLOUD GATEWAY",
              "OAUTH2 / KEYCLOAK",
              "DISTRIBUTED CACHING",
              "EVENT-DRIVEN ARCHITECTURE",
              "CONTAINER ORCHESTRATION",
              "ASYNC MESSAGING",
              "JWT AUTHORIZATION",
              "RESTFUL API DESIGN",
            ]}
            speed={45}
            reverse
            separator="—"
            className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#DDFE67]"
          />
        </div>
      </div>

      {/* ═══ Category Grid with Curved Enclosure Cards ═══ */}
      <div className="stack-grid px-6 md:px-12 max-w-[1728px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {skillGroups.map((group, idx) => {
            const isDimmed = hoveredCategory !== null && hoveredCategory !== group.category;
            const isFocused = hoveredCategory === group.category;

            return (
              <div
                key={group.category}
                onMouseEnter={() => setHoveredCategory(group.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`stack-card spotlight-card rounded-[2rem] sm:rounded-[2.25rem] border border-[#F5F5F0]/15 bg-[#000000] p-6 sm:p-8 flex flex-col justify-between transition-all duration-400 relative overflow-hidden group hover:border-[#DDFE67]/50 hover:shadow-[0_0_40px_rgba(221,254,103,0.06)] ${
                  isDimmed ? "opacity-35" : isFocused ? "opacity-100 border-[#DDFE67]/70" : "opacity-90"
                }`}
              >
                {/* Ambient Radial Glow */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#DDFE67]/[0.03] rounded-full blur-3xl pointer-events-none group-hover:bg-[#DDFE67]/[0.06] transition-all duration-500" />

                <div>
                  <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-4 mb-5">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#DDFE67]">
                      // {group.category}
                    </h3>
                    <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#F5F5F0]/15 text-[#8A8A8A] group-hover:text-[#DDFE67] group-hover:border-[#DDFE67]/40 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="group/item flex items-center justify-between py-2.5 border-b border-[#F5F5F0]/5 hover:border-[#DDFE67]/30 transition-colors cursor-default"
                      >
                        <span className="text-lg md:text-xl font-bold uppercase tracking-tight text-[#F5F5F0] group-hover/item:text-[#DDFE67] group-hover/item:translate-x-2 transition-all duration-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
