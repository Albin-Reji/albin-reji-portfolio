"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: string;
  title: string;
  category?: string;
  children?: ReactNode;
}

export default function SectionHeading({
  index,
  title,
  category,
  children,
}: SectionHeadingProps) {
  return (
    <div className="relative mb-16 md:mb-24">
      {/* Top micro metadata strip */}
      <div className="flex items-center justify-between border-b border-[#F5F5F0]/15 pb-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#D7FF00] tracking-[0.2em]">
            [{index}]
          </span>
          {category && (
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8A8A8A]">
              / {category}
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A]">
          ALBIN REJI — 2025/2026
        </span>
      </div>

      {/* Main Large Display Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <h2 className="text-display-lg font-black uppercase text-[#F5F5F0]">
          {title}
        </h2>
        {children && (
          <p className="max-w-2xl text-base md:text-lg text-[#B5B5B5] font-normal leading-relaxed">
            {children}
          </p>
        )}
      </motion.div>
    </div>
  );
}
