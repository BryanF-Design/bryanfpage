import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useReducedMotion } from "https://cdn.jsdelivr.net/npm/motion@12.40.0/react/+esm";

var h = React.createElement;
var WA_URL = "https://wa.me/525663012505?text=" + encodeURIComponent("Hola BryanF, quiero una web con animaciones increibles y performance real.");

var tools = [
  {
    icon: "MR",
    title: "Motion React",
    copy: "Animaciones declarativas para componentes, estados, entradas y microinteracciones.",
    tip: "Lo uso cuando una interfaz necesita responder como producto premium: hover, tap, layout transitions, cambios de estado y scroll reveals."
  },
  {
    icon: "JS",
    title: "Motion JS",
    copy: "Secuencias ligeras para HTML, SVG y detalles sin migrar todo el sitio.",
    tip: "Ideal para sitios estaticos: entra con CDN, anima transform/opacity y mantiene el sitio rapido."
  },
  {
    icon: "CSS",
    title: "CSS animations",
    copy: "Keyframes y transiciones para brillo, ritmo visual y feedback tactil.",
    tip: "Las animaciones simples se quedan en CSS para que el navegador las ejecute de forma fluida y barata."
  },
  {
    icon: "CS",
    title: "CSS Studio",
    copy: "Iteracion visual para ajustar responsive, variables, keyframes y estados.",
    tip: "Sirve como herramienta de diseno en desarrollo: se prueban variantes visuales y luego se aplican al codigo real."
  },
  {
    icon: "CWV",
    title: "Performance",
    copy: "Movimiento con intencion, cuidando Core Web Vitals y accesibilidad.",
    tip: "No todo debe moverse. Priorizo transform, opacity, reduced motion y animaciones que ayuden a entender la accion."
  }
];

var flow = [
  ["01", "Idea", "Definimos que debe sentir el usuario y que accion queremos provocar."],
  ["02", "Diseno", "Se arma una interfaz limpia, escaneable y con jerarquia visual clara."],
  ["03", "Movimiento", "Se agregan transiciones, gestos y reveals que guian sin distraer."],
  ["04", "Publicacion", "Se prueba en movil, se optimiza y queda lista para convertir."]
];

function MotionButton(props) {
  return h(motion.a, {
    className: props.className || "motion-btn",
    href: props.href,
    target: props.target,
    rel: props.rel,
    whileHover: { y: -2, scale: 1.015 },
    whileTap: { scale: .98 }
  }, props.children);
}

function Header() {
  return h("header", { className: "motion-nav" },
    h("a", { className: "motion-nav__logo", href: "/", "aria-label": "BryanF Design - Inicio" },
      h("img", { src: "img/logotipo-blanco-320.png", alt: "BRYANF DESIGN", width: 180, height: 45 })
    ),
    h("nav", { className: "motion-nav__links", "aria-label": "Navegacion Motion" },
      h("a", { className: "motion-link", href: "/" }, "Inicio"),
      h("a", { className: "motion-link", href: "crear-web.html" }, "Crear web"),
      h(MotionButton, { href: WA_URL, target: "_blank", rel: "noopener noreferrer", className: "motion-btn motion-btn--whatsapp" }, "Pedir ayuda")
    )
  );
}

function Hero() {
  var reduced = useReducedMotion();
  var entrance = reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: .65, ease: [.22, 1, .36, 1] }
  };
  var floatTransition = reduced ? {} : { duration: 4.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" };

  return h("section", { className: "motion-hero" },
    h(motion.div, Object.assign({ className: "motion-hero__content" }, entrance),
      h("span", { className: "motion-kicker" }, "Motion stack"),
      h("h1", null,
        "Animaciones que se sienten ",
        h("span", { className: "motion-gradient-text" }, "premium"),
        " sin volver lenta tu web."
      ),
      h("p", { className: "motion-hero__copy" },
        "Una pagina no solo debe verse bonita: debe guiar, responder y vender. Aqui te muestro como uso Motion, React, JS y CSS para crear experiencias fluidas."
      ),
      h("div", { className: "motion-hero__actions" },
        h(MotionButton, { href: "crear-web.html" }, "Crear mi web animada"),
        h(MotionButton, { href: "#herramientas", className: "motion-btn motion-btn--ghost" }, "Ver herramientas")
      ),
      h("div", { className: "motion-metrics", "aria-label": "Beneficios" },
        [["60fps", "Movimiento fluido"], ["React", "Islas interactivas"], ["CWV", "Performance cuidada"]].map(function (item) {
          return h(motion.div, {
            className: "motion-metric",
            key: item[0],
            whileHover: { y: -4 }
          }, h("strong", null, item[0]), h("span", null, item[1]));
        })
      )
    ),
    h("div", { className: "motion-stage", "aria-label": "Preview animado" },
      h("span", { className: "motion-stage__grid", "aria-hidden": "true" }),
      h("span", { className: "motion-orbit", "aria-hidden": "true" }),
      [
        ["Entrada guiada", "Cards, texto y CTAs aparecen con ritmo.", "motion-card-float motion-card-float--one"],
        ["Microinteracciones", "Hover y tap ayudan a confirmar acciones.", "motion-card-float motion-card-float--two"],
        ["Scroll inteligente", "Las secciones cuentan una historia.", "motion-card-float motion-card-float--three"]
      ].map(function (card, index) {
        return h(motion.div, {
          className: card[2],
          key: card[0],
          initial: reduced ? false : { opacity: 0, scale: .92, y: 16 },
          animate: reduced ? {} : { opacity: 1, scale: 1, y: [0, index % 2 ? -12 : 12] },
          transition: reduced ? {} : Object.assign({ delay: .25 + index * .15 }, floatTransition)
        }, h("strong", null, card[0]), h("span", null, card[1]));
      }),
      h("div", { className: "motion-stage__panel" },
        h("div", { className: "motion-stage__bars" },
          [92, 74, 58].map(function (width, index) {
            return h(motion.span, {
              className: "motion-stage__bar",
              key: width,
              initial: reduced ? false : { scaleX: .18 },
              animate: { scaleX: width / 100 },
              transition: { delay: .8 + index * .16, duration: .7, ease: "easeOut" }
            });
          })
        )
      )
    )
  );
}

