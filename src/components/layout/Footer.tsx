"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { personalInfo, socialLinks } from "@/data/portfolio";
import {
  GitHubIcon,
  LinkedInIcon,
  LeetCodeIcon,
  XIcon,
  MailIcon,
} from "@/components/ui/Icons";
import type { ComponentType, SVGProps } from "react";

const iconMap: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
> = {
  github: ({ size = 18, ...props }) => (
    <GitHubIcon width={size} height={size} {...props} />
  ),
  linkedin: ({ size = 18, ...props }) => (
    <LinkedInIcon width={size} height={size} {...props} />
  ),
  leetcode: ({ size = 18, ...props }) => (
    <LeetCodeIcon width={size} height={size} {...props} />
  ),
  x: ({ size = 18, ...props }) => (
    <XIcon width={size} height={size} {...props} />
  ),
  mail: ({ size = 18, ...props }) => (
    <MailIcon width={size} height={size} {...props} />
  ),
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] text-[#F5F5F0] border-t border-[#DDFE67]/20 relative z-20">
      <div className="max-w-[1728px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 py-10 sm:py-12">
        {/* ── Social Channels Bar ("Last Space") ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#DDFE67] shadow-[0_0_8px_rgba(221,254,103,0.8)] animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
              NETWORK CHANNELS // DIRECT DISPATCH
            </span>
          </div>

          {/* Clickable Social Logos */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon];
              const isMail = link.icon === "mail";
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noopener noreferrer"}
                  aria-label={`Visit Albin Reji on ${link.platform}`}
                  className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#111111] hover:bg-[#18181B] border border-white/10 hover:border-[#DDFE67] text-[#D4D4D8] hover:text-[#DDFE67] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(221,254,103,0.15)]"
                >
                  <span className="text-[#A1A1AA] group-hover:text-[#DDFE67] transition-colors">
                    {Icon && <Icon size={16} />}
                  </span>
                  <span className="font-mono text-xs font-bold tracking-wider uppercase">
                    {link.platform}
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#DDFE67]"
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Footer Bottom Row ── */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-[#8A8A8A]">
          <div className="flex items-center gap-3 text-center sm:text-left flex-wrap justify-center sm:justify-start">
            <span>&copy; {new Date().getFullYear()} {personalInfo.name}. ART-DIRECTED DEV PORTFOLIO.</span>
            <span className="hidden md:inline text-[#F5F5F0]/20">•</span>
            <span className="hidden md:inline text-[#777771]">BENGALURU, IN</span>
          </div>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 text-[#F5F5F0] hover:text-[#DDFE67] transition-colors cursor-pointer py-1 px-2 rounded"
            aria-label="Scroll back to top of page"
          >
            <span>BACK TO SUMMIT</span>
            <ArrowUp
              size={14}
              className="text-[#DDFE67] transition-transform duration-300 group-hover:-translate-y-1"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
