"use client";

import { ArrowUp } from "lucide-react";
import { personalInfo } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 py-8 max-w-[1728px] mx-auto bg-transparent text-[#F5F5F0]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-[#8A8A8A]">
        <div>
          &copy; {new Date().getFullYear()} {personalInfo.name}. ART-DIRECTED DEV PORTFOLIO.
        </div>

        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex items-center gap-2 text-[#F5F5F0] hover:text-[#D7FF00] transition-colors cursor-pointer"
          aria-label="Scroll back to top of page"
        >
          <span>BACK TO SUMMIT</span>
          <ArrowUp size={14} className="text-[#D7FF00]" />
        </button>
      </div>
    </footer>
  );
}
