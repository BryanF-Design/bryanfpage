/**
 * Presets de movimiento del sitio (Motion / framer-motion, ya instalado).
 * Un solo resorte físico para todo lo que se mueve con Motion, para que el
 * movimiento se sienta fluido y consistente: stiffness 200, damping 18, mass 1.
 * Las entradas al hacer scroll van con CSS nativo (animation-timeline: view())
 * en globals.css; Motion solo se usa donde ya estaba (menú, Lumina, 404).
 */
export const SPRING = { type: "spring", stiffness: 200, damping: 18, mass: 1 } as const;
