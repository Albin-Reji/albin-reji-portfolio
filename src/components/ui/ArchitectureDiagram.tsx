"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { ArchNode, ArchConnection } from "@/data/portfolio";

interface ArchitectureDiagramProps {
  nodes: ArchNode[];
  connections: ArchConnection[];
}

function getNodeCenter(node: ArchNode) {
  const w = node.width ?? 124;
  const h = node.height ?? 38;
  return { cx: node.x + w / 2, cy: node.y + h / 2 };
}

function buildPath(fromNode: ArchNode, toNode: ArchNode): string {
  const from = getNodeCenter(fromNode);
  const to = getNodeCenter(toNode);
  const midY = (from.cy + to.cy) / 2;
  return `M ${from.cx} ${from.cy} C ${from.cx} ${midY}, ${to.cx} ${midY}, ${to.cx} ${to.cy}`;
}

export default function ArchitectureDiagram({
  nodes,
  connections,
}: ArchitectureDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodeMap = useMemo(() => {
    const map = new Map<string, ArchNode>();
    for (const n of nodes) map.set(n.id, n);
    return map;
  }, [nodes]);

  const connectedIds = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const ids = new Set<string>([hoveredNode]);
    for (const c of connections) {
      if (c.from === hoveredNode) ids.add(c.to);
      if (c.to === hoveredNode) ids.add(c.from);
    }
    return ids;
  }, [hoveredNode, connections]);

  const maxX = Math.max(...nodes.map((n) => n.x + (n.width ?? 124))) + 30;
  const maxY = Math.max(...nodes.map((n) => n.y + (n.height ?? 38))) + 30;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full overflow-hidden bg-[#050505] border border-[#F5F5F0]/15 p-4 md:p-6"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F5F5F0]/10 font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A8A8A]">
        <span>SYSTEM TOPOLOGY // TRACE</span>
        <span className="text-[#D7FF00]">HOVER NODES TO HIGHLIGHT</span>
      </div>

      <svg
        viewBox={`0 0 ${maxX} ${maxY}`}
        className="w-full h-auto"
        role="img"
        aria-label="Architecture diagram"
      >
        {/* Connection lines */}
        {connections.map((conn) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          if (!fromNode || !toNode) return null;

          const isHighlighted =
            hoveredNode !== null &&
            (conn.from === hoveredNode || conn.to === hoveredNode);
          const isDimmed = hoveredNode !== null && !isHighlighted;

          return (
            <path
              key={`${conn.from}-${conn.to}`}
              d={buildPath(fromNode, toNode)}
              fill="none"
              stroke={isHighlighted ? "#D7FF00" : "rgba(245, 245, 240, 0.2)"}
              strokeWidth={isHighlighted ? 2 : 1}
              className="arch-line transition-all duration-300"
              opacity={isDimmed ? 0.15 : 1}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const w = node.width ?? 124;
          const h = node.height ?? 38;
          const isActive = connectedIds.has(node.id);
          const isDimmed = hoveredNode !== null && !isActive;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer transition-all duration-300"
              opacity={isDimmed ? 0.25 : 1}
            >
              {/* Node Background */}
              <rect
                x={node.x}
                y={node.y}
                width={w}
                height={h}
                fill={isActive ? "#0D1200" : "#111111"}
                stroke={isActive ? "#D7FF00" : "rgba(245, 245, 240, 0.2)"}
                strokeWidth={1}
              />

              {/* Status accent pip */}
              <rect
                x={node.x + 6}
                y={node.y + 6}
                width={3}
                height={3}
                fill={isActive ? "#D7FF00" : "#6A6A6A"}
              />

              {/* Label */}
              <text
                x={node.x + w / 2}
                y={node.y + (node.sublabel ? h / 2 - 5 : h / 2)}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono text-[11px] select-none uppercase tracking-[0.1em]"
                fill={isActive ? "#D7FF00" : "#F5F5F0"}
                fontWeight={600}
              >
                {node.label}
              </text>

              {/* Sublabel */}
              {node.sublabel && (
                <text
                  x={node.x + w / 2}
                  y={node.y + h / 2 + 8}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono text-[8px] uppercase tracking-[0.14em] select-none"
                  fill="#8A8A8A"
                >
                  {node.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
