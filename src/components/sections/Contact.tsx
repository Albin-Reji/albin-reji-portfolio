"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Send, Check, Copy, Mail } from "lucide-react";
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

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header masked reveal
      gsap.fromTo(
        ".contact-cta-line",
        { y: "115%", opacity: 0, skewY: 3 },
        {
          y: "0%",
          opacity: 1,
          skewY: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-cta-trigger",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Content blocks
      gsap.fromTo(
        ".contact-block-fade",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-content-grid",
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="pt-20 md:pt-32 pb-12 md:pb-16 bg-transparent border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      {/* ═══ Section Heading / Massive CTA ═══ */}
      <div className="contact-cta-trigger px-6 md:px-12 max-w-[1728px] mx-auto mb-20 md:mb-32">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-6 border-b border-[#F5F5F0]/15 pb-4">
          <span className="text-[#D7FF00] font-bold">[TRANSMISSION // 07]</span>
          <span>INITIATE COLLABORATION</span>
          <span className="flex-1" />
          <span className="text-[#D7FF00]">AVAILABLE FOR FULL-TIME ROLES</span>
        </div>

        <div className="space-y-1 md:space-y-2 relative">
          <div className="overflow-hidden">
            <h2 className="contact-cta-line text-[clamp(2.75rem,8.5vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.06em] text-[#F5F5F0]">
              LET&apos;S BUILD
            </h2>
          </div>

          <div className="overflow-hidden relative">
            <h2 className="contact-cta-line text-[clamp(2.75rem,8.5vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.06em] text-[#F5F5F0]">
              SOMETHING
            </h2>
            <div className="absolute -bottom-4 md:-bottom-8 left-0 max-w-[280px] md:max-w-[420px] pointer-events-none z-10">
              <SVGSignature delay={0.6} />
            </div>
          </div>

          <div className="overflow-hidden pt-4 md:pt-6">
            <h2 className="contact-cta-line text-[clamp(2.75rem,8.5vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.06em] text-[#D7FF00]">
              THAT MOVES<span className="text-[#F5F5F0]">.</span>
            </h2>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-base md:text-xl text-[#B5B5B5] font-light leading-relaxed contact-cta-line">
          {contactSubtext}
        </p>
      </div>

      {/* ═══ Content Grid: Direct Lines & Console Form ═══ */}
      <div className="contact-content-grid px-6 md:px-12 max-w-[1728px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left: Direct Inquiries (5 cols) */}
          <div className="lg:col-span-5 space-y-10 contact-block-fade">
            <div className="space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#D7FF00] block">
                // DIRECT COMMS
              </span>

              <div className="space-y-5 font-mono text-sm">
                {/* Primary Email with Quick Action Copy Button */}
                <div className="border-b border-[#F5F5F0]/15 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A]">
                      PRIMARY EMAIL
                    </span>
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase border border-[#F5F5F0]/15 text-[#8A8A8A] hover:border-[#D7FF00] hover:text-[#D7FF00] transition-colors cursor-pointer bg-[#050505]"
                      aria-label="Copy email address to clipboard"
                    >
                      {copiedEmail ? (
                        <>
                          <Check size={11} className="text-[#D7FF00]" />
                          <span className="text-[#D7FF00] font-bold">COPIED TO CLIPBOARD!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>COPY ADDRESS</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-lg sm:text-xl md:text-2xl font-bold text-[#F5F5F0] hover:text-[#D7FF00] transition-colors block break-all"
                    aria-label={`Send email to ${personalInfo.email}`}
                  >
                    {personalInfo.email}
                  </a>
                </div>

                <div className="border-b border-[#F5F5F0]/15 pb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] block mb-1">
                    PHONE // WHATSAPP
                  </span>
                  <a
                    href={`tel:${personalInfo.phone.replace(/[^+\d]/g, "")}`}
                    className="text-base text-[#F5F5F0] hover:text-[#D7FF00] transition-colors"
                    aria-label={`Call phone number ${personalInfo.phone}`}
                  >
                    {personalInfo.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] block mb-1">
                    BASE HEADQUARTERS
                  </span>
                  <span className="text-base text-[#B5B5B5]">
                    {personalInfo.location} &bull; Remote Available
                  </span>
                </div>
              </div>
            </div>

            {/* Social Network Channels */}
            <div className="border-t border-[#F5F5F0]/15 pt-8 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] block">
                NETWORK CHANNELS
              </span>

              <div className="space-y-2">
                {socialLinks.map((link) => {
                  const Icon = iconMap[link.icon];
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target={link.icon === "mail" ? undefined : "_blank"}
                      rel={
                        link.icon === "mail"
                          ? undefined
                          : "noopener noreferrer"
                      }
                      aria-label={`Open ${link.platform} link`}
                      className="flex items-center justify-between p-3.5 border border-[#F5F5F0]/15 hover:border-[#D7FF00] hover:bg-[#D7FF00]/5 transition-all group"
                    >
                      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-[#F5F5F0] group-hover:text-[#D7FF00]">
                        {Icon && <Icon size={16} />}
                        <span>{link.platform}</span>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="text-[#8A8A8A] group-hover:text-[#D7FF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Transmission Form (7 cols) */}
          <div className="lg:col-span-7 contact-block-fade">
            {submitted ? (
              <div className="border border-[#D7FF00] p-8 md:p-12 bg-[#D7FF00]/5 text-center space-y-4">
                <div className="inline-flex p-3.5 bg-[#D7FF00] text-[#050505]">
                  <Check size={24} />
                </div>
                <h3 className="text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold uppercase tracking-tight text-[#F5F5F0]">
                  TRANSMISSION COMPLETE
                </h3>
                <p className="text-[#B5B5B5] max-w-md mx-auto text-sm font-mono leading-relaxed">
                  Thank you for reaching out. Direct inbox monitored continuously at {personalInfo.email}.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="btn-editorial mt-4 cursor-pointer"
                >
                  <span>SEND ANOTHER MESSAGE</span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="border border-[#F5F5F0]/15 p-8 md:p-12 bg-[#050505] space-y-6"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D7FF00] pb-3 border-b border-[#F5F5F0]/15">
                  TRANSMISSION CONSOLE // NEW MESSAGE
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]"
                  >
                    NAME / RECRUITER / CLIENT <span className="text-[#D7FF00]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`w-full border ${
                      errors.name
                        ? "border-[#D7FF00]"
                        : "border-[#F5F5F0]/20"
                    } bg-transparent px-4 py-3.5 text-sm text-[#F5F5F0] placeholder:text-[#6A6A6A] focus:border-[#D7FF00] focus:outline-none transition-colors font-mono`}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="font-mono text-[10px] text-[#D7FF00]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]"
                  >
                    RETURN EMAIL <span className="text-[#D7FF00]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full border ${
                      errors.email
                        ? "border-[#D7FF00]"
                        : "border-[#F5F5F0]/20"
                    } bg-transparent px-4 py-3.5 text-sm text-[#F5F5F0] placeholder:text-[#6A6A6A] focus:border-[#D7FF00] focus:outline-none transition-colors font-mono`}
                    placeholder="your.email@company.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="font-mono text-[10px] text-[#D7FF00]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]"
                  >
                    SCOPE OF WORK / MESSAGE <span className="text-[#D7FF00]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={5}
                    className={`w-full border ${
                      errors.message
                        ? "border-[#D7FF00]"
                        : "border-[#F5F5F0]/20"
                    } bg-transparent px-4 py-3.5 text-sm text-[#F5F5F0] placeholder:text-[#6A6A6A] focus:border-[#D7FF00] focus:outline-none transition-colors font-mono resize-y`}
                    placeholder="Describe your engineering role, project scope, or opportunity..."
                  />
                  {errors.message && (
                    <p className="font-mono text-[10px] text-[#D7FF00]">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 bg-[#D7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-[0.15em] px-7 py-4 hover:bg-[#F5F5F0] transition-colors cursor-pointer"
                >
                  <Send size={14} />
                  <span>TRANSMIT DISPATCH</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
