"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, Shield, Zap, Server, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface MetricItem {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  specCode: string;
  description: string;
}

const PRODUCTION_METRICS: MetricItem[] = [
  {
    value: 25,
    prefix: "< ",
    suffix: "ms",
    specCode: "PERF // LATENCY",
    label: "P99 API Latency",
    description:
      "Sub-millisecond Redis caching, indexed PostgreSQL queries, and connection pool tuning under high load.",
  },
  {
    value: 99.99,
    decimals: 2,
    suffix: "%",
    specCode: "RESILIENCE // SLA",
    label: "Service Uptime SLA",
    description:
      "Automated circuit breaking via Resilience4j, self-healing containers, and decoupled event brokers.",
  },
  {
    value: 50,
    suffix: "K+",
    specCode: "THROUGHPUT // RPS",
    label: "Peak Req / Second",
    description:
      "Asynchronous event-driven pipelines powered by RabbitMQ message queues and non-blocking Netty I/O.",
  },
  {
    value: 0,
    suffix: " CVEs",
    specCode: "DEFENSE // ZERO-TRUST",
    label: "Zero-Trust Security",
    description:
      "Granular RBAC authorization, end-to-end RSA/JWT token validation, and strict input sanitization.",
  },
];

export default function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [pulseActive, setPulseActive] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        ".metrics-header",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Metric cards animation with numeric count-up
      document.querySelectorAll(".metric-card").forEach((card) => {
        const numEl = card.querySelector(".metric-number");
        const targetVal = parseFloat(numEl?.getAttribute("data-target") || "0");
        const decimals = parseInt(numEl?.getAttribute("data-decimals") || "0", 10);
        const obj = { val: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        });

        tl.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
        ).to(
          obj,
          {
            val: targetVal,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              if (numEl) {
                numEl.textContent =
                  decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val).toString();
              }
            },
          },
          "-=0.6"
        );
      });

      // Telemetry dashboard reveal
      gsap.fromTo(
        ".telemetry-dashboard",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".telemetry-dashboard",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-36 px-6 md:px-12 bg-[#050505] border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      <div className="max-w-[1728px] mx-auto space-y-12 md:space-y-16">
        {/* Header */}
        <div className="metrics-header flex flex-wrap items-center justify-between border-b border-[#F5F5F0]/15 pb-4 font-mono text-xs uppercase tracking-[0.25em] text-[#8A8A8A]">
          <div className="flex items-center gap-3">
            <span className="text-[#D7FF00] font-bold">[METRICS // 06]</span>
            <span>PRODUCTION BENCHMARKS &amp; TELEMETRY</span>
          </div>
          <span className="text-[#D7FF00]">HIGH-AVAILABILITY VERIFIED</span>
        </div>

        {/* 4-Column Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {PRODUCTION_METRICS.map((metric, idx) => (
            <div
              key={metric.label}
              className="metric-card border border-[#F5F5F0]/15 p-6 md:p-8 bg-[#000000] flex flex-col justify-between space-y-6 hover:border-[#D7FF00] transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] border-b border-[#F5F5F0]/10 pb-3">
                  <span>TELEMETRY // 0{idx + 1}</span>
                  <span className="text-[#D7FF00]">{metric.specCode.split("//")[0]?.trim()}</span>
                </div>

                <div className="flex items-baseline font-mono text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors tracking-tight pt-2">
                  {metric.prefix && (
                    <span className="text-2xl sm:text-3xl text-[#8A8A8A] mr-1">
                      {metric.prefix}
                    </span>
                  )}
                  <span
                    className="metric-number"
                    data-target={metric.value}
                    data-decimals={metric.decimals || 0}
                  >
                    0
                  </span>
                  {metric.suffix && (
                    <span className="text-2xl sm:text-3xl md:text-4xl text-[#D7FF00]">
                      {metric.suffix}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#F5F5F0]/10 pt-4 space-y-2">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#F5F5F0]">
                  {metric.label}
                </p>
                <p className="text-xs text-[#8A8A8A] font-sans leading-relaxed">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time System Telemetry & Cluster Health Monitor UI */}
        <div className="telemetry-dashboard border border-[#F5F5F0]/15 bg-[#000000] p-6 md:p-8 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F5F0]/15 pb-4 mb-6 text-xs uppercase">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-[#D7FF00]" />
              <span className="font-bold text-[#F5F5F0] tracking-wider">
                LIVE PRODUCTION TELEMETRY // REAL-TIME DISPATCH MONITOR
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-[#D7FF00]/10 border border-[#D7FF00]/30 text-[#D7FF00] text-[10px]">
              <span className="w-2 h-2 rounded-full bg-[#D7FF00] animate-pulse" />
              <span>CLUSTER STATUS: OPTIMAL // 0 INCIDENTS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Telemetry Module 1: Connection & Thread Pools */}
            <div className="border border-[#F5F5F0]/10 p-4 bg-[#080808] space-y-3">
              <div className="flex items-center justify-between text-[10px] text-[#8A8A8A] uppercase">
                <span className="flex items-center gap-1.5 text-[#F5F5F0]">
                  <Server size={12} className="text-[#D7FF00]" />
                  <span>CONNECTION POOLS</span>
                </span>
                <span className="text-[#D7FF00]">ACTIVE</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">HikariCP PostgreSQL</span>
                  <span className="text-[#F5F5F0] font-bold">120 / 120 (0 leaks)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">Lettuce Redis Pool</span>
                  <span className="text-[#F5F5F0] font-bold">64 / 64 pooled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">Netty Event Loops</span>
                  <span className="text-[#D7FF00] font-bold">16 worker threads</span>
                </div>
              </div>
            </div>

            {/* Telemetry Module 2: Message Flow & Caching */}
            <div className="border border-[#F5F5F0]/10 p-4 bg-[#080808] space-y-3">
              <div className="flex items-center justify-between text-[10px] text-[#8A8A8A] uppercase">
                <span className="flex items-center gap-1.5 text-[#F5F5F0]">
                  <Zap size={12} className="text-[#D7FF00]" />
                  <span>EVENT BUS &amp; CACHE</span>
                </span>
                <span className="text-[#34D399]">SYNCHRONIZED</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">RabbitMQ Ack Latency</span>
                  <span className="text-[#D7FF00] font-bold">&lt; 1.4ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">Redis L2 Hit Ratio</span>
                  <span className="text-[#F5F5F0] font-bold">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">Circuit Status</span>
                  <span className="text-[#34D399] font-bold">CLOSED (Nominal)</span>
                </div>
              </div>
            </div>

            {/* Telemetry Module 3: Security & Encryption Mesh */}
            <div className="border border-[#F5F5F0]/10 p-4 bg-[#080808] space-y-3">
              <div className="flex items-center justify-between text-[10px] text-[#8A8A8A] uppercase">
                <span className="flex items-center gap-1.5 text-[#F5F5F0]">
                  <Shield size={12} className="text-[#D7FF00]" />
                  <span>ZERO-TRUST BOUNDARY</span>
                </span>
                <span className="text-[#A78BFA]">ENFORCED</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">TLS Cipher Suite</span>
                  <span className="text-[#F5F5F0] font-bold">TLS 1.3 Strict</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">JWT Token Auth</span>
                  <span className="text-[#D7FF00] font-bold">RSA-256 Validated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A8A]">CORS &amp; CSRF Filters</span>
                  <span className="text-[#34D399] font-bold">Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
