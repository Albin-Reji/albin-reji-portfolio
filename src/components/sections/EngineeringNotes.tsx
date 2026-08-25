"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight, Radio } from "lucide-react";
import { XIcon } from "@/components/ui/Icons";
import { engineeringNotes, personalInfo } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function EngineeringNotes() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);

  // Check scroll boundary to enable/disable arrow buttons
  const checkScrollBoundaries = useCallback(() => {
    if (!railRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    checkScrollBoundaries();
    el.addEventListener("scroll", checkScrollBoundaries, { passive: true });
    window.addEventListener("resize", checkScrollBoundaries);
    return () => {
      el.removeEventListener("scroll", checkScrollBoundaries);
      window.removeEventListener("resize", checkScrollBoundaries);
    };
  }, [checkScrollBoundaries]);

  // Scroll navigation helpers
  const handleScrollBy = (direction: "left" | "right") => {
    if (!railRef.current) return;
    const cardWidth = 380;
    const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
    railRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!railRef.current) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - railRef.current.offsetLeft);
    setScrollLeftState(railRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !railRef.current) return;
    e.preventDefault();
    const x = e.pageX - railRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 5) {
      setDragMoved(true);
    }
    railRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Mouse wheel horizontal translation
  const handleWheel = (e: React.WheelEvent) => {
    if (!railRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 4) {
      railRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  // GSAP scroll trigger entrance
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        ".notes-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Card rail fade in
      gsap.fromTo(
        ".notes-rail-container",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".notes-rail-container",
            start: "top 85%",
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
      id="notes"
      className="py-14 md:py-20 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      <div className="max-w-[1728px] mx-auto px-6 md:px-12">
        {/* ═══ Section Header ═══ */}
        <div className="notes-header space-y-6 mb-8 md:mb-10">
          {/* Eyebrow & Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.25em] text-[#8A8A8A] border-b border-[#F5F5F0]/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-[#D7FF00] font-bold">[ENGINEERING NOTES // 06]</span>
              <span className="hidden sm:inline">TECH DISPATCHES &amp; BUILD LOGS</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Live from the lab status badge */}
              <div className="flex items-center gap-2 px-2.5 py-1 bg-[#D7FF00]/10 border border-[#D7FF00]/30 text-[#D7FF00] text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF00] animate-pulse" />
                <span>LIVE FROM THE LAB</span>
              </div>

              {/* Post Count */}
              <span className="text-[#8A8A8A] text-[11px]">
                08 SELECTED POSTS
              </span>
            </div>
          </div>

          {/* Main Title & Action Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#F5F5F0] leading-[0.95]">
                THINGS I&apos;M BUILDING, LEARNING &amp; SHARING<span className="text-[#D7FF00]">.</span>
              </h2>
              <p className="text-sm md:text-base text-[#B5B5B5] font-light leading-relaxed">
                Selected technical posts, experiments, architecture ideas, and lessons from building software.
              </p>
            </div>

            {/* Header Right: Profile Link & Carousel Navigation Arrows */}
            <div className="flex items-center gap-6 self-start lg:self-end">
              <a
                href="https://x.com/_AlbinReji_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View all technical posts on X profile @_AlbinReji_"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#F5F5F0] hover:text-[#D7FF00] transition-colors group"
              >
                <XIcon width={12} height={12} />
                <span>VIEW ALL POSTS</span>
                <ArrowUpRight size={14} className="text-[#8A8A8A] group-hover:text-[#D7FF00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Desktop Nav Arrows */}
              <div className="hidden sm:flex items-center gap-2 font-mono">
                <button
                  onClick={() => handleScrollBy("left")}
                  disabled={!canScrollLeft}
                  className="p-2.5 border border-[#F5F5F0]/15 text-[#F5F5F0] hover:border-[#D7FF00] hover:text-[#D7FF00] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer bg-[#000000]"
                  aria-label="Scroll technical notes left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handleScrollBy("right")}
                  disabled={!canScrollRight}
                  className="p-2.5 border border-[#F5F5F0]/15 text-[#F5F5F0] hover:border-[#D7FF00] hover:text-[#D7FF00] disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer bg-[#000000]"
                  aria-label="Scroll technical notes right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Horizontally Scrollable X Post Card Rail ═══ */}
        <div className="notes-rail-container -mx-6 md:-mx-12 px-6 md:px-12">
          <div
            ref={railRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onWheel={handleWheel}
            tabIndex={0}
            role="region"
            aria-label="Technical engineering notes horizontal rail"
            className={`flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory py-4 pb-8 focus:outline-none select-none ${
              isDragging ? "cursor-grabbing scroll-auto" : "cursor-grab scroll-smooth"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {engineeringNotes.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (dragMoved) e.preventDefault();
                }}
                aria-label={`${post.category}: ${post.title}. View technical post on X.`}
                className="group w-[82vw] sm:w-[360px] md:w-[380px] shrink-0 snap-start border border-[#F5F5F0]/15 bg-[#000000] p-5 md:p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D7FF00]/60 hover:shadow-[0_12px_30px_rgba(215,255,0,0.04)]"
              >
                <div className="space-y-4">
                  {/* Card Thumbnail Image Area */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#F5F5F0]/10 bg-[#111111]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 85vw, 380px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/30 to-transparent pointer-events-none" />

                    {/* Small category tag badge on image */}
                    <div className="absolute top-3 left-3 z-10 font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 bg-[#050505]/90 border border-[#D7FF00]/40 text-[#D7FF00]">
                      {post.category}
                    </div>

                    <div className="absolute bottom-3 right-3 z-10 text-[#F5F5F0]/60 group-hover:text-[#D7FF00] transition-colors">
                      <XIcon width={14} height={14} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#F5F5F0] leading-snug group-hover:text-[#D7FF00] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#B5B5B5] font-light leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </div>

                {/* Card Meta & CTA Bar */}
                <div className="border-t border-[#F5F5F0]/10 pt-3.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]">
                  <span>{post.date}</span>
                  <span className="inline-flex items-center gap-1 text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors font-semibold">
                    <span>VIEW ON X</span>
                    <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
