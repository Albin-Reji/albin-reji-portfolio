import React from "react";

interface TextParserProps {
  text: string;
  className?: string;
  boldClassName?: string;
}

/**
 * Parses a string containing **bold text** and renders it with appropriate styling.
 * Used for inline emphasis in body paragraphs.
 */
export function TextParser({ text, className, boldClassName = "text-[#F5F5F0] font-bold" }: TextParserProps) {
  if (!text) return null;

  // Split by **
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          // Remove the asterisks
          const content = part.slice(2, -2);
          return (
            <strong key={index} className={boldClassName}>
              {content}
            </strong>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
