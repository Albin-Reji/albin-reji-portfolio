"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  stagger?: number;
  y?: number;
}

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  stagger = 0.08,
  y = 60,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !ref.current) return;

    const el = ref.current;
    const children = el.querySelectorAll(".reveal-line");

    if (children.length === 0) {
      // Animate the container itself
      gsap.set(el, { y, opacity: 0 });

      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    } else {
      // Staggered line reveal
      gsap.set(children, { y, opacity: 0 });

      gsap.to(children, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [delay, stagger, y]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement & HTMLDivElement>} className={`overflow-hidden ${className}`}>
      {children}
    </Tag>
  );
}
