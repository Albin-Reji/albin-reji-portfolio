"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { certifications } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cert-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cert-grid",
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
      <div className="px-6 md:px-12 max-w-[1728px] mx-auto mb-8 md:mb-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-4 border-b border-[#F5F5F0]/12 pb-3">
          <span className="text-[#D7FF00] font-bold">[05]</span>
          <span>FORMAL CREDENTIALS</span>
          <span className="flex-1" />
          <span>{certifications.length} CERTIFICATIONS</span>
        </div>

        <h2 className="text-[clamp(1.5rem,4vw,3.5rem)] font-black uppercase tracking-[-0.04em] text-[#F5F5F0]">
          VERIFIED CREDENTIALS<span className="text-[#D7FF00]">.</span>
        </h2>
      </div>

      {/* ═══ Cert Cards ═══ */}
      <div className="cert-grid px-6 md:px-12 max-w-[1728px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, idx) => (
            <div
              key={cert.name}
              className="cert-card border border-[#F5F5F0]/12 p-6 md:p-8 bg-[#F5F5F0]/[0.02] hover:border-[#D7FF00] transition-all group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A]">
                  <span>CERT // 0{idx + 1}</span>
                  <span className="text-[#D7FF00] font-semibold">{cert.provider}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors leading-snug">
                  {cert.name}
                </h3>
              </div>

              <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]">
                  STATUS: VERIFIED
                </span>
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#D7FF00] uppercase tracking-wider hover:underline"
                  >
                    VIEW <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className="font-mono text-[10px] text-[#8A8A8A] uppercase tracking-wider">
                    VERIFIED ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
