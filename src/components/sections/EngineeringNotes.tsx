"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { XIcon } from "@/components/ui/Icons";
import EngineeringNoteCard from "@/components/ui/EngineeringNoteCard";
import { engineeringNotes } from "@/data/engineeringNotesData";

gsap.registerPlugin(ScrollTrigger);

// ─── 3D Cylindrical Carousel Configuration ───────────────────────────────────
// Faster dynamic auto-play cycle (~2.35s total)
const AUTO_PLAY_PAUSE = 1800; // ms hold time on active card
const TRANSITION_MS = 550; // ms for the smooth 3D cylindrical slide
const INTERACTION_COOLDOWN = 4000; // ms to pause auto-play after user click/swipe

// Desktop: Cylindrical geometry with slight, intentional card overlap
const DESKTOP_PARAMS = {
  radius: 630, // cylinder radius in px
  angleStep: 27, // degrees per slot along cylinder (~285px displacement)
  centerScale: 1.08, // center card prominence
  sideScaleFactor: 0.86, // scale of adjacent cards
  depthMultiplier: 1.25, // Z-depth pushback factor
  sideOpacity: 0.68, // opacity of adjacent cards
  farOpacity: 0.2, // opacity of cards 2 steps away
  visibleRange: 2, // only render visible cylinder arc slots
};

// Mobile: Tailored cylindrical geometry with subtle overlap for narrow viewports (< 640px)
const MOBILE_PARAMS = {
  radius: 380,
  angleStep: 32,
  centerScale: 1.02,
  sideScaleFactor: 0.83,
  depthMultiplier: 1.15,
  sideOpacity: 0.5,
  farOpacity: 0.1,
  visibleRange: 1,
};

const SM_BREAKPOINT = 640;

