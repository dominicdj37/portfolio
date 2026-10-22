"use client";

import { useEffect } from "react";

/**
 * Marks the section being read in the desktop table of contents (AC43): the
 * last section whose top has passed the middle of the viewport.
 */
export function TocSpy() {
  useEffect(() => {
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>(
        "[data-toc='desktop'] a[href^='#']",
      ),
    ];
    const sections = links
      .map((link) => document.getElementById(link.hash.slice(1)))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      let active = -1;
      sections.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= line) active = i;
      });
      links.forEach((link, i) => {
        if (i === active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
