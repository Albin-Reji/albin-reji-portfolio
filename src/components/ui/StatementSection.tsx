"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SVGSignature from "@/components/ui/SVGSignature";
import { architecturalPillars } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered masked line reveal
      gsap.fromTo(
        ".statement-line",
        { y: "110%", opacity: 0, skewY: 3 },
        {
          y: "0%",
          opacity: 1,
          skewY: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // Chapter badge fade
      gsap.fromTo(
        ".statement-meta",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Architectural pillars stagger entrance
      gsap.fromTo(
        ".pillar-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pillars-grid",
            start: "top 80%",
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
      className="relative py-24 md:py-40 px-6 md:px-12 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      <div
        ref={containerRef}
        className="max-w-[1728px] mx-auto flex flex-col justify-center min-h-[50vh]"
      >
        {/* Chapter marker metadata header */}
        <div className="statement-meta flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.25em] text-[#8A8A8A] mb-8 border-b border-[#F5F5F0]/15 pb-4">
          <div className="flex items-center gap-4">
            <span className="text-[#D7FF00] font-bold">[STATEMENT // 01]</span>
            <span className="hidden sm:inline">DISCIPLINE &amp; EXECUTION</span>
          </div>
          <span className="text-right text-[#B5B5B5]">PRECISION BACKEND SYSTEMS</span>
        </div>

        {/* Masked Headline Lines with 1:1 Responsive SVG Anchor */}
        <div className="space-y-1 md:space-y-2 relative">
          
          {/* Line 1: REDEFINING */}
          <div className="overflow-hidden">
            <h2 className="statement-line text-[clamp(2.5rem,7.5vw,8.5rem)] font-black uppercase tracking-[-0.05em] leading-[0.88] text-[#F5F5F0]">
              REDEFINING
            </h2>
          </div>

          {/* Line 2: SCALABILITY with anchored SVG underline loop */}
          <div className="overflow-visible relative">
            <h2 className="statement-line text-[clamp(2.5rem,7.5vw,8.5rem)] font-black uppercase tracking-[-0.05em] leading-[0.88] text-[#F5F5F0]">
              <span className="relative inline-block">
                SCALABILITY
                {/* 1:1 Ratio Anchored SVG Vector Loop */}
                <span
                  className="absolute -bottom-[22%] left-[-2%] w-[108%] pointer-events-none z-10 block"
                  aria-hidden="true"
                >
                  <SVGSignature delay={0.6} strokeWidth={4} />
                </span>
              </span>
            </h2>
          </div>

          {/* Line 3: THROUGH CODE. */}
          <div className="overflow-hidden pt-3 md:pt-5">
            <h2 className="statement-line text-[clamp(2.5rem,7.5vw,8.5rem)] font-black uppercase tracking-[-0.05em] leading-[0.88] text-[#D7FF00]">
              THROUGH CODE<span className="text-[#F5F5F0]">.</span>
            </h2>
          </div>

        </div>

        {/* Core Philosophy Architectural Pillars Grid */}
        <div className="mt-16 md:mt-24 space-y-6">
          <div className="statement-meta flex items-center justify-between border-b border-[#F5F5F0]/15 pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A]">
            <span className="text-[#D7FF00] font-bold">// ARCHITECTURAL PILLARS</span>
            <span>CORE ENGINEERING POLICIES</span>
          </div>

          <div className="pillars-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {architecturalPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="pillar-card border border-[#F5F5F0]/15 p-6 bg-[#050505]/90 hover:border-[#D7FF00] hover:bg-[#D7FF00]/[0.02] transition-all duration-300 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3 font-mono text-[10px] uppercase tracking-widest">
                    <span className="text-[#D7FF00] font-bold">
                      [PILLAR // {pillar.id}]
                    </span>
                    <span className="text-[#8A8A8A] group-hover:text-[#F5F5F0] transition-colors">
                      {pillar.tag.split("//")[0]?.trim()}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs md:text-sm text-[#B5B5B5] font-sans font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="border-t border-[#F5F5F0]/10 pt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#8A8A8A]">
                  <span>SPEC // MODULE</span>
                  <span className="text-[#D7FF00]">{pillar.techBadge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Annotation Strip */}
        <div className="statement-meta mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-[#F5F5F0]/15 font-mono text-xs text-[#8A8A8A]">
          <div className="md:col-span-6 space-y-1">
            <span className="text-[#D7FF00] block text-[10px] uppercase tracking-widest">
              SYSTEM MANDATE
            </span>
            <p className="text-sm md:text-base text-[#B5B5B5] font-sans font-light">
              High-throughput microservices, robust relational architectures, and real-time reactive user interfaces designed to never falter under scale.
            </p>
          </div>

          <div className="md:col-span-6 flex md:justify-end items-end gap-8 uppercase tracking-[0.2em] text-[11px]">
            <div>
              <span className="text-[#8A8A8A] block text-[10px]">STACK</span>
              <span className="text-[#F5F5F0]">JAVA / SPRING / REACT</span>
            </div>
            <div>
              <span className="text-[#8A8A8A] block text-[10px]">LATENCY</span>
              <span className="text-[#D7FF00] font-bold">&lt; 25MS TARGET</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
