"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, X, Maximize2 } from "lucide-react";
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
  const [previewCert, setPreviewCert] = useState<typeof certifications[0] | null>(null);

  const totalCerts = certifications.length;

  // ── Handle menu item click/hover ──
  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // ── Compute stacked card style ──
  const getCardStyle = useCallback(
    (index: number): React.CSSProperties => {
      const distanceFromActive =
        (index - activeIndex + totalCerts) % totalCerts;

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

  // Close preview on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewCert(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
      className="py-14 md:py-20 bg-transparent"
    >
      {/* ═══ Section Heading ═══ */}
      <div className="px-6 md:px-12 max-w-[1728px] mx-auto mb-10 md:mb-14">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-4 border-b border-[#F5F5F0]/12 pb-3">
          <span className="text-[#DDFE67] font-bold">[05]</span>
          <span>FORMAL CREDENTIALS</span>
          <span className="flex-1" />
          <span>
            {String(certifications.length).padStart(2, "0")} CERTIFICATIONS
          </span>
        </div>

        <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-black uppercase tracking-[-0.04em] text-[#F5F5F0]">
          VERIFIED CREDENTIALS<span className="text-[#DDFE67]">.</span>
        </h2>
      </div>

      {/* ═══ Showcase Slider ═══ */}
      <div className="cert-showcase px-6 md:px-12 max-w-[1728px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          {/* ── Left: Stacked Certificate Cards ── */}
          <div className="cert-showcase-stack relative w-full max-w-[520px] lg:w-[55%] aspect-[4/3] shrink-0">
            {certifications.map((cert, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={cert.name}
                  className="absolute inset-0 will-change-transform cursor-pointer group"
                  style={getCardStyle(index)}
                  onClick={() => {
                    if (isActive) {
                      setPreviewCert(cert);
                    } else {
                      handleSelect(index);
                    }
                  }}
                >
                  {/* Card Container */}
                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                      isActive
                        ? "border-[#DDFE67]/60 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_45px_rgba(221,254,103,0.12)]"
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
                      className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                        isActive ? "bg-transparent" : "bg-black/40"
                      }`}
                    />

                    {/* Active card: bottom gradient with provider badge & inspect hint */}
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 md:p-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                          <span className="px-2.5 py-1 bg-[#DDFE67] text-black font-bold rounded-sm shadow-[0_0_10px_rgba(221,254,103,0.5)]">
                            {cert.provider}
                          </span>
                          <span className="text-[#F5F5F0]/60">
                            CERT // {String(activeIndex + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#DDFE67] uppercase tracking-wider group-hover:scale-105 transition-transform">
                          <Maximize2 size={12} />
                          <span className="hidden sm:inline">INSPECT</span>
                        </div>
                      </div>
                    )}

                    {/* Active glow top edge */}
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DDFE67]/70 to-transparent" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right: Certificate Menu List ── */}
          <div className="cert-menu-list flex-1 w-full lg:w-auto flex flex-col justify-center min-h-[300px]">
            {/* Menu heading */}
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#DDFE67] font-bold mb-8">
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
                      className={`flex items-start gap-4 md:gap-6 py-4 px-4 md:px-5 rounded-xl border transition-all duration-400 ${
                        isActive
                          ? "border-[#DDFE67]/40 bg-[#DDFE67]/[0.05] shadow-[0_0_25px_rgba(221,254,103,0.08)]"
                          : "border-transparent hover:border-[#F5F5F0]/10 hover:bg-[#F5F5F0]/[0.02]"
                      }`}
                    >
                      {/* Number */}
                      <span
                        className={`font-mono text-xs font-bold shrink-0 pt-1 transition-colors duration-300 ${
                          isActive ? "text-[#DDFE67]" : "text-[#8A8A8A]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Connector line (visible only on active, desktop) */}
                      <div
                        className={`hidden lg:block w-12 shrink-0 mt-3 transition-all duration-500 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <div className="h-[1px] w-full bg-gradient-to-r from-[#DDFE67]/70 to-[#DDFE67]/10" />
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg md:text-xl font-bold uppercase tracking-tight leading-snug transition-colors duration-300 ${
                            isActive
                              ? "text-[#DDFE67]"
                              : "text-[#F5F5F0] group-hover:text-[#F5F5F0]/80"
                          }`}
                        >
                          {cert.name}
                        </h3>

                        {/* Active: show provider + View Certificate link */}
                        <div
                          className={`overflow-hidden transition-all duration-400 ${
                            isActive
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
                                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#DDFE67] uppercase tracking-wider hover:underline transition-colors"
                              >
                                VIEW CREDENTIAL
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

      {/* ═══ Fullscreen Certificate Lightbox Modal ═══ */}
      {previewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#000000]/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setPreviewCert(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-[#0d0d0d] border border-[#DDFE67]/50 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(221,254,103,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F5F0]/15 bg-[#050505]">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
                <span className="px-2 py-0.5 bg-[#DDFE67] text-black font-bold text-[10px]">
                  {previewCert.provider}
                </span>
                <span className="text-[#F5F5F0] font-bold truncate max-w-[280px] sm:max-w-md">
                  {previewCert.name}
                </span>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="p-1.5 text-[#8A8A8A] hover:text-[#DDFE67] transition-colors cursor-pointer"
                aria-label="Close certificate preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative aspect-[16/11] w-full bg-[#000000]">
              <Image
                src={previewCert.image}
                alt={previewCert.name}
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            {/* Modal Footer */}
            {previewCert.url && (
              <div className="px-6 py-3 border-t border-[#F5F5F0]/15 bg-[#050505] flex items-center justify-between font-mono text-xs">
                <span className="text-[#8A8A8A]">AUTHENTICATED CREDENTIAL</span>
                <a
                  href={previewCert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#DDFE67] font-semibold hover:underline"
                >
                  <span>OFFICIAL VERIFICATION LINK</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
