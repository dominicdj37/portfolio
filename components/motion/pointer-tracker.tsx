"use client";

import { useEffect } from "react";

/**
 * M10: the one shared pointer island. With a fine, hovering pointer (and no
 * reduced-motion preference) it sets --gx/--gy on the root for the plane-grid
 * glow, --x/--y on the [data-pointer] element under the pointer for the
 * spotlight and ripple, and --mx/--my on [data-magnetic] elements.
 */
export function PointerTracker() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const root = document.documentElement;
    let frame = 0;
    let last: PointerEvent | undefined;
    let magnet: HTMLElement | null = null;

    const update = () => {
      frame = 0;
      if (!last) return;
      const target =
        last.target instanceof Element
          ? last.target.closest<HTMLElement>("[data-pointer]")
          : null;
      if (magnet && magnet !== target) {
        magnet.style.setProperty("--mx", "0");
        magnet.style.setProperty("--my", "0");
        magnet = null;
      }
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = last.clientX - rect.left;
      const y = last.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
      if (target.hasAttribute("data-magnetic")) {
        magnet = target;
        target.style.setProperty("--mx", ((x / rect.width) * 2 - 1).toFixed(3));
        target.style.setProperty(
          "--my",
          ((y / rect.height) * 2 - 1).toFixed(3),
        );
      }
    };

    const onMove = (event: PointerEvent) => {
      root.style.setProperty("--gx", `${event.clientX}px`);
      root.style.setProperty("--gy", `${event.clientY}px`);
      last = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
