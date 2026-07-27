"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Shared collision signal for the purchase configurator. Floating helpers use
 * one threshold so none of them drift into the buying controls.
 */
export function useConfiguratorInView() {
  const [inView, setInView] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const configurator = document.getElementById("precios");
    if (!configurator) {
      setInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-12% 0px -12% 0px", threshold: 0.05 }
    );
    observer.observe(configurator);
    return () => observer.disconnect();
  }, [pathname]);

  return inView;
}
