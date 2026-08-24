"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SVGSignatureProps {
  className?: string;
  color?: string;
  strokeWidth?: number;
  delay?: number;
}

export default function SVGSignature({
  className = "",
  color = "#D7FF00",
  strokeWidth = 3.5,
  delay = 0.4,
}: SVGSignatureProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !pathRef.current || !svgRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Set initial dasharray & offset
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 0,
    });

    const trigger = ScrollTrigger.create({
      trigger: svgRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(path, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.4,
          delay,
          ease: "power2.out",
        });
      },
    });

    return () => trigger.kill();
  }, [delay]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto overflow-visible ${className}`}
      aria-hidden="true"
    >
      {/* Expressive swoosh underline path */}
      <path
        ref={pathRef}
        d="M 5 42 C 60 18, 140 12, 220 28 C 265 37, 298 46, 312 30 C 318 24, 305 18, 285 22 C 255 28, 230 45, 290 50 C 305 52, 315 48, 318 42"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
