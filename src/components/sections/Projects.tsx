"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Layers,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import ArchitectureDiagram from "@/components/ui/ArchitectureDiagram";
import { projects } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

const PROJECT_IMAGES = ["/project-01.jpg", "/project-02.jpg"];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeTabByProject, setActiveTabByProject] = useState<Record<number, "preview" | "architecture">>({
    0: "preview",
    1: "preview",
  });

  const handlePrev = useCallback(() => {
    setActiveProjectIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveProjectIndex((prev) => Math.min(projects.length - 1, prev + 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch Swipe for mobile / tablet
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header masked reveal
      gsap.fromTo(
        ".projects-heading-line",
        { y: "115%", opacity: 0, skewY: 3 },
        {
          y: "0%",
          opacity: 1,
          skewY: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-header-trigger",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Carousel container fade in
      gsap.fromTo(
        ".projects-carousel-container",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-carousel-container",
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const project = projects[activeProjectIndex];
  const num = String(activeProjectIndex + 1).padStart(2, "0");
  const currentTab = activeTabByProject[activeProjectIndex] || "preview";

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="pt-6 md:pt-10 pb-8 md:pb-12 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      {/* ═══ Section Heading & Meta ═══ */}
      <div className="projects-header-trigger px-4 sm:px-6 md:px-12 max-w-[1728px] mx-auto mb-4 md:mb-5">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-2 border-b border-[#F5F5F0]/15 pb-2">
          <span className="text-[#D7FF00] font-bold">[WORK // 03]</span>
          <span>SELECTED PRODUCTION SYSTEMS</span>
          <span className="flex-1" />
          <span className="hidden sm:inline">{projects.length} ARCHITECTURAL CASE STUDIES</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="overflow-hidden">
            <h2 className="projects-heading-line text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[-0.03em] text-[#F5F5F0]">
              FEATURED <span className="text-[#D7FF00]">PROJECTS.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8A8A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF00] animate-pulse" />
            <span className="text-[#8A8A8A]">KEYBOARD:</span>
            <span className="text-[#F5F5F0] border border-[#F5F5F0]/20 px-1.5 py-0.5 text-[9px]">←</span>
            <span className="text-[#F5F5F0] border border-[#F5F5F0]/20 px-1.5 py-0.5 text-[9px]">→</span>
          </div>
        </div>
      </div>

      {/* ═══ Active Project Viewport ═══ */}
      <div className="projects-carousel-container px-4 sm:px-6 md:px-12 max-w-[1728px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.article
            key={`${activeProjectIndex}-${currentTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full border border-[#D7FF00]/60 bg-[#000000] p-4 sm:p-5 md:p-6 lg:p-7 shadow-[0_0_40px_rgba(215,255,0,0.04)] transition-colors"
          >
            {/* ═══ Project Card Primary Header Bar: Title, Navigation & Switcher ═══ */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 md:gap-4 border-b border-[#F5F5F0]/15 pb-3 mb-4 md:mb-5 font-mono">
              {/* Left: Project Number & Name */}
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <span className="text-2xl md:text-3xl lg:text-4xl font-black text-[#D7FF00] tracking-tight shrink-0">
                  {num}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-[#F5F5F0] truncate">
                    {project.name}
                  </h3>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] block truncate">
                    DISTRIBUTED SYSTEMS // CASE STUDY {num}
                  </span>
                </div>
              </div>

              {/* Right: Integrated Navigation Controls & Blueprint Switcher */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                {/* ─── PRIMARY PROJECT NAVIGATION CONTROLLER ─── */}
                <div
                  className="flex items-stretch border border-[#F5F5F0]/25 bg-[#050505] shadow-[0_0_20px_rgba(0,0,0,0.6)]"
                  role="group"
                  aria-label="Project Navigation Controls"
                >
                  {/* Previous Project Button */}
                  <button
                    onClick={handlePrev}
                    disabled={activeProjectIndex === 0}
                    className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-[#F5F5F0] hover:text-[#D7FF00] hover:bg-[#D7FF00]/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer border-r border-[#F5F5F0]/15 select-none min-h-[38px] text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D7FF00]"
                    aria-label="Previous project"
                    title="Previous project (or Left arrow key)"
                  >
                    <ArrowLeft
                      size={13}
                      className="text-[#D7FF00] group-hover:-translate-x-0.5 group-disabled:translate-x-0 transition-transform"
                    />
                    <span className="inline">PREV</span>
                  </button>

                  {/* Integrated Project Counter */}
                  <div
                    className="px-3 sm:px-3.5 py-2 flex items-center gap-1.5 bg-[#000000] text-[10.5px] sm:text-[11px] uppercase tracking-widest border-r border-[#F5F5F0]/15 select-none font-mono min-h-[38px]"
                    aria-label={`Project ${activeProjectIndex + 1} of ${projects.length}`}
                  >
                    <span className="text-[#D7FF00] font-black text-xs sm:text-sm">
                      0{activeProjectIndex + 1}
                    </span>
                    <span className="text-[#8A8A8A] text-[10px]">/</span>
                    <span className="text-[#8A8A8A] font-medium text-[10px] sm:text-xs">
                      0{projects.length}
                    </span>
                  </div>

                  {/* Next Project Button */}
                  <button
                    onClick={handleNext}
                    disabled={activeProjectIndex === projects.length - 1}
                    className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-[#F5F5F0] hover:text-[#D7FF00] hover:bg-[#D7FF00]/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer bg-[#D7FF00]/5 hover:bg-[#D7FF00]/15 select-none min-h-[38px] text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D7FF00]"
                    aria-label="Next project"
                    title="Next project (or Right arrow key)"
                  >
                    <span className="inline text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors">
                      NEXT
                    </span>
                    <ArrowRight
                      size={13}
                      className="text-[#D7FF00] group-hover:translate-x-0.5 group-disabled:translate-x-0 transition-transform"
                    />
                  </button>
                </div>

                {/* ─── VISUAL / BLUEPRINT SWITCHER ─── */}
                <div className="flex items-center bg-[#111111] p-0.5 sm:p-1 border border-[#F5F5F0]/10 text-[10px] uppercase">
                  <button
                    onClick={() => {
                      setActiveTabByProject((prev) => ({
                        ...prev,
                        [activeProjectIndex]: "preview",
                      }));
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
                      currentTab === "preview"
                        ? "bg-[#D7FF00] text-[#050505] font-bold"
                        : "text-[#8A8A8A] hover:text-[#F5F5F0]"
                    }`}
                  >
                    <span>01 // Visual Preview</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTabByProject((prev) => ({
                        ...prev,
                        [activeProjectIndex]: "architecture",
                      }));
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
                      currentTab === "architecture"
                        ? "bg-[#D7FF00] text-[#050505] font-bold"
                        : "text-[#8A8A8A] hover:text-[#F5F5F0]"
                    }`}
                  >
                    <Layers size={12} />
                    <span>02 // Architecture Mesh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ═══ Main Content Area ═══ */}
            {currentTab === "preview" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
                {/* Left Column: Visual Media (6 cols) */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="relative aspect-[16/9] max-h-[260px] sm:max-h-[300px] lg:max-h-[330px] overflow-hidden border border-[#F5F5F0]/15 bg-[#111111] group">
                    <Image
                      src={PROJECT_IMAGES[activeProjectIndex] || PROJECT_IMAGES[0]}
                      alt={`${project.name} visual preview`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/85 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 z-20 font-mono text-[9px] uppercase tracking-[0.25em] text-[#D7FF00] px-2 py-0.5 bg-[#050505]/90 border border-[#F5F5F0]/15">
                      SYSTEM RUNTIME // ACTIVE
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#F5F5F0]/90 pointer-events-none">
                      <span>{project.name}</span>
                      <span className="text-[#D7FF00] font-bold">{project.techStack[0]}</span>
                    </div>
                  </div>

                  {/* Tech Badges Strip below preview */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9.5px] uppercase tracking-[0.12em] border border-[#F5F5F0]/15 px-2.5 py-0.5 text-[#F5F5F0] bg-[#050505]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Column: Architectural Highlights & Specs (6 cols) */}
                <div className="lg:col-span-6 space-y-3 md:space-y-3.5 flex flex-col">
                  {/* System Overview */}
                  <div className="space-y-1">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.25em] text-[#8A8A8A] block">
                      // SYSTEM OVERVIEW
                    </span>
                    <p className="text-xs md:text-[13.5px] text-[#B5B5B5] leading-relaxed font-light">
                      {project.description}
                    </p>
                  </div>

                  {/* Engineering Highlights */}
                  <div className="border-t border-[#F5F5F0]/15 pt-2.5 space-y-1.5">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.25em] text-[#D7FF00] block">
                      // ARCHITECTURAL HIGHLIGHTS
                    </span>
                    <ul className="space-y-1.5">
                      {project.highlights.map((hl, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-xs md:text-[13px] text-[#F5F5F0]/90 pl-3 border-l-2 border-[#D7FF00]/50 leading-snug font-normal hover:border-[#D7FF00] transition-colors"
                        >
                          {hl}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Links */}
                  <div className="pt-2 border-t border-[#F5F5F0]/15 flex flex-wrap items-center gap-3">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-editorial !py-2 !px-4 !min-h-[36px] text-[10px]"
                        aria-label={`View source repository for ${project.name}`}
                      >
                        <GitHubIcon width={13} height={13} />
                        <span>SOURCE CODE</span>
                        <ArrowUpRight size={13} className="arrow" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider text-[#8A8A8A] border border-[#F5F5F0]/10 px-3 py-1.5 cursor-default">
                        <GitHubIcon width={13} height={13} />
                        <span>PROPRIETARY REPO</span>
                      </span>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-editorial bg-[#D7FF00] text-[#050505] font-bold border-[#D7FF00] !py-2 !px-4 !min-h-[36px] text-[10px]"
                        aria-label={`View live demo of ${project.name}`}
                      >
                        <span>LIVE DEMO</span>
                        <ArrowUpRight size={13} className="arrow" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Full-width Architecture Mesh view */
              <div className="space-y-4">
                <ArchitectureDiagram
                  nodes={project.architecture.nodes || []}
                  connections={project.architecture.connections || []}
                  title={`${project.name} // ARCHITECTURAL TOPOLOGY`}
                />

                {/* Bottom Specs & Highlights */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3 border-t border-[#F5F5F0]/15 items-start">
                  <div className="lg:col-span-5 space-y-2">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.25em] text-[#8A8A8A] block">
                      // ARCHITECTURAL SUMMARY
                    </span>
                    <p className="text-xs text-[#B5B5B5] leading-relaxed font-light">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[9px] uppercase tracking-[0.12em] border border-[#F5F5F0]/15 px-2 py-0.5 text-[#F5F5F0] bg-[#050505]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-1.5">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.25em] text-[#D7FF00] block">
                      // ENGINEERING & RESILIENCE HIGHLIGHTS
                    </span>
                    <ul className="space-y-1.5">
                      {project.highlights.map((hl, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-[11.5px] text-[#F5F5F0]/90 pl-2.5 border-l border-[#D7FF00]/50 leading-snug font-normal"
                        >
                          {hl}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-2 flex lg:flex-col justify-end gap-2 pt-1">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-editorial !py-2 !px-3 !min-h-[34px] text-[9.5px] justify-center"
                        aria-label={`View source repository for ${project.name}`}
                      >
                        <GitHubIcon width={12} height={12} />
                        <span>CODE REPO</span>
                        <ArrowUpRight size={12} className="arrow" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-editorial bg-[#D7FF00] text-[#050505] font-bold border-[#D7FF00] !py-2 !px-3 !min-h-[34px] text-[9.5px] justify-center"
                        aria-label={`View live demo of ${project.name}`}
                      >
                        <span>LIVE DEMO</span>
                        <ArrowUpRight size={12} className="arrow" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.article>
        </AnimatePresence>

        {/* ═══ Carousel Pagination Progress Bar & Quick Navigation Pills ═══ */}
        <div className="mt-4 md:mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F5F5F0]/15 pt-3 font-mono text-[10px] uppercase tracking-widest text-[#8A8A8A]">
          <div className="flex items-center gap-2.5">
            <span>PROGRESS</span>
            <div className="w-24 md:w-36 h-1 bg-[#1A1A1A] overflow-hidden">
              <div
                className="h-full bg-[#D7FF00] transition-all duration-300"
                style={{
                  width: `${((activeProjectIndex + 1) / projects.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-[#D7FF00] font-bold text-[9.5px]">
              0{activeProjectIndex + 1} / 0{projects.length}
            </span>
          </div>

          {/* Direct Project Jump Pills */}
          <div className="flex items-center gap-1.5">
            {projects.map((p, pIdx) => (
              <button
                key={p.name}
                onClick={() => setActiveProjectIndex(pIdx)}
                className={`px-2.5 py-1 text-[9px] border transition-colors cursor-pointer font-mono uppercase tracking-wider flex items-center gap-1.5 ${
                  activeProjectIndex === pIdx
                    ? "bg-[#D7FF00] text-[#050505] border-[#D7FF00] font-bold"
                    : "bg-[#0A0A0A] text-[#8A8A8A] border-[#F5F5F0]/10 hover:text-[#F5F5F0] hover:border-[#F5F5F0]/30"
                }`}
                aria-label={`Switch directly to project ${pIdx + 1}: ${p.name}`}
              >
                <span className={activeProjectIndex === pIdx ? "text-[#050505]" : "text-[#D7FF00]"}>
                  0{pIdx + 1}
                </span>
                <span className="hidden sm:inline truncate max-w-[140px]">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
