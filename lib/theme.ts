/**
 * Tema claro / oscuro. La elección se guarda en localStorage (`bfd-theme`:
 * "light" | "dark"); sin elección se sigue al sistema. El script de
 * layout.tsx pone `html.dark` antes del primer cuadro.
 */
export const THEME_KEY = "bfd-theme";
export type Theme = "light" | "dark";

export const THEME_COLORS: Record<Theme, string> = { light: "#eef2e6", dark: "#0a100d" };

export const themeBootstrap = `
  (function () {
    try {
      var saved = localStorage.getItem("${THEME_KEY}");
      var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (dark) document.documentElement.classList.add("dark");
    } catch (_) {}
  })();
`;

export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

function reducedMotion() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("a11y-reduce-motion")
  );
}

/**
 * Cambia el tema. Con `origin` (el botón que se tocó) y un navegador con View
 * Transitions, el tema nuevo se revela en un círculo que nace del botón: el
 * navegador anima dos capturas, no cada elemento, así que no se traba. Sin
 * eso (o con "reducir movimiento"), el cambio es instantáneo y sin saltos.
 */
export function applyTheme(theme: Theme, save = true, origin?: HTMLElement | null) {
  const root = document.documentElement;
  const commit = () => {
    root.classList.toggle("dark", theme === "dark");
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", THEME_COLORS[theme]));
    if (save) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        /* storage bloqueado: el tema dura esta visita */
      }
    }
    window.dispatchEvent(new CustomEvent("bfd:theme", { detail: { theme } }));
  };

  const doc = document as ViewTransitionDoc;
  if (!origin || !doc.startViewTransition || reducedMotion()) {
    // Sin transiciones por un cuadro: nada "persigue" al color nuevo.
    root.classList.add("theme-instant");
    commit();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-instant")));
    return;
  }

  const r = origin.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.classList.add("theme-vt", "theme-instant");
  const transition = doc.startViewTransition(commit);
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    })
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove("theme-vt", "theme-instant"));
}
