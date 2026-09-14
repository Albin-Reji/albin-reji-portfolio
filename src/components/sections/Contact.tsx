"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, AlertCircle, Loader2 } from "lucide-react";
import {
  GitHubIcon,
  LinkedInIcon,
  LeetCodeIcon,
  XIcon,
  MailIcon,
} from "@/components/ui/Icons";

import SVGSignature from "@/components/ui/SVGSignature";
import {
  personalInfo,
  socialLinks,
  contactSubtext,
} from "@/data/portfolio";
import type { ComponentType, SVGProps } from "react";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
> = {
  github: ({ size = 16, ...props }) => (
    <GitHubIcon width={size} height={size} {...props} />
  ),
  linkedin: ({ size = 16, ...props }) => (
    <LinkedInIcon width={size} height={size} {...props} />
  ),
  leetcode: ({ size = 16, ...props }) => (
    <LeetCodeIcon width={size} height={size} {...props} />
  ),
  x: ({ size = 16, ...props }) => (
    <XIcon width={size} height={size} {...props} />
  ),
  mail: ({ size = 16, ...props }) => (
    <MailIcon width={size} height={size} {...props} />
  ),
};

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!form.message.trim()) errors.message = "Message is required";
  return errors;
}

/* ── Inline SVG Topographic Contour Pattern (Subtle Ambient) ─────────────────── */
function ContourPattern() {
  return (
    <svg
      className="contact-contour-svg contact-contour-animate"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke="#6F733F" strokeWidth="0.75">
        <path d="M-40 110 C220 70, 420 150, 640 110 S920 50, 1140 120 S1320 170, 1500 90" />
        <path d="M-40 190 C190 230, 390 170, 590 210 S800 270, 1000 190 S1220 150, 1480 230" />
        <path d="M-40 300 C170 260, 370 320, 570 280 S770 240, 970 310 S1180 360, 1480 280" />
        <path d="M-40 390 C230 430, 430 370, 630 420 S830 460, 1030 380 S1250 340, 1480 410" />
        <path d="M-40 490 C210 450, 410 510, 610 470 S810 430, 1010 500 S1210 550, 1480 470" />
        <path d="M-40 580 C190 620, 390 560, 590 600 S790 640, 990 570 S1190 530, 1480 590" />
        <path d="M-40 670 C230 630, 430 690, 630 650 S830 610, 1030 680 S1230 720, 1480 660" />
        <path d="M-40 760 C210 800, 410 740, 610 780 S810 820, 1010 750 S1210 710, 1480 790" />
        <path d="M-40 840 C250 800, 450 860, 650 820 S850 780, 1050 850 S1290 890, 1480 830" />
        <path d="M-40 150 C250 120, 450 180, 650 140 S870 100, 1070 160 S1290 200, 1480 140" opacity="0.6" />
        <path d="M-40 340 C210 370, 410 310, 610 350 S810 390, 1010 330 S1230 290, 1480 360" opacity="0.6" />
        <path d="M-40 530 C250 500, 450 560, 650 520 S850 480, 1050 540 S1270 580, 1480 520" opacity="0.6" />
        <path d="M-40 710 C190 750, 390 690, 590 730 S790 770, 990 710 S1190 670, 1480 730" opacity="0.6" />
      </g>
    </svg>
  );
}

/* ── Hand-drawn Strike-through SVG ───────────────────────────────────────── */
function StrikethroughSVG() {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !pathRef.current || !svgRef.current) return;
    const path = pathRef.current;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: svgRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(path, { strokeDashoffset: 0, opacity: 1, duration: 0.9, delay: 1.1, ease: "power2.out" });
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 440 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="contact-strikethrough max-w-full"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M 4 20 C 60 14, 120 25, 185 16 C 240 9, 300 23, 365 15 C 390 12, 415 18, 436 15"
        stroke="#DDFE67"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type EmailVerifyStatus = "idle" | "checking" | "valid" | "invalid";

interface EmailVerifyState {
  status: EmailVerifyStatus;
  suggestion: string | null;
  message: string | null;
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [emailVerify, setEmailVerify] = useState<EmailVerifyState>({
    status: "idle",
    suggestion: null,
    message: null,
  });
  const emailVerifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastVerifiedEmailRef = useRef<string>("");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const performEmailVerification = async (emailToVerify: string): Promise<boolean> => {
    const trimmed = emailToVerify.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailVerify({ status: "idle", suggestion: null, message: null });
      return false;
    }

    if (lastVerifiedEmailRef.current === trimmed && emailVerify.status === "valid") {
      return true;
    }

