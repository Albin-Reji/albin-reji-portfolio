"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, useInView, animate } from "framer-motion";

interface MetricCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function MetricCounter({
  value,
  prefix,
  suffix,
  decimals = 0,
  className,
}: MetricCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplay(decimals > 0 ? value.toFixed(decimals) : String(Math.round(value)));
      return;
    }

    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1] as const,
      onUpdate(latest) {
        setDisplay(decimals > 0 ? latest.toFixed(decimals) : String(Math.round(latest)));
      },
    });

    return () => controls.stop();
  }, [isInView, value, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix && <span className="text-2xl sm:text-3xl text-[#8A8A8A] mr-1">{prefix}</span>}
      {display}
      {suffix && (
        <span className="text-2xl sm:text-3xl md:text-4xl text-[#DDFE67]">{suffix}</span>
      )}
    </span>
  );
}
