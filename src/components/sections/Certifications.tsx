"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { certifications } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

// ─── Showcase Stack Configuration ────────────────────────────────────────────
const STACK_OFFSET_X = 12; // px horizontal offset per stacked card
const STACK_OFFSET_Y = 10; // px vertical offset per stacked card
const STACK_ROTATION = 2.5; // degrees rotation per stacked card
const TRANSITION_DURATION = 500; // ms for card swap animation

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalCerts = certifications.length;

  // ── Handle menu item click/hover ──
  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // ── Compute stacked card style ──
  const getCardStyle = useCallback(
    (index: number): React.CSSProperties => {
      // Calculate depth position relative to active card
      // Active card is on top (highest z-index), others fan behind
      const distanceFromActive =
        (index - activeIndex + totalCerts) % totalCerts;

      // Reverse order: active = front, others behind
      const depth = distanceFromActive === 0 ? 0 : distanceFromActive;
      const zIndex = totalCerts - depth;

      const offsetX = -depth * STACK_OFFSET_X;
      const offsetY = -depth * STACK_OFFSET_Y;
      const rotation = -depth * STACK_ROTATION;
      const scale = 1 - depth * 0.03;
      const opacity = depth === 0 ? 1 : Math.max(0.15, 1 - depth * 0.3);

      return {
        transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex,
        opacity,
        transition: `all ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.35, 1)`,
      };
    },
    [activeIndex, totalCerts]
  );

  // ── Entrance GSAP ScrollTrigger ──
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cert-showcase-stack",
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cert-showcase",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".cert-menu-item",
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cert-menu-list",
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
      id="certifications"
      className="py-14 md:py-20 bg-transparent border-b border-[#F5F5F0]/12"
    >
      {/* ═══ Section Heading ═══ */}
      <div className="px-6 md:px-12 max-w-[1728px] mx-auto mb-10 md:mb-14">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-4 border-b border-[#F5F5F0]/12 pb-3">
          <span className="text-[#D7FF00] font-bold">[05]</span>
          <span>FORMAL CREDENTIALS</span>
          <span className="flex-1" />
          <span>
            {String(certifications.length).padStart(2, "0")} CERTIFICATIONS
          </span>
        </div>

        <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-black uppercase tracking-[-0.04em] text-[#F5F5F0]">
          VERIFIED CREDENTIALS<span className="text-[#D7FF00]">.</span>
        </h2>
      </div>

      {/* ═══ Showcase Slider ═══ */}
      <div className="cert-showcase px-6 md:px-12 max-w-[1728px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          {/* ── Left: Stacked Certificate Cards ── */}
          <div className="cert-showcase-stack relative w-full max-w-[520px] lg:w-[55%] aspect-[4/3] shrink-0">
            {certifications.map((cert, index) => (
              <div
                key={cert.name}
                className="absolute inset-0 will-change-transform cursor-pointer"
                style={getCardStyle(index)}
                onClick={() => handleSelect(index)}
              >
                {/* Card Container */}
                <div
                  className={`relative w-full h-full rounded-2xl overflow-hidden border-2 transition-all duration-500 ${index === activeIndex
                      ? "border-[#D7FF00]/50 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(215,255,0,0.08)]"
                      : "border-[#F5F5F0]/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                    }`}
                >
                  {/* Certificate Image */}
                  <Image
                    src={cert.image}
                    alt={`${cert.name} — ${cert.provider} Certificate`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 520px"
                    priority={index === 0}
                  />

                  {/* Subtle dark overlay for depth on non-active cards */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${index === activeIndex
                        ? "bg-transparent"
                        : "bg-black/40"
                      }`}
                  />

                  {/* Active card: bottom gradient with provider badge */}
                  {index === activeIndex && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 md:p-6">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                        <span className="px-2 py-0.5 bg-[#D7FF00] text-black font-bold rounded-sm">
                          {cert.provider}
                        </span>
                        <span className="text-[#F5F5F0]/60">
                          CERT // {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Active glow top edge */}
                  {index === activeIndex && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D7FF00]/60 to-transparent" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: Certificate Menu List ── */}
          <div className="cert-menu-list flex-1 w-full lg:w-auto flex flex-col justify-center min-h-[300px]">
            {/* Menu heading */}
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D7FF00] font-bold mb-8">
              CREDENTIALS
            </div>

            {/* Menu items */}
            <div className="space-y-2">
              {certifications.map((cert, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={cert.name}
                    className="cert-menu-item w-full text-left cursor-pointer group"
                    onClick={() => handleSelect(index)}
                    onMouseEnter={() => handleSelect(index)}
                    aria-label={`View certificate: ${cert.name}`}
                  >
                    <div
                      className={`flex items-start gap-4 md:gap-6 py-4 px-4 md:px-5 rounded-xl border transition-all duration-400 ${isActive
                          ? "border-[#D7FF00]/30 bg-[#D7FF00]/[0.04] shadow-[0_0_20px_rgba(215,255,0,0.06)]"
                          : "border-transparent hover:border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/[0.02]"
                        }`}
                    >
                      {/* Number */}
                      <span
                        className={`font-mono text-xs font-bold shrink-0 pt-1 transition-colors duration-300 ${isActive ? "text-[#D7FF00]" : "text-[#8A8A8A]"
                          }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Connector line (visible only on active, desktop) */}
                      <div
                        className={`hidden lg:block w-12 shrink-0 mt-3 transition-all duration-500 ${isActive
                            ? "opacity-100"
                            : "opacity-0"
                          }`}
                      >
                        <div className="h-[1px] w-full bg-gradient-to-r from-[#D7FF00]/60 to-[#D7FF00]/10" />
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg md:text-xl font-bold uppercase tracking-tight leading-snug transition-colors duration-300 ${isActive
                              ? "text-[#D7FF00]"
                              : "text-[#F5F5F0] group-hover:text-[#F5F5F0]/80"
                            }`}
                        >
                          {cert.name}
                        </h3>

                        {/* Active: show provider + View Certificate link */}
                        <div
                          className={`overflow-hidden transition-all duration-400 ${isActive
                              ? "max-h-20 opacity-100 mt-2"
                              : "max-h-0 opacity-0 mt-0"
                            }`}
                        >
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]">
                              {cert.provider} • VERIFIED
                            </span>
                            {cert.url && (
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#D7FF00] uppercase tracking-wider hover:underline transition-colors"
                              >
                                VIEW CERTIFICATE
                                <ArrowUpRight size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider between items */}
                    {index < totalCerts - 1 && (
                      <div className="mx-4 md:mx-5 border-b border-[#F5F5F0]/8 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
