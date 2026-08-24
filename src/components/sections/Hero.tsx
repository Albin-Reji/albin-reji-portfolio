"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import MarqueeTicker from "@/components/ui/MarqueeTicker";

const Lanyard = dynamic(() => import("@/components/ui/Lanyard"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  "JAVA",
  "SPRING BOOT",
  "REACT",
  "MICROSERVICES",
  "POSTGRESQL",
  "DOCKER",
  "KUBERNETES",
  "REST APIs",
  "DISTRIBUTED SYSTEMS",
  "SPRING SECURITY",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial Entrance Choreography
      tl.fromTo(
        ".hero-text-line",
        { y: "115%", opacity: 0, skewY: 4 },
        { y: "0%", opacity: 1, skewY: 0, duration: 1.2, stagger: 0.12 },
        0.2
      );

      tl.fromTo(
        imageContainerRef.current,
        { clipPath: "inset(100% 0 0 0)", opacity: 0 },
        { clipPath: "inset(0% 0 0 0)", opacity: 1, duration: 1.4, ease: "power4.out" },
        0.5
      );

      tl.fromTo(
        ".hero-fade",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
        0.9
      );

      // Continuous Scroll-linked Motion
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (headlineRef.current) {
            gsap.set(headlineRef.current, {
              yPercent: -12 * progress,
              opacity: gsap.utils.interpolate(1, 0.85, progress),
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#050505] border-b border-[#F5F5F0]/15"
    >
      {/* ═══ Main Viewport Composition (Tighter top spacing closer to navbar) ═══ */}
      <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 max-w-[1728px] mx-auto w-full pt-14 sm:pt-16 lg:pt-16 pb-6 sm:pb-8 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">

          {/* Left Column: Oversized Typography & CTAs (Natural flow, 7 cols on Desktop) */}
          <div
            ref={headlineRef}
            className="lg:col-span-7 space-y-6 max-w-2xl lg:max-w-none"
          >
            <div>
              <div className="overflow-hidden">
                <p className="hero-text-line font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-[#D7FF00] mb-3">
                  {"// "}{personalInfo.title}
                </p>
              </div>

              <div className="overflow-hidden">
                <h1 className="hero-text-line text-[clamp(3.75rem,13vw,13.5rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[#F5F5F0]">
                  ALBIN
                </h1>
              </div>

              <div className="overflow-hidden">
                <h1 className="hero-text-line text-[clamp(3.75rem,13vw,13.5rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[#F5F5F0]">
                  REJI<span className="text-[#D7FF00]">.</span>
                </h1>
              </div>
            </div>

            {/* Tagline narrative */}
            <div className="max-w-xl hero-fade">
              <p className="text-base md:text-xl text-[#B5B5B5] leading-relaxed font-light">
                {personalInfo.tagline}
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4 hero-fade">
              <a
                href="#projects"
                className="btn-editorial bg-[#D7FF00] text-[#050505] font-bold border-[#D7FF00] hover:bg-[#F5F5F0] hover:text-[#050505] transition-colors"
              >
                <span>EXPLORE WORK</span>
                <ArrowDown size={14} className="arrow" />
              </a>
              <a href="#contact" className="btn-editorial">
                <span>GET IN TOUCH</span>
                <ArrowUpRight size={14} className="arrow" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive 3D Lanyard Badge (5 cols on Desktop, stacked cleanly below CTAs on Mobile) */}
          <div
            ref={imageContainerRef}
            className="lg:col-span-5 relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-none h-[440px] sm:h-[520px] lg:h-[620px] mx-auto flex items-center justify-center mt-4 lg:mt-0"
          >
            <div className="relative w-full h-full">
              <Lanyard
                position={[0, 0, 18]}
                gravity={[0, -40, 0]}
                fov={20}
                transparent={true}
                frontImage="/albin-reji_photo_fianal.png"
                cardScale={4.25}
                lanyardWidth={1.3}
                cardBgColor="#D4ff45"
              />
            </div>

            {/* Accent Editorial Grid Brackets (Desktop) */}
            <div className="hidden lg:block absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-[#D7FF00]/50 pointer-events-none" />
            <div className="hidden lg:block absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-[#D7FF00]/50 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* ═══ Kinetic Infinite Tech Marquee ═══ */}
      <div className="relative z-20 border-t border-b border-[#F5F5F0]/15 py-3.5 bg-[#050505]">
        <MarqueeTicker
          items={MARQUEE_ITEMS}
          speed={48}
          separator="—"
          className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#F5F5F0]/40"
        />
      </div>
    </section>
  );
}
