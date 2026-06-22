/**
 * enhance.js – BryanF Design
 * Animaciones premium con GSAP + ScrollTrigger.
 * Carga con defer DESPUÉS de gsap/ScrollTrigger, así que window.gsap ya existe.
 * Degradación elegante: si GSAP no carga, el failsafe del <head> revela todo.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll(gsap) {
    // Sin animación: deja todo visible en su sitio.
    gsap.set('[data-gsap]', { clearProps: 'transform', opacity: 1 });
  }

  function animate(gsap) {
    var ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    if (reduce) { revealAll(gsap); return; }

    // ── Reveals (carga inmediata para el hero, con scroll para el resto) ──
    gsap.utils.toArray('[data-gsap]').forEach(function (el) {
      var delay = parseFloat(el.getAttribute('data-gsap-delay')) || 0;
      var vars = {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: 0.9, ease: 'power3.out', delay: delay
      };

      if (el.hasAttribute('data-gsap-now')) {
        gsap.to(el, vars);
      } else if (ST) {
        vars.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
        gsap.to(el, vars);
      } else {
        gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      }
    });

    if (!ST) return;

    // ── Parallax decorativo (suave, scrub) ──
    function parallax(target, trigger, amount) {
      var node = document.querySelector(target);
      var trig = document.querySelector(trigger);
      if (!node || !trig) return;
      gsap.to(node, {
        yPercent: amount, ease: 'none',
        scrollTrigger: { trigger: trig, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    }

    parallax('.hero__halo', '.hero', 16);
    parallax('.wc-banner__lottie', '.wc-banner', -14);
    parallax('.cta__glow-pulse', '.cta', 12);

    // Recalcular posiciones cuando todo (fuentes/imágenes) cargó.
    window.addEventListener('load', function () { ST.refresh(); });
  }

  function boot() {
    if (!window.gsap) {
      // GSAP aún no disponible: reintenta brevemente.
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (window.gsap) { clearInterval(iv); window.__gsapInit = true; animate(window.gsap); }
        else if (tries > 25) { clearInterval(iv); /* failsafe del head revela todo */ }
      }, 80);
      return;
    }
    window.__gsapInit = true;
    animate(window.gsap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
