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
      className="py-14 md:py-20 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      {/* ═══ Section Heading & Navigation Controls ═══ */}
      <div className="projects-header-trigger px-6 md:px-12 max-w-[1728px] mx-auto mb-8 md:mb-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-4 border-b border-[#F5F5F0]/15 pb-3">
          <span className="text-[#D7FF00] font-bold">[WORK // 03]</span>
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
              <h2 className="projects-heading-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#D7FF00]">
                PROJECTS<span className="text-[#F5F5F0]">.</span>
              </h2>
            </div>
          </div>

          {/* Interactive Carousel Controls & Indicators */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#8A8A8A]">
              <MoveHorizontal size={14} className="text-[#D7FF00]" />
              <span className="text-[10px] uppercase tracking-widest hidden sm:inline">
                DRAG OR USE ARROW KEYS
              </span>
            </div>

            {/* Slide Position Counter */}
            <div className="px-3 py-1.5 border border-[#F5F5F0]/15 bg-[#000000] text-[11px] uppercase tracking-wider text-[#F5F5F0]">
              <span className="text-[#D7FF00] font-bold">
                0{activeProjectIndex + 1}
              </span>{" "}
              / 0{projects.length}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={activeProjectIndex === 0}
                className="p-3 border border-[#F5F5F0]/15 text-[#F5F5F0] hover:border-[#D7FF00] hover:text-[#D7FF00] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Previous project"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                disabled={activeProjectIndex === projects.length - 1}
                className="p-3 border border-[#F5F5F0]/15 text-[#F5F5F0] hover:border-[#D7FF00] hover:text-[#D7FF00] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
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
          className={`flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory py-4 pb-8 focus:outline-none select-none ${isDragging ? "cursor-grabbing scroll-auto" : "cursor-grab scroll-smooth"
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
                className={`w-[90vw] sm:w-[85vw] lg:w-[1240px] xl:w-[1360px] shrink-0 snap-center border border-[#F5F5F0]/15 bg-[#000000] p-6 md:p-10 transition-all duration-500 ${isActive
                    ? "border-[#D7FF00]/60 shadow-[0_0_40px_rgba(215,255,0,0.04)]"
                    : "opacity-60 hover:opacity-90"
                  }`}
              >
                {/* Project Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F5F0]/15 pb-5 mb-8 font-mono">
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl md:text-5xl font-black text-[#D7FF00]">
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
                  <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#F5F5F0]/10 text-[10px] uppercase">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTabByProject((prev) => ({ ...prev, [idx]: "preview" }));
                      }}
                      className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${currentTab === "preview"
                          ? "bg-[#D7FF00] text-[#050505] font-bold"
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
                      className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${currentTab === "architecture"
                          ? "bg-[#D7FF00] text-[#050505] font-bold"
                          : "text-[#8A8A8A] hover:text-[#F5F5F0]"
                        }`}
                    >
                      <Layers size={12} />
                      <span>02 // Architecture Mesh</span>
                    </button>
                  </div>
                </div>

                {/* Main Slide Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Column: Visual Media / Architecture Diagram (6 cols) */}
                  <div className="lg:col-span-6 space-y-4">
                    {currentTab === "preview" ? (
                      <div className="relative aspect-[16/10] overflow-hidden border border-[#F5F5F0]/15 bg-[#111111] group">
                        <Image
                          src={PROJECT_IMAGES[idx] || PROJECT_IMAGES[0]}
                          alt={`${project.name} visual preview`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute top-4 left-4 z-20 font-mono text-[9px] uppercase tracking-[0.25em] text-[#D7FF00] px-2.5 py-1 bg-[#050505]/85 border border-[#F5F5F0]/15">
                          SYSTEM RUNTIME // ACTIVE
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#F5F5F0]/90 pointer-events-none">
                          <span>{project.name}</span>
                          <span className="text-[#D7FF00]">{project.techStack[0]}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-[#F5F5F0]/15 bg-[#050505] p-2">
                        <div className="px-3 py-2 border-b border-[#F5F5F0]/10 flex items-center justify-between font-mono text-[10px] uppercase text-[#8A8A8A]">
                          <span>DISTRIBUTED TOPOLOGY</span>
                          <span className="text-[#D7FF00]">
                            {project.architecture.nodes.length} NODES
                          </span>
                        </div>
                        <ArchitectureDiagram
                          nodes={project.architecture.nodes || []}
                          connections={project.architecture.connections || []}
                        />
                      </div>
                    )}

                    {/* Tech Badges Strip below preview */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] uppercase tracking-[0.15em] border border-[#F5F5F0]/15 px-3 py-1 text-[#F5F5F0] bg-[#050505]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Architectural Highlights & Specs (6 cols) */}
                  <div className="lg:col-span-6 space-y-6 flex flex-col justify-between h-full">
                    {/* System Overview */}
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] block">
                        // SYSTEM OVERVIEW
                      </span>
                      <p className="text-sm md:text-base text-[#B5B5B5] leading-relaxed font-light">
                        {project.description}
                      </p>
                    </div>

                    {/* Engineering Highlights */}
                    <div className="border-t border-[#F5F5F0]/15 pt-5 space-y-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D7FF00] block">
                        // ARCHITECTURAL HIGHLIGHTS
                      </span>
                      <ul className="space-y-2.5">
                        {project.highlights.map((hl, hIdx) => (
                          <li
                            key={hIdx}
                            className="text-xs md:text-sm text-[#F5F5F0]/90 pl-3.5 border-l-2 border-[#D7FF00]/50 leading-relaxed font-normal hover:border-[#D7FF00] transition-colors"
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
                          className="btn-editorial"
                          aria-label={`View source repository for ${project.name}`}
                          onClick={(e) => {
                            if (dragDistance > 10) e.preventDefault();
                          }}
                        >
                          <GitHubIcon width={14} height={14} />
                          <span>SOURCE CODE</span>
                          <ArrowUpRight size={14} className="arrow" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A] border border-[#F5F5F0]/10 px-4 py-3 cursor-default">
                          <GitHubIcon width={14} height={14} />
                          <span>PROPRIETARY REPO</span>
                        </span>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-editorial bg-[#D7FF00] text-[#050505] font-bold border-[#D7FF00]"
                          aria-label={`View live demo of ${project.name}`}
                          onClick={(e) => {
                            if (dragDistance > 10) e.preventDefault();
                          }}
                        >
                          <span>LIVE DEMO</span>
                          <ArrowUpRight size={14} className="arrow" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
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
                className="h-full bg-[#D7FF00] transition-all duration-300"
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
                className={`w-8 h-2 transition-colors cursor-pointer ${activeProjectIndex === pIdx ? "bg-[#D7FF00]" : "bg-[#1A1A1A] hover:bg-[#F5F5F0]/30"
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