function ToolCard(props) {
  var [open, setOpen] = useState(false);
  return h(motion.button, {
    className: "motion-tool",
    type: "button",
    onClick: function () { setOpen(!open); },
    onMouseEnter: function () { setOpen(true); },
    onMouseLeave: function () { setOpen(false); },
    whileHover: { y: -6, borderColor: "rgba(180, 227, 50, .48)" },
    whileTap: { scale: .985 },
    "aria-expanded": open ? "true" : "false"
  },
    h("span", { className: "motion-tool__icon" }, props.tool.icon),
    h("h3", null, props.tool.title),
    h("p", null, props.tool.copy),
    h("span", { className: "motion-tool__hint", "aria-hidden": "true" }, "i"),
    h(AnimatePresence, null,
      open && h(motion.span, {
        className: "motion-tooltip",
        initial: { opacity: 0, y: 8, scale: .98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 8, scale: .98 },
        transition: { duration: .18 }
      }, props.tool.tip)
    )
  );
}

function ToolsSection() {
  return h("section", { className: "motion-section", id: "herramientas" },
    h("div", { className: "motion-section__head" },
      h("span", { className: "motion-section__kicker" }, "Herramientas"),
      h("h2", { className: "motion-section__title" }, "Movimiento con estrategia, no decoracion vacia."),
      h("p", { className: "motion-section__copy" }, "Cada herramienta tiene una funcion: hacer que el usuario entienda mas rapido, sienta confianza y avance sin friccion.")
    ),
    h("div", { className: "motion-tools" }, tools.map(function (tool) {
      return h(ToolCard, { tool: tool, key: tool.title });
    }))
  );
}

function FlowSection() {
  return h("section", { className: "motion-section" },
    h("div", { className: "motion-section__head" },
      h("span", { className: "motion-section__kicker" }, "Proceso"),
      h("h2", { className: "motion-section__title" }, "De una idea suelta a una experiencia clara."),
      h("p", { className: "motion-section__copy" }, "La animacion se decide junto con el contenido, la jerarquia y el objetivo comercial.")
    ),
    h("div", { className: "motion-flow" }, flow.map(function (step, index) {
      return h(motion.article, {
        className: "motion-flow__step",
        key: step[1],
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: .35 },
        transition: { delay: index * .08, duration: .45 }
      }, h("span", null, step[0]), h("h3", null, step[1]), h("p", null, step[2]));
    }))
  );
}

function LabSection() {
  var cards = useMemo(function () {
    return [
      ["Spring", "Reacciones naturales, no roboticas."],
      ["Stagger", "Entradas ordenadas para listas y cards."],
      ["Reduced motion", "Accesible para quien prefiere menos movimiento."]
    ];
  }, []);

  return h("section", { className: "motion-section" },
    h("div", { className: "motion-lab" },
      h("div", { className: "motion-lab__copy" },
        h("span", { className: "motion-section__kicker" }, "React island"),
        h("h2", null, "Framer Motion sin migrar toda la web."),
        h("p", null, "Esta pagina vive como una isla React: permite usar Motion en React donde aporta valor, mientras el resto del sitio conserva su estructura estatica y sus pagos intactos."),
        h(MotionButton, { href: "https://motion.dev/docs/quick-start", target: "_blank", rel: "noopener noreferrer", className: "motion-btn motion-btn--ghost" }, "Ver docs de Motion")
      ),
      h("div", { className: "motion-lab__preview", "aria-label": "Laboratorio visual" },
        cards.map(function (card, index) {
          return h(motion.div, {
            className: "motion-preview-card",
            key: card[0],
            animate: { y: [0, index % 2 ? 12 : -12, 0], rotate: [0, index % 2 ? -1 : 1, 0] },
            transition: { duration: 4 + index * .4, repeat: Infinity, ease: "easeInOut" }
          }, h("b", null, card[0]), h("small", null, card[1]));
        })
      )
    )
  );
}

function FinalCta() {
  return h("section", { className: "motion-section" },
    h("div", { className: "motion-final" },
      h("span", { className: "motion-section__kicker" }, "Tu web puede sentirse asi"),
      h("h2", null, "Rapida, guiada, memorable y lista para vender."),
      h("p", null, "Si quieres una experiencia con movimiento cuidado, performance y un flujo claro de compra o contacto, la construimos paso por paso."),
      h("div", { className: "motion-final__actions" },
        h(MotionButton, { href: "crear-web.html" }, "Configurar mi web"),
        h(MotionButton, { href: WA_URL, target: "_blank", rel: "noopener noreferrer", className: "motion-btn motion-btn--whatsapp" }, "Ayuda personalizada")
      )
    )
  );
}

function App() {
  return h("div", { className: "motion-shell" },
    h(Header),
    h("main", null,
      h(Hero),
      h(ToolsSection),
      h(FlowSection),
      h(LabSection),
      h(FinalCta)
    )
  );
}

createRoot(document.getElementById("motion-root")).render(h(App));
