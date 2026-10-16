import type { IconType } from "react-icons";
import {
  SiCss,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiReact,
  SiStripe,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
  SiWordpress,
} from "react-icons/si";

export type StackCategory = "front" | "back" | "tools";

/** Las herramientas del estudio: la sección Stack y la trayectoria de la home leen de aquí. */
export const STACK: { Icon: IconType; label: string; category: StackCategory }[] = [
  { Icon: SiNextdotjs, label: "Next.js", category: "front" },
  { Icon: SiReact, label: "React", category: "front" },
  { Icon: SiTypescript, label: "TypeScript", category: "front" },
  { Icon: SiJavascript, label: "JavaScript", category: "front" },
  { Icon: SiTailwindcss, label: "Tailwind CSS", category: "front" },
  { Icon: SiHtml5, label: "HTML5", category: "front" },
  { Icon: SiCss, label: "CSS3", category: "front" },
  { Icon: SiThreedotjs, label: "Three.js", category: "front" },
  { Icon: SiNodedotjs, label: "Node.js", category: "back" },
  { Icon: SiPhp, label: "PHP", category: "back" },
  { Icon: SiWordpress, label: "WordPress", category: "back" },
  { Icon: SiStripe, label: "Stripe", category: "back" },
  { Icon: SiFigma, label: "Figma", category: "tools" },
  { Icon: SiVercel, label: "Vercel", category: "tools" },
  { Icon: SiGit, label: "Git", category: "tools" },
  { Icon: SiGithub, label: "GitHub", category: "tools" },
];
