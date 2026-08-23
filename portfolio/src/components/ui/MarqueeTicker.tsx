"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MarqueeTickerProps {
  items: string[];
  speed?: number;
  separator?: string;
  className?: string;
  reverse?: boolean;
}

export default function MarqueeTicker({
  items,
  speed = 40,
  separator = "—",
  className = "",
  reverse = false,
}: MarqueeTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current || !innerRef.current) return;

    const inner = innerRef.current;
    const totalWidth = inner.scrollWidth / 2;
    const duration = totalWidth / speed;

    const tween = gsap.to(inner, {
      x: reverse ? totalWidth : -totalWidth,
      duration,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          return reverse
            ? ((x % totalWidth) + totalWidth) % totalWidth
            : ((x % totalWidth) - totalWidth) % totalWidth + totalWidth;
        }),
      },
    });

    // Simpler approach: just use fromTo
    tween.kill();

    const anim = gsap.fromTo(
      inner,
      { x: reverse ? -totalWidth : 0 },
      {
        x: reverse ? 0 : -totalWidth,
        duration,
        ease: "none",
        repeat: -1,
      }
    );

    return () => {
      anim.kill();
    };
  }, [items, speed, reverse]);

  const content = items.map((item, i) => (
    <span key={i} className="inline-flex items-center gap-6 whitespace-nowrap">
      <span>{item}</span>
      <span className="text-[#D7FF00] opacity-60">{separator}</span>
    </span>
  ));

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
      aria-hidden="true"
    >
      <div ref={innerRef} className="inline-flex items-center gap-6">
        {/* Duplicate content for seamless loop */}
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}
