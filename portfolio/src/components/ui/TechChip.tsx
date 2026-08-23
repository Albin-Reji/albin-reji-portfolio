"use client";

interface TechChipProps {
  label: string;
  size?: "sm" | "md";
}

export default function TechChip({ label, size = "md" }: TechChipProps) {
  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-1 text-[10px]"
      : "px-3 py-1.5 text-xs";

  return (
    <span
      className={`inline-flex items-center font-mono font-medium uppercase tracking-[0.14em] border border-[#F5F5F0]/15 bg-[#F5F5F0]/[0.03] text-[#B5B5B5] hover:border-[#D7FF00] hover:text-[#D7FF00] hover:bg-[#D7FF00]/5 transition-colors cursor-default ${sizeClasses}`}
    >
      {label}
    </span>
  );
}
