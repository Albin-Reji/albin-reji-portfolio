"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import MarqueeTicker from "@/components/ui/MarqueeTicker";

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
  const imageInnerRef = useRef<HTMLDivElement>(null);

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

      // Continuous Scroll-linked Motion (per spec: image scale 1.08 -> 1.0, translateY 0 -> -4%, headline 0 -> -12%)
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
          if (imageInnerRef.current) {
            gsap.set(imageInnerRef.current, {
              scale: gsap.utils.interpolate(1.08, 1.0, progress),
              yPercent: -4 * progress,
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
      {/* ═══ Top Metadata Index Bar ═══ */}
      <div className="relative z-20 px-6 md:px-12 pt-28 md:pt-32 max-w-[1728px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/15 pb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A]">
          <div className="flex items-center gap-3 hero-fade">
            <span className="inline-block w-2 h-2 bg-[#D7FF00] animate-pulse" />
            <span className="text-[#F5F5F0]">EDITION // {new Date().getFullYear()}</span>
            <span className="text-[#8A8A8A]">/ FULL STACK ENGINEER</span>
          </div>
          <div className="flex items-center gap-6 hero-fade">
            <span>LOC: {personalInfo.location}</span>
            <span className="text-[#D7FF00] font-semibold">STATUS: AVAILABLE</span>
          </div>
        </div>
      </div>

      {/* ═══ Main Viewport Composition ═══ */}
      <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 max-w-[1728px] mx-auto w-full py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
          {/* Left: Oversized Typography (7 cols) */}
          <div ref={headlineRef} className="lg:col-span-7 relative z-10 space-y-6">
            <div>
              <div className="overflow-hidden">
                <p className="hero-text-line font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-[#D7FF00] mb-3">
                  // {personalInfo.title}
                </p>
              </div>

              <div className="overflow-hidden">
                <h1 className="hero-text-line text-[clamp(4rem,15vw,14rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[#F5F5F0]">
                  ALBIN
                </h1>
              </div>

              <div className="overflow-hidden">
                <h1 className="hero-text-line text-[clamp(4rem,15vw,14rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] text-[#F5F5F0]">
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

          {/* Right: Sticky/Anchored Portrait Media Container (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div
              ref={imageContainerRef}
              className="relative aspect-[3/4] max-h-[72vh] w-full overflow-hidden border border-[#F5F5F0]/15 bg-[#111111]"
            >
              <div ref={imageInnerRef} className="relative w-full h-full will-change-transform">
                <Image
                  src="/hero-portrait.jpg"
                  alt="Albin Reji — Full Stack Developer"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>

              {/* Editorial gradient and corner brackets */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-70 pointer-events-none" />
              <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#D7FF00] px-2 py-1 bg-[#050505]/80 border border-[#F5F5F0]/15">
                PORTRAIT // 01
              </div>

              <div className="absolute bottom-6 left-6 right-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#F5F5F0]/70 flex items-center justify-between">
                <span>JAVA &bull; SPRING &bull; REACT</span>
                <span className="text-[#D7FF00] font-bold">2025/2026</span>
              </div>
            </div>

            {/* Accent grid lines */}
            <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-[#D7FF00]/50 pointer-events-none" />
            <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-[#D7FF00]/50 pointer-events-none" />
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
