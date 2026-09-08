"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  Layers,
  X,
  Info,
} from "lucide-react";
import type { ArchNode, ArchConnection, ArchConnectionType, ArchNodeType } from "@/data/portfolio";

interface ArchitectureDiagramProps {
  nodes: ArchNode[];
  connections: ArchConnection[];
  title?: string;
}

interface TierGroup {
  id: string;
  label: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// ─── Protocol Color Tokens ──────────────────────────────────────────────────
const PROTOCOL_CONFIG: Record<
  ArchConnectionType,
  { label: string; stroke: string; glow: string; bg: string; text: string }
> = {
  rest: {
    label: "REST / HTTP",
    stroke: "#00E5FF",
    glow: "rgba(0, 229, 255, 0.4)",
    bg: "rgba(0, 229, 255, 0.1)",
    text: "#00E5FF",
  },
  event: {
    label: "AMQP / EVENTS",
    stroke: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
    bg: "rgba(245, 158, 11, 0.1)",
    text: "#F59E0B",
  },
  ws: {
    label: "WEBSOCKET / STOMP",
    stroke: "#C084FC",
    glow: "rgba(192, 132, 252, 0.4)",
    bg: "rgba(192, 132, 252, 0.1)",
    text: "#C084FC",
  },
  jdbc: {
    label: "DATABASE / JPA",
    stroke: "#34D399",
    glow: "rgba(52, 211, 153, 0.4)",
    bg: "rgba(52, 211, 153, 0.1)",
    text: "#34D399",
  },
  auth: {
    label: "AUTH / OIDC",
    stroke: "#FB7185",
    glow: "rgba(251, 113, 133, 0.4)",
    bg: "rgba(251, 113, 133, 0.1)",
    text: "#FB7185",
  },
  discovery: {
    label: "DISCOVERY / CONFIG",
    stroke: "#D7FF00",
    glow: "rgba(215, 255, 0, 0.4)",
    bg: "rgba(215, 255, 0, 0.1)",
    text: "#D7FF00",
  },
};

const TIER_ACCENTS: Record<ArchNodeType, { border: string; badge: string }> = {
  client: { border: "#00E5FF", badge: "text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/30" },
  gateway: { border: "#38BDF8", badge: "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30" },
  service: { border: "#A855F7", badge: "text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30" },
  broker: { border: "#F59E0B", badge: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30" },
  data: { border: "#10B981", badge: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30" },
  external: { border: "#F43F5E", badge: "text-[#F43F5E] bg-[#F43F5E]/10 border-[#F43F5E]/30" },
  governance: { border: "#D7FF00", badge: "text-[#D7FF00] bg-[#D7FF00]/10 border-[#D7FF00]/30" },
};

// ─── Edge Calculation Helper ────────────────────────────────────────────────
function getEdgePoints(fromNode: ArchNode, toNode: ArchNode) {
  const fw = fromNode.width ?? 180;
  const fh = fromNode.height ?? 46;
  const tw = toNode.width ?? 180;
  const th = toNode.height ?? 46;

  const fcx = fromNode.x + fw / 2;
  const fcy = fromNode.y + fh / 2;
  const tcx = toNode.x + tw / 2;
  const tcy = toNode.y + th / 2;

  const dx = tcx - fcx;
  const dy = tcy - fcy;

  let startX = fcx;
  let startY = fcy;
  let endX = tcx;
  let endY = tcy;

  // Determine exit & entry faces
  if (Math.abs(dy) >= Math.abs(dx)) {
    if (dy > 0) {
      // Flow downwards
      startX = fcx;
      startY = fromNode.y + fh;
      endX = tcx;
      endY = toNode.y;
    } else {
      // Flow upwards
      startX = fcx;
      startY = fromNode.y;
      endX = tcx;
      endY = toNode.y + th;
    }
  } else {
    if (dx > 0) {
      // Flow rightwards
      startX = fromNode.x + fw;
      startY = fcy;
      endX = toNode.x;
      endY = tcy;
    } else {
      // Flow leftwards
      startX = fromNode.x;
      startY = fcy;
      endX = toNode.x + tw;
      endY = tcy;
    }
  }

  return { startX, startY, endX, endY, fcx, fcy, tcx, tcy };
}

function buildSmoothPath(fromNode: ArchNode, toNode: ArchNode): string {
  const { startX, startY, endX, endY } = getEdgePoints(fromNode, toNode);
  const dy = endY - startY;
  const dx = endX - startX;

  if (Math.abs(dy) >= Math.abs(dx)) {
    const cp1y = startY + dy * 0.45;
    const cp2y = endY - dy * 0.45;
    return `M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`;
  } else {
    const cp1x = startX + dx * 0.45;
    const cp2x = endX - dx * 0.45;
    return `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
  }
}

export default function ArchitectureDiagram({
  nodes,
  connections,
  title,
}: ArchitectureDiagramProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<ArchConnectionType | "ALL">("ALL");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard escape handler for fullscreen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nodeMap = useMemo(() => {
    const map = new Map<string, ArchNode>();
    for (const n of nodes) map.set(n.id, n);
    return map;
  }, [nodes]);

  // Determine available protocols present in this diagram
  const availableProtocols = useMemo(() => {
    const set = new Set<ArchConnectionType>();
    for (const c of connections) {
      if (c.type) set.add(c.type);
    }
    return Array.from(set);
  }, [connections]);

  // Compute tier boundary boxes
  const tierGroups = useMemo<TierGroup[]>(() => {
    const groups = new Map<string, { label: string; nodes: ArchNode[] }>();

    for (const n of nodes) {
      const tierKey = n.tierLabel || n.tier || "general";
      if (!groups.has(tierKey)) {
        groups.set(tierKey, { label: tierKey.toUpperCase(), nodes: [] });
      }
      groups.get(tierKey)!.nodes.push(n);
    }

    const result: TierGroup[] = [];
    groups.forEach((group, id) => {
      if (group.nodes.length === 0) return;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const n of group.nodes) {
        const w = n.width ?? 180;
        const h = n.height ?? 46;
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + w);
        maxY = Math.max(maxY, n.y + h);
      }

      result.push({
        id,
        label: group.label,
        minX: minX - 16,
        minY: minY - 20,
        maxX: maxX + 16,
        maxY: maxY + 14,
      });
    });

    return result;
  }, [nodes]);

  const activeFocusId = selectedNodeId || hoveredNodeId;

  // Connected nodes set based on active focus node
  const connectedIds = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const ids = new Set<string>([activeFocusId]);
    for (const c of connections) {
      if (c.from === activeFocusId) ids.add(c.to);
      if (c.to === activeFocusId) ids.add(c.from);
    }
    return ids;
  }, [activeFocusId, connections]);

  // Inbound & outbound connections for the inspected node
  const inspectedNode = useMemo(() => {
    if (!activeFocusId) return null;
    return nodeMap.get(activeFocusId) || null;
  }, [activeFocusId, nodeMap]);

  const inspectedInbound = useMemo(() => {
    if (!activeFocusId) return [];
    return connections.filter((c) => c.to === activeFocusId);
  }, [activeFocusId, connections]);

  const inspectedOutbound = useMemo(() => {
    if (!activeFocusId) return [];
    return connections.filter((c) => c.from === activeFocusId);
  }, [activeFocusId, connections]);

  // Dynamic canvas bounds calculated tightly from node coordinates
  const maxX = useMemo(() => {
    if (!nodes.length) return 960;
    return Math.max(...nodes.map((n) => n.x + (n.width ?? 180))) + 25;
  }, [nodes]);

  const maxY = useMemo(() => {
    if (!nodes.length) return 460;
    return Math.max(...nodes.map((n) => n.y + (n.height ?? 46))) + 25;
  }, [nodes]);

  // Filtered connections list
  const filteredConnections = useMemo(() => {
    if (activeProtocol === "ALL") return connections;
    return connections.filter((c) => c.type === activeProtocol);
  }, [connections, activeProtocol]);

  // Render SVG Canvas Component
  const renderDiagramSvg = (isModal = false) => (
    <svg
      viewBox={`0 0 ${maxX} ${maxY}`}
      className={`w-full ${isModal ? "h-[68vh]" : "h-auto"} select-none`}
      role="img"
      aria-label="Interactive Architecture Diagram"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Custom Arrow Markers per Protocol */}
        {Object.entries(PROTOCOL_CONFIG).map(([type, cfg]) => (
          <marker
            key={`arrow-${type}`}
            id={`arrow-${type}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={cfg.stroke} />
          </marker>
        ))}

        {/* Default / Neutral Arrow Marker */}
        <marker
          id="arrow-default"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(245, 245, 240, 0.4)" />
        </marker>

        {/* Highlighted Marker */}
        <marker
          id="arrow-active"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#D7FF00" />
        </marker>

        {/* Grid pattern */}
        <pattern id="arch-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="0.7" fill="rgba(245, 245, 240, 0.08)" />
        </pattern>
      </defs>

      {/* Grid Canvas Background */}
      <rect width={maxX} height={maxY} fill="url(#arch-grid)" />

      {/* ═══ Tier Boundaries ═══ */}
      {tierGroups.map((group) => {
        const width = group.maxX - group.minX;
        const height = group.maxY - group.minY;
        return (
          <g key={group.id} className="pointer-events-none">
            <rect
              x={group.minX}
              y={group.minY}
              width={width}
              height={height}
              fill="rgba(245, 245, 240, 0.012)"
              stroke="rgba(245, 245, 240, 0.08)"
              strokeWidth={1}
              strokeDasharray="4 4"
              rx={4}
            />
            <text
              x={group.minX + 8}
              y={group.minY + 11}
              fill="rgba(245, 245, 240, 0.35)"
              className="font-mono text-[8px] uppercase tracking-[0.2em] select-none"
              dominantBaseline="middle"
            >
              [ {group.label} ]
            </text>
          </g>
        );
      })}

      {/* ═══ Connection Lines ═══ */}
      {filteredConnections.map((conn) => {
        const fromNode = nodeMap.get(conn.from);
        const toNode = nodeMap.get(conn.to);
        if (!fromNode || !toNode) return null;

        const isHighlighted =
          activeFocusId !== null &&
          (conn.from === activeFocusId || conn.to === activeFocusId);
        const isDimmed = activeFocusId !== null && !isHighlighted;
        const protoCfg = conn.type ? PROTOCOL_CONFIG[conn.type] : null;
        const strokeColor = isHighlighted
          ? "#D7FF00"
          : protoCfg
          ? protoCfg.stroke
          : "rgba(245, 245, 240, 0.25)";

        const markerId = isHighlighted
          ? "url(#arrow-active)"
          : conn.type
          ? `url(#arrow-${conn.type})`
          : "url(#arrow-default)";

        const pathD = buildSmoothPath(fromNode, toNode);

        return (
          <g key={`${conn.from}-${conn.to}-${conn.type || "default"}`} className="transition-opacity duration-300">
            {/* Background halo for easier selection/hover */}
            <path
              d={pathD}
              fill="none"
              stroke="transparent"
              strokeWidth={14}
              className="cursor-pointer"
            />
            {/* Active flow glow */}
            {isHighlighted && (
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={4}
                opacity={0.3}
                filter="url(#glow)"
              />
            )}
            {/* Main Path */}
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isHighlighted ? 2 : 1.2}
              markerEnd={markerId}
              strokeDasharray={isHighlighted ? "6 3" : undefined}
              opacity={isDimmed ? 0.08 : isHighlighted ? 1 : 0.65}
              className="transition-all duration-300"
            />
          </g>
        );
      })}

