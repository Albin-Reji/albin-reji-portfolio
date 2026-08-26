"use client";

import Image from "next/image";
import { XIcon } from "@/components/ui/Icons";
import type { EngineeringPost } from "@/data/engineeringNotesData";

interface EngineeringNoteCardProps {
  post: EngineeringPost;
  dragMoved: boolean;
  /** Whether this card is the active/center card in the carousel */
  isActive?: boolean;
}

export default function EngineeringNoteCard({
  post,
  dragMoved,
  isActive = false,
}: EngineeringNoteCardProps) {
  // Clear, crisp border & surface styling with depth separation
  const borderClasses = isActive
    ? "border-[#F5F5F0]/35 ring-1 ring-[#D7FF00]/30 shadow-[0_0_0_1px_rgba(215,255,0,0.25),0_30px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(215,255,0,0.08)] bg-gradient-to-b from-[#161616] to-[#070707]"
    : "border-[#F5F5F0]/20 shadow-[0_15px_40px_rgba(0,0,0,0.75)] bg-gradient-to-b from-[#111111] to-[#040404]";

  const hoverClasses = isActive
    ? "hover:border-[#D7FF00]/70 hover:ring-[#D7FF00]/50 hover:shadow-[0_0_0_1px_rgba(215,255,0,0.4),0_35px_80px_rgba(0,0,0,0.98),0_0_55px_rgba(215,255,0,0.12)]"
    : "hover:border-[#F5F5F0]/35";

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (dragMoved) e.preventDefault();
      }}
      aria-label={`${post.category}: ${post.title}. View technical post on X.`}
      className={`group relative block w-[74vw] sm:w-[310px] md:w-[335px] min-h-[460px] md:min-h-[490px] shrink-0 rounded-2xl border p-5 md:p-6 flex flex-col justify-between space-y-4 transition-all duration-300 overflow-hidden ${borderClasses} ${hoverClasses}`}
      style={{
        // Subtle cylindrical surface highlight
        backgroundImage: isActive
          ? "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(215,255,0,0.05) 0%, rgba(22,22,22,0.98) 60%, rgba(7,7,7,1) 100%)"
          : "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,255,255,0.02) 0%, rgba(15,15,15,0.98) 60%, rgba(4,4,4,1) 100%)",
      }}
    >
      {/* Top subtle highlight rim */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1px] ${
          isActive
            ? "bg-gradient-to-r from-transparent via-[#D7FF00]/60 to-transparent"
            : "bg-gradient-to-r from-transparent via-[#F5F5F0]/20 to-transparent"
        }`}
      />

      <div className="space-y-4 flex-1 flex flex-col">
        {/* Card Thumbnail Image Area with clean vertical balance */}
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-[#F5F5F0]/15 bg-[#111111] shrink-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 75vw, 340px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/25 to-transparent pointer-events-none" />

          {/* Small category tag badge on image */}
          <div className="absolute top-3 left-3 z-10 font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm bg-[#050505]/95 border border-[#D7FF00]/50 text-[#D7FF00] backdrop-blur-xs">
            {post.category}
          </div>

          <div className="absolute bottom-3 right-3 z-10 text-[#F5F5F0]/60 group-hover:text-[#D7FF00] transition-colors">
            <XIcon width={14} height={14} />
          </div>
        </div>

        {/* Title & Description with tall, elegant typography spacing */}
        <div className="space-y-2.5 flex-1 flex flex-col justify-start pt-1">
          <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#F5F5F0] leading-snug group-hover:text-[#D7FF00] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-[#B5B5B5] font-light leading-relaxed line-clamp-3">
            {post.description}
          </p>
        </div>
      </div>

      {/* Card Meta & CTA Bar */}
      <div className="border-t border-[#F5F5F0]/15 pt-3.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A] shrink-0">
        <span>{post.date}</span>
        <span className="inline-flex items-center gap-1 text-[#F5F5F0] group-hover:text-[#D7FF00] transition-colors font-semibold">
          <span>VIEW ON X</span>
          <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </span>
      </div>

      {/* Inactive card subtle dark depth layer to emphasize center card in front */}
      {!isActive && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-2xl transition-opacity duration-300 group-hover:bg-transparent" />
      )}
    </a>
  );
}
