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

export function applyTheme(theme: Theme, save = true) {
  const root = document.documentElement;
  root.classList.add("theme-fade");
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
  window.setTimeout(() => root.classList.remove("theme-fade"), 400);
}
