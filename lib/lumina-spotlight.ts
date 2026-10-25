/**
 * Foco de Lumina: lleva la página hasta un elemento, oscurece todo lo demás y
 * le pone encima una nota con el avatar de Lumina. Sigue al elemento mientras
 * dura (scroll, cambios de tamaño) y se quita al tocar cualquier parte, con
 * Escape o solo a los pocos segundos. Sin dependencias de React: así lo puede
 * llamar el chat desde cualquier lado.
 */

const AVATAR = "/img/lumina/Normal.png";
const DURATION_MS = 5200;
const PAD = 10;

let active: (() => void) | null = null;

export function clearSpotlight() {
  active?.();
}

export function spotlight(
  target: HTMLElement,
  note: string | undefined,
  { reducedMotion = false, delay = 0 }: { reducedMotion?: boolean; delay?: number } = {}
) {
  clearSpotlight();

  const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
  const rect = target.getBoundingClientRect();
  const fixed = getComputedStyle(target).position === "fixed" || !!target.closest(".fab-slot, header");
  // Elementos fijos (header, flotantes) ya están a la vista; el resto se
  // centra. Si es más alto que la pantalla, se alinea arriba.
  if (!fixed) {
    target.scrollIntoView({
      behavior,
      block: rect.height > window.innerHeight * 0.7 ? "start" : "center",
    });
  }
  // Los flotantes guardados al bajar vuelven para poder señalarlos.
  document.documentElement.classList.remove("fab-tucked");

  const focus = document.createElement("div");
  focus.className = "lumina-focus";
  focus.setAttribute("aria-hidden", "true");
  focus.style.opacity = "0";

  let bubble: HTMLDivElement | null = null;
  if (note) {
    bubble = document.createElement("div");
    bubble.className = "lumina-focus-note";
    bubble.setAttribute("role", "status");
    const img = document.createElement("img");
    img.src = AVATAR;
    img.alt = "";
    img.width = 32;
    img.height = 32;
    img.style.cssText = "width:2rem;height:2rem;border-radius:999px;background:hsl(var(--ink));box-shadow:0 0 0 2px hsl(var(--lime));flex:none;object-fit:cover";
    const text = document.createElement("span");
    text.textContent = note;
    bubble.append(img, text);
    bubble.style.opacity = "0";
  }

  let frame = 0;
  let shown = false;
  const place = () => {
    frame = requestAnimationFrame(place);
    const r = target.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // El foco no pasa de la pantalla (las secciones muy altas se recortan).
    const top = Math.max(r.top - PAD, 6);
    const left = Math.max(r.left - PAD, 6);
    const right = Math.min(r.right + PAD, vw - 6);
    const bottom = Math.min(r.bottom + PAD, vh - 6);
    focus.style.top = `${top}px`;
    focus.style.left = `${left}px`;
    focus.style.width = `${Math.max(right - left, 24)}px`;
    focus.style.height = `${Math.max(bottom - top, 24)}px`;
    if (bubble) {
      const bw = bubble.offsetWidth;
      const bh = bubble.offsetHeight;
      const below = bottom + 12 + bh < vh - 8;
      const above = top - 12 - bh > 8;
      const y = below ? bottom + 12 : above ? top - 12 - bh : Math.min(top + 12, vh - bh - 8);
      const x = Math.min(Math.max(left + (right - left) / 2 - bw / 2, 12), vw - bw - 12);
      bubble.style.top = `${y}px`;
      bubble.style.left = `${x}px`;
    }
    if (!shown) {
      shown = true;
      focus.style.opacity = "";
      if (bubble) bubble.style.opacity = "";
    }
  };

  const startTimer = window.setTimeout(() => {
    document.body.append(focus);
    if (bubble) document.body.append(bubble);
    place();
  }, delay);

  const end = () => {
    window.clearTimeout(startTimer);
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
    focus.remove();
    bubble?.remove();
    window.removeEventListener("pointerdown", end, true);
    window.removeEventListener("keydown", onKey, true);
    if (active === end) active = null;
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") end();
  };
  const timer = window.setTimeout(end, DURATION_MS + delay);
  // Se agrega en el siguiente tick para que el mismo toque que disparó la
  // acción no lo cierre al instante.
  window.setTimeout(() => {
    window.addEventListener("pointerdown", end, true);
    window.addEventListener("keydown", onKey, true);
  }, 50);

  active = end;
  return end;
}

/** Destello lima sobre un campo que Lumina acaba de llenar. */
export function flashFilled(el: HTMLElement | null) {
  if (!el) return;
  el.classList.remove("lumina-filled");
  void el.offsetWidth;
  el.classList.add("lumina-filled");
  window.setTimeout(() => el.classList.remove("lumina-filled"), 1700);
}
