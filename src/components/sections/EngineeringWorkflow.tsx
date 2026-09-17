"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
  {
    id: "01",
    label: "Requirements Analysis",
    desc: "Stakeholder interviews, RFC documentation, and constraint mapping.",
    code: "REQ",
  },
  {
    id: "02",
    label: "System Design",
    desc: "Architecture diagrams, API contracts, and data model definition.",
    code: "DSN",
  },
  {
    id: "03",
    label: "Implementation",
    desc: "Clean code, TDD cycles, and peer-reviewed pull requests.",
    code: "DEV",
  },
  {
    id: "04",
    label: "Testing & QA",
    desc: "Unit, integration, and load testing with coverage gates.",
    code: "QA",
  },
  {
    id: "05",
    label: "Containerization",
    desc: "Docker image hardening, multi-stage builds, and registry publishing.",
    code: "CTR",
  },
  {
    id: "06",
    label: "Deploy & Monitor",
    desc: "K8s rollouts, zero-downtime strategies, and Prometheus alerting.",
    code: "OPS",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" as const },
  },
};

export default function EngineeringWorkflow() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      ref={ref}
      id="workflow"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#050505] border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      <div className="max-w-[1728px] mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex flex-wrap items-center justify-between border-b border-[#F5F5F0]/15 pb-4 font-mono text-xs uppercase tracking-[0.25em] text-[#8A8A8A]"
        >
          <div className="flex items-center gap-3">
            <span className="text-[#DDFE67] font-bold">[PROCESS // WF]</span>
            <span>Engineering Workflow Pipeline</span>
          </div>
          <span className="text-[#DDFE67]">6-Stage Build Cycle</span>
        </motion.div>

        {/* Workflow grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.id}
              variants={nodeVariants}
              className="relative group"
            >
              {/* Connector line (right) — desktop only */}
              {idx < STEPS.length - 1 && idx % 3 !== 2 && (
                <div className="hidden lg:block absolute top-8 left-full w-6 z-10 pointer-events-none">
                  <svg width="24" height="2" viewBox="0 0 24 2" fill="none">
                    <motion.line
                      x1="0" y1="1" x2="24" y2="1"
                      stroke="#DDFE67"
                      strokeWidth="1"
                      strokeDasharray="4 3"
                      variants={lineVariants}
                      className="workflow-path"
                    />
                  </svg>
                </div>
              )}

              <div className="border border-[#F5F5F0]/15 bg-[#000000] p-6 group-hover:border-[#DDFE67]/50 transition-all duration-300 spotlight-card relative overflow-hidden">
                {/* Corner cross */}
                <span className="absolute top-1 left-1 text-[8px] font-mono text-[#F5F5F0]/20 group-hover:text-[#DDFE67]/50 select-none pointer-events-none transition-colors">+</span>
                <span className="absolute top-1 right-1 text-[8px] font-mono text-[#F5F5F0]/20 group-hover:text-[#DDFE67]/50 select-none pointer-events-none transition-colors">+</span>
                <span className="absolute bottom-1 left-1 text-[8px] font-mono text-[#F5F5F0]/20 group-hover:text-[#DDFE67]/50 select-none pointer-events-none transition-colors">+</span>
                <span className="absolute bottom-1 right-1 text-[8px] font-mono text-[#F5F5F0]/20 group-hover:text-[#DDFE67]/50 select-none pointer-events-none transition-colors">+</span>

                {/* Stage badge */}
                <div className="flex items-center justify-between mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] border-b border-[#F5F5F0]/10 pb-3">
                  <span>STAGE // {step.id}</span>
                  <span className="text-[#DDFE67] font-bold">{step.code}</span>
                </div>

                {/* Step number (decorative) */}
                <div className="font-mono text-5xl font-black text-[#F5F5F0]/05 leading-none select-none mb-3 group-hover:text-[#DDFE67]/08 transition-colors">
                  {step.id}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <p className="font-mono text-sm font-bold uppercase tracking-wider text-[#F5F5F0] group-hover:text-[#DDFE67] transition-colors">
                    {step.label}
                  </p>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 h-px bg-[#F5F5F0]/08 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#DDFE67]"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${((idx + 1) / STEPS.length) * 100}%` } : {}}
                    transition={{ duration: 0.8, delay: idx * 0.12 + 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
