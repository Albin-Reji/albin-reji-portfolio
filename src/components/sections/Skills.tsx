"use client";

import { useEffect, useRef, useCallback } from "react";
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

/* ─── Clean serpentine layout ─────────────────────────────────────────────
   Cards flow in a clear S-curve: left → center-right → right → center-right → center → left
   Each row has enough vertical clearance — no overlapping cards.

   Layout grid (3 columns across viewport):
     LEFT   = 3-8%
     CENTER = 30-40%
     RIGHT  = 60-75%
*/

interface CardLayout {
  leftPct: number;    // Card left edge (% of container width)
  topPx: number;      // Fixed vertical position (px from roadmap top)
  pathAnchorX: number; // SVG path anchor X (% of SVG viewbox)
}

const CARD_LAYOUTS: CardLayout[] = [
  { leftPct: 5,  topPx: 30,   pathAnchorX: 18 },   // 01 Languages — top-left
  { leftPct: 33, topPx: 280,  pathAnchorX: 45 },   // 02 Frameworks — center
  { leftPct: 58, topPx: 540,  pathAnchorX: 70 },   // 03 Architecture — right
  { leftPct: 65, topPx: 860,  pathAnchorX: 78 },   // 04 Databases — right (shifted down enough)
  { leftPct: 30, topPx: 1100, pathAnchorX: 42 },   // 05 DevOps & Tools — center
  { leftPct: 3,  topPx: 1550, pathAnchorX: 15 },   // 06 Core Concepts — far-left
];

const ROADMAP_HEIGHT = 1780;
const SVG_VIEWBOX_W = 1000;
const SVG_VIEWBOX_H = ROADMAP_HEIGHT;

/* ─── SVG path generator ─────────────────────────────────────────────────
   Draws a clean S-curve through card anchor points with smooth cubic beziers */

function buildSerpentinePath(): string {
  const pts = CARD_LAYOUTS.map((c) => ({
    x: (c.pathAnchorX / 100) * SVG_VIEWBOX_W,
    y: c.topPx + 60, // anchor near top-center of each card
  }));

  // Entry: start above first card
  let d = `M ${pts[0].x - 80} ${pts[0].y - 140}`;
  d += ` Q ${pts[0].x - 20} ${pts[0].y - 50}, ${pts[0].x} ${pts[0].y}`;

  // Smooth S-curves between each pair
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dy = b.y - a.y;

    // Control points: push handles vertically to create smooth curves
    d += ` C ${a.x} ${a.y + dy * 0.55}, ${b.x} ${b.y - dy * 0.45}, ${b.x} ${b.y}`;
  }

  // Exit: trail below last card
  const last = pts[pts.length - 1];
  d += ` Q ${last.x - 50} ${last.y + 100}, ${last.x - 100} ${last.y + 190}`;

  return d;
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const setCardRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    cardsRef.current[idx] = el;
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // ── Header masked reveal ──
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

      // ── SVG Path Draw ──
      const path = pathRef.current;
      const glowPath = glowPathRef.current;

      if (path && roadmapRef.current) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;

        if (glowPath) {
          glowPath.style.strokeDasharray = `${len}`;
          glowPath.style.strokeDashoffset = `${len}`;
        }

        const scrollConfig = {
          trigger: roadmapRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 1,
        };

        gsap.to(path, { strokeDashoffset: 0, ease: "none", scrollTrigger: scrollConfig });
        if (glowPath) {
          gsap.to(glowPath, { strokeDashoffset: 0, ease: "none", scrollTrigger: { ...scrollConfig } });
        }
      }

      // ── Card animations ──
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;

        const layout = CARD_LAYOUTS[idx];
        const fromX = layout.leftPct > 50 ? 70 : layout.leftPct < 20 ? -70 : 0;

        gsap.fromTo(
          card,
          { x: fromX, y: 50, opacity: 0, scale: 0.93 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 60%",
              scrub: 0.6,
            },
          }
        );

        // Stagger skill items
        const items = card.querySelectorAll(".roadmap-skill-item");
        gsap.fromTo(
          items,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 80%", once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const serpentinePath = buildSerpentinePath();

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-14 md:py-20 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      {/* ═══ Section Heading ═══ */}
      <div className="stack-header-trigger px-6 md:px-12 max-w-[1728px] mx-auto mb-8 md:mb-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#777771] mb-4 border-b border-[#F5F5F0]/15 pb-3">
          <span className="text-[#DDFE67] font-bold">[STACK // 05]</span>
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
          <h2 className="stack-header-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#DDFE67]">
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
            className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#DDFE67]"
          />
        </div>
      </div>

      {/* ═══ Vertical Scroll Roadmap ═══ */}
      <div
        ref={roadmapRef}
        className="roadmap-container relative max-w-[1728px] mx-auto px-4 md:px-12"
        style={{ height: `${ROADMAP_HEIGHT}px` }}
      >
        {/* ── SVG Curved Path ── */}
        <svg
          className="roadmap-svg absolute inset-0 w-full pointer-events-none"
          style={{ height: `${SVG_VIEWBOX_H}px` }}
          viewBox={`0 0 ${SVG_VIEWBOX_W} ${SVG_VIEWBOX_H}`}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Wide glow halo */}
          <path
            ref={glowPathRef}
            d={serpentinePath}
            stroke="rgba(221, 254, 103, 0.20)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            className="roadmap-path-glow"
          />
          {/* Bright core line */}
          <path
            ref={pathRef}
            d={serpentinePath}
            stroke="#DDFE67"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="roadmap-path-main"
          />
        </svg>

        {/* ── Skill Cards ── */}
        {skillGroups.map((group, idx) => {
          const layout = CARD_LAYOUTS[idx];

          return (
            <div
              key={group.category}
              ref={(el) => setCardRef(el, idx)}
              className="roadmap-card absolute"
              style={{
                left: `${layout.leftPct}%`,
                top: `${layout.topPx}px`,
                width: "min(340px, 70vw)",
              }}
            >
              <div className="roadmap-card-inner spotlight-card rounded-2xl border border-[#F5F5F0]/12 bg-[#0A0A0A] overflow-hidden transition-all duration-400 group hover:border-[#DDFE67]/50 hover:shadow-[0_0_40px_rgba(221,254,103,0.06)]">
                {/* Ambient glow */}
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#DDFE67]/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-[#DDFE67]/[0.06] transition-all duration-500" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F5F5F0]/8 px-4 py-2.5">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#DDFE67]">
                    // {group.category}
                  </h3>
                  <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#F5F5F0]/12 text-[#666] group-hover:text-[#DDFE67] group-hover:border-[#DDFE67]/40 transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                {/* Skills */}
                <div className="px-4 py-3">
                  <ul>
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="roadmap-skill-item group/item flex items-center justify-between py-[7px] border-b border-[#F5F5F0]/5 last:border-b-0 hover:border-[#DDFE67]/25 transition-colors cursor-default"
                      >
                        <span className="text-[13px] md:text-sm font-bold uppercase tracking-tight text-[#F5F5F0] group-hover/item:text-[#DDFE67] group-hover/item:translate-x-1.5 transition-all duration-300">
                          {item}
                        </span>
                        <svg
                          className="w-2.5 h-2.5 text-transparent group-hover/item:text-[#DDFE67] transition-all duration-300"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M2 10L10 2M10 2H4M10 2V8" />
                        </svg>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom accent */}
                <div className="h-[2px] w-full bg-gradient-to-r from-[#DDFE67]/0 via-[#DDFE67]/15 to-[#DDFE67]/0 group-hover:via-[#DDFE67]/40 transition-all duration-500" />
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
