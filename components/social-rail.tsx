"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

import { useFooterInView } from "@/lib/use-footer-in-view";

const social = [
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram", glow: "#E1306C" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook", glow: "#1877F2" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp", glow: "#25D366" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn", glow: "#0A66C2" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub", glow: "#FFFFFF" },
];

/**
 * Fixed rail that rides the scroll on desktop. Hides once the footer (which
 * already repeats these same links) enters the viewport, so they never stack.
 */
export function SocialRail() {
  const footerInView = useFooterInView();
  const visible = !footerInView;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -12, y: "-50%" }}
          animate={{ opacity: 1, x: 0, y: "-50%" }}
          exit={{ opacity: 0, x: -12, y: "-50%" }}
          transition={{ duration: 0.3 }}
          className="fixed left-5 top-1/2 z-[90] hidden flex-col items-center gap-1 lg:flex"
          aria-label="Redes sociales"
        >
          <div className="flex flex-col items-center gap-3 rounded-full border border-border bg-background/70 px-2.5 py-4 backdrop-blur-xl">
            {social.map(({ Icon, href, label, glow }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ ["--glow" as string]: glow }}
                className="group flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-[var(--glow)] hover:shadow-[0_0_16px_var(--glow)]"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
