"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Send, Check, Copy, AlertCircle, Loader2 } from "lucide-react";
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
        stroke="#DFFF35"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Compact Numbered Form Field ─────────────────────────────────────────── */
function CompactField({
  id,
  fieldNum,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  isTextarea = false,
  autoComplete,
  placeholder,
  headerExtra,
  footerExtra,
}: {
  id: string;
  fieldNum: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  isTextarea?: boolean;
  autoComplete?: string;
  placeholder?: string;
  headerExtra?: React.ReactNode;
  footerExtra?: React.ReactNode;
}) {
  return (
    <div className={`cf-field${error ? " cf-field--error" : ""}`}>
      <div className="cf-field-head">
        <span className="cf-field-num" aria-hidden="true">{fieldNum}</span>
        <label htmlFor={id} className="cf-field-lbl">
          {label}<span className="cf-req">*</span>
        </label>
        {headerExtra}
      </div>
      <div className="cf-field-body">
        {isTextarea ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className="cf-input cf-textarea"
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className="cf-input"
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        )}
        {footerExtra}
      </div>
      {error && (
        <p id={`${id}-error`} className="cf-field-err" role="alert">
          <AlertCircle size={10} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start w-full min-w-0">

            {/* ── Left: Direct Comms ── */}
            <div className="lg:col-span-5 space-y-10 contact-block-fade w-full min-w-0">
              <div className="space-y-7">
                <span className="contact-section-label text-[#171717] font-bold block">// DIRECT COMMS</span>
                <div className="space-y-6">
                  {/* Primary Email */}
                  <div className="border-b border-[rgba(23,23,23,0.18)] pb-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="contact-info-label">PRIMARY EMAIL</span>
                      <button onClick={handleCopyEmail} className="contact-copy-btn" aria-label="Copy email address to clipboard">
                        {copiedEmail ? (
                          <><Check size={12} className="text-[#16A34A]" /><span className="text-[#16A34A] font-bold">COPIED!</span></>
                        ) : (
                          <><Copy size={12} /><span>COPY ADDRESS</span></>
                        )}
                      </button>
                    </div>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-lg sm:text-2xl md:text-3xl font-bold text-[#171717] hover:opacity-75 transition-opacity block break-all tracking-tight"
                      aria-label={`Send email to ${personalInfo.email}`}
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                  {/* Phone */}
                  <div className="border-b border-[rgba(23,23,23,0.18)] pb-5">
                    <span className="contact-info-label block">PHONE // WHATSAPP</span>
                    <a
                      href={`tel:${personalInfo.phone.replace(/[^+\d]/g, "")}`}
                      className="text-base sm:text-xl text-[#171717] hover:opacity-75 transition-opacity font-semibold block"
                      aria-label={`Call phone number ${personalInfo.phone}`}
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                  {/* Location */}
                  <div className="pb-2">
                    <span className="contact-info-label block">BASE HEADQUARTERS</span>
                    <div className="text-base sm:text-lg text-[#171717] font-semibold flex items-center gap-2 flex-wrap">
                      <span>{personalInfo.location}</span>
                      <span className="text-[rgba(23,23,23,0.4)] font-normal">/</span>
                      <span className="text-[rgba(23,23,23,0.8)] font-medium">Remote Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 sm:pt-6 space-y-1 w-full min-w-0">
                <span className="contact-section-label text-[rgba(23,23,23,0.65)] block mb-4">NETWORK CHANNELS</span>
                <div className="w-full min-w-0 space-y-0.5">
                  {socialLinks.map((link) => {
                    const Icon = iconMap[link.icon];
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target={link.icon === "mail" ? undefined : "_blank"}
                        rel={link.icon === "mail" ? undefined : "noopener noreferrer"}
                        aria-label={`Open ${link.platform} link`}
                        className="contact-social-row"
                      >
                        <span className="social-row-label">
                          {Icon && <Icon size={16} />}
                          <span className="truncate">{link.platform}</span>
                        </span>
                        <ArrowUpRight size={17} className="social-row-arrow" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Right: Transmission Console ── */}
            <div className="lg:col-span-7 contact-block-fade w-full min-w-0">
              {submitStatus === "success" ? (
                /* ── Success State ── */
                <div className="contact-success-card">
                  <div className="contact-success-icon-wrap">
                    <Check size={24} aria-hidden="true" />
                  </div>
                  <h3 className="contact-success-heading">TRANSMISSION COMPLETE</h3>
                  <p className="contact-success-body">
                    Message received. Expect a reply at{" "}
                    <strong className="text-[#171717]">{form.email}</strong>
                    {" "}— direct inbox monitored continuously.
                  </p>
                  <button onClick={handleReset} className="contact-success-reset">
                    <span>SEND ANOTHER MESSAGE</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} noValidate className="w-full min-w-0 box-border">
                  {/* Header with LIVE indicator */}
                  <div className="contact-form-header">
                    <span className="contact-form-header-accent" aria-hidden="true" />
                    <span className="contact-section-label" style={{ color: "#171717", fontWeight: "700" }}>
                      TRANSMISSION CONSOLE // NEW MESSAGE
                    </span>
                    <span className="cf-live-badge" aria-hidden="true">
                      <span className="cf-live-dot" />
                      LIVE
                    </span>
                  </div>

                  {/* Unified card with grid background */}
                  <div className="contact-form-card">
                    <span className="contact-form-card-accent" aria-hidden="true" />
                    <div className="cf-fields">
                      <CompactField
                        id="contact-name"
                        fieldNum="01"
                        label="NAME · RECRUITER · CLIENT"
                        value={form.name}
                        onChange={(v) => handleChange("name", v)}
                        error={errors.name}
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                      <CompactField
                        id="contact-email"
                        fieldNum="02"
                        label="RETURN EMAIL"
                        type="email"
                        value={form.email}
                        onChange={(v) => handleChange("email", v)}
                        onBlur={handleEmailBlur}
                        error={errors.email}
                        placeholder="your@email.com"
                        autoComplete="email"

                        footerExtra={
                          emailVerify.suggestion ? (
                            <div className="cf-suggestion-box">
                              <span>
                                Did you mean <strong className="text-[#171717]">{emailVerify.suggestion}</strong>?
                              </span>
                              <button
                                type="button"
                                onClick={() => handleApplySuggestion(emailVerify.suggestion!)}
                                className="cf-suggestion-btn"
                              >
                                APPLY
                              </button>
                            </div>
                          ) : null
                        }
                      />
                      <CompactField
                        id="contact-message"
                        fieldNum="03"
                        label="SCOPE OF WORK · MESSAGE"
                        isTextarea
                        value={form.message}
                        onChange={(v) => handleChange("message", v)}
                        error={errors.message}
                        placeholder="Describe your project, role, or collaboration..."
                      />
                    </div>
                  </div>

                  {/* Server error */}
                  {submitStatus === "error" && serverError && (
                    <div className="contact-server-error" role="alert">
                      <AlertCircle size={14} aria-hidden="true" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className={`contact-submit-btn${submitStatus === "loading" ? " contact-submit-btn--loading" : ""}${submitStatus === "error" ? " contact-submit-btn--error" : ""}`}
                  >
                    {submitStatus === "loading" ? (
                      <>
                        <Loader2 size={15} className="contact-submit-spinner" aria-hidden="true" />
                        <span>TRANSMITTING...</span>
                      </>
                    ) : submitStatus === "error" ? (
                      <>
                        <AlertCircle size={15} aria-hidden="true" />
                        <span>RETRY TRANSMISSION</span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        <Send size={14} aria-hidden="true" />
                        <span>SEND MESSAGE</span>
                        <ArrowUpRight size={15} aria-hidden="true" />
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
