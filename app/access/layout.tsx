import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BryanF Access",
  description: "Panel privado de BryanF Design.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