// ─── Helper: Shortest circular modular offset ────────────────────────────────
function wrapOffset(rawOffset: number, total: number): number {
  let offset = rawOffset % total;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function EngineeringNotes() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const dragRef = useRef({ startX: 0, isDragging: false });
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCards = engineeringNotes.length;
  const params = isMobile ? MOBILE_PARAMS : DESKTOP_PARAMS;

  // ── Responsive breakpoint listener ──
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < SM_BREAKPOINT);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Reduced motion accessibility check ──
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // ── Compute true cylindrical 3D transform for each card slot ──
  const getSlotStyle = useCallback(
    (index: number): React.CSSProperties => {
      const offset = wrapOffset(index - activeIndex, totalCards);
      const absOffset = Math.abs(offset);

      // Smoothly hide cards beyond active cylindrical arc
      if (absOffset > params.visibleRange) {
        const sign = offset >= 0 ? 1 : -1;
        const rad = (params.angleStep * (params.visibleRange + 0.8) * Math.PI) / 180;
        const hiddenX = Math.sin(rad) * params.radius * sign;
        const hiddenZ = -(1 - Math.cos(rad)) * params.radius * params.depthMultiplier - 150;
        const hiddenRotY = -sign * (params.angleStep * (params.visibleRange + 0.8));

        return {
          transform: `translateX(${hiddenX.toFixed(1)}px) translateZ(${hiddenZ.toFixed(1)}px) rotateY(${hiddenRotY.toFixed(1)}deg) scale(0.65)`,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 0,
          transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.35, 1), opacity ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.35, 1)`,
        };
      }

      const isCenter = absOffset === 0;

      // Mathematical cylindrical projection:
      // theta = angular position along cylinder arc
      const thetaDeg = offset * params.angleStep;
      const thetaRad = (thetaDeg * Math.PI) / 180;

      // X displacement along cylindrical tangent
      const x = Math.sin(thetaRad) * params.radius;

      // Z depth displacement along cylindrical radius (pushes back into screen)
      const z = -(1 - Math.cos(thetaRad)) * params.radius * params.depthMultiplier;

      // Yaw rotation (faces inward towards viewer / center of cylinder curvature)
      const rotY = -thetaDeg;

      // Scale: center dominant with controlled falloff
      const scale = isCenter
        ? params.centerScale
        : Math.pow(params.sideScaleFactor, absOffset);

      // Opacity: center 100%, adjacent 68%, far 20%
      const opacity = isCenter
        ? 1
        : absOffset === 1
        ? params.sideOpacity
        : params.farOpacity;

      // Stacking order: center is highest (30), side cards are underneath (20, 10)
      const zIndex = 30 - absOffset * 10;

      return {
        transform: `translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
        opacity,
        zIndex,
        pointerEvents: absOffset <= 1 ? "auto" : "none",
        transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.35, 1), opacity ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.35, 1)`,
      };
    },
    [activeIndex, params, totalCards]
  );

  // ── Auto-play: fast, dynamic cylindrical rotation ──
  useEffect(() => {
    if (isPaused || isHovered || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCards);
    }, AUTO_PLAY_PAUSE + TRANSITION_MS);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, prefersReducedMotion, totalCards]);

  // ── Pause on tab blur to conserve GPU ──
  useEffect(() => {
    const handler = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // ── Pause auto-play temporarily after user interaction ──
  const pauseForInteraction = useCallback(() => {
    setIsPaused(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, INTERACTION_COOLDOWN);
  }, []);

  // ── Step navigation ──
  const goTo = useCallback(
    (direction: "left" | "right") => {
      setActiveIndex((prev) => {
        if (direction === "right") return (prev + 1) % totalCards;
        return (prev - 1 + totalCards) % totalCards;
      });
      pauseForInteraction();
    },
    [totalCards, pauseForInteraction]
  );

  const goToIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      pauseForInteraction();
    },
    [pauseForInteraction]
  );

  // ── Keyboard arrow keys navigation ──
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo("left");
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo("right");
      }
    };
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [goTo]);

  // ── Pointer / Swipe Drag ──
  const handlePointerDown = (clientX: number) => {
    dragRef.current = { startX: clientX, isDragging: true };
    setDragMoved(false);
  };

  const handlePointerUp = (clientX: number) => {
    if (!dragRef.current.isDragging) return;
    const dx = clientX - dragRef.current.startX;
    if (Math.abs(dx) > 40) {
      setDragMoved(true);
      goTo(dx > 0 ? "left" : "right");
    }
    dragRef.current.isDragging = false;
  };

  // ── Entrance GSAP ScrollTrigger ──
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
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
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    };
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
                  onClick={() => goTo("left")}
                  className="p-2.5 border border-[#F5F5F0]/20 text-[#F5F5F0] hover:border-[#D7FF00] hover:text-[#D7FF00] transition-colors cursor-pointer bg-[#000000] rounded-sm active:scale-95"
                  aria-label="Previous engineering note"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => goTo("right")}
                  className="p-2.5 border border-[#F5F5F0]/20 text-[#F5F5F0] hover:border-[#D7FF00] hover:text-[#D7FF00] transition-colors cursor-pointer bg-[#000000] rounded-sm active:scale-95"
                  aria-label="Next engineering note"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 3D Cylindrical Orbiting Carousel ═══ */}
        <div className="notes-rail-container -mx-6 md:-mx-12 px-6 md:px-12 relative overflow-hidden py-4">
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              if (dragRef.current.isDragging) {
                dragRef.current.isDragging = false;
              }
            }}
            onMouseDown={(e) => handlePointerDown(e.clientX)}
            onMouseUp={(e) => handlePointerUp(e.clientX)}
            onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
            onTouchEnd={(e) => handlePointerUp(e.changedTouches[0].clientX)}
            tabIndex={0}
            role="region"
            aria-label="Technical engineering notes 3D cylindrical carousel"
            aria-roledescription="carousel"
            className="relative cursor-grab active:cursor-grabbing select-none focus:outline-none w-full"
            style={{
              perspective: isMobile ? "900px" : "1300px",
              height: isMobile ? "490px" : "560px",
            }}
          >
            {/* 3D Cylindrical Stage */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              {engineeringNotes.map((post, index) => {
                const offset = wrapOffset(index - activeIndex, totalCards);
                const isActive = offset === 0;

                return (
                  <div
                    key={post.id}
                    className="absolute will-change-transform pointer-events-auto"
                    style={getSlotStyle(index)}
                    onClick={
                      !isActive && Math.abs(offset) <= 1
                        ? (e) => {
                            e.stopPropagation();
                            goToIndex(index);
                          }
                        : undefined
                    }
                    aria-hidden={!isActive}
                  >
                    <EngineeringNoteCard
                      post={post}
                      dragMoved={dragMoved || !isActive}
                      isActive={isActive}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Progress Indicators / Dots ── */}
          <div className="flex justify-center items-center gap-2 mt-4 md:mt-6">
            {engineeringNotes.map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                  i === activeIndex
                    ? "w-8 bg-[#D7FF00] shadow-[0_0_10px_rgba(215,255,0,0.5)]"
                    : "w-1.5 bg-[#F5F5F0]/20 hover:bg-[#F5F5F0]/40"
                }`}
                aria-label={`Go to note ${i + 1}: ${engineeringNotes[i].title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
