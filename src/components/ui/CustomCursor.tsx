"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Only on non-touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReducedMotion) {
      cursor.style.display = "none";
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Hide the dot entirely when hovering inside the contact form card
      const formCard = (e.target as Element)?.closest?.(".contact-form-card, .cf-fields, .cf-field, .cf-field-body");
      if (formCard) {
        cursor.style.opacity = "0";
      } else {
        cursor.style.opacity = "1";
      }
    };

    const animate = () => {
      // Smooth follow with lerp
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

      rafId = requestAnimationFrame(animate);
    };

    const onMouseEnterInteractive = (e: Event) => {
      // Don't expand when over inputs/textareas inside the contact form
      const target = e.target as Element;
      const isInsideForm = target.closest(".contact-form-card, .cf-fields");
      if (isInsideForm) return;
      cursor.classList.add("is-active");
    };

    const onMouseLeaveInteractive = () => {
      cursor.classList.remove("is-active");
    };

    // Track interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);

    // Re-bind on DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select"
      );
      newElements.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, []);

  return <div ref={cursorRef} className="cursor-dot" />;
}
