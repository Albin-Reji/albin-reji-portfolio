"use client";

import { useEffect, useRef } from "react";
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
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-4 border-b border-[#F5F5F0]/15 pb-3">
          <span className="text-[#D7FF00] font-bold">[STACK // 05]</span>
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
          <h2 className="stack-header-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#D7FF00]">
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
            className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#D7FF00]"
          />
        </div>
      </div>

      {/* ═══ Category Grid with Editorial Dividers ═══ */}
      <div className="stack-grid px-6 md:px-12 max-w-[1728px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {skillGroups.map((group, idx) => (
            <div
              key={group.category}
              className="stack-card border-t border-[#F5F5F0]/15 pt-6 space-y-6"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#D7FF00]">
                  // {group.category}
                </h3>
                <span className="font-mono text-[10px] text-[#8A8A8A]">
                  0{idx + 1}
                </span>
              </div>

              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group flex items-center justify-between py-2.5 border-b border-[#F5F5F0]/5 hover:border-[#D7FF00]/40 transition-colors cursor-default"
                  >
                    <span className="text-lg md:text-xl font-bold uppercase tracking-tight text-[#F5F5F0] group-hover:text-[#D7FF00] group-hover:translate-x-2 transition-all duration-300">
                      {item}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-[#D7FF00] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      READY
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
