"use client";

import { useEffect, useState } from "react";

/**
 * True once #site-footer scrolls into view. Fixed UI (chat, a11y panel, social
 * rail) uses this to get out of the way instead of stacking on top of the footer.
 */
export function useFooterInView() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    // Debounced so momentum/rubber-band scroll bouncing right at the footer's
    // edge doesn't flip this state (and the fixed FAB it controls) back and
    // forth several times in a row.
    let timeout: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(
          () => setInView(entry.isIntersecting),
          150
        );
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(footer);
    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return inView;
}