    setEmailVerify((prev) => ({ ...prev, status: "checking" }));

    try {
      const res = await fetch(`/api/verify-email?email=${encodeURIComponent(trimmed)}`);
      const data = (await res.json()) as {
        valid: boolean;
        error?: string | null;
        suggestion?: string | null;
      };

      lastVerifiedEmailRef.current = trimmed;

      if (data.valid) {
        setEmailVerify({
          status: "valid",
          suggestion: null,
          message: null,
        });
        setErrors((prev) => {
          const next = { ...prev };
          delete next.email;
          return next;
        });
        return true;
      } else {
        setEmailVerify({
          status: "invalid",
          suggestion: data.suggestion || null,
          message: data.error || "The email address is invalid.",
        });
        setErrors((prev) => ({
          ...prev,
          email: data.error || "The email address is invalid.",
        }));
        return false;
      }
    } catch {
      setEmailVerify({ status: "idle", suggestion: null, message: null });
      return true;
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    setForm((prev) => ({ ...prev, email: suggestion }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.email;
      return next;
    });
    performEmailVerification(suggestion);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-cta-line",
        { y: "115%", opacity: 0, skewY: 3 },
        {
          y: "0%", opacity: 1, skewY: 0, duration: 1.2, stagger: 0.18, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-cta-trigger", start: "top 80%", once: true },
        }
      );
      gsap.fromTo(
        ".cta-dash-line",
        { width: 0, opacity: 0 },
        {
          width: "2.5rem", opacity: 1, duration: 0.8, delay: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-cta-trigger", start: "top 80%", once: true },
        }
      );
      gsap.fromTo(
        ".contact-block-fade",
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-content-grid", start: "top 75%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
    if (serverError) setServerError("");

    if (field === "email") {
      const trimmed = value.trim();
      if (emailVerifyTimeoutRef.current) {
        clearTimeout(emailVerifyTimeoutRef.current);
      }

      if (trimmed !== lastVerifiedEmailRef.current) {
        setEmailVerify({ status: "idle", suggestion: null, message: null });
      }

      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
        emailVerifyTimeoutRef.current = setTimeout(() => {
          performEmailVerification(trimmed);
        }, 700);
      }
    }
  };

  const handleEmailBlur = () => {
    const trimmed = form.email.trim();
    if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      if (trimmed !== lastVerifiedEmailRef.current || emailVerify.status !== "valid") {
        if (emailVerifyTimeoutRef.current) {
          clearTimeout(emailVerifyTimeoutRef.current);
        }
        performEmailVerification(trimmed);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (emailVerify.status === "invalid") {
      setErrors((prev) => ({
        ...prev,
        email: emailVerify.message || "Please provide a valid, existing return email.",
      }));
      return;
    }

    setErrors({});
    setServerError("");
    setSubmitStatus("loading");

    if (emailVerify.status !== "valid" || lastVerifiedEmailRef.current !== form.email.trim()) {
      const isDomainValid = await performEmailVerification(form.email.trim());
      if (!isDomainValid) {
        setSubmitStatus("idle");
        return;
      }
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setSubmitStatus("error");
        return;
      }
      setSubmitStatus("success");
    } catch {
      setServerError("Network error — please check your connection and retry.");
      setSubmitStatus("error");
    }
  };

  const handleReset = () => {
    setSubmitStatus("idle");
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setServerError("");
    setEmailVerify({ status: "idle", suggestion: null, message: null });
    lastVerifiedEmailRef.current = "";
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-editorial-bg relative z-10 w-full max-w-full overflow-hidden pb-20 md:pb-28 lg:pb-32 box-border"
    >
      <ContourPattern />

      <div className="relative z-10 w-full max-w-full box-border">
        {/* ═══ Section Label ═══ */}
        <div className="contact-cta-trigger px-5 sm:px-8 md:px-12 lg:px-20 max-w-[1728px] mx-auto w-full pt-16 sm:pt-20 md:pt-24 lg:pt-28 box-border">
          <div className="flex items-center gap-3 contact-section-label mb-4 pb-4 border-b border-[rgba(23,23,23,0.18)] flex-wrap">
            <span className="text-[#171717] font-bold">[07]</span>
            <span className="text-[rgba(23,23,23,0.65)]">CONTACT // DIRECT COMMS</span>
            <span className="flex-1 min-w-[20px]" />
            <span className="text-[#171717] font-bold hidden sm:inline">AVAILABLE FOR FULL-TIME ROLES</span>
          </div>

          {/* ═══ Editorial Headline ═══ */}
          <div className="space-y-1 md:space-y-2 relative mt-8 md:mt-12 max-w-full">
            <div className="overflow-hidden max-w-full">
              <h2 className="contact-cta-line text-[clamp(1.75rem,7.5vw,8.5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-[#171717] break-normal">
                LET&apos;S BUILD
              </h2>
            </div>
            <div className="overflow-visible relative max-w-full">
              <h2 className="contact-cta-line text-[clamp(1.75rem,7.5vw,8.5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-[#171717] break-normal">
                <span className="relative inline-block max-w-full">
                  SOMETHING
                  <span className="absolute -bottom-[22%] left-0 w-full pointer-events-none z-10 block max-w-full" aria-hidden="true">
                    <SVGSignature delay={0.6} strokeWidth={4.5} />
                  </span>
                </span>
              </h2>
            </div>
            <div className="overflow-visible pt-3 sm:pt-4 md:pt-6 max-w-full">
              <h2 className="contact-cta-line text-[clamp(1.75rem,7.5vw,8.5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-[#171717] relative inline-block max-w-full break-normal">
                THAT SCALES.
                <StrikethroughSVG />
              </h2>
            </div>
          </div>

          <div className="mt-8 contact-cta-line flex items-center gap-4 flex-wrap">
            <span className="cta-dash-line block w-10 h-[2px] bg-[#171717]" />
            <p className="text-base md:text-xl text-[#171717] font-medium leading-relaxed tracking-wide italic">
              Useful by design<span className="text-[#171717] not-italic font-bold mx-1">·</span>Built with intent<span className="text-[#171717] not-italic font-bold">.</span>
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-[rgba(23,23,23,0.75)] font-normal leading-relaxed contact-cta-line">
            {contactSubtext}
          </p>
        </div>

        {/* ═══ Content Grid ═══ */}
        <div className="contact-content-grid px-5 sm:px-8 md:px-12 lg:px-20 max-w-[1728px] mx-auto w-full mt-14 sm:mt-16 md:mt-24 box-border min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full min-w-0">

            {/* ── Left Column: Direct Comms (Image 2) + Network Channels ── */}
            <div className="lg:col-span-5 space-y-6 contact-block-fade w-full min-w-0">
              
              {/* Direct Comms Card (Image 2 Design) */}
              <div className="transmission-card bg-white rounded-[2rem] sm:rounded-[2.25rem] p-6 sm:p-8 md:p-9 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] relative">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
                  <span className="font-mono text-xs sm:text-[13px] font-bold text-[#4D5A2B] tracking-[0.16em] uppercase">
                    // DIRECT COMMS
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold text-slate-800 tracking-wider uppercase">
                      INBOX OPEN
                    </span>
                  </div>
                </div>

                {/* Primary Email */}
                <div className="space-y-2 mb-4 sm:mb-5">
                  <span className="block font-mono text-[10px] sm:text-[11px] font-semibold text-[#64748B] tracking-[0.16em] uppercase">
                    PRIMARY EMAIL
                  </span>
                  <div className="bg-[#F4F7FB] border border-[#CBD5E1]/70 rounded-2xl p-3 sm:p-3.5 md:p-4 flex items-center justify-between gap-3 hover:border-[#94A3B8] transition-colors">
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="font-mono font-bold text-sm sm:text-base md:text-[17px] text-slate-900 hover:text-[#4D5A2B] transition-colors tracking-tight truncate select-all"
                      aria-label={`Send email to ${personalInfo.email}`}
                    >
                      {personalInfo.email}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="bg-[#111111] hover:bg-black text-[#CCFF00] px-4 sm:px-5 py-2 rounded-full font-mono font-extrabold text-xs tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
                      aria-label="Copy email address"
                    >
                      {copiedEmail ? (
                        <>
                          <Check size={13} className="text-[#CCFF00]" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <span>COPY</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
                  {/* Phone // WhatsApp */}
                  <div className="bg-[#F4F7FB] border border-[#CBD5E1]/70 rounded-2xl p-4 sm:p-5 hover:border-[#94A3B8] transition-colors">
                    <span className="block font-mono text-[10px] sm:text-[11px] font-semibold text-[#64748B] tracking-[0.14em] uppercase mb-1.5">
                      PHONE // WHATSAPP
                    </span>
                    <a
                      href={`tel:${personalInfo.phone.replace(/[^+\d]/g, "")}`}
                      className="font-mono font-bold text-sm sm:text-base text-slate-900 hover:text-[#4D5A2B] transition-colors block tracking-tight"
                      aria-label={`Call phone number ${personalInfo.phone}`}
                    >
                      {personalInfo.phone}
                    </a>
                  </div>

                  {/* Base Headquarters */}
                  <div className="bg-[#F4F7FB] border border-[#CBD5E1]/70 rounded-2xl p-4 sm:p-5 hover:border-[#94A3B8] transition-colors">
                    <span className="block font-mono text-[10px] sm:text-[11px] font-semibold text-[#64748B] tracking-[0.14em] uppercase mb-1.5">
                      BASE HEADQUARTERS
                    </span>
                    <span className="font-mono font-bold text-sm sm:text-base text-slate-900 block tracking-tight">
                      {personalInfo.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Network Channels Companion Card */}
              <div className="transmission-card bg-white/80 backdrop-blur-md rounded-[2rem] p-5 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#E2E8F0]">
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#4D5A2B] tracking-[0.16em] uppercase">
                    NETWORK CHANNELS // VERIFIED HANDLES
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">CONNECT</span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {socialLinks.map((link) => {
                    const Icon = iconMap[link.icon];
                    const isMail = link.icon === "mail";
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target={isMail ? undefined : "_blank"}
                        rel={isMail ? undefined : "noopener noreferrer"}
                        aria-label={`Open ${link.platform} channel`}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F4F7FB] hover:bg-[#111111] border border-[#CBD5E1]/70 hover:border-black text-slate-800 hover:text-[#CCFF00] font-mono text-xs font-semibold tracking-wide transition-all duration-200 group"
                      >
                        <span className="text-slate-600 group-hover:text-[#CCFF00] transition-colors">
                          {Icon && <Icon size={14} />}
                        </span>
                        <span>{link.platform}</span>
                        <ArrowUpRight
                          size={12}
                          className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#CCFF00]"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Right Column: Transmission Console (Image 1 Design) ── */}
            <div className="lg:col-span-7 contact-block-fade w-full min-w-0">
              {submitStatus === "success" ? (
                /* ── Success State ── */
                <div className="transmission-card bg-white rounded-[2rem] sm:rounded-[2.25rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#CCFF00]/25 border border-[#CCFF00] flex items-center justify-center mx-auto text-slate-950 shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                    <Check size={28} className="text-slate-950 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold text-[#4D5A2B] tracking-[0.2em] uppercase">
                      TRANSMISSION SUCCESSFUL
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight text-slate-900">
                      MESSAGE DISPATCHED
                    </h3>
                  </div>
                  <p className="max-w-md mx-auto font-mono text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Received loud and clear. Expect a direct reply at{" "}
                    <strong className="text-slate-900 underline decoration-[#CCFF00] decoration-2">
                      {form.email}
                    </strong>{" "}
                    shortly.
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#111111] hover:bg-black text-[#CCFF00] font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  >
                    <span>SEND ANOTHER MESSAGE</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                /* ── Transmission Console Form (Image 1) ── */
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="transmission-card bg-white rounded-[2rem] sm:rounded-[2.25rem] p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] relative w-full min-w-0 box-border"
                >
                  {/* Header: Title + LIVE Pill Badge */}
                  <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
                    <span className="font-mono text-xs sm:text-[13px] font-bold text-[#4D5A2B] tracking-[0.16em] uppercase">
                      TRANSMISSION CONSOLE // NEW MESSAGE
                    </span>
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#CCFF00] text-black font-mono font-black text-[10px] sm:text-[11px] tracking-widest uppercase shadow-[0_0_12px_rgba(204,255,0,0.35)]">
                      LIVE
                    </span>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-5 sm:space-y-6">
                    {/* 01 NAME · RECRUITER · CLIENT* */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block font-mono text-[11px] sm:text-xs font-bold text-[#475569] tracking-[0.14em] uppercase mb-2.5 cursor-pointer"
                      >
                        01 NAME · RECRUITER · CLIENT*
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Sarah Connor / Team Lead"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        className={`w-full bg-[#F4F7FB] border ${
                          errors.name ? "border-red-400 focus:border-red-500" : "border-[#CBD5E1]/70 focus:border-[#4D5A2B]"
                        } hover:border-[#94A3B8] focus:bg-white focus:ring-4 focus:ring-[#CCFF00]/25 rounded-2xl px-5 py-3.5 sm:py-4 font-mono text-sm sm:text-base text-slate-900 placeholder:text-[#94A3B8] transition-all outline-none`}
                      />
                      {errors.name && (
                        <p id="contact-name-error" className="mt-1.5 flex items-center gap-1.5 font-mono text-xs font-bold text-red-600" role="alert">
                          <AlertCircle size={12} aria-hidden="true" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* 02 RETURN EMAIL* */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <label
                          htmlFor="contact-email"
                          className="block font-mono text-[11px] sm:text-xs font-bold text-[#475569] tracking-[0.14em] uppercase cursor-pointer"
                        >
                          02 RETURN EMAIL*
                        </label>
                        {emailVerify.status === "checking" && (
                          <span className="font-mono text-[10px] text-slate-500 tracking-wider uppercase flex items-center gap-1">
                            <Loader2 size={10} className="animate-spin" />
                            VERIFYING
                          </span>
                        )}
                      </div>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={handleEmailBlur}
                        placeholder="lead@infrastructure.corp"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        className={`w-full bg-[#F4F7FB] border ${
                          errors.email ? "border-red-400 focus:border-red-500" : "border-[#CBD5E1]/70 focus:border-[#4D5A2B]"
                        } hover:border-[#94A3B8] focus:bg-white focus:ring-4 focus:ring-[#CCFF00]/25 rounded-2xl px-5 py-3.5 sm:py-4 font-mono text-sm sm:text-base text-slate-900 placeholder:text-[#94A3B8] transition-all outline-none`}
                      />
                      {/* Suggestion box */}
                      {emailVerify.suggestion && (
                        <div className="mt-2 p-3 bg-[#CCFF00]/15 border border-[#CCFF00]/50 rounded-xl flex items-center justify-between gap-3 text-xs font-mono">
                          <span>
                            Did you mean <strong className="text-slate-900 underline">{emailVerify.suggestion}</strong>?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleApplySuggestion(emailVerify.suggestion!)}
                            className="bg-[#111111] hover:bg-black text-[#CCFF00] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                          >
                            APPLY
                          </button>
                        </div>
                      )}
                      {errors.email && (
                        <p id="contact-email-error" className="mt-1.5 flex items-center gap-1.5 font-mono text-xs font-bold text-red-600" role="alert">
                          <AlertCircle size={12} aria-hidden="true" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* 03 SCOPE OF WORK · MESSAGE* */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block font-mono text-[11px] sm:text-xs font-bold text-[#475569] tracking-[0.14em] uppercase mb-2.5 cursor-pointer"
                      >
                        03 SCOPE OF WORK · MESSAGE*
                      </label>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Brief description of your backend challenge, team requirements, or role specification..."
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        className={`w-full min-h-[140px] sm:min-h-[160px] bg-[#F4F7FB] border ${
                          errors.message ? "border-red-400 focus:border-red-500" : "border-[#CBD5E1]/70 focus:border-[#4D5A2B]"
                        } hover:border-[#94A3B8] focus:bg-white focus:ring-4 focus:ring-[#CCFF00]/25 rounded-2xl px-5 py-4 font-mono text-sm sm:text-base text-slate-900 placeholder:text-[#94A3B8] leading-relaxed transition-all outline-none resize-none`}
                      />
                      {errors.message && (
                        <p id="contact-message-error" className="mt-1.5 flex items-center gap-1.5 font-mono text-xs font-bold text-red-600" role="alert">
                          <AlertCircle size={12} aria-hidden="true" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Server error */}
                  {submitStatus === "error" && serverError && (
                    <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 font-mono text-xs" role="alert">
                      <AlertCircle size={15} className="shrink-0 text-red-600" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Submit Button: Bright Neon Lime with BLACK text and arrow */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="w-full mt-6 sm:mt-8 py-4 sm:py-4.5 px-8 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] active:scale-[0.99] text-black font-mono font-black text-xs sm:text-sm tracking-[0.22em] uppercase transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(204,255,0,0.35)] hover:shadow-[0_6px_25px_rgba(204,255,0,0.5)] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
                  >
                    {submitStatus === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-black" aria-hidden="true" />
                        <span className="text-black">TRANSMITTING...</span>
                      </>
                    ) : submitStatus === "error" ? (
                      <>
                        <AlertCircle size={16} className="text-black" aria-hidden="true" />
                        <span className="text-black">RETRY TRANSMISSION</span>
                        <ArrowUpRight size={16} className="text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        <span className="text-black">SEND MESSAGE</span>
                        {/* Outlined arrow shape matching Image 1 */}
                        <svg
                          className="w-4 h-4 text-black fill-current group-hover:translate-x-1 transition-transform"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M4 3.5l17 8.5-17 8.5 3.5-8.5-3.5-8.5zm4.5 8.5l-2 5 11-5-11-5 2 5z" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
