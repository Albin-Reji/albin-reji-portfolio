"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Terminal,
  Activity,
  Cpu,
  Server,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { aboutText, coreTechnologies, education } from "@/data/portfolio";
import MarqueeTicker from "@/components/ui/MarqueeTicker";

gsap.registerPlugin(ScrollTrigger);

interface DiagnosticLog {
  id: string;
  time: string;
  level: "INFO" | "METRIC" | "SECURITY" | "BROKER";
  source: string;
  message: string;
  latency?: string;
}

const INITIAL_LOGS: DiagnosticLog[] = [
  {
    id: "log-1",
    time: "19:04:12.108",
    level: "SECURITY",
    source: "SPRING_SECURITY",
    message: "Zero-trust JWT token verified with RSA-256 signature across gateway mesh.",
    latency: "0.8ms",
  },
  {
    id: "log-2",
    time: "19:04:12.142",
    level: "INFO",
    source: "CLOUD_GATEWAY",
    message: "Route dispatched: POST /api/v2/orders -> order-service-node-04.",
    latency: "1.2ms",
  },
  {
    id: "log-3",
    time: "19:04:12.158",
    level: "BROKER",
    source: "RABBITMQ_BUS",
    message: "Event published: 'order.event.created' [partition: 02, ack: true].",
    latency: "2.4ms",
  },
  {
    id: "log-4",
    time: "19:04:12.180",
    level: "METRIC",
    source: "HIKARICP_POOL",
    message: "PostgreSQL query executed via indexed B-Tree scan. 0 lock contention.",
    latency: "3.1ms",
  },
  {
    id: "log-5",
    time: "19:04:12.215",
    level: "METRIC",
    source: "REDIS_CLUSTER",
    message: "Cache hit for key 'session:tenant:active'. In-memory response returned.",
    latency: "0.4ms",
  },
  {
    id: "log-6",
    time: "19:04:12.260",
    level: "INFO",
    source: "CIRCUIT_BREAKER",
    message: "Resilience4j circuit status: CLOSED (Failure rate: 0.00%, Calls: 14,280).",
    latency: "0.1ms",
  },
];

