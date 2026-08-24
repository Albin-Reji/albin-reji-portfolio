"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { aboutText, coreTechnologies, education } from "@/data/portfolio";
import MarqueeTicker from "@/components/ui/MarqueeTicker";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState<string>("03");

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
      className="py-20 md:py-32 bg-[#050505] border-b border-[#F5F5F0]/15 overflow-hidden"
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
          <span className="text-[#F5F5F0] font-semibold">ENGINEERING WORKFLOW</span>
        </div>
      </div>

      {/* ═══ Visual Build Pipeline & Current Process Dashboard ═══ */}
      <div className="about-pipeline-container px-6 md:px-12 max-w-[1728px] mx-auto mb-20 md:mb-32">
        <div className="border border-[#F5F5F0]/15 bg-[#000000] rounded-xl p-5 sm:p-7 lg:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* ─── Left Column: 6-Box Build Pipeline Loop (8 Cols) ─── */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
              
              {/* TOP ROW: 01 UNDERSTAND -> 02 ARCHITECT -> 03 DEVELOP */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                
                {/* Box 01: UNDERSTAND */}
                <div
                  onClick={() => setActiveStep("01")}
                  className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all duration-300 min-h-[145px] flex flex-col justify-between cursor-pointer ${
                    activeStep === "01"
                      ? "border-2 border-[#D7FF00] bg-[#D7FF00]/[0.03] shadow-[0_0_24px_rgba(215,255,0,0.12)]"
                      : "border-[#F5F5F0]/15 bg-[#080808] hover:border-[#F5F5F0]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`font-mono text-xl sm:text-2xl font-black ${
                      activeStep === "01" ? "text-[#D7FF00]" : "text-[#8A8A8A]"
                    }`}>
                      01
                    </span>
                    {/* Magnifying Glass Window Icon */}
                    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className={activeStep === "01" ? "text-[#D7FF00]" : "text-[#8A8A8A]"}>
                      <rect x="2" y="2" width="36" height="36" rx="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="2" y1="12" x2="38" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                      <circle cx="8" cy="7" r="1.5" fill="currentColor" fillOpacity="0.4" />
                      <circle cx="13" cy="7" r="1.5" fill="currentColor" fillOpacity="0.4" />
                      <circle cx="20" cy="23" r="6" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="24.5" y1="27.5" x2="30" y2="33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F5F0]">
                      UNDERSTAND
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8A8A8A] font-light mt-0.5">
                      Define the problem
                    </p>
                  </div>
                </div>

                {/* Horizontal Arrow */}
                <span className="text-[#8A8A8A] font-mono text-base sm:text-lg select-none shrink-0 px-1">
                  →
                </span>

                {/* Box 02: ARCHITECT */}
                <div
                  onClick={() => setActiveStep("02")}
                  className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all duration-300 min-h-[145px] flex flex-col justify-between cursor-pointer ${
                    activeStep === "02"
                      ? "border-2 border-[#D7FF00] bg-[#D7FF00]/[0.03] shadow-[0_0_24px_rgba(215,255,0,0.12)]"
                      : "border-[#F5F5F0]/15 bg-[#080808] hover:border-[#F5F5F0]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`font-mono text-xl sm:text-2xl font-black ${
                      activeStep === "02" ? "text-[#D7FF00]" : "text-[#8A8A8A]"
                    }`}>
                      02
                    </span>
                    {/* Structural Chart Window Icon */}
                    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className={activeStep === "02" ? "text-[#D7FF00]" : "text-[#8A8A8A]"}>
                      <rect x="2" y="2" width="36" height="36" rx="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="2" y1="12" x2="38" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                      <circle cx="8" cy="7" r="1.5" fill="currentColor" fillOpacity="0.4" />
                      <circle cx="13" cy="7" r="1.5" fill="currentColor" fillOpacity="0.4" />
                      <rect x="15" y="16" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M20 21V25 M11 25H29 M11 25V28 M29 25V28" stroke="currentColor" strokeWidth="1.2" />
                      <rect x="7" y="28" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                      <rect x="25" y="28" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F5F0]">
                      ARCHITECT
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8A8A8A] font-light mt-0.5">
                      Design the system
                    </p>
                  </div>
                </div>

                {/* Horizontal Arrow */}
                <span className="text-[#8A8A8A] font-mono text-base sm:text-lg select-none shrink-0 px-1">
                  →
                </span>

                {/* Box 03: DEVELOP (Highlighted Neon Green) */}
                <div
                  onClick={() => setActiveStep("03")}
                  className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all duration-300 min-h-[145px] flex flex-col justify-between cursor-pointer ${
                    activeStep === "03"
                      ? "border-2 border-[#D7FF00] bg-[#D7FF00]/[0.03] shadow-[0_0_24px_rgba(215,255,0,0.12)]"
                      : "border-[#F5F5F0]/15 bg-[#080808] hover:border-[#F5F5F0]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#D7FF00]">
                      03
                    </span>
                    {/* Code Snippet </> Window Icon */}
                    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className="text-[#D7FF00]">
                      <rect x="2" y="2" width="36" height="36" rx="6" stroke="#D7FF00" strokeWidth="1.5" strokeOpacity="0.8" />
                      <line x1="2" y1="12" x2="38" y2="12" stroke="#D7FF00" strokeWidth="1" strokeOpacity="0.5" />
                      <rect x="24" y="5" width="10" height="4" rx="1" fill="#D7FF00" fillOpacity="0.3" />
                      <path d="M15 20L10 24.5L15 29 M25 20L30 24.5L25 29 M22 17L18 32" stroke="#D7FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F5F0]">
                      DEVELOP
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8A8A8A] font-light mt-0.5">
                      Implement the idea
                    </p>
                  </div>
                </div>

              </div>

              {/* VERTICAL TRANSITION ARROW (UNDER BOX 03) */}
              <div className="flex justify-end pr-8 sm:pr-14 md:pr-16 text-[#8A8A8A] font-mono text-base sm:text-lg select-none py-0.5">
                <span>↓</span>
              </div>

              {/* BOTTOM ROW: 06 ITERATE <- 05 MEASURE <- 04 SHIP */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                
                {/* Box 06: ITERATE */}
                <div
                  onClick={() => setActiveStep("05")}
                  className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all duration-300 min-h-[145px] flex flex-col justify-between cursor-pointer ${
                    activeStep === "06"
                      ? "border-2 border-[#D7FF00] bg-[#D7FF00]/[0.03] shadow-[0_0_24px_rgba(215,255,0,0.12)]"
                      : "border-[#F5F5F0]/15 bg-[#080808] hover:border-[#F5F5F0]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`font-mono text-xl sm:text-2xl font-black ${
                      activeStep === "06" ? "text-[#D7FF00]" : "text-[#8A8A8A]"
                    }`}>
                      06
                    </span>
                    {/* Reticle Circular Sync Icon */}
                    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className={activeStep === "06" ? "text-[#D7FF00]" : "text-[#8A8A8A]"}>
                      <path d="M6 12V6H12 M28 6H34V12 M34 28V34H28 M12 34H6V28" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
                      <path d="M14 20C14 16.7 16.7 14 20 14C22.6 14 24.8 15.6 25.6 18 M26 14V18H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M26 20C26 23.3 23.3 26 20 26C17.4 26 15.2 24.4 14.4 22 M14 26V22H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F5F0]">
                      ITERATE
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8A8A8A] font-light mt-0.5">
                      Improve with data
                    </p>
                  </div>
                </div>

                {/* Leftward Arrow */}
                <span className="text-[#8A8A8A] font-mono text-base sm:text-lg select-none shrink-0 px-1">
                  ←
                </span>

                {/* Box 05: MEASURE */}
                <div
                  onClick={() => setActiveStep("05")}
                  className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all duration-300 min-h-[145px] flex flex-col justify-between cursor-pointer ${
                    activeStep === "05"
                      ? "border-2 border-[#D7FF00] bg-[#D7FF00]/[0.03] shadow-[0_0_24px_rgba(215,255,0,0.12)]"
                      : "border-[#F5F5F0]/15 bg-[#080808] hover:border-[#F5F5F0]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`font-mono text-xl sm:text-2xl font-black ${
                      activeStep === "05" ? "text-[#D7FF00]" : "text-[#8A8A8A]"
                    }`}>
                      05
                    </span>
                    {/* Analytics Bar Graph Window Icon */}
                    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className={activeStep === "05" ? "text-[#D7FF00]" : "text-[#8A8A8A]"}>
                      <rect x="2" y="2" width="36" height="36" rx="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="2" y1="12" x2="38" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                      <circle cx="8" cy="7" r="1.5" fill="currentColor" fillOpacity="0.4" />
                      <circle cx="13" cy="7" r="1.5" fill="currentColor" fillOpacity="0.4" />
                      <rect x="9" y="27" width="3.5" height="5" rx="0.5" fill="currentColor" fillOpacity="0.5" />
                      <rect x="15" y="23" width="3.5" height="9" rx="0.5" fill="currentColor" fillOpacity="0.7" />
                      <rect x="21" y="19" width="3.5" height="13" rx="0.5" fill="currentColor" fillOpacity="0.9" />
                      <rect x="27" y="15" width="3.5" height="17" rx="0.5" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F5F0]">
                      MEASURE
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8A8A8A] font-light mt-0.5">
                      Observe real usage
                    </p>
                  </div>
                </div>

                {/* Leftward Arrow */}
                <span className="text-[#8A8A8A] font-mono text-base sm:text-lg select-none shrink-0 px-1">
                  ←
                </span>

                {/* Box 04: SHIP (Highlighted Neon Green) */}
                <div
                  onClick={() => setActiveStep("04")}
                  className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all duration-300 min-h-[145px] flex flex-col justify-between cursor-pointer ${
                    activeStep === "04"
                      ? "border-2 border-[#D7FF00] bg-[#D7FF00]/[0.03] shadow-[0_0_24px_rgba(215,255,0,0.12)]"
                      : "border-[#F5F5F0]/15 bg-[#080808] hover:border-[#F5F5F0]/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#D7FF00]">
                      04
                    </span>
                    {/* Cloud Deploy & Server Discs Icon */}
                    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className="text-[#D7FF00]">
                      <path d="M20 19V9 M16 13L20 9L24 13" stroke="#D7FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <ellipse cx="20" cy="24" rx="12" ry="4" stroke="#D7FF00" strokeWidth="1.5" />
                      <path d="M8 24V29C8 31.2 13.4 33 20 33C26.6 33 32 31.2 32 29V24" stroke="#D7FF00" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F5F0]">
                      SHIP
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#8A8A8A] font-light mt-0.5">
                      Deploy to production
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* ─── Right Column: CURRENT PROCESS Linear Panel (4 Cols) ─── */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#F5F5F0]/15 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between relative min-h-[320px]">
              
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F5F5F0] shrink-0">
                     PROCESS
                  </span>
                  <div className="h-px bg-[#F5F5F0]/20 flex-1" />
                </div>

                {/* Linear Process List with Downward Arrows */}
                <div className="space-y-3 font-mono">
                  
                  {/* 01 DISCOVER */}
                  <div
                    onClick={() => setActiveStep("01")}
                    className={`space-y-0.5 transition-colors cursor-pointer ${
                      activeStep === "01" ? "text-[#D7FF00]" : "text-[#F5F5F0]"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold">
                      <span className="mr-2">01</span>
                      <span className="font-black">DISCOVER</span>
                    </p>
                    <p className={`text-[11px] pl-6 font-light ${
                      activeStep === "01" ? "text-[#D7FF00]/80" : "text-[#8A8A8A]"
                    }`}>
                      Understand the problem
                    </p>
                    <p className="text-[#8A8A8A] text-xs pl-6">↓</p>
                  </div>

                  {/* 02 DESIGN */}
                  <div
                    onClick={() => setActiveStep("02")}
                    className={`space-y-0.5 transition-colors cursor-pointer ${
                      activeStep === "02" ? "text-[#D7FF00]" : "text-[#F5F5F0]"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold">
                      <span className="mr-2">02</span>
                      <span className="font-black">DESIGN</span>
                    </p>
                    <p className={`text-[11px] pl-6 font-light ${
                      activeStep === "02" ? "text-[#D7FF00]/80" : "text-[#8A8A8A]"
                    }`}>
                      Architecture / UX / Data
                    </p>
                    <p className="text-[#8A8A8A] text-xs pl-6">↓</p>
                  </div>

                  {/* 03 DEVELOP (Highlighted Neon Green) */}
                  <div
                    onClick={() => setActiveStep("03")}
                    className={`space-y-0.5 transition-colors cursor-pointer ${
                      activeStep === "03" ? "text-[#D7FF00]" : "text-[#F5F5F0]"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold text-[#D7FF00]">
                      <span className="mr-2">03</span>
                      <span className="font-black">DEVELOP</span>
                    </p>
                    <p className="text-[11px] text-[#D7FF00]/80 pl-6 font-light">
                      Frontend / Backend / AI
                    </p>
                    <p className="text-[#8A8A8A] text-xs pl-6">↓</p>
                  </div>

                  {/* 04 DEPLOY */}
                  <div
                    onClick={() => setActiveStep("04")}
                    className={`space-y-0.5 transition-colors cursor-pointer ${
                      activeStep === "04" ? "text-[#D7FF00]" : "text-[#F5F5F0]"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold">
                      <span className="mr-2">04</span>
                      <span className="font-black">DEPLOY</span>
                    </p>
                    <p className={`text-[11px] pl-6 font-light ${
                      activeStep === "04" ? "text-[#D7FF00]/80" : "text-[#8A8A8A]"
                    }`}>
                      Cloud / CI/CD / Monitoring
                    </p>
                    <p className="text-[#8A8A8A] text-xs pl-6">↓</p>
                  </div>

                  {/* 05 IMPROVE */}
                  <div
                    onClick={() => setActiveStep("05")}
                    className={`space-y-0.5 transition-colors cursor-pointer ${
                      activeStep === "05" ? "text-[#D7FF00]" : "text-[#F5F5F0]"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-bold">
                      <span className="mr-2">05</span>
                      <span className="font-black">IMPROVE</span>
                    </p>
                    <p className={`text-[11px] pl-6 font-light ${
                      activeStep === "05" ? "text-[#D7FF00]/80" : "text-[#8A8A8A]"
                    }`}>
                      Measure / Debug / Iterate
                    </p>
                  </div>

                </div>
              </div>

              {/* Decorative 4-point Diamond Star */}
              <div className="absolute bottom-2 right-2 text-[#8A8A8A]/30 pointer-events-none">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M16 0L19.5 12.5L32 16L19.5 19.5L16 32L12.5 19.5L0 16L12.5 12.5L16 0Z" fill="currentColor" />
                </svg>
              </div>

            </div>

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
      <div className="mt-24 md:mt-36 border-t border-b border-[#F5F5F0]/15 py-3.5 bg-[#050505]">
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