      {/* ═══ Nodes ═══ */}
      {nodes.map((node) => {
        const w = node.width ?? 180;
        const h = node.height ?? 46;
        const isFocused = activeFocusId === node.id;
        const isConnected = connectedIds.has(node.id);
        const isDimmed = activeFocusId !== null && !isConnected;
        const tierAccent = node.tier ? TIER_ACCENTS[node.tier] : { border: "#D7FF00", badge: "" };

        return (
          <g
            key={node.id}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() =>
              setSelectedNodeId((prev) => (prev === node.id ? null : node.id))
            }
            className="cursor-pointer transition-all duration-300"
            opacity={isDimmed ? 0.22 : 1}
          >
            {/* Outer Highlight Glow */}
            {isFocused && (
              <rect
                x={node.x - 2}
                y={node.y - 2}
                width={w + 4}
                height={h + 4}
                fill="none"
                stroke="#D7FF00"
                strokeWidth={1.5}
                opacity={0.8}
                filter="url(#glow)"
                rx={2}
              />
            )}

            {/* Node Card Background */}
            <rect
              x={node.x}
              y={node.y}
              width={w}
              height={h}
              fill={isFocused ? "#121800" : isConnected ? "#0A0D04" : "#0D0D0D"}
              stroke={
                isFocused
                  ? "#D7FF00"
                  : isConnected
                  ? "rgba(215, 255, 0, 0.5)"
                  : "rgba(245, 245, 240, 0.2)"
              }
              strokeWidth={1}
              rx={1}
            />

            {/* Left Accent Stripe */}
            <rect
              x={node.x}
              y={node.y}
              width={3}
              height={h}
              fill={isFocused ? "#D7FF00" : tierAccent.border}
            />

            {/* Status Pip */}
            <circle
              cx={node.x + 12}
              cy={node.y + 14}
              r={2.5}
              fill={isFocused ? "#D7FF00" : tierAccent.border}
            />

            {/* Node Title */}
            <text
              x={node.x + 20}
              y={node.y + 14}
              dominantBaseline="middle"
              className="font-mono text-[10.5px] font-bold tracking-[0.05em] select-none uppercase"
              fill={isFocused ? "#D7FF00" : "#F5F5F0"}
            >
              {node.label}
            </text>

            {/* Port Badge (if available) */}
            {node.port && (
              <text
                x={node.x + w - 8}
                y={node.y + 14}
                textAnchor="end"
                dominantBaseline="middle"
                className="font-mono text-[8.5px] font-medium tracking-[0.05em] select-none text-[#8A8A8A]"
                fill="#8A8A8A"
              >
                {node.port}
              </text>
            )}

            {/* Sublabel / Technology Badging */}
            {node.sublabel && (
              <text
                x={node.x + 20}
                y={node.y + 32}
                dominantBaseline="middle"
                className="font-mono text-[8px] uppercase tracking-[0.12em] select-none"
                fill={isFocused ? "rgba(215, 255, 0, 0.85)" : "#8A8A8A"}
              >
                {node.sublabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full bg-[#050505] border border-[#F5F5F0]/15 flex flex-col"
    >
      {/* ═══ Header Bar: Title, Protocol Filters & Maximize Action ═══ */}
      <div className="p-3 md:p-4 border-b border-[#F5F5F0]/15 flex flex-wrap items-center justify-between gap-3 bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A8A] flex items-center gap-1.5">
            <Layers size={13} className="text-[#D7FF00]" />
            <span>{title || "DISTRIBUTED SYSTEM TOPOLOGY"}</span>
          </span>
          <span className="font-mono text-[9px] px-2 py-0.5 border border-[#F5F5F0]/15 text-[#D7FF00] bg-[#000000]">
            {nodes.length} NODES // {connections.length} FLOWS
          </span>
        </div>

        {/* Protocol Filter Chips */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-[9px] uppercase">
          <button
            onClick={() => setActiveProtocol("ALL")}
            className={`px-2 py-1 border transition-colors cursor-pointer ${
              activeProtocol === "ALL"
                ? "bg-[#D7FF00] text-[#050505] border-[#D7FF00] font-bold"
                : "border-[#F5F5F0]/10 text-[#8A8A8A] hover:text-[#F5F5F0]"
            }`}
          >
            ALL
          </button>
          {availableProtocols.map((proto) => {
            const cfg = PROTOCOL_CONFIG[proto];
            const isActive = activeProtocol === proto;
            return (
              <button
                key={proto}
                onClick={() => setActiveProtocol(isActive ? "ALL" : proto)}
                className={`px-2 py-1 border transition-colors cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? "bg-[#D7FF00] text-[#050505] border-[#D7FF00] font-bold"
                    : "border-[#F5F5F0]/10 text-[#8A8A8A] hover:text-[#F5F5F0]"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cfg.stroke }}
                />
                <span>{cfg.label}</span>
              </button>
            );
          })}

          {/* Fullscreen Modal Toggle Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="ml-2 p-1.5 border border-[#F5F5F0]/15 text-[#8A8A8A] hover:text-[#D7FF00] hover:border-[#D7FF00] transition-colors cursor-pointer"
            title="Expand Fullscreen Diagram"
            aria-label="Expand Fullscreen Diagram"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* ═══ Main Diagram Canvas ═══ */}
      <div className="relative p-2 md:p-4 overflow-x-auto bg-[#050505]">
        {renderDiagramSvg(false)}
      </div>

      {/* ═══ Interactive Inspector Card ═══ */}
      <AnimatePresence>
        {inspectedNode ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="border-t border-[#F5F5F0]/15 bg-[#080808] p-3 md:p-4 text-xs font-mono"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#F5F5F0]/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#D7FF00] font-bold text-sm uppercase">
                    {inspectedNode.label}
                  </span>
                  {inspectedNode.port && (
                    <span className="px-1.5 py-0.5 text-[9px] border border-[#F5F5F0]/20 text-[#8A8A8A]">
                      PORT {inspectedNode.port}
                    </span>
                  )}
                  {inspectedNode.tier && (
                    <span
                      className={`px-2 py-0.5 text-[9px] border uppercase ${
                        TIER_ACCENTS[inspectedNode.tier].badge
                      }`}
                    >
                      {inspectedNode.category || inspectedNode.tier}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#A0A0A0]">
                  {inspectedNode.tech && (
                    <span className="text-[#F5F5F0]/80">{inspectedNode.tech}</span>
                  )}
                  {inspectedNode.description && ` — ${inspectedNode.description}`}
                </div>
              </div>

              {selectedNodeId && (
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-[10px] text-[#8A8A8A] hover:text-[#D7FF00] flex items-center gap-1 border border-[#F5F5F0]/10 px-2 py-1 cursor-pointer"
                >
                  <X size={11} />
                  <span>CLEAR PIN</span>
                </button>
              )}
            </div>

            {/* Subsystem Flow Dependencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-[10px]">
              {/* Inbound Flows */}
              <div>
                <span className="text-[#8A8A8A] uppercase tracking-wider block mb-1.5">
                  ↓ INBOUND TRAFFIC ({inspectedInbound.length})
                </span>
                {inspectedInbound.length === 0 ? (
                  <span className="text-[#606060] italic">Entry point / No internal inbound calls</span>
                ) : (
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {inspectedInbound.map((c, i) => {
                      const from = nodeMap.get(c.from);
                      const proto = c.type ? PROTOCOL_CONFIG[c.type] : null;
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 p-1 bg-[#111111] border border-[#F5F5F0]/5"
                        >
                          <span className="text-[#F5F5F0] truncate">{from?.label || c.from}</span>
                          <span
                            className="px-1.5 py-0.2 border text-[8px] uppercase shrink-0"
                            style={{
                              borderColor: proto?.stroke || "#666",
                              color: proto?.text || "#AAA",
                            }}
                          >
                            {c.protocol || c.label || proto?.label || "CALL"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Outbound Flows */}
              <div>
                <span className="text-[#8A8A8A] uppercase tracking-wider block mb-1.5">
                  ↑ OUTBOUND CALLS & EVENTS ({inspectedOutbound.length})
                </span>
                {inspectedOutbound.length === 0 ? (
                  <span className="text-[#606060] italic">Terminal sink / Leaf persistence</span>
                ) : (
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {inspectedOutbound.map((c, i) => {
                      const to = nodeMap.get(c.to);
                      const proto = c.type ? PROTOCOL_CONFIG[c.type] : null;
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 p-1 bg-[#111111] border border-[#F5F5F0]/5"
                        >
                          <span className="text-[#F5F5F0] truncate">{to?.label || c.to}</span>
                          <span
                            className="px-1.5 py-0.2 border text-[8px] uppercase shrink-0"
                            style={{
                              borderColor: proto?.stroke || "#666",
                              color: proto?.text || "#AAA",
                            }}
                          >
                            {c.protocol || c.label || proto?.label || "CALL"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="px-4 py-2 border-t border-[#F5F5F0]/10 bg-[#0A0A0A] flex items-center justify-between text-[9px] font-mono text-[#8A8A8A] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Info size={11} className="text-[#D7FF00]" />
              <span>HOVER OR CLICK ANY NODE TO TRACE CALL PATHS & PROTOCOLS</span>
            </span>
            <span className="text-[#606060]">CLICK PIN TO LOCK INSPECTION</span>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ Fullscreen Modal View ═══ */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-md flex flex-col p-4 md:p-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F5F5F0]/15 font-mono mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-[#D7FF00]">
                  SYSTEM ARCHITECTURE DEEP DIVE
                </span>
                <span className="text-xs text-[#8A8A8A] hidden md:inline">
                  // {title || "DISTRIBUTED TOPOLOGY"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-[#8A8A8A] uppercase">
                  ESC TO CLOSE
                </span>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 border border-[#F5F5F0]/20 text-[#F5F5F0] hover:text-[#D7FF00] hover:border-[#D7FF00] transition-colors cursor-pointer"
                  aria-label="Close fullscreen"
                >
                  <Minimize2 size={16} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 bg-[#050505] border border-[#F5F5F0]/15 p-4 flex flex-col justify-between overflow-hidden">
              {/* Protocol Filters in Modal */}
              <div className="flex flex-wrap items-center gap-2 pb-3 mb-2 border-b border-[#F5F5F0]/10 font-mono text-[10px] uppercase">
                <span className="text-[#8A8A8A] mr-2">PROTOCOL FILTER:</span>
                <button
                  onClick={() => setActiveProtocol("ALL")}
                  className={`px-3 py-1 border transition-colors cursor-pointer ${
                    activeProtocol === "ALL"
                      ? "bg-[#D7FF00] text-[#050505] border-[#D7FF00] font-bold"
                      : "border-[#F5F5F0]/10 text-[#8A8A8A] hover:text-[#F5F5F0]"
                  }`}
                >
                  ALL ({connections.length})
                </button>
                {availableProtocols.map((proto) => {
                  const cfg = PROTOCOL_CONFIG[proto];
                  const count = connections.filter((c) => c.type === proto).length;
                  return (
                    <button
                      key={proto}
                      onClick={() => setActiveProtocol(proto)}
                      className={`px-3 py-1 border transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeProtocol === proto
                          ? "bg-[#D7FF00] text-[#050505] border-[#D7FF00] font-bold"
                          : "border-[#F5F5F0]/10 text-[#8A8A8A] hover:text-[#F5F5F0]"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cfg.stroke }}
                      />
                      <span>
                        {cfg.label} ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Large SVG */}
              <div className="flex-1 flex items-center justify-center overflow-auto">
                {renderDiagramSvg(true)}
              </div>

              {/* Modal Bottom Inspector */}
              {inspectedNode && (
                <div className="mt-3 p-3 bg-[#0A0A0A] border border-[#F5F5F0]/15 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#D7FF00] font-bold mb-1">
                    <span>
                      {inspectedNode.label} {inspectedNode.port && `(${inspectedNode.port})`}
                    </span>
                    <span className="text-[#8A8A8A] text-[10px]">
                      {inspectedNode.tech}
                    </span>
                  </div>
                  <p className="text-[#B5B5B5] text-[11px] leading-relaxed">
                    {inspectedNode.description}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