const CLUSTER_NODES = [
  {
    id: "gw",
    name: "Spring Cloud Gateway",
    role: "Edge Routing & Rate Limiting",
    status: "HEALTHY",
    throughput: "45.2k req/s",
    latency: "1.2ms",
    p99: "3.8ms",
  },
  {
    id: "auth",
    name: "Keycloak / Spring Security",
    role: "OAuth2 / OIDC & RBAC",
    status: "OPTIMAL",
    throughput: "28.4k auth/s",
    latency: "0.8ms",
    p99: "2.1ms",
  },
  {
    id: "svc",
    name: "Distributed Microservices Mesh",
    role: "Business Domains & CQRS",
    status: "HEALTHY",
    throughput: "52.1k op/s",
    latency: "4.6ms",
    p99: "14.2ms",
  },
  {
    id: "msg",
    name: "RabbitMQ Event Broker",
    role: "Async Decoupled Messaging",
    status: "ACTIVE",
    throughput: "88.0k msg/s",
    latency: "1.8ms",
    p99: "4.0ms",
  },
  {
    id: "db",
    name: "PostgreSQL + Redis Tier",
    role: "Relational Storage & L2 Cache",
    status: "HEALTHY",
    throughput: "36.5k qps",
    latency: "2.2ms",
    p99: "8.5ms",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<"logs" | "benchmarks" | "cluster">("logs");
  const [selectedNode, setSelectedNode] = useState(CLUSTER_NODES[0]);
  const [copiedLogs, setCopiedLogs] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<DiagnosticLog[]>(INITIAL_LOGS);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading masked reveal
      gsap.fromTo(
        ".about-title-line",
        { y: "115%", opacity: 0, skewY: 3 },
        {
          y: "0%",
          opacity: 1,
          skewY: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-heading-trigger",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Terminal diagnostic console fade in
      gsap.fromTo(
        ".about-terminal-container",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-terminal-container",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Content blocks stagger
      gsap.fromTo(
        ".about-content-fade",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-content-trigger",
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.time}] [${l.level}] [${l.source}] ${l.message} (latency: ${l.latency})`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  const handleSimulatePulse = () => {
    setIsSimulating(true);
    const now = new Date();
    const timeStr = `${now.toTimeString().split(" ")[0]}.${Math.floor(Math.random() * 900 + 100)}`;
    const newLog: DiagnosticLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      level: "METRIC",
      source: "LOAD_BALANCER",
      message: `Simulated high-throughput test probe dispatched across ${CLUSTER_NODES.length} active service instances.`,
      latency: `${(Math.random() * 1.8 + 0.4).toFixed(1)}ms`,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    setTimeout(() => setIsSimulating(false), 600);
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 md:py-40 bg-[#050505] border-b border-[#F5F5F0]/15 overflow-hidden"
    >
      {/* ═══ Section Heading ═══ */}
      <div className="about-heading-trigger px-6 md:px-12 max-w-[1728px] mx-auto mb-16 md:mb-24">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-4 border-b border-[#F5F5F0]/15 pb-3">
          <span className="text-[#D7FF00] font-bold">[ABOUT // 02]</span>
          <span>STORY &amp; FOUNDATION</span>
          <span className="flex-1" />
          <span>SYSTEMS ARCHITECTURE</span>
        </div>

        <div className="overflow-hidden">
          <h2 className="about-title-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#F5F5F0]">
            BUILDING
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="about-title-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#F5F5F0]">
            PRODUCTION-GRADE
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2 className="about-title-line text-[clamp(2.5rem,7vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-[#D7FF00]">
            SYSTEMS<span className="text-[#F5F5F0]">.</span>
          </h2>
        </div>
      </div>

      {/* ═══ Interactive Production Terminal & System Diagnostics Console ═══ */}
      <div className="about-terminal-container px-6 md:px-12 max-w-[1728px] mx-auto mb-24 md:mb-36">
        <div className="border border-[#F5F5F0]/15 bg-[#000000] overflow-hidden shadow-2xl">
          {/* Terminal Console Header */}
          <div className="border-b border-[#F5F5F0]/15 px-4 md:px-6 py-3.5 bg-[#080808] flex flex-wrap items-center justify-between gap-4">
            {/* Terminal Window Dots & Identity */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 block" />
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#8A8A8A]">
                <Terminal size={14} className="text-[#D7FF00]" />
                <span className="text-[#F5F5F0] font-semibold">albin@cluster-prod-mesh</span>
                <span className="hidden sm:inline text-[#8A8A8A]">:~</span>
              </div>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#F5F5F0]/10 font-mono text-[11px] uppercase">
              <button
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "logs"
                    ? "bg-[#D7FF00] text-[#050505] font-bold"
                    : "text-[#8A8A8A] hover:text-[#F5F5F0]"
                }`}
              >
                <Activity size={12} />
                <span>01 // System Logs</span>
              </button>
              <button
                onClick={() => setActiveTab("benchmarks")}
                className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "benchmarks"
                    ? "bg-[#D7FF00] text-[#050505] font-bold"
                    : "text-[#8A8A8A] hover:text-[#F5F5F0]"
                }`}
              >
                <Cpu size={12} />
                <span>02 // Benchmarks</span>
              </button>
              <button
                onClick={() => setActiveTab("cluster")}
                className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "cluster"
                    ? "bg-[#D7FF00] text-[#050505] font-bold"
                    : "text-[#8A8A8A] hover:text-[#F5F5F0]"
                }`}
              >
                <Server size={12} />
                <span>03 // Cluster Mesh</span>
              </button>
            </div>

            {/* Quick Actions & Live Indicator */}
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase">
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#D7FF00]/10 border border-[#D7FF00]/30 text-[#D7FF00]">
                <span className="w-2 h-2 rounded-full bg-[#D7FF00] animate-pulse" />
                <span>HEALTH: 100% OPERATIONAL</span>
              </div>
              <button
                onClick={handleSimulatePulse}
                disabled={isSimulating}
                className="px-3 py-1 border border-[#F5F5F0]/15 text-[#F5F5F0] hover:border-[#D7FF00] hover:text-[#D7FF00] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Trigger simulated traffic probe"
              >
                <RefreshCw size={11} className={isSimulating ? "animate-spin" : ""} />
                <span>{isSimulating ? "PROBING..." : "DISPATCH PROBE"}</span>
              </button>
              {activeTab === "logs" && (
                <button
                  onClick={handleCopyLogs}
                  className="px-3 py-1 border border-[#F5F5F0]/15 text-[#F5F5F0] hover:border-[#D7FF00] hover:text-[#D7FF00] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLogs ? <Check size={11} className="text-[#D7FF00]" /> : <Copy size={11} />}
                  <span>{copiedLogs ? "COPIED" : "COPY LOGS"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Terminal View Content Area */}
          <div className="p-6 md:p-8 min-h-[380px] bg-[#030303] font-mono">
            {/* ─── TAB 1: Real-time System Logs ─── */}
            {activeTab === "logs" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10 text-[10px] uppercase tracking-widest text-[#8A8A8A]">
                  <span>STREAM // EVENT_BUS_DAEMON</span>
                  <span className="text-[#D7FF00]">P99 DISPATCH: &lt; 3.2MS</span>
                </div>

                <div className="space-y-2 text-xs md:text-sm">
                  {logs.map((log) => {
                    const levelColors: Record<string, string> = {
                      INFO: "text-[#38BDF8] border-[#38BDF8]/40",
                      METRIC: "text-[#D7FF00] border-[#D7FF00]/40",
                      SECURITY: "text-[#A78BFA] border-[#A78BFA]/40",
                      BROKER: "text-[#34D399] border-[#34D399]/40",
                    };

                    return (
                      <div
                        key={log.id}
                        className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 py-1.5 border-b border-[#F5F5F0]/5 hover:bg-[#F5F5F0]/[0.02] px-2 -mx-2 transition-colors"
                      >
                        <span className="text-[#8A8A8A] text-[11px] shrink-0 font-mono">
                          [{log.time}]
                        </span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 border shrink-0 font-bold ${
                            levelColors[log.level] || "text-[#F5F5F0] border-[#F5F5F0]/20"
                          }`}
                        >
                          {log.level}
                        </span>
                        <span className="text-[#8A8A8A] text-xs shrink-0 font-semibold">
                          {log.source}:
                        </span>
                        <span className="text-[#F5F5F0]/90 font-light flex-1">
                          {log.message}
                        </span>
                        {log.latency && (
                          <span className="text-[10px] text-[#D7FF00] shrink-0 font-mono">
                            ⚡ {log.latency}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs text-[#8A8A8A]">
                  <span className="inline-block w-2 h-4 bg-[#D7FF00] animate-pulse" />
                  <span className="text-[#6A6A6A]">Awaiting asynchronous dispatch events...</span>
                </div>
              </div>
            )}

            {/* ─── TAB 2: Throughput & Latency Benchmarks ─── */}
            {activeTab === "benchmarks" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10 text-[10px] uppercase tracking-widest text-[#8A8A8A]">
                  <span>BENCHMARK ENGINE // LOAD TESTING (10,000 CONCURRENT CLIENTS)</span>
                  <span className="text-[#D7FF00]">RUNTIME: LINUX / K8S</span>
                </div>

                {/* Metric Summary Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border border-[#F5F5F0]/15 p-4 bg-[#080808] space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#8A8A8A] block">
                      PEAK THROUGHPUT
                    </span>
                    <p className="text-2xl md:text-3xl font-black text-[#D7FF00]">
                      52,400 <span className="text-xs text-[#8A8A8A]">RPS</span>
                    </p>
                    <p className="text-[10px] text-[#B5B5B5]">Non-blocking Netty event loop</p>
                  </div>

                  <div className="border border-[#F5F5F0]/15 p-4 bg-[#080808] space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#8A8A8A] block">
                      P99 LATENCY
                    </span>
                    <p className="text-2xl md:text-3xl font-black text-[#F5F5F0]">
                      18.4 <span className="text-xs text-[#8A8A8A]">MS</span>
                    </p>
                    <p className="text-[10px] text-[#D7FF00]">Sub-25ms SLA compliance</p>
                  </div>

                  <div className="border border-[#F5F5F0]/15 p-4 bg-[#080808] space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#8A8A8A] block">
                      CACHE HIT RATIO
                    </span>
                    <p className="text-2xl md:text-3xl font-black text-[#D7FF00]">
                      98.7 <span className="text-xs text-[#8A8A8A]">%</span>
                    </p>
                    <p className="text-[10px] text-[#B5B5B5]">Distributed Redis cluster</p>
                  </div>

                  <div className="border border-[#F5F5F0]/15 p-4 bg-[#080808] space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#8A8A8A] block">
                      ERROR RATE
                    </span>
                    <p className="text-2xl md:text-3xl font-black text-[#34D399]">
                      0.000 <span className="text-xs text-[#8A8A8A]">%</span>
                    </p>
                    <p className="text-[10px] text-[#B5B5B5]">Zero dropped TCP frames</p>
                  </div>
                </div>

                {/* Latency Percentile Histogram Bar Chart */}
                <div className="border border-[#F5F5F0]/15 p-5 bg-[#080808] space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] block">
                    LATENCY PERCENTILE PROFILE (P50 → P99.9)
                  </span>

                  <div className="space-y-3">
                    {[
                      { label: "P50 (Median)", time: "4.2 ms", width: "18%", color: "bg-[#38BDF8]" },
                      { label: "P75 (Nominal)", time: "8.6 ms", width: "34%", color: "bg-[#38BDF8]" },
                      { label: "P90 (Heavy Load)", time: "12.8 ms", width: "52%", color: "bg-[#D7FF00]" },
                      { label: "P99 (SLA Boundary)", time: "18.4 ms", width: "74%", color: "bg-[#D7FF00]" },
                      { label: "P99.9 (Tail Max)", time: "24.1 ms", width: "92%", color: "bg-[#A78BFA]" },
                    ].map((bar) => (
                      <div key={bar.label} className="space-y-1 text-xs">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#F5F5F0]">{bar.label}</span>
                          <span className="text-[#D7FF00] font-bold">{bar.time}</span>
                        </div>
                        <div className="w-full bg-[#1A1A1A] h-2 overflow-hidden">
                          <div className={`h-full ${bar.color}`} style={{ width: bar.width }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 3: Cluster Mesh & Node Topology ─── */}
            {activeTab === "cluster" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10 text-[10px] uppercase tracking-widest text-[#8A8A8A]">
                  <span>TOPOLOGY // INTERACTIVE ARCHITECTURE NODES</span>
                  <span className="text-[#D7FF00]">5 NODES CONFIGURED</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Node Selection List (6 cols) */}
                  <div className="lg:col-span-6 space-y-2">
                    {CLUSTER_NODES.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`w-full text-left p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                          selectedNode.id === node.id
                            ? "border-[#D7FF00] bg-[#D7FF00]/5 text-[#F5F5F0]"
                            : "border-[#F5F5F0]/10 bg-[#080808] text-[#8A8A8A] hover:border-[#F5F5F0]/30 hover:text-[#F5F5F0]"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold uppercase text-[#F5F5F0]">
                            {node.name}
                          </p>
                          <p className="text-[10px] text-[#8A8A8A] font-light">
                            {node.role}
                          </p>
                        </div>
                        <div className="text-right font-mono text-[10px]">
                          <span className="text-[#D7FF00] font-bold block">{node.status}</span>
                          <span className="text-[#8A8A8A]">{node.latency}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right: Selected Node Detail Specs (6 cols) */}
                  <div className="lg:col-span-6 border border-[#F5F5F0]/15 p-6 bg-[#080808] space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
                        <span className="text-[10px] uppercase tracking-widest text-[#D7FF00] font-bold">
                          NODE DIAGNOSTICS
                        </span>
                        <span className="text-[10px] text-[#34D399] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                          ONLINE
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-base font-bold uppercase text-[#F5F5F0]">
                          {selectedNode.name}
                        </p>
                        <p className="text-xs text-[#B5B5B5] font-light">
                          {selectedNode.role}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F5F5F0]/10 text-xs">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#8A8A8A] block">
                            THROUGHPUT
                          </span>
                          <span className="text-[#F5F5F0] font-bold text-sm">
                            {selectedNode.throughput}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#8A8A8A] block">
                            P99 LATENCY
                          </span>
                          <span className="text-[#D7FF00] font-bold text-sm">
                            {selectedNode.p99}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#F5F5F0]/10 pt-3 flex items-center justify-between text-[10px] text-[#8A8A8A]">
                      <span>CONTAINER: DOCKER / K8S</span>
                      <span className="text-[#D7FF00]">REPLICAS: 3/3 READY</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Narrative Story & Core Stack ═══ */}
      <div className="about-content-trigger px-6 md:px-12 max-w-[1728px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="about-content-fade space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#D7FF00] block">
                // ENGINEERING NARRATIVE
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl text-[#F5F5F0] font-light leading-snug tracking-tight">
                {aboutText}
              </p>
            </div>

            {/* Core Stack 8-box Matrix */}
            <div className="about-content-fade border-t border-[#F5F5F0]/15 pt-8">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A8A8A] mb-5">
                <span>CORE TECHNOLOGICAL ANCHORS</span>
                <span>8 PILLARS</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {coreTechnologies.map((tech, idx) => (
                  <div
                    key={tech}
                    className="group border border-[#F5F5F0]/15 p-4 bg-[#F5F5F0]/[0.02] hover:border-[#D7FF00] hover:bg-[#D7FF00]/5 transition-all cursor-default"
                  >
                    <span className="block font-mono text-[9px] text-[#8A8A8A] group-hover:text-[#D7FF00] mb-1 transition-colors">
                      0{idx + 1}
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Architecture & Credential Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="about-content-fade border border-[#F5F5F0]/15 p-6 md:p-8 bg-[#050505] space-y-6">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/15 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D7FF00] font-bold">
                  EDUCATION // CREDENTIAL
                </span>
                <span className="font-mono text-[10px] text-[#8A8A8A]">MITE</span>
              </div>

              <div>
                <p className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[#F5F5F0] leading-snug">
                  {education.degree}
                </p>
                <p className="mt-2 font-mono text-xs uppercase text-[#8A8A8A]">
                  {education.institution}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-[#F5F5F0]/15 py-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8A8A] block">PERIOD</span>
                  <span className="text-[#F5F5F0] font-medium uppercase">{education.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8A8A] block">LOCATION</span>
                  <span className="text-[#F5F5F0] font-medium uppercase">{education.location}</span>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8A8A] block">
                  TECHNICAL FOCUS
                </span>
                <p className="font-mono text-sm font-bold uppercase text-[#D7FF00]">
                  Full-Stack Architecture &amp; High-Throughput Microservices
                </p>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className="about-content-fade border border-[#F5F5F0]/15 p-5 bg-[#F5F5F0]/[0.02] flex items-center justify-between hover:border-[#D7FF00] transition-colors group">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#F5F5F0] font-bold">
                  LOOKING FOR A BACKEND / FULL STACK DEV?
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]">
                  Open to exciting engineering challenges
                </p>
              </div>
              <a
                href="#contact"
                className="p-3 border border-[#F5F5F0]/15 text-[#F5F5F0] group-hover:border-[#D7FF00] group-hover:text-[#D7FF00] transition-colors"
                aria-label="Contact"
              >
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Capabilities Marquee Ticker ═══ */}
      <div className="mt-24 md:mt-36 border-t border-b border-[#F5F5F0]/15 py-3.5 bg-[#050505]">
        <MarqueeTicker
          items={[
            "BACKEND ARCHITECTURE",
            "MICROSERVICES",
            "HIGH-CONCURRENCY APIS",
            "REACT WEB APPS",
            "POSTGRESQL TUNING",
            "DOCKER / K8S CLUSTERS",
            "SPRING SECURITY JWT",
          ]}
          speed={42}
          reverse
          separator="•"
          className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#F5F5F0]/30"
        />
      </div>
    </section>
  );
}
