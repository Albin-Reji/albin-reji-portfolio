"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navItems, personalInfo } from "@/data/portfolio";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleNavClick = useCallback((href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#050505]/90 backdrop-blur-md border-b border-[#F5F5F0]/10 py-3.5"
            : "bg-[#050505]/90 backdrop-blur-sm border-b border-[#F5F5F0]/10 py-3.5"
        }`}
      >
        <nav
          className="mx-auto flex w-full max-w-[1728px] items-center justify-between px-6 md:px-12"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group text-left cursor-pointer flex items-center focus:outline-none flex-shrink-0 z-10"
            aria-label="Albin Reji - Back to top"
          >
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-lg border border-[#F5F5F0]/20 bg-[#D7FF00]/10 transition-all duration-300 group-hover:border-[#D7FF00] group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(215,255,0,0.35)]">
              <Image
                src="/logo.png"
                alt="Albin Reji Logo"
                fill
                sizes="(max-width: 640px) 44px, 48px"
                className="object-cover"
                priority
              />
            </div>
          </button>

          {/* Center Coordinates / Editorial Label */}
          <div className="hidden xl:flex items-center gap-4 font-mono text-[10px] tracking-[0.25em] text-[#8A8A8A] uppercase">
            <span>FULL STACK ENGINEER</span>
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
            {navItems.map((item, idx) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="group relative flex items-center gap-1.5 py-1 font-mono text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer"
                  >
                    <span className="text-[9px] text-[#8A8A8A] group-hover:text-[#D7FF00] transition-colors">
                      0{idx + 1}
                    </span>
                    <span
                      className={`font-semibold ${isActive
                        ? "text-[#D7FF00]"
                        : "text-[#F5F5F0] group-hover:text-[#D7FF00]"
                        } transition-colors`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="inline-block h-1 w-1 rounded-full bg-[#D7FF00] ml-0.5" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-[#F5F5F0] hover:text-[#D7FF00] transition-colors cursor-pointer border border-[#F5F5F0]/15 rounded-none"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#050505] flex flex-col justify-between p-8 pt-28 md:hidden"
          >
            <div className="space-y-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] border-b border-[#F5F5F0]/15 pb-3">
                Index Navigation
              </p>
              <ul className="space-y-6">
                {navItems.map((item, idx) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="w-full text-left flex items-center justify-between group py-2"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-[#8A8A8A]">
                          0{idx + 1}
                        </span>
                        <span className="text-3xl font-extrabold uppercase tracking-tight text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <ArrowUpRight
                        size={20}
                        className="text-[#8A8A8A] group-hover:text-[#D7FF00] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                      />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#F5F5F0]/15 pt-6 space-y-2 font-mono text-[11px] uppercase tracking-wider text-[#8A8A8A]">
              <p className="text-[#F5F5F0] font-semibold">{personalInfo.name}</p>
              <p>{personalInfo.location}</p>
              <p className="text-[#D7FF00] pt-2">{personalInfo.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
