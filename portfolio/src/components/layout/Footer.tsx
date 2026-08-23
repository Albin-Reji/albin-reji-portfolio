"use client";

import { useState } from "react";
import { ArrowUp, Copy, Check } from "lucide-react";
import { personalInfo, socialLinks } from "@/data/portfolio";
import {
  GitHubIcon,
  LinkedInIcon,
  LeetCodeIcon,
  XIcon,
  MailIcon,
} from "@/components/ui/Icons";

const footerIconMap: Record<string, React.ComponentType<{ width?: number; height?: number }>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  leetcode: LeetCodeIcon,
  x: XIcon,
  mail: MailIcon,
};

export default function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <footer className="px-6 md:px-12 py-16 md:py-24 max-w-[1728px] mx-auto bg-[#050505] text-[#F5F5F0]">
      {/* Massive Editorial Statement */}
      <div className="border-b border-[#F5F5F0]/15 pb-16 md:pb-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#D7FF00] mb-4">
          // FINAL FRAME
        </p>
        <h2 className="text-display-xl font-black leading-none text-[#F5F5F0] tracking-tighter">
          LET&apos;S BUILD
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D7FF00] to-[#F5F5F0]">
            SOMETHING.
          </span>
        </h2>
      </div>

      {/* Footer Navigation & Social Links Strip */}
      <div className="py-12 border-b border-[#F5F5F0]/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-mono text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] block mb-3">
            PRIMARY IDENTITY
          </span>
          <p className="text-sm font-bold uppercase text-[#F5F5F0]">
            {personalInfo.name}
          </p>
          <p className="text-[#8A8A8A] uppercase mt-1">
            {personalInfo.title}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] block mb-3">
            BASE LOCATION
          </span>
          <p className="text-[#F5F5F0] uppercase">
            {personalInfo.location}
          </p>
          <p className="text-[#8A8A8A] uppercase mt-1">
            INDIA // GLOBAL AVAILABILITY
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] block mb-3">
            DIRECT INQUIRY
          </span>
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-[#D7FF00] hover:underline uppercase block font-bold"
            aria-label={`Send email to ${personalInfo.email}`}
          >
            {personalInfo.email}
          </a>
          <button
            onClick={handleCopyEmail}
            className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] uppercase border border-[#F5F5F0]/15 text-[#8A8A8A] hover:border-[#D7FF00] hover:text-[#D7FF00] transition-colors cursor-pointer"
            aria-label="Copy email address to clipboard"
          >
            {copiedEmail ? (
              <>
                <Check size={10} className="text-[#D7FF00]" />
                <span className="text-[#D7FF00] font-bold">COPIED!</span>
              </>
            ) : (
              <>
                <Copy size={10} />
                <span>COPY EMAIL</span>
              </>
            )}
          </button>
          <span className="text-[#8A8A8A] mt-2 block">
            {personalInfo.phone}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] block mb-3">
            SOCIAL NETWORKS
          </span>
          <div className="flex flex-col space-y-2">
            {socialLinks.map((link) => {
              const Icon = footerIconMap[link.icon];
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target={link.icon === "mail" ? undefined : "_blank"}
                  rel={link.icon === "mail" ? undefined : "noopener noreferrer"}
                  aria-label={`Open ${link.platform} profile`}
                  className="inline-flex items-center gap-2 text-[#F5F5F0] hover:text-[#D7FF00] uppercase transition-colors group"
                >
                  {Icon && <Icon width={12} height={12} />}
                  <span>{link.platform}</span>
                  <span className="text-[#8A8A8A] group-hover:text-[#D7FF00] transition-colors">↗</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar & Return to top */}
      <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-[#8A8A8A]">
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
