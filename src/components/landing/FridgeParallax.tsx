"use client";
/**
 * Moves the objects on the fridge door with the pointer, each by its own depth (--d in landing.module.css).
 * Off for touch and reduced motion; the scene is fully readable without it.
 */
import { useEffect, useRef, type ReactNode } from "react";

export function FridgeParallax({
  className,
  children,
  label,
}: {
  className: string;
  children: ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest("section");
    if (!el || !host) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    let frame = 0;
    function onMove(e: PointerEvent): void {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = host!.getBoundingClientRect();
        el!.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        el!.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    }
    function onLeave(): void {
      el!.style.setProperty("--px", "0");
      el!.style.setProperty("--py", "0");
    }
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      {children}
    </div>
  );
}
