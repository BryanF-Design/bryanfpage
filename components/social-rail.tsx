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
  { Icon: FaInstagram, href: "https://www.instagram.com/bryanf_design/", label: "Instagram" },
  { Icon: FaFacebookF, href: "https://www.facebook.com/share/1R1rS2ToKf/", label: "Facebook" },
  { Icon: FaWhatsapp, href: "https://wa.me/525663012505", label: "WhatsApp" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/bryanfdesigner", label: "LinkedIn" },
  { Icon: FaGithub, href: "https://github.com/BryanF-Design", label: "GitHub" },
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
        <motion.nav
          initial={{ opacity: 0, x: -12, y: "-50%" }}
          animate={{ opacity: 1, x: 0, y: "-50%" }}
          exit={{ opacity: 0, x: -12, y: "-50%" }}
          transition={{ duration: 0.3 }}
          className="fixed left-5 top-1/2 z-[90] hidden flex-col items-center gap-1 lg:flex"
          aria-label="Redes sociales"
        >
          <div className="glass-nav flex flex-col items-center gap-2 rounded-full border border-white/10 px-2 py-3 shadow-lg shadow-black/30">
            {social.map(({ Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex size-11 items-center justify-center rounded-full text-muted-foreground transition-[color,transform,box-shadow] duration-200 hover:scale-105 hover:text-primary hover:shadow-[0_0_16px_hsl(var(--primary)/0.2)]"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
