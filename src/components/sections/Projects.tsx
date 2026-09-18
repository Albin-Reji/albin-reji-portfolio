"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Layers,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import ArchitectureDiagram from "@/components/ui/ArchitectureDiagram";
import { projects } from "@/data/portfolio";
import { TextParser } from "@/components/ui/TextParser";

gsap.registerPlugin(ScrollTrigger);

const PROJECT_IMAGES = ["/project-01.jpg", "/project-02.jpg"];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [activeTabByProject, setActiveTabByProject] = useState<Record<number, "preview" | "architecture">>({
    0: "preview",
    1: "preview",
  });

  // Handle scroll position detection to track active slide
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const index = Math.round(scrollLeft / (clientWidth * 0.85 || 1));
    const clamped = Math.max(0, Math.min(projects.length - 1, index));
    setActiveProjectIndex(clamped);
  }, []);

  // Programmatic scroll to index
  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const children = carouselRef.current.children;
    if (children[index]) {
      (children[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeProjectIndex - 1);
    scrollToSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(projects.length - 1, activeProjectIndex + 1);
    scrollToSlide(nextIdx);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftState - walk;
    setDragDistance(Math.abs(walk));
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Mouse Wheel horizontal translation
  const handleWheel = (e: React.WheelEvent) => {
    if (!carouselRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 4) {
      // Translate vertical mouse wheel to horizontal scroll smoothly
      carouselRef.current.scrollLeft += e.deltaY * 0.85;
    }
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

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-14 md:py-20 bg-transparent border-b border-[#F5F5F0]/15"
    >
      {/* ═══ Section Heading & Navigation Controls ═══ */}
      <div className="projects-header-trigger px-6 md:px-12 max-w-[1728px] mx-auto mb-8 md:mb-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-4 border-b border-[#F5F5F0]/15 pb-3">
          <span className="text-[#DDFE67] font-bold">[WORK // 03]</span>
          <span>ON TRACK // SELECTED SYSTEMS</span>
          <span className="flex-1" />
          <span>{projects.length} CASE STUDIES</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="overflow-hidden">
              <h2 className="projects-heading-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#F5F5F0]">
                FEATURED
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="projects-heading-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#DDFE67]">
                PROJECTS<span className="text-[#F5F5F0]">.</span>
              </h2>
            </div>
          </div>

          {/* Interactive Carousel Controls & Indicators */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#8A8A8A]">
              <MoveHorizontal size={14} className="text-[#DDFE67]" />
              <span className="text-[10px] uppercase tracking-widest hidden sm:inline">
                DRAG OR USE ARROW KEYS
              </span>
            </div>

            {/* Slide Position Counter */}
            <div className="px-3.5 py-1.5 border border-[#F5F5F0]/15 bg-[#000000] text-[11px] uppercase tracking-wider text-[#F5F5F0] rounded-full">
              <span className="text-[#DDFE67] font-bold">
                0{activeProjectIndex + 1}
              </span>{" "}
              / 0{projects.length}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={activeProjectIndex === 0}
                className="p-3 border border-[#F5F5F0]/15 text-[#F5F5F0] hover:border-[#DDFE67] hover:text-[#DDFE67] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer rounded-full"
                aria-label="Previous project"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                disabled={activeProjectIndex === projects.length - 1}
                className="p-3 border border-[#F5F5F0]/15 text-[#F5F5F0] hover:border-[#DDFE67] hover:text-[#DDFE67] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer rounded-full"
                aria-label="Next project"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Horizontal Scroll Carousel Viewport ═══ */}
      <div className="projects-carousel-container px-6 md:px-12 max-w-[1728px] mx-auto">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Featured projects horizontal slider"
          className={`flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory py-4 pb-12 focus:outline-none select-none [&::-webkit-scrollbar]:hidden ${isDragging ? "cursor-grabbing scroll-auto" : "cursor-grab scroll-smooth"
            }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            const isActive = activeProjectIndex === idx;
            const currentTab = activeTabByProject[idx] || "preview";

            return (
              <article
                key={project.name}
                className={`w-[90vw] sm:w-[85vw] lg:w-[1240px] xl:w-[1300px] shrink-0 snap-center rounded-[2rem] sm:rounded-[2.25rem] border border-[#F5F5F0]/15 bg-[#000000] p-6 sm:p-8 md:p-10 transition-all duration-500 flex flex-col relative overflow-hidden ${isActive
                  ? "border-[#DDFE67]/60 shadow-[0_0_45px_rgba(221,254,103,0.06)]"
                  : "opacity-60 hover:opacity-90"
                  }`}
              >
                {/* Project Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F5F0]/15 pb-5 mb-8 font-mono">
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl md:text-5xl font-black text-[#DDFE67]">
                      {num}
                    </span>
                    <div>
                      <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F0]">
                        {project.name}
                      </h3>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A]">
                        DISTRIBUTED SYSTEMS // CASE STUDY {num}
                      </span>
                    </div>
                  </div>

                    {/* Visual / Blueprint Switcher */}
                    <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#F5F5F0]/10 text-[10px] uppercase rounded-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTabByProject((prev) => ({ ...prev, [idx]: "preview" }));
                        }}
                        className={`px-3.5 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 rounded-full ${currentTab === "preview"
                          ? "bg-[#DDFE67] text-[#050505] font-bold shadow-[0_0_12px_rgba(221,254,103,0.35)]"
                          : "text-[#8A8A8A] hover:text-[#F5F5F0]"
                          }`}
                      >
                        <span>01 // Visual Preview</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTabByProject((prev) => ({ ...prev, [idx]: "architecture" }));
                        }}
                        className={`px-3.5 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 rounded-full ${currentTab === "architecture"
                          ? "bg-[#DDFE67] text-[#050505] font-bold shadow-[0_0_12px_rgba(221,254,103,0.35)]"
                          : "text-[#8A8A8A] hover:text-[#F5F5F0]"
                          }`}
                      >
                        <Layers size={12} />
                        <span>02 // Architecture Mesh</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Slide Grid */}
                  {currentTab === "preview" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                      {/* Left Column: Visual Media (6 cols) */}
                      <div className="lg:col-span-6 space-y-4 flex flex-col">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#F5F5F0]/15 bg-[#111111] group shrink-0">
                          <Image
                            src={PROJECT_IMAGES[idx] || PROJECT_IMAGES[0]}
                            alt={`${project.name} visual preview`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent pointer-events-none" />

                          <div className="absolute top-4 left-4 z-20 font-mono text-[9px] uppercase tracking-[0.25em] text-[#DDFE67] px-3 py-1 bg-[#050505]/85 border border-[#F5F5F0]/15 rounded-full backdrop-blur-sm shadow-sm">
                            SYSTEM RUNTIME // ACTIVE
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F5F0]/90 pointer-events-none">
                            <span>{project.name}</span>
                            <span className="text-[#DDFE67]">{project.techStack[0]}</span>
                          </div>
                        </div>

                        {/* Tech Badges Strip below preview */}
                        <div className="flex flex-wrap gap-2 pt-4 mt-auto">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[10px] uppercase tracking-[0.15em] border border-[#F5F5F0]/15 px-3 py-1 text-[#F5F5F0] bg-[#050505] hover:border-[#DDFE67]/50 transition-colors rounded-lg"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Architectural Highlights & Specs (6 cols) */}
                      <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
                        {/* System Overview */}
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] block">
                            // SYSTEM OVERVIEW
                          </span>
                          <p className="text-sm md:text-base text-[#B5B5B5] leading-relaxed font-light">
                            <TextParser text={project.description} />
                          </p>
                        </div>

                        {/* Engineering Highlights */}
                        <div className="border-t border-[#F5F5F0]/15 pt-5 space-y-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#DDFE67] block">
                            // ARCHITECTURAL HIGHLIGHTS
                          </span>
                          <ul className="space-y-2.5">
                            {project.highlights.map((hl, hIdx) => (
                              <li
                                key={hIdx}
                                className="text-xs md:text-sm text-[#F5F5F0]/90 pl-3.5 border-l-2 border-[#DDFE67]/50 leading-relaxed font-normal hover:border-[#DDFE67] transition-colors"
                              >
                                {hl}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Links */}
                        <div className="pt-4 border-t border-[#F5F5F0]/15 flex flex-wrap items-center gap-4">
                          {project.githubUrl ? (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[10px] text-[#777771] hover:text-[#DDFE67] lowercase transition-colors group"
                              aria-label={`View source repository for ${project.name}`}
                              onClick={(e) => {
                                if (dragDistance > 10) e.preventDefault();
                              }}
                            >
                              <GitHubIcon width={12} height={12} />
                              <span>source code</span>
                              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[10px] text-[#777771] lowercase cursor-default">
                              <GitHubIcon width={12} height={12} />
                              <span>proprietary repo</span>
                            </span>
                          )}

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[10px] text-[#777771] hover:text-[#DDFE67] lowercase transition-colors group"
                              aria-label={`View live demo of ${project.name}`}
                              onClick={(e) => {
                                if (dragDistance > 10) e.preventDefault();
                              }}
                            >
                              <span>live demo</span>
                              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Full-width Architecture Mesh view */
                    <div className="space-y-6">
                      <ArchitectureDiagram
                        nodes={project.architecture.nodes || []}
                        connections={project.architecture.connections || []}
                        title={`${project.name} // ARCHITECTURAL TOPOLOGY`}
                      />

                      {/* Bottom Specs & Highlights */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-[#F5F5F0]/15 items-start">
                        <div className="lg:col-span-5 space-y-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] block">
                            // ARCHITECTURAL SUMMARY
                          </span>
                          <p className="text-xs md:text-sm text-[#B5B5B5] leading-relaxed font-light">
                            <TextParser text={project.description} />
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="font-mono text-[9px] uppercase tracking-[0.15em] border border-[#F5F5F0]/15 px-2.5 py-1 text-[#F5F5F0] bg-[#050505] hover:border-[#DDFE67]/50 transition-colors rounded-lg"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="lg:col-span-5 space-y-2">
                          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#DDFE67] block">
                            // ENGINEERING & RESILIENCE HIGHLIGHTS
                          </span>
                          <ul className="space-y-2">
                            {project.highlights.map((hl, hIdx) => (
                              <li
                                key={hIdx}
                                className="text-xs text-[#F5F5F0]/90 pl-3 border-l border-[#DDFE67]/50 leading-relaxed font-normal hover:border-[#DDFE67] transition-colors"
                              >
                                {hl}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="lg:col-span-2 flex lg:flex-col justify-end gap-3 pt-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[10px] text-[#777771] hover:text-[#DDFE67] lowercase transition-colors group"
                              aria-label={`View source repository for ${project.name}`}
                            >
                              <GitHubIcon width={12} height={12} />
                              <span>code repo</span>
                              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[10px] text-[#777771] hover:text-[#DDFE67] lowercase transition-colors group"
                              aria-label={`View live demo of ${project.name}`}
                            >
                              <span>live demo</span>
                              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Carousel Pagination Progress Bar */}
          <div className="mt-8 flex items-center justify-between border-t border-[#F5F5F0]/15 pt-4 font-mono text-[10px] uppercase tracking-widest text-[#8A8A8A]">
            <div className="flex items-center gap-2">
              <span>PROGRESS</span>
              <div className="w-24 md:w-48 h-1 bg-[#1A1A1A] overflow-hidden">
                <div
                  className="h-full bg-[#DDFE67] shadow-[0_0_8px_rgba(221,254,103,0.7)] transition-all duration-300"
                  style={{
                    width: `${((activeProjectIndex + 1) / projects.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {projects.map((p, pIdx) => (
                <button
                  key={p.name}
                  onClick={() => scrollToSlide(pIdx)}
                  className={`w-8 h-2 transition-colors cursor-pointer ${activeProjectIndex === pIdx ? "bg-[#DDFE67] shadow-[0_0_6px_rgba(221,254,103,0.6)]" : "bg-[#1A1A1A] hover:bg-[#F5F5F0]/30"
                    }`}
                  aria-label={`Go to slide ${pIdx + 1}: ${p.name}`}
                />
              ))}
            </div>
          </div>
      </div>
    </section>
  );
}
