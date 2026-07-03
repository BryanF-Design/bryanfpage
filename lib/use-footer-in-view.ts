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
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px" }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return inView;
}
