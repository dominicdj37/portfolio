"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The header lives in the root layout, so it stays mounted across client
 * navigations. This island keeps it in step with the route: it marks the
 * current page's nav links (AC12) and closes the menu sheet when a link is
 * tapped or the route changes (Q13).
 */
export function NavState({ menuId }: { menuId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    for (const link of document.querySelectorAll<HTMLAnchorElement>(
      "a[data-nav]",
    )) {
      const href = link.getAttribute("href") ?? "";
      const current = pathname === href || pathname.startsWith(`${href}/`);
      if (current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    const sheet = document.getElementById(menuId);
    if (sheet?.matches(":popover-open")) sheet.hidePopover();
  }, [pathname, menuId]);

  useEffect(() => {
    const sheet = document.getElementById(menuId);
    if (!sheet) return;
    const onClick = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("a") &&
        sheet.matches(":popover-open")
      ) {
        sheet.hidePopover();
      }
    };
    sheet.addEventListener("click", onClick);
    return () => sheet.removeEventListener("click", onClick);
  }, [menuId]);

  return null;
}
