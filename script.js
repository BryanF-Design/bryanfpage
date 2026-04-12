/**
 * script.js – BryanF Design
 * Vanilla JS – No dependencies required
 * Production-ready for cPanel / static hosting
 */

(function () {
  'use strict';

  /* ============================================================
     1. PRELOADER
     ============================================================ */
  (function initPreloader() {
    const el = document.getElementById('preloader');
    if (!el) return;

    const seen = sessionStorage.getItem('bd-preloader-seen');
    if (seen) {
      // Already seen this session → hide immediately
      el.classList.add('hidden');
      return;
    }

    // Show for 1.4 s then fade out
    setTimeout(function () {
      el.classList.add('hidden');
      sessionStorage.setItem('bd-preloader-seen', '1');
    }, 1400);
  })();

  /* ============================================================
     2. FOOTER YEAR
     ============================================================ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     3. NAVBAR – HEADROOM (hide on scroll-down, show on scroll-up)
     ============================================================ */
  (function initHeadroom() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      if (y > lastY && y > 140) {
        navbar.classList.add('headroom-hidden');
      } else {
        navbar.classList.remove('headroom-hidden');
      }
      if (y > 8) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ============================================================
     4. BURGER MENU
     ============================================================ */
  (function initBurger() {
    var burgerBtn  = document.getElementById('burgerBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');
    if (!burgerBtn || !mobileMenu) return;

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      mobileMenu.removeAttribute('hidden');
      burgerBtn.classList.add('open');
      burgerBtn.setAttribute('aria-expanded', 'true');
      burgerBtn.setAttribute('aria-label', 'Cerrar menú');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      isOpen = false;
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('menu-open');

      // Wait for CSS transition then set hidden
      setTimeout(function () {
        if (!isOpen) mobileMenu.setAttribute('hidden', '');
      }, 320);
    }

    burgerBtn.addEventListener('click', function () {
      if (isOpen) closeMenu(); else openMenu();
    });

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);

    // Close when clicking outside the panel
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    // Close on menu link click (data-close attribute)
    mobileMenu.querySelectorAll('[data-close]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  })();

  /* ============================================================
     5. SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('a.smooth-scroll, a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto')) return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navH = (document.getElementById('navbar') || {}).offsetHeight || 70;
        var top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     6. MOUSE-FOLLOWING GLOW
     ============================================================ */
  (function initGlow() {
    var glow = document.getElementById('glow');
    if (!glow) return;

    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var tx = cx, ty = cy;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    });

    function loop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(loop);
    }

    loop();
  })();

  /* ============================================================
     7. CUSTOM CURSOR (desktop only)
     ============================================================ */
  (function initCursor() {
    if (window.innerWidth < 769 || window.matchMedia('(hover: none)').matches) return;

    var dot  = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    var dx = 0, dy = 0;
    var rx = 0, ry = 0;
    var mx = 0, my = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function loop() {
      dx = mx; dy = my;
      rx += (dx - rx) * 0.12;
      ry += (dy - ry) * 0.12;

      dot.style.left  = dx + 'px';
      dot.style.top   = dy + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';

      requestAnimationFrame(loop);
    }

    loop();

    // Scale on hoverable elements
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button')) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button')) {
        document.body.classList.remove('cursor-hover');
      }
    });
  })();

  /* ============================================================
     8. INTERSECTION OBSERVER – Reveal animations
     ============================================================ */
  (function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(function (el) { observer.observe(el); });
  })();

  /* ============================================================
     9. TOOLS RAIL MARQUEE
     ============================================================ */
  (function initToolsRail() {
    var wrap  = document.getElementById('toolsWrap');
    var track = document.getElementById('toolsTrack');
    var base  = document.getElementById('toolsBase');
    if (!wrap || !track || !base) return;

    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.transform = 'translate3d(0,0,0)';
      return;
    }

    var SPEED_NORMAL = 120; // px/s
    var SPEED_SLOW   = 35;

    var speed   = SPEED_NORMAL;
    var target  = SPEED_NORMAL;
    var pos     = 0;
    var lastTs  = null;
    var baseW   = 0;

    function measure() {
      baseW = base.getBoundingClientRect().width || 1;
    }

    measure();

    var ro = new ResizeObserver(measure);
    ro.observe(base);
    window.addEventListener('resize', measure, { passive: true });

    // Hover / touch slow-down
    wrap.addEventListener('mouseenter',  function () { target = SPEED_SLOW;   });
    wrap.addEventListener('mouseleave',  function () { target = SPEED_NORMAL; });
    wrap.addEventListener('touchstart',  function () { target = SPEED_SLOW;   }, { passive: true });
    wrap.addEventListener('touchend',    function () { target = SPEED_NORMAL; }, { passive: true });

    // Check reduced motion preference
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function tick(ts) {
      if (lastTs === null) lastTs = ts;
      var dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (prefersReduced) return;

      // Ease toward target speed
      speed += (target - speed) * 0.1;

      var w = baseW || 1;
      pos = (pos + speed * dt) % w;
      if (pos < 0) pos += w;

      var snapped = Math.round(-pos * (window.devicePixelRatio || 1)) / (window.devicePixelRatio || 1);
      track.style.transform = 'translate3d(' + snapped + 'px, 0, 0)';

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  })();

  /* ============================================================
     10. CTA PARTICLE CANVAS
     ============================================================ */
  (function initCtaParticles() {
    var canvas = document.getElementById('ctaCanvas');
    if (!canvas) return;
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h;
    var mouse = { x: 0, y: 0, active: false };
    var parts  = [];
    var raf;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(a, b) { return a + Math.random() * (b - a); }

    function init() {
      resize();
      var count = w < 480 ? 35 : w < 768 ? 55 : 90;
      parts = [];
      for (var i = 0; i < count; i++) {
        parts.push({
          x:  Math.random() * w,
          y:  Math.random() * h,
          vx: rand(-0.25, 0.25),
          vy: rand(-0.25, 0.25),
          o:  rand(0.2, 0.5)
        });
      }
    }

    canvas.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    });
    canvas.addEventListener('mouseleave', function () { mouse.active = false; });
    window.addEventListener('resize', function () { init(); }, { passive: true });

    function step() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle  = 'rgba(180,227,50,0.35)';
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(180,227,50,0.35)';

      parts.forEach(function (p) {
        // Mouse repulsion
        if (mouse.active) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var d  = Math.hypot(dx, dy);
          if (d < 120) {
            var f = (1 - d / 120) * 0.08;
            p.vx += (dx / (d || 1)) * f;
            p.vy += (dy / (d || 1)) * f;
          }
        }

        p.x  += p.vx;
        p.y  += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Wrap
        if (p.x < -10)  p.x = w + 10;
        if (p.x > w+10) p.x = -10;
        if (p.y < -10)  p.y = h + 10;
        if (p.y > h+10) p.y = -10;

        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(step);
    }

    init();
    step();
  })();

  /* ============================================================
     11. ABOUT MODAL
     ============================================================ */
  (function initModal() {
    var overlay    = document.getElementById('aboutOverlay');
    var aboutBtn   = document.getElementById('aboutBtn');
    var closeBtn   = document.getElementById('modalClose');
    if (!overlay || !aboutBtn) return;

    function openModal() {
      overlay.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      document.body.style.overflow = '';
      setTimeout(function () {
        if (!overlay.classList.contains('open')) {
          overlay.setAttribute('hidden', '');
        }
      }, 300);
      overlay.setAttribute('hidden', '');
    }

    aboutBtn.addEventListener('click', openModal);

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Click backdrop to close
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Escape key to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
    });
  })();

  /* ============================================================
     12. CANVAS TRAIL (cursor sparkle – desktop)
     ============================================================ */
  (function initTrail() {
    if (window.innerWidth < 769 || window.matchMedia('(hover: none)').matches) return;

    var canvas = document.getElementById('trail');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    var points = [];
    var mx = -200, my = -200;

    window.addEventListener('resize', function () {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      points.push({ x: mx, y: my, life: 1 });
    });

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points = points.filter(function (p) { return p.life > 0; });

      points.forEach(function (p) {
        p.life -= 0.04;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180,227,50,' + (p.life * 0.35) + ')';
        ctx.fill();
      });

      requestAnimationFrame(loop);
    }

    loop();
  })();

})();

/* ============================================================
   COTIZAR MODAL – i18n + Form Logic
   ============================================================ */
(function () {
  'use strict';

  window.LANG = {
    es: {

      // Navbar & Hero
      nav_home: 'Inicio', nav_projects: 'Proyectos', nav_talk: "Let's talk", nav_fasttrack: 'Inicia tu Web Rápido',
      ft_chip: 'Pago rápido + Configurador',
      ft_title: 'Configura tu Proyecto Web',
      ft_subtitle: 'Selecciona tu base, activa módulos, genera cotización automática y continúa directo al onboarding.',
      ft_step1_title: '1) Paquete base',
      ft_step1_sub: 'Precios sincronizados con la cotización actual del sitio.',
      ft_plan_badge: 'Base',
      ft_plan_name: 'Desarrollo Base Optimizado',
      ft_plan_includes: 'Incluye dominio y host gratis por 1 año, correos ilimitados de 1 GB, diseño personalizado, satisfacción garantizada, 3 secciones a elegir (ej. Inicio, Servicios, Contacto) y páginas legales (Privacidad/Términos) incluidas en caso de requerirlas.',
      ft_plan_badge_update: 'Actualización',
      ft_plan_update_name: 'No necesito web completa',
      ft_plan_update_includes: 'Ajustes de diseño, secciones existentes, contenido y mejoras puntuales sin rehacer todo el sitio.',
      ft_plan_badge_maintenance: 'Mantenimiento',
      ft_plan_maintenance_name: 'Quiero mantenimiento de mi sitio',
      ft_plan_maintenance_includes: 'Correcciones, respaldos, monitoreo técnico y soporte para mantener tu sitio estable y actualizado.',
      ft_step2_title: '2) Módulos extra',
      ft_step2_sub: 'Selecciona los complementos que necesita tu proyecto.',
      ft_mod_ecommerce: 'Integración de E-commerce',
      ft_mod_payments: 'Pasarelas de Pago Directo',
      ft_mod_sections: 'Secciones Adicionales',
      ft_mod_maintenance: 'Mantenimiento Especializado',
      ft_sections_count_label: 'Cantidad de secciones extra',
      ft_lumina_title: 'Lumina IA',
      ft_lumina_msg_default: 'Cuéntame qué necesitas y adapto la configuración ideal para tu proyecto.',
      ft_lumina_prompt_label: 'Mensaje para Lumina',
      ft_lumina_prompt_ph: 'Describe tu proyecto o dicta tu idea aquí...',
      ft_lumina_dictate: 'Dictar',
      ft_lumina_analyze: 'Analizar con IA',
      ft_quote_title: 'Cotización automática',
      ft_pay_full: 'Pagar servicio completo',
      ft_pay_half: 'Pagar 50%',
      ft_coupon_ph: 'Cupón (ej. BRYANF10)',
      ft_coupon_apply: 'Aplicar',
      ft_total_now: 'Total a pagar ahora',
      ft_pay_stripe: 'Pagar con Stripe',
      ft_pay_mp: 'Pagar con Mercado Pago',
      ft_pay_status_idle: 'Selecciona método de pago para generar payload y sesión.',
      ft_simulate_success: 'Simular callback de éxito',
      ft_onboard_title: 'Onboarding del proyecto',
      ft_onboard_sub: 'Pago confirmado. Completa estos datos para iniciar producción.',
      ft_field_business: 'Nombre del negocio',
      ft_field_contact: 'Nombre de contacto',
      ft_field_email: 'Correo',
      ft_field_whatsapp: 'WhatsApp',
      ft_field_goal: 'Objetivo principal',
      ft_field_services: 'Productos o servicios principales',
      ft_field_notes: 'Referencias o notas',
      ft_action_start: 'Enviar información y comenzar',
      ft_action_later: 'La envío después',
      ft_action_help: 'No tengo esta información, por favor ayúdame',
      cq_extra_sections_label: 'Secciones adicionales ($350 c/u)',
      cq_pay_full: 'Pagar servicio completo',
      cq_pay_half: 'Pagar 50% de anticipo',
      cq_plan_includes: 'Incluye dominio y host gratuito por un año, correos ilimitados (1 GB cada uno), diseño personalizado, satisfacción garantizada, 3 secciones libres (ej. Inicio, Servicios, Contacto) y páginas legales (Privacidad/Términos) incluidas en caso de requerirlas.',
      cq_total_now: 'Monto a pagar ahora:',
      cq_coupon_ph: 'Cupón (ej. BRYANF10)',
      cq_pack_full: 'Web completa (nuevo proyecto)',
      cq_pack_update: 'No necesito web completa, quiero actualización de página web',
      cq_pack_maintenance: 'Quiero mantenimiento de mi sitio',
      hero_badge: '¡BIENVENIDOS!', hero_title: '<span class="hero__title-accent">Web que vende</span>,<br />rendimiento real.',
      hero_sub: 'Estrategia, performance y SEO real para que tu sitio se vea increíble <em>y</em> convierta.',
      hero_about: 'Acerca de BryanF', hero_projects: 'Ver proyectos', hero_talk: "Let's talk",
      stack_title: 'Stack & herramientas',
      exp_title: 'Más de 5 años de experiencia', exp_sub: 'Hemos trabajado e impulsado más de 100 proyectos digitales con éxito.', exp_badge: 'Proyectos',
      projects_title: 'Trabajos destacados', project_visit: 'Visitar sitio', project_view: 'Ver proyecto',
      clients_title: 'Marcas que han confiado',
      
      // FAQ
      faq_title: 'Preguntas Frecuentes', faq_search_ph: 'Buscar pregunta...',
      faq_q1: '¿Cuáles son los tiempos de entrega?', faq_a1: 'Los tiempos de entrega empiezan desde <strong>3 días</strong> una vez que nos hayas proporcionado la información completa de tu empresa.',
      faq_q2: '¿Cuántos cambios puedo pedir en el diseño?', faq_a2: 'En BryanF Design <strong>no manejamos un límite de cambios</strong>. Creemos que la satisfacción total del cliente es lo más importante para entregar un producto de calidad.',
      faq_q3: '¿Cuáles son sus horarios de atención?', faq_a3: 'Nuestro horario es de Lunes a Viernes de <strong>9:00 AM a 7:00 PM</strong> hora de Ciudad de México (CDMX).',
      faq_tz_btn: 'Convertir a mi hora local',
      faq_q4: '¿Cuáles son los costos aproximados?', faq_a4: 'Los costos empiezan a partir de los <strong>$3500 MXN</strong>, y pueden variar dependiendo de las necesidades específicas de tu proyecto.',
      faq_currency_btn: 'Ver costo equivalente en mi moneda',
      faq_q5: '¿Qué se necesita para empezar?', faq_a5: 'Necesitamos la información general de tu empresa, tener una breve llamada o reunión para recopilar requerimientos clave y un <strong>50% de anticipo</strong>. El otro 50% se liquidará una vez entregado y aprobado el proyecto.',
      faq_q6: '¿Qué se me entrega al final?', faq_a6: 'Se entregarán los <strong>accesos totales</strong> a la página web y a los correos (en caso de haberse creado), además de una <strong>pequeña capacitación de no más de 30 minutos</strong> para el manejo básico de tu sitio.',
      faq_q7: '¿Qué incluye el plan de trabajar juntos?', faq_a7: 'Incluye <strong>dominio y host gratuito por un año</strong>, correos ilimitados (de 1 GB de espacio cada uno), un <strong>diseño completamente personalizado</strong> y la satisfacción de un producto final garantizado.',
      faq_empty: '¿No encontraste tu respuesta? Mándanos un mensaje y te atenderemos con gusto.', faq_whatsapp_btn: 'Mandar WhatsApp',
      
      // CTA & Footer
      cta_title: 'Impulsa tu proyecto con diseño y performance reales', cta_sub: 'Webs veloces, animadas y con SEO que convierte. Hablemos de objetivos y lo construimos.',
      footer_tagline: 'Animación, performance y SEO real.<br /><strong class="footer__tagline-highlight">Diseño que vende</strong>, no sólo que luce.',
      footer_nav: 'Navegación', footer_contact: 'Contacto', footer_whatsapp: 'WhatsApp disponible', footer_cta: '¿Proyecto en mente? <strong>Cotiza</strong> sin compromiso.',
      
      // About
      about_title: 'Sobre mí', about_close: 'Cerrar',
      about_text1: 'Soy <strong>BryanF</strong>, desarrollador y diseñador front-end. Me especializo en crear sitios <strong>rápidos, animados y medibles</strong> con Core Web Vitals en verde, SEO técnico y una fuerte orientación a diseño UX/UI.',
      about_text2: 'Mi enfoque es claro: webs que no solo se vean bien, sino que <strong>generen resultados reales</strong>.',
      
      // A11y
      a11y_title: 'Accesibilidad', a11y_text: 'Texto grande', a11y_contrast: 'Alto contraste', a11y_motion: 'Reducir animación',
      
      // Existing Modals

      cq_badge:'Proyecto nuevo', cq_title:'Cuéntame tu idea',
      cq_sub:'Rellena el formulario y te contactaré en menos de 24 h.',
      cq_name_label:'Nombre completo *', cq_name_ph:'Bryan Flores',
      cq_email_label:'Correo electrónico *', cq_email_ph:'hola@empresa.com',
      cq_phone_label:'Teléfono / WhatsApp', cq_phone_ph:'+52 56 1234 5678',
      cq_company_label:'Empresa / Marca', cq_company_ph:'Mi empresa S.A.',
      cq_type_label:'Tipo de proyecto *',
      cq_type_web:'Sitio web', cq_type_ecomm:'E-commerce',
      cq_type_landing:'Landing page', cq_type_seo:'SEO / Performance',
      cq_type_branding:'Actualización web', cq_type_other:'Otro',
      cq_budget_label:'Presupuesto aproximado',
      cq_budget_ph:'— Selecciona un rango —',
      cq_budget_lt5:'Menos de $5,000 MXN', cq_budget_5_15:'$5,000 – $15,000 MXN',
      cq_budget_15_40:'$15,000 – $40,000 MXN', cq_budget_40_80:'$40,000 – $80,000 MXN',
      cq_budget_gt80:'Más de $80,000 MXN',
      cq_msg_label:'Cuéntame tu proyecto *',
      cq_msg_ph:'Necesito un sitio web para mi restaurante con menú online…',
      cq_file_label:'Adjuntar archivos',
      cq_file_hint:'(briefs y referencias — máx. 5 archivos, 10 MB c/u)',
      cq_drop_text:'Arrastra tus archivos aquí o <strong>haz clic para explorar</strong>',
      cq_drop_hint:'JPG, PNG, PDF, AI, PSD, DOCX, ZIP — hasta 10 MB por archivo',
      cq_source_label:'¿Cómo me encontraste?', cq_source_ph:'— Cuéntame —',
      cq_source_ig:'Instagram', cq_source_fb:'Facebook',
      cq_source_google:'Google', cq_source_ref:'Referido / Recomendación',
      cq_source_linkedin:'LinkedIn', cq_source_other:'Otro',
      cq_privacy:'Tu información es confidencial y nunca se comparte con terceros.',
      cq_send_wa:'Enviar Formulario a WhatsApp',
      cq_success:'¡Listo! Te contactaré pronto.',
      cq_err_name:'Por favor escribe tu nombre.',
      cq_err_email:'Ingresa un correo electrónico válido.',
      cq_err_type:'Selecciona el tipo de proyecto.',
      cq_err_msg:'Cuéntame un poco más (mínimo 20 caracteres).',
      cq_err_file:'Máximo 5 archivos de hasta 10 MB cada uno.',
      cta_btn_primary:'Iniciar proyecto', cta_btn_secondary:'Ver proyectos',
      footer_start_btn:'Iniciar proyecto'
    },
    en: {

      // Navbar & Hero
      nav_home: 'Home', nav_projects: 'Projects', nav_talk: "Let's talk", nav_fasttrack: 'Start Your Web Fast',
      ft_chip: 'Fast payment + Configurator',
      ft_title: 'Configure Your Web Project',
      ft_subtitle: 'Pick your base, add modules, generate an automatic quote, and continue directly to onboarding.',
      ft_step1_title: '1) Base package',
      ft_step1_sub: 'Prices synchronized with the current website quote.',
      ft_plan_badge: 'Base',
      ft_plan_name: 'Optimized Base Development',
      ft_plan_includes: 'Includes free domain and hosting for 1 year, unlimited email accounts (1 GB each), fully custom design, guaranteed satisfaction, 3 free-choice sections (e.g. Home, Services, Contact), and legal pages (Privacy/Terms) included when needed.',
      ft_plan_badge_update: 'Update',
      ft_plan_update_name: 'I do not need a full website',
      ft_plan_update_includes: 'Design tweaks, existing section updates, content edits, and focused improvements without rebuilding the whole site.',
      ft_plan_badge_maintenance: 'Maintenance',
      ft_plan_maintenance_name: 'I need website maintenance',
      ft_plan_maintenance_includes: 'Fixes, backups, technical monitoring, and support to keep your website stable and up to date.',
      ft_step2_title: '2) Extra modules',
      ft_step2_sub: 'Select the add-ons your project needs.',
      ft_mod_ecommerce: 'E-commerce Integration',
      ft_mod_payments: 'Direct Payment Gateways',
      ft_mod_sections: 'Additional Sections',
      ft_mod_maintenance: 'Specialized Maintenance',
      ft_sections_count_label: 'Extra sections quantity',
      ft_lumina_title: 'Lumina AI',
      ft_lumina_msg_default: 'Tell me what you need and I will adapt the ideal setup for your project.',
      ft_lumina_prompt_label: 'Message for Lumina',
      ft_lumina_prompt_ph: 'Describe your project or dictate your idea here...',
      ft_lumina_dictate: 'Dictate',
      ft_lumina_analyze: 'Analyze with AI',
      ft_quote_title: 'Automatic quote',
      ft_pay_full: 'Pay full service',
      ft_pay_half: 'Pay 50%',
      ft_coupon_ph: 'Coupon (e.g. BRYANF10)',
      ft_coupon_apply: 'Apply',
      ft_total_now: 'Amount to pay now',
      ft_pay_stripe: 'Pay with Stripe',
      ft_pay_mp: 'Pay with Mercado Pago',
      ft_pay_status_idle: 'Choose a payment method to generate payload and session.',
      ft_simulate_success: 'Simulate successful callback',
      ft_onboard_title: 'Project onboarding',
      ft_onboard_sub: 'Payment confirmed. Complete this information to start production.',
      ft_field_business: 'Business name',
      ft_field_contact: 'Contact name',
      ft_field_email: 'Email',
      ft_field_whatsapp: 'WhatsApp',
      ft_field_goal: 'Main goal',
      ft_field_services: 'Main products or services',
      ft_field_notes: 'References or notes',
      ft_action_start: 'Send info and start',
      ft_action_later: 'I will send it later',
      ft_action_help: 'I do not have this info, please help me',
      cq_extra_sections_label: 'Additional sections ($350 each)',
      cq_pay_full: 'Pay full service',
      cq_pay_half: 'Pay 50% deposit',
      cq_plan_includes: 'Includes free domain and hosting for one year, unlimited email accounts (1 GB each), custom design, guaranteed satisfaction, 3 free-choice sections (e.g. Home, Services, Contact), and legal pages (Privacy/Terms) included if required.',
      cq_total_now: 'Amount to pay now:',
      cq_coupon_ph: 'Coupon (e.g. BRYANF10)',
      cq_pack_full: 'Full website (new project)',
      cq_pack_update: 'I do not need a full website, I need a website update',
      cq_pack_maintenance: 'I need website maintenance',
      hero_badge: 'WELCOME!', hero_title: '<span class="hero__title-accent">Web that sells</span>,<br />real performance.',
      hero_sub: 'Strategy, performance, and real SEO so your site looks amazing <em>and</em> converts.',
      hero_about: 'About BryanF', hero_projects: 'View projects', hero_talk: "Let's talk",
      stack_title: 'Stack & tools',
      exp_title: 'Over 5 years of experience', exp_sub: 'We have successfully driven and worked on more than 100 digital projects.', exp_badge: 'Projects',
      projects_title: 'Featured works', project_visit: 'Visit site', project_view: 'View project',
      clients_title: 'Brands that trust us',
      
      // FAQ
      faq_title: 'Frequently Asked Questions', faq_search_ph: 'Search questions...',
      faq_q1: 'What are the delivery times?', faq_a1: 'Delivery times start from <strong>3 days</strong> once we have complete information about your company.',
      faq_q2: 'How many design revisions can I request?', faq_a2: 'At BryanF Design <strong>we do not have a limit on revisions</strong>. We believe total customer satisfaction is the most important thing to deliver a quality product.',
      faq_q3: 'What are your working hours?', faq_a3: 'Our hours are Monday to Friday, <strong>9:00 AM to 7:00 PM</strong> Mexico City (CDMX) time.',
      faq_tz_btn: 'Convert to my local time',
      faq_q4: 'What are the approximate costs?', faq_a4: 'Costs start at <strong>$3500 MXN</strong>, and can vary depending on the specific needs of your project.',
      faq_currency_btn: 'View equivalent cost in my currency',
      faq_q5: 'What is needed to start?', faq_a5: 'We need general information about your business, a brief call or meeting to gather key requirements, and a <strong>50% deposit</strong>. The remaining 50% will be paid once the project is delivered and approved.',
      faq_q6: 'What is delivered at the end?', faq_a6: 'You will be given <strong>full access</strong> to the website and emails (if created), plus a <strong>short training of no more than 30 minutes</strong> for the basic management of your site.',
      faq_q7: 'What does the plan include?', faq_a7: 'It includes <strong>free domain and hosting for one year</strong>, unlimited emails (1 GB of space each), a <strong>completely customized design</strong>, and a guaranteed final product satisfaction.',
      faq_empty: 'Did not find your answer? Send us a message and we will be happy to assist you.', faq_whatsapp_btn: 'Send WhatsApp',

      // CTA & Footer
      cta_title: 'Boost your project with real design and performance', cta_sub: 'Fast, animated websites with SEO that converts. Let us talk about goals and build it.',
      footer_tagline: 'Animation, performance, and real SEO.<br /><strong class="footer__tagline-highlight">Design that sells</strong>, not just looks good.',
      footer_nav: 'Navigation', footer_contact: 'Contact', footer_whatsapp: 'WhatsApp available', footer_cta: 'Project in mind? <strong>Get a quote</strong> without commitment.',

      // About
      about_title: 'About me', about_close: 'Close',
      about_text1: 'I am <strong>BryanF</strong>, a front-end developer and designer. I specialize in creating <strong>fast, animated, and measurable</strong> sites with green Core Web Vitals, technical SEO, and a strong UX/UI orientation.',
      about_text2: 'My focus is clear: websites that not only look good but <strong>generate real results</strong>.',
      
      // A11y
      a11y_title: 'Accessibility', a11y_text: 'Large text', a11y_contrast: 'High contrast', a11y_motion: 'Reduce motion',

      // Existing Modals

      cq_badge:'New project', cq_title:'Tell me your idea',
      cq_sub:"Fill out the form and I'll get back to you within 24 h.",
      cq_name_label:'Full name *', cq_name_ph:'Bryan Flores',
      cq_email_label:'Email address *', cq_email_ph:'hello@company.com',
      cq_phone_label:'Phone / WhatsApp', cq_phone_ph:'+1 234 567 8900',
      cq_company_label:'Company / Brand', cq_company_ph:'My company Inc.',
      cq_type_label:'Project type *',
      cq_type_web:'Website', cq_type_ecomm:'E-commerce',
      cq_type_landing:'Landing page', cq_type_seo:'SEO / Performance',
      cq_type_branding:'Website update', cq_type_other:'Other',
      cq_budget_label:'Approximate budget',
      cq_budget_ph:'— Select a range —',
      cq_budget_lt5:'Under $300 USD', cq_budget_5_15:'$300 – $900 USD',
      cq_budget_15_40:'$900 – $2,500 USD', cq_budget_40_80:'$2,500 – $5,000 USD',
      cq_budget_gt80:'Over $5,000 USD',
      cq_msg_label:'Tell me about your project *',
      cq_msg_ph:'I need a website for my restaurant with an online menu…',
      cq_file_label:'Attach files',
      cq_file_hint:'(briefs and references — max 5 files, 10 MB each)',
      cq_drop_text:'Drag your files here or <strong>click to browse</strong>',
      cq_drop_hint:'JPG, PNG, PDF, AI, PSD, DOCX, ZIP — up to 10 MB per file',
      cq_source_label:'How did you find me?', cq_source_ph:'— Let me know —',
      cq_source_ig:'Instagram', cq_source_fb:'Facebook',
      cq_source_google:'Google', cq_source_ref:'Referral / Recommendation',
      cq_source_linkedin:'LinkedIn', cq_source_other:'Other',
      cq_privacy:'Your information is confidential and never shared with third parties.',
      cq_send_wa:'Send Form to WhatsApp',
      cq_success:"Done! I'll contact you soon.",
      cq_err_name:'Please enter your name.',
      cq_err_email:'Enter a valid email address.',
      cq_err_type:'Please select a project type.',
      cq_err_msg:'Tell me a bit more (at least 20 characters).',
      cq_err_file:'Max 5 files, up to 10 MB each.',
      cta_btn_primary:'Start a project', cta_btn_secondary:'View projects',
      footer_start_btn:'Start a project'
    }
  };

  window.currentLang = 'es';
  var selectedFiles = [];
  var API_BASE = String(window.PAYMENTS_API_BASE || '').replace(/\/$/, '');

  function apiUrl(path) {
    return API_BASE ? (API_BASE + path) : path;
  }

  /* ── Apply translations ── */
  window.applyLang = function(lang) {
    window.currentLang = lang;
    var t = window.LANG[lang];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] === undefined) return;
      el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] === undefined) return;
      el.innerHTML = t[key];
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
    });

    var dropText = document.getElementById('cqDropText');
    if (dropText) dropText.innerHTML = t.cq_drop_text;

    var badge = document.getElementById('cqBadgeText');
    if (badge) badge.textContent = t.cq_badge;
    var titleEl = document.getElementById('cqTitle');
    if (titleEl) titleEl.textContent = t.cq_title;
    var subEl = document.getElementById('cqSub');
    if (subEl) subEl.textContent = t.cq_sub;

    document.querySelectorAll('.cq-lang__btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('cq-lang__btn--active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  /* ── Open / Close ── */
  var overlay = document.getElementById('cotizarOverlay');
  var form    = document.getElementById('cotizarForm');
  var success = document.getElementById('cqSuccess');

  function openCotizar() {
    if (!overlay) return;
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var first = overlay.querySelector('.cq-input');
      if (first) first.focus();
    }, 380);
  }

  function closeCotizar() {
    if (!overlay) return;
    document.body.style.overflow = '';
    setTimeout(function () { overlay.setAttribute('hidden', ''); }, 360);
    overlay.setAttribute('hidden', '');
  }

  ['ctaCotizarBtn','navTalkBtn','footerTalkBtn','footerStartBtn','mobileCotizarBtn'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', openCotizar);
  });

  var cqClose = document.getElementById('cqClose');
  if (cqClose) cqClose.addEventListener('click', closeCotizar);
  if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCotizar(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && !overlay.hasAttribute('hidden')) closeCotizar();
  });

  /* ── Language ── */
  document.querySelectorAll('.cq-lang__btn').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-lang')); });
  });

  /* ── Type chips ── */
  var typeInput = document.getElementById('cqType');
  document.querySelectorAll('.cq-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.cq-chip').forEach(function (c) { c.classList.remove('cq-chip--active'); });
      chip.classList.add('cq-chip--active');
      if (typeInput) typeInput.value = chip.getAttribute('data-value');
      var err = document.getElementById('cqTypeErr');
      if (err) err.textContent = '';
    });
  });

  /* ── Char counter ── */
  var textarea = document.getElementById('cqMessage');
  var charEl   = document.getElementById('cqCharCount');
  var MAX_CHARS = 600;
  if (textarea && charEl) {
    textarea.addEventListener('input', function () {
      var len = Math.min(textarea.value.length, MAX_CHARS);
      if (textarea.value.length > MAX_CHARS) textarea.value = textarea.value.slice(0, MAX_CHARS);
      charEl.textContent = len + ' / ' + MAX_CHARS;
    });
  }

  /* ── File upload ── */
  var dropZone  = document.getElementById('cqDrop');
  var fileInput = document.getElementById('cqFileInput');
  var fileList  = document.getElementById('cqFileList');
  var fileErrEl = document.getElementById('cqFileErr');
  var MAX_FILES = 5;
  var MAX_BYTES = 10 * 1024 * 1024;

  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
    return (b/1048576).toFixed(1) + ' MB';
  }

  function renderFiles() {
    if (!fileList) return;
    fileList.innerHTML = '';
    selectedFiles.forEach(function (f, i) {
      var li = document.createElement('li');
      li.className = 'cq-file-item';
      li.innerHTML = '<span class="cq-file-item__name" title="' + f.name + '">' + f.name + '</span>' +
        '<span class="cq-file-item__size">' + fmtBytes(f.size) + '</span>' +
        '<button type="button" class="cq-file-item__remove" data-idx="' + i + '" aria-label="Quitar">✕</button>';
      fileList.appendChild(li);
    });
    fileList.querySelectorAll('.cq-file-item__remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedFiles.splice(parseInt(btn.getAttribute('data-idx')), 1);
        renderFiles();
      });
    });
  }

  function addFiles(newFiles) {
    var combined = selectedFiles.concat(Array.from(newFiles));
    var valid    = combined.filter(function (f) { return f.size <= MAX_BYTES; }).slice(0, MAX_FILES);
    if (combined.length > MAX_FILES || valid.length < combined.length) {
      if (fileErrEl) fileErrEl.textContent = LANG[currentLang].cq_err_file;
    } else {
      if (fileErrEl) fileErrEl.textContent = '';
    }
    selectedFiles = valid;
    renderFiles();
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', function () { fileInput.click(); });
    dropZone.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files.length) addFiles(fileInput.files);
      fileInput.value = '';
    });
    dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', function (e) {
      if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', function (e) {
      e.preventDefault(); dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    });
  }

  /* ── Validation ── */
  function setErr(id, msg) { var el = document.getElementById(id); if (el) el.textContent = msg; }
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function validate() {
    var t = window.LANG[window.currentLang] || window.LANG.es; var ok = true;
    var name = document.getElementById('cqName');
    if (!name || name.value.trim().length < 2) { if(name)name.style.borderColor='#ff4d4d'; ok=false; }
    else { name.style.borderColor=''; }

    var msg = document.getElementById('cqMessage');
    if (!msg || msg.value.trim().length < 10) { setErr('cqMsgErr','Por favor describe más tu proyecto.'); if(msg)msg.style.borderColor='#ff4d4d'; ok=false; }
    else { setErr('cqMsgErr',''); msg.style.borderColor=''; }

    return ok;
  }

  /* ── Estimator State, Voice & Logic ── */
  var cqBase = 3500;
  var cqServiceLabel = 'Desarrollo Base Optimizado';
  var cqExtraSections = 0;
  var CQ_EXTRA_SECTION_PRICE = 350;
  var cqPaymentMode = 'liquidacion';
  var cqDiscount = 0;
  var cqCoupon = '';
  var exchangeRate = 1;
  var currentCurrency = 'MXN';

  function syncCqServicePack() {
    var selected = document.querySelector('input[name="cqServicePack"]:checked');
    cqBase = selected ? Math.max(0, parseInt(selected.value || '3500', 10)) : 3500;
    var labelNode = selected && selected.parentElement ? selected.parentElement.querySelector('span') : null;
    cqServiceLabel = selected ? ((labelNode && labelNode.textContent) || selected.getAttribute('data-label') || 'Servicio web') : 'Servicio web';

    var baseLabelEl = document.getElementById('cqBasePlanLabel');
    var basePriceEl = document.getElementById('cqBasePlanPrice');
    if (baseLabelEl) baseLabelEl.textContent = cqServiceLabel;
    if (basePriceEl) basePriceEl.textContent = '$' + new Intl.NumberFormat('es-MX').format(cqBase);
  }

  function updateEstimator() {
    syncCqServicePack();
    var total = cqBase;
    var checkboxes = document.querySelectorAll('.cq-mod-cb');
    var activeMods = [];
    checkboxes.forEach(function(cb) {
      if(cb.checked) {
        total += parseInt(cb.value || '0', 10);
        activeMods.push(cb.getAttribute('data-name'));
      }
    });

    if (cqExtraSections > 0) {
      total += cqExtraSections * CQ_EXTRA_SECTION_PRICE;
      activeMods.push('Secciones adicionales x' + cqExtraSections);
    }

    var mxnTotalProyecto = total;
    if (cqDiscount > 0) {
      if (cqDiscount <= 100) mxnTotalProyecto = total - (total * (cqDiscount/100));
      else mxnTotalProyecto = total - cqDiscount; // Descuento directo en MXN
    }

    var factorPago = cqPaymentMode === 'anticipo' ? 0.5 : 1;
    var mxnTotal = Math.round(mxnTotalProyecto * factorPago);
    
    var displayTotal = mxnTotal * exchangeRate;
    if(currentCurrency !== 'MXN') {
      // Redondeo premium al multiplo de 5 mas cercano hacia arriba (ej. $182 -> $185 USD)
      displayTotal = Math.ceil(displayTotal / 5) * 5;
    }

    var formatter = new Intl.NumberFormat(currentCurrency === 'MXN' ? 'es-MX' : 'en-US', { style: 'currency', currency: currentCurrency });
    var el = document.getElementById('cqTotalDisplay');
    if(el) {
      el.innerHTML = formatter.format(displayTotal).replace('.00', '') + ' <small class="cq-currency-label" style="font-size:1.2rem;font-weight:600;">' + currentCurrency + '</small>';
    }
    var discEl = document.getElementById('cqDiscountDisplay');
    if (discEl) {
      discEl.style.display = cqDiscount > 0 ? 'block' : 'none';
      if(cqDiscount > 0) discEl.textContent = '- Descuento aplicado (' + cqCoupon + ')';
    }
    return { total: mxnTotal, projectTotal: Math.round(mxnTotalProyecto), mods: activeMods, paymentMode: cqPaymentMode };
  }

  document.querySelectorAll('.cq-mod-cb').forEach(function(cb) { cb.addEventListener('change', updateEstimator); });
  document.querySelectorAll('input[name="cqServicePack"]').forEach(function(radio) {
    radio.addEventListener('change', updateEstimator);
  });

  var cqSecMinus = document.getElementById('cqSecMinus');
  var cqSecPlus = document.getElementById('cqSecPlus');
  var cqSecCount = document.getElementById('cqSecCount');
  function renderCqSections() {
    if (cqSecCount) cqSecCount.textContent = String(cqExtraSections);
  }
  function changeCqSections(delta) {
    cqExtraSections = Math.max(0, Math.min(30, cqExtraSections + delta));
    renderCqSections();
    updateEstimator();
  }
  if (cqSecMinus) cqSecMinus.addEventListener('click', function(){ changeCqSections(-1); });
  if (cqSecPlus) cqSecPlus.addEventListener('click', function(){ changeCqSections(1); });
  renderCqSections();

  document.querySelectorAll('input[name="cqPaymentMode"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      cqPaymentMode = radio.value || 'liquidacion';
      updateEstimator();
    });
  });

  /* ── Divisas (Currency Toggle) ── */
  document.querySelectorAll('#currencyToggle .cq-lang__btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#currencyToggle .cq-lang__btn').forEach(function(b) { b.classList.remove('cq-lang__btn--active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('cq-lang__btn--active');
      btn.setAttribute('aria-pressed','true');
      const target = btn.getAttribute('data-curr');
      if(target === 'MXN') {
        exchangeRate = 1; currentCurrency = 'MXN'; updateEstimator();
      } else {
        fetch('https://open.er-api.com/v6/latest/MXN')
          .then(function(r) { return r.json(); })
          .then(function(data) {
             if(data && data.rates && data.rates[target]) {
               exchangeRate = data.rates[target];
               currentCurrency = target;
               updateEstimator();
             }
          }).catch(function(e){ console.error('Currency API error', e); });
      }
    });
  });

  /* ── Dictado por Voz (Micrófono) ── */
  var micBtn = document.getElementById('cqMicBtn');
  if (micBtn) {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      var recognition = new SpeechRecognition();
      recognition.lang = window.currentLang === 'en' ? 'en-US' : 'es-MX';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      var isRecording = false;
      micBtn.addEventListener('click', function() {
        if (isRecording) { recognition.stop(); return; }
        recognition.start();
      });
      recognition.onstart = function() {
        isRecording = true;
        micBtn.style.color = '#ff4d4d';
        micBtn.querySelector('span').textContent = 'Escuchando...';
      };
      recognition.onresult = function(e) {
        var transcript = e.results[0][0].transcript;
        var msgArea = document.getElementById('cqMessage');
        msgArea.value = (msgArea.value + ' ' + transcript).trim();
      };
      recognition.onend = function() {
        isRecording = false;
        micBtn.style.color = 'var(--brand)';
        micBtn.querySelector('span').textContent = 'Dictar';
      };
    } else {
      micBtn.style.display = 'none'; // Ocultar si el navegador no soporta
    }
  }

  /* ── Cupones ── */
  var applyCouponBtn = document.getElementById('cqApplyCoupon');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', function() {
      var code = document.getElementById('cqCouponCode').value.trim().toUpperCase();
      var msgEl = document.getElementById('cqCouponMsg');
      cqDiscount = 0; cqCoupon = '';
      if (code === 'BRYANF10') {
         cqDiscount = 10; cqCoupon = code;
         msgEl.textContent = '¡10% de descuento aplicado!'; msgEl.style.color = '#25d366';
      } else if (code === 'DISEÑO500' || code === 'DISENO500') {
         cqDiscount = 500; cqCoupon = code;
         msgEl.textContent = '¡$500 MXN de descuento aplicados!'; msgEl.style.color = '#25d366';
      } else if (code.length > 0) {
         msgEl.textContent = 'Cupón inválido.'; msgEl.style.color = '#ff4d4d';
      } else {
         msgEl.textContent = '';
      }
      updateEstimator();
    });
  }

  /* ── Inteligencia Artificial ── */
  var aiBtn = document.getElementById('cqAiBtn');
  if (aiBtn) {
    aiBtn.addEventListener('click', function() {
      var msg = val('cqMessage');
      if (msg.length < 10) { setErr('cqMsgErr', 'Escribe o dicta tu idea primero.'); return; }
      setErr('cqMsgErr', '');
      
      var origText = document.getElementById('cqAiText').innerHTML;
      document.getElementById('cqAiText').innerHTML = '⏳ Analizando con Lumina IA...';
      
      fetch(apiUrl('/api/openai-chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: 'Eres Lumina, asesora web. Analiza la idea del cliente y decide qué extras necesita entre: ecommerce, payments, seo, mantenimiento. Devuelve ESTRICTAMENTE Y SOLO UN JSON con esta estructura {"mods": [], "reply": "mensaje breve"}. Reglas: reply de máximo 3-4 líneas, tono profesional y claro, sin montos exactos.'
          }, {role: 'user', content: msg}],
          response_format: { type: 'json_object' },
          temperature: 0.2
        })
      }).then(function(res){ return res.json(); }).then(function(data){
         try {
           var resJson = JSON.parse(data.choices[0].message.content);
           
           if(resJson.mods && Array.isArray(resJson.mods)) {
             document.querySelectorAll('.cq-mod-cb').forEach(function(cb) { cb.checked = false; });
             resJson.mods.forEach(function(item) {
               var key = item === 'mantenimiento' ? 'maintenance' : item;
               var cb = document.querySelector('.cq-mod-cb[data-key="' + key + '"]');
               if(cb) cb.checked = true;
             });
             updateEstimator();
           }
           
           if(resJson.reply) {
             var aiBox = document.getElementById('cqAiResponseBox');
             var aiTextEl = document.getElementById('cqAiResponseText');
             if(aiBox && aiTextEl) {
               aiBox.style.display = 'block';
               aiTextEl.innerHTML = '';
               var chars = resJson.reply.split('');
               var i = 0;
               var typingInterval = setInterval(function() {
                 if(i < chars.length) {
                   aiTextEl.innerHTML += chars[i];
                   i++;
                 } else {
                   clearInterval(typingInterval);
                 }
               }, 20); // efecto maquina de escribir
             }
           }
         } catch(e) { console.error('Error procesando respuesta IA', e); }
         document.getElementById('cqAiText').innerHTML = origText;
      }).catch(function(e){
         document.getElementById('cqAiText').innerHTML = origText;
         console.error('Error IA', e);
      });
    });
  }

  /* ── Build summary ── */
  function buildSummary() {
    var state = updateEstimator();
    var formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
    var totalFormatted = formatter.format(state.total);
    var projectTotalFormatted = formatter.format(state.projectTotal || state.total);
    
    var fileText = '';
    if (selectedFiles && selectedFiles.length > 0) {
      var names = selectedFiles.map(function(f){ return f.name; }).join(', ');
      fileText = '\n\nArchivos adjuntados en la web: ' + names + ' (Te los enviaré por aquí enseguida).';
    }

    var modText = state.mods.length ? '\nMódulos adicionales: ' + state.mods.join(', ') : '';
    var couponText = (cqDiscount > 0) ? '\nCupón usado: ' + cqCoupon : '';
    var paymentModeText = '\nModalidad de pago: ' + (state.paymentMode === 'anticipo' ? '50% de anticipo' : 'Servicio completo');

    return '--- NUEVA COTIZACIÓN ---\n' +
      'Nombre: ' + val('cqName') + '\n' +
      'Teléfono: ' + (val('cqPhone')||'—') + '\n' +
      'Servicio elegido: ' + cqServiceLabel + '\n' +
      'Total del proyecto: ' + projectTotalFormatted + '\n' +
      'Monto a pagar ahora: ' + totalFormatted + paymentModeText + modText + couponText + '\n\n' +
      'Descripción / Mensaje:\n' + val('cqMessage') + fileText;
  }

  function showSuccess() {
    if (success) { success.removeAttribute('hidden'); setTimeout(function () { success.setAttribute('hidden',''); }, 6000); }
  }

  /* ── WhatsApp submit ── */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      window.open('https://wa.me/525663012505?text=' + encodeURIComponent(buildSummary()), '_blank', 'noopener,noreferrer');
      showSuccess();
    });
  }

  /* Clear errors on input */
  ['cqName','cqMessage'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { el.style.borderColor=''; });
  });

  window.applyLang('es');

})();

/* =============================================
   LUMINA AI CHATBOT LOGIC
   ============================================= */
(function() {
  const API_BASE = String(window.PAYMENTS_API_BASE || '').replace(/\/$/, '');
  const apiUrl = (path) => API_BASE ? `${API_BASE}${path}` : path;
  const SYSTEM_PROMPT = `Eres LUMINA, la IA asistente especializada en Diseño y Desarrollo Web en WordPress de la agencia BryanF Design. 
Tu objetivo es ayudar a los clientes a entender la importancia de tener una página web profesional, cómo trabajamos con WordPress, optimización (SEO, rendimiento) y el impacto de un buen diseño.

CONOCIMIENTO DE PREGUNTAS FRECUENTES (FAQ):
- Tiempos de entrega: empiezan desde 3 días una vez entregada la información completa.
- Límite de cambios: NO hay límite de cambios, trabajamos hasta la satisfacción total del cliente.
- Horarios de atención: Lunes a Viernes de 9:00 AM a 7:00 PM hora CDMX.
- Requisitos para empezar: Info de la empresa, una breve reunión, y 50% de anticipo (el otro 50% al finalizar).
- Entregables finales: Accesos totales a la web y correos, y una capacitación de aprox 30 mins.
- Qué incluye: Dominio y host gratis por 1 año, correos ilimitados (1GB), y diseño personalizado.

REGLA ESTRICTA DE COSTOS: Si el usuario pregunta por costos, precios, tarifas o presupuestos aproximados, DEBES decirle que los costos varían según el proyecto (empiezan desde $3500 MXN) y redirigirlo INMEDIATAMENTE al WhatsApp de BryanF Design (+52 56 6301 2505) usando este enlace exacto: <a href="https://wa.me/525663012505" target="_blank">Contactar por WhatsApp</a>.
REGLA DE COMPLIANCE / PRIVACIDAD: Si el usuario pregunta qué hacemos con sus datos, si el pago es seguro, o sobre políticas, asegúrale que sus datos están súper protegidos e invítalo a leer nuestro <a href="/privacidad" target="_blank">Aviso de Privacidad</a> y los <a href="/terminos" target="_blank">Términos y Condiciones</a> oficiales.


ACCIÓN AUTOMÁTICA DE COTIZACIÓN: Si el usuario ya te proporciona detalles de su proyecto y muestra intención de cotizar o empezar, incluye EXACTAMENTE esta etiqueta al final de tu respuesta: [ACTION:OPEN_FORM:{"name": "nombre del cliente si lo dio, sino vacío", "message": "resumen breve del proyecto que te dio, listo para el formulario"}]

Tono: Profesional, experto, premium, amigable y conciso (no des respuestas largas).
Usa formato HTML básico en tus respuestas (como <strong>, <br>, <ul>, <li>, y <a> en caso de links).`;

  const fab = document.getElementById('luminaFab');
  const panel = document.getElementById('luminaPanel');
  const closeBtn = document.getElementById('luminaClose');
  const messagesContainer = document.getElementById('luminaMessages');
  const input = document.getElementById('luminaInput');
  const sendBtn = document.getElementById('luminaSend');
  const chips = document.querySelectorAll('.lumina-chip');

  let chatHistory = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];
  let isTyping = false;
  let hasOpened = false;

  // Toggle panel
  function togglePanel(e) {
    if (e) e.stopPropagation();
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');
      fab.style.transform = 'scale(0)';
      fab.style.opacity = '0';
      fab.style.pointerEvents = 'none';
      if (!hasOpened) {
        addMessage('¡Hola! Soy LUMINA, la asistente inteligente de BryanF Design. ¿En qué te puedo ayudar hoy sobre la creación de tu próxima página web profesional?', 'ai');
        hasOpened = true;
      }
      setTimeout(() => input.focus(), 300);
    } else {
      panel.setAttribute('hidden', '');
      fab.style.transform = '';
      fab.style.opacity = '1';
      fab.style.pointerEvents = 'all';
    }
  }

  fab.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', togglePanel);

  // Auto-resize textarea
  input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    if (this.value.trim() === '') this.style.height = 'auto';
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);

  // Chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.getAttribute('data-msg');
      input.style.height = 'auto';
      handleSend();
    });
  });

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `lumina-msg lumina-msg--${sender}`;
    div.innerHTML = text; // Permite HTML formateado del bot
    messagesContainer.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'lumina-typing';
    div.id = 'luminaTypingObj';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(div);
    scrollToBottom();
    isTyping = true;
    input.disabled = true;
    sendBtn.disabled = true;
  }

  function hideTyping() {
    const typingObj = document.getElementById('luminaTypingObj');
    if (typingObj) typingObj.remove();
    isTyping = false;
    input.disabled = false;
    sendBtn.disabled = false;
    setTimeout(() => input.focus(), 10);
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function handleSend() {
    const text = input.value.trim();
    if (!text || isTyping) return;

    // UI Updates
    input.value = '';
    input.style.height = 'auto';
    addMessage(text, 'user');
    showTyping();

    // API Call
    chatHistory.push({ role: 'user', content: text });

    try {
      const response = await fetch(apiUrl('/api/openai-chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: chatHistory,
          temperature: 0.7,
          max_tokens: 400
        })
      });

      const data = await response.json();
      hideTyping();

      if (data.error) {
        console.error('OpenAI Error:', data.error);
        addMessage('Lo siento, tuve un problema temporal al conectarme. Por favor, intenta de nuevo o escríbenos por <a href="https://wa.me/525663012505" target="_blank">WhatsApp</a>.', 'ai');
        chatHistory.pop(); // Remove failed user msg
        return;
      }

      let aiText = data.choices[0].message.content;
      chatHistory.push({ role: 'assistant', content: aiText });
      
      // Keep history manageable (last 10 interactions + system prompt)
      if (chatHistory.length > 21) {
        chatHistory = [chatHistory[0], ...chatHistory.slice(chatHistory.length - 20)];
      }

      // Check for OPEN_FORM action
      const actionMatch = aiText.match(/\[ACTION:OPEN_FORM:(.*?)\]/);
      if (actionMatch) {
        try {
          const formData = JSON.parse(actionMatch[1]);
          if (formData.name) document.getElementById('cqName').value = formData.name;
          if (formData.message) document.getElementById('cqMessage').value = formData.message;
          
          // Trigger the form UI
          const overlay = document.getElementById('cotizarOverlay');
          if (overlay) {
            overlay.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
          }
        } catch (e) {
          console.error("Failed to parse form action JSON from AI", e);
        }
        // Remove the action tag from the visible response
        aiText = aiText.replace(/\[ACTION:OPEN_FORM:.*?\]/, '');
      }

      // Convert simple markdown to HTML
      let formattedText = aiText
        .trim()
        .replace(/\n\n/g, '<br><br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
      addMessage(formattedText, 'ai');

    } catch (err) {
      hideTyping();
      console.error('Fetch Error:', err);
      addMessage('Error de red. Por favor revisa tu conexión e inténtalo de nuevo.', 'ai');
      chatHistory.pop();
    }
  }

})();


  /* ============================================================
     13. LANG TOGGLE TABS
     ============================================================ */
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var l = this.getAttribute('data-lang');
      applyLang(l);
      document.querySelectorAll('.lang-btn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-lang') === l);
      });
      // Try to re-run currency formatting if it's already generated
      if(window.faqLastCurrencyInfo) { updateCurrencyUI(window.faqLastCurrencyInfo); }
    });
  });

  /* ============================================================
     14. FAQ SEARCH LOGIC
     ============================================================ */
  (function initFAQ() {
    var search = document.getElementById('faqSearch');
    var items = document.querySelectorAll('.faq__item');
    var empty = document.getElementById('faqEmpty');
    var list = document.getElementById('faqList');
    
    if (!search || items.length === 0) return;

    search.addEventListener('input', function() {
      var q = search.value.toLowerCase().trim();
      var visible = 0;
      items.forEach(function(item) {
        var text = item.textContent.toLowerCase();
        if (text.indexOf(q) > -1) {
          item.style.display = '';
          visible++;
        } else {
          item.style.display = 'none';
        }
      });
      if (visible === 0) {
        empty.removeAttribute('hidden');
        list.setAttribute('hidden', '');
      } else {
        empty.setAttribute('hidden', '');
        list.removeAttribute('hidden');
      }
    });

    /* ============================================================
       15. FAQ CURRENCY API & TIMEZONE
       ============================================================ */
    var currencyBtn = document.getElementById('faqCurrencyBtn');
    var currencyRes = document.getElementById('faqCurrencyResult');
    var mxnValue = 3500;
    
    if(currencyBtn) {
      currencyBtn.addEventListener('click', function() {
        currencyBtn.style.display = 'none';
        currencyRes.removeAttribute('hidden');
        
        // Use free API to get USD rate, fallback to 1 -> 20 if fails
        fetch('https://api.exchangerate-api.com/v4/latest/MXN')
          .then(res => res.json())
          .then(data => {
            // Predict user currency via basic timezone
            var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            var targetCur = 'USD'; // default
            if(tz.includes('Europe')) targetCur = 'EUR';
            if(tz.includes('London')) targetCur = 'GBP';
            if(tz.includes('America/Bogota')) targetCur = 'COP';
            if(tz.includes('America/Argentina')) targetCur = 'ARS';
            if(tz.includes('America/Santiago')) targetCur = 'CLP';
            // Fallback if targetCur not in API
            if(!data.rates[targetCur]) targetCur = 'USD';
            
            var rate = data.rates[targetCur];
            var conv = Math.round(mxnValue * rate);
            window.faqLastCurrencyInfo = { val: conv, cur: targetCur };
            updateCurrencyUI(window.faqLastCurrencyInfo);
          })
          .catch(err => {
            // fallback
            var conv = Math.round(mxnValue * 0.05); // approx $175 USD
            window.faqLastCurrencyInfo = { val: conv, cur: 'USD' };
            updateCurrencyUI(window.faqLastCurrencyInfo);
          });
      });
    }

    window.updateCurrencyUI = function(info) {
      if(!currencyRes) return;
      var t = window.LANG[window.currentLang];
      currencyRes.textContent = (window.currentLang === 'es' ? 'Aprox. ' : 'Approx. ') + info.val.toLocaleString() + ' ' + info.cur;
    };

    var tzBtn = document.getElementById('faqTimezoneBtn');
    var tzRes = document.getElementById('faqTimezoneResult');
    if(tzBtn) {
      tzBtn.addEventListener('click', function() {
        tzBtn.style.display = 'none';
        tzRes.removeAttribute('hidden');
        
        var d1 = new Date(); d1.setHours(9,0,0,0);
        var d2 = new Date(); d2.setHours(19,0,0,0);
        
        // CDMX is usually GMT-6
        var format = new Intl.DateTimeFormat(window.currentLang === 'es' ? 'es-MX' : 'en-US', {
            hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short'
        });
        
        tzRes.textContent = (window.currentLang === 'es' ? 'Tu hora local: ' : 'Your local time: ') + format.format(d1) + ' — ' + format.format(d2);
      });
    }
  })();

  /* ============================================================
     16. ACCESSIBILITY MODULE
     ============================================================ */
  (function initA11y() {
    var fab = document.getElementById('a11yFab');
    var menu = document.getElementById('a11yMenu');
    if (!fab || !menu) return;

    fab.addEventListener('click', function(e) {
      e.stopPropagation();
      if(menu.hasAttribute('hidden')) menu.removeAttribute('hidden');
      else menu.setAttribute('hidden','');
    });

    document.addEventListener('click', function(e) {
      if(!menu.contains(e.target) && e.target !== fab && !fab.contains(e.target)) {
        menu.setAttribute('hidden','');
      }
    });

    var bigText = document.getElementById('a11yText');
    var contrast = document.getElementById('a11yContrast');
    var reduceMotion = document.getElementById('a11yMotion');

    if(bigText) bigText.addEventListener('change', function(e) { document.body.classList.toggle('a11y-large-text', e.target.checked); });
    if(contrast) contrast.addEventListener('change', function(e) { document.body.classList.toggle('a11y-high-contrast', e.target.checked); });
    if(reduceMotion) reduceMotion.addEventListener('change', function(e) { document.body.classList.toggle('a11y-reduced-motion', e.target.checked); });
  })();

  /* ============================================================
     17. FLOATING BUTTONS FOOTER HIDER
     ============================================================ */
  (function initFloatingHider() {
    var footer = document.querySelector('.footer');
    var luminaFab = document.getElementById('luminaFab');
    var a11yModule = document.querySelector('.a11y-module');
    
    if(!footer || (!luminaFab && !a11yModule)) return;
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if(luminaFab) luminaFab.classList.add('hide-floating');
          if(a11yModule) a11yModule.classList.add('hide-floating');
        } else {
          if(luminaFab) luminaFab.classList.remove('hide-floating');
          if(a11yModule) a11yModule.classList.remove('hide-floating');
        }
      });
    }, { rootMargin: '0px', threshold: 0.1 });
    
    observer.observe(footer);
  })();

  /* ============================================================
     18. FAST TRACK CONFIGURATOR (ISOLATED SECTION)
     ============================================================ */
  (function initFastTrackSection() {
    var root = document.getElementById('fast-track-section');
    if (!root) return;

    var WA_URL_BASE = 'https://wa.me/525663012505?text=';
    var PAYMENTS_API_BASE = String(window.PAYMENTS_API_BASE || '').replace(/\/$/, '');

    function parseMoney(text) {
      if (!text) return 0;
      var num = text.replace(/[^0-9.,]/g, '').replace(/,/g, '');
      var parsed = parseFloat(num || '0');
      return Number.isFinite(parsed) ? Math.round(parsed) : 0;
    }

    function formatMXN(amount) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
        .format(amount) + ' MXN';
    }

    function readExistingPricing() {
      var prices = {
        plans: {
          full: 3500,
          update: 1800,
          maintenance: 1000
        },
        ecommerce: 3500,
        payments: 1500,
        sections: 350,
        maintenance: 1000
      };

      document.querySelectorAll('input[name="cqServicePack"]').forEach(function(input) {
        var value = parseInt(input.value || '0', 10);
        if (!value || value < 1) return;
        var label = (input.getAttribute('data-label') || '').toLowerCase();
        if (label.indexOf('actualizacion') > -1 || label.indexOf('update') > -1) {
          prices.plans.update = value;
        } else if (label.indexOf('mantenimiento') > -1 || label.indexOf('maintenance') > -1) {
          prices.plans.maintenance = value;
        } else {
          prices.plans.full = value;
        }
      });

      document.querySelectorAll('.cq-mod-cb').forEach(function(cb) {
        var value = parseInt(cb.value || '0', 10);
        var key = (cb.getAttribute('data-key') || '').toLowerCase();
        var name = ((cb.getAttribute('data-name') || '') + ' ' + (cb.parentElement ? cb.parentElement.textContent : '')).toLowerCase();
        if (!value || value < 1) return;

        if (key === 'ecommerce' || name.indexOf('e-commerce') > -1 || name.indexOf('tienda') > -1) {
          prices.ecommerce = value;
        } else if (key === 'payments' || name.indexOf('pasarela') > -1 || name.indexOf('pago directo') > -1) {
          prices.payments = value;
        } else if (key === 'maintenance' || name.indexOf('mantenimiento') > -1) {
          prices.maintenance = value;
        }
      });

      return prices;
    }

    var pricing = readExistingPricing();
    var state = {
      selectedPlan: 'full',
      modules: {
        ecommerce: false,
        payments: false,
        sections: false,
        maintenance: false
      },
      extraSections: 0,
      paymentMode: 'liquidacion',
      coupon: { code: '', discountType: null, discountValue: 0 },
      lastPayment: null
    };

    var dom = {
      navFastTrackBtn: document.getElementById('navFastTrackBtn'),
      mobileFastTrackLink: document.querySelector('.mobile-menu__link[href="#fast-track-section"]'),
      configState: document.getElementById('ftStateConfig'),
      onboardingState: document.getElementById('ftStateOnboarding'),
      moduleInputs: root.querySelectorAll('.ft-module-cb'),
      planButtons: root.querySelectorAll('.ft-plan[data-ft-plan]'),
      sectionsMinus: document.getElementById('ftSectionsMinus'),
      sectionsPlus: document.getElementById('ftSectionsPlus'),
      sectionsCount: document.getElementById('ftSectionsCount'),
      basePriceLabel: document.getElementById('ftBasePriceLabel'),
      updatePriceLabel: document.getElementById('ftUpdatePriceLabel'),
      maintenancePlanPriceLabel: document.getElementById('ftMaintenancePlanPriceLabel'),
      priceEcommerce: document.getElementById('ftPriceEcommerce'),
      pricePayments: document.getElementById('ftPricePayments'),
      priceSections: document.getElementById('ftPriceSections'),
      priceMaintenance: document.getElementById('ftPriceMaintenance'),
      paymentModeRadios: root.querySelectorAll('input[name="ftPaymentMode"]'),
      couponCode: document.getElementById('ftCouponCode'),
      applyCouponBtn: document.getElementById('ftApplyCouponBtn'),
      couponMsg: document.getElementById('ftCouponMsg'),
      total: document.getElementById('ftTotal'),
      summaryRows: document.getElementById('ftSummaryRows'),
      luminaMessage: document.getElementById('ftLuminaMessage'),
      luminaPrompt: document.getElementById('ftLuminaPrompt'),
      luminaMicBtn: document.getElementById('ftLuminaMicBtn'),
      luminaSuggestBtn: document.getElementById('ftLuminaSuggestBtn'),
      payStripeBtn: document.getElementById('ftPayStripeBtn'),
      payMPBtn: document.getElementById('ftPayMPBtn'),
      payStatus: document.getElementById('ftPayStatus'),
      simulateSuccessBtn: document.getElementById('ftSimulateSuccessBtn'),
      wizardSummary: document.getElementById('ftWizardSummary'),
      form: document.getElementById('ftOnboardingForm'),
      actionButtons: root.querySelectorAll('[data-ft-action]')
    };

    var speechState = {
      recognition: null,
      isRecording: false
    };

    function t(key, fallback) {
      var lang = window.currentLang || 'es';
      if (window.LANG && window.LANG[lang] && window.LANG[lang][key] !== undefined) {
        return window.LANG[lang][key];
      }
      return fallback || key;
    }

    function smoothScrollToFastTrack(ev) {
      if (ev) ev.preventDefault();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function getModuleCatalog() {
      return {
        ecommerce: { label: 'Integracion de E-commerce', price: pricing.ecommerce, source: 'E-commerce / Tienda Online' },
        payments: { label: 'Pasarelas de Pago Directo', price: pricing.payments, source: 'Pasarelas de Pago Directo' },
        sections: { label: 'Secciones Adicionales', price: pricing.sections, source: 'Secciones adicionales' },
        maintenance: { label: 'Mantenimiento Especializado', price: pricing.maintenance, source: 'Mantenimiento Mensual' }
      };
    }

    function getSelectedPlanData() {
      if (state.selectedPlan === 'update') {
        return { key: 'update', source: t('ft_plan_update_name', 'Actualizacion de pagina web'), price: pricing.plans.update };
      }
      if (state.selectedPlan === 'maintenance') {
        return { key: 'maintenance', source: t('ft_plan_maintenance_name', 'Mantenimiento de sitio web'), price: pricing.plans.maintenance };
      }
      return { key: 'full', source: t('ft_plan_name', 'Desarrollo Base Optimizado'), price: pricing.plans.full };
    }

    function getSummaryItems() {
      var catalog = getModuleCatalog();
      var selectedPlan = getSelectedPlanData();
      var items = [
        { label: 'Paquete base', key: selectedPlan.key, source: selectedPlan.source, price: selectedPlan.price }
      ];

      ['ecommerce', 'payments', 'maintenance'].forEach(function(key) {
        if (state.modules[key]) {
          items.push({
            label: 'Modulo',
            key: key,
            source: catalog[key].source,
            price: catalog[key].price
          });
        }
      });

      if (state.extraSections > 0) {
        items.push({
          label: 'Modulo',
          key: 'sections',
          source: 'Secciones adicionales x' + state.extraSections,
          price: state.extraSections * pricing.sections
        });
      }

      return items;
    }

    function getTotals() {
      var projectSubtotal = getSummaryItems().reduce(function(sum, item) { return sum + item.price; }, 0);
      var projectTotal = projectSubtotal;

      if (state.coupon.discountValue > 0) {
        if (state.coupon.discountType === 'percent') {
          projectTotal = projectSubtotal - (projectSubtotal * (state.coupon.discountValue / 100));
        } else if (state.coupon.discountType === 'fixed') {
          projectTotal = projectSubtotal - state.coupon.discountValue;
        }
      }

      projectTotal = Math.max(0, Math.round(projectTotal));
      var payableNow = state.paymentMode === 'anticipo' ? Math.round(projectTotal * 0.5) : projectTotal;
      return { projectSubtotal: projectSubtotal, projectTotal: projectTotal, payableNow: payableNow };
    }

    function renderPriceLabels() {
      if (dom.basePriceLabel) dom.basePriceLabel.textContent = formatMXN(pricing.plans.full);
      if (dom.updatePriceLabel) dom.updatePriceLabel.textContent = formatMXN(pricing.plans.update);
      if (dom.maintenancePlanPriceLabel) dom.maintenancePlanPriceLabel.textContent = formatMXN(pricing.plans.maintenance);
      dom.priceEcommerce.textContent = '+' + formatMXN(pricing.ecommerce);
      dom.pricePayments.textContent = '+' + formatMXN(pricing.payments);
      dom.priceSections.textContent = '+' + formatMXN(pricing.sections) + ' c/u';
      dom.priceMaintenance.textContent = '+' + formatMXN(pricing.maintenance);
    }

    function renderSummary() {
      var items = getSummaryItems();
      var totals = getTotals();
      dom.summaryRows.innerHTML = items.map(function(item) {
        return (
          '<div class="ft-summary-row">' +
          '<div><span>' + item.label + '</span><br><strong>' + item.source + '</strong></div>' +
          '<strong>' + formatMXN(item.price) + '</strong>' +
          '</div>'
        );
      }).join('');
      dom.total.textContent = formatMXN(totals.payableNow);
      if (state.coupon.discountValue > 0 && dom.couponMsg) {
        dom.couponMsg.textContent = (window.currentLang === 'en' ? 'Coupon applied: ' : 'Cupon aplicado: ') + state.coupon.code + (window.currentLang === 'en' ? ' | Project total: ' : ' | Total proyecto: ') + formatMXN(totals.projectTotal);
        dom.couponMsg.style.color = '#b4e332';
      } else if (dom.couponMsg) {
        dom.couponMsg.textContent = '';
      }
      if (dom.sectionsCount) dom.sectionsCount.textContent = String(state.extraSections);
    }

    function refresh() {
      renderSummary();
    }

    function setLuminaMessage(text) {
      if (dom.luminaMessage) dom.luminaMessage.textContent = text;
    }

    function setPaymentStatus(text, ok) {
      dom.payStatus.textContent = text;
      dom.payStatus.style.color = ok ? '#b4e332' : '';
    }

    function setPaymentLoading(isLoading) {
      dom.payStripeBtn.disabled = isLoading;
      dom.payMPBtn.disabled = isLoading;
    }

    async function requestPaymentJson(endpoint, payload) {
      var url = PAYMENTS_API_BASE ? (PAYMENTS_API_BASE + endpoint) : endpoint;
      var response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      var contentType = (response.headers.get('content-type') || '').toLowerCase();
      if (contentType.indexOf('application/json') === -1) {
        var raw = await response.text();
        throw new Error('El backend de pagos no respondió JSON. Verifica que el servidor Node esté activo y exponga ' + endpoint + '. Detalle: ' + (raw ? raw.slice(0, 120) : 'sin detalle'));
      }

      var data = await response.json();
      if (!response.ok || (data && data.error)) {
        throw new Error(data && data.error ? data.error : 'Error de servidor en ' + endpoint + '.');
      }
      return data;
    }

    function getPaymentPayload() {
      var summaryItems = getSummaryItems();
      var serviceName = summaryItems[0] ? summaryItems[0].source : 'Servicio web';
      var modules = summaryItems.slice(1).map(function(item) { return item.source; });
      var totals = getTotals();
      return {
        monto: totals.projectTotal,
        modalidad: state.paymentMode,
        descripcion: 'Configura tu Proyecto Web - ' + serviceName + (modules.length ? ' + ' + modules.join(', ') : ''),
        metadata: {
          flow: 'fast-track',
          service: serviceName,
          modules: modules,
          extra_sections: state.extraSections.toString(),
          coupon: state.coupon.code || 'none'
        }
      };
    }

    function renderWizardSummary() {
      var chips = getSummaryItems().map(function(item) {
        return '<span class="ft-wizard-chip">' + item.source + ' - ' + formatMXN(item.price) + '</span>';
      });
      var totals = getTotals();
      chips.push('<span class="ft-wizard-chip">Total proyecto: ' + formatMXN(totals.projectTotal) + '</span>');
      chips.push('<span class="ft-wizard-chip">Pago ahora: ' + formatMXN(totals.payableNow) + '</span>');
      dom.wizardSummary.innerHTML = chips.join('');
    }

    function showOnboarding() {
      dom.configState.classList.remove('ft-state--active');
      dom.onboardingState.classList.add('ft-state--active');
      renderWizardSummary();
      dom.onboardingState.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function requestLuminaSuggestion() {
      var payload = getSummaryItems().map(function(item) { return item.source; }).join(', ');
      var userPrompt = dom.luminaPrompt ? String(dom.luminaPrompt.value || '').trim() : '';
      setLuminaMessage(window.currentLang === 'en' ? 'Analyzing your setup with Lumina...' : 'Analizando tu configuracion con Lumina...');
      dom.luminaSuggestBtn.disabled = true;
      if (dom.luminaMicBtn) dom.luminaMicBtn.disabled = true;

      try {
        var response = await fetch((PAYMENTS_API_BASE ? PAYMENTS_API_BASE : '') + '/api/openai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: 'Eres Lumina. Analiza una configuracion de servicios web y responde SOLO JSON con {"mods":[],"reply":""}. Mods posibles: ecommerce,payments,sections,maintenance. Reply breve, premium y accionable.'
              },
              {
                role: 'user',
                content: 'Configuracion actual: ' + payload + '. Contexto del cliente: ' + (userPrompt || 'No agrego detalle adicional.') + '. Sugiere optimizacion de modulos.'
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
          })
        });

        var data = await response.json();
        var content = data && data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '{}';
        var parsed = JSON.parse(content || '{}');

        if (parsed.mods && Array.isArray(parsed.mods)) {
          dom.moduleInputs.forEach(function(input) {
            var should = parsed.mods.indexOf(input.value) > -1;
            input.checked = should;
            state.modules[input.value] = should;
            if (input.value === 'sections') {
              state.extraSections = should ? Math.max(1, state.extraSections) : 0;
            }
          });
          refresh();
        }

        setLuminaMessage(parsed.reply || (window.currentLang === 'en'
          ? 'I already have a recommendation so you can move forward with a stronger setup.'
          : 'Ya tengo una recomendacion para que avances con una configuracion mas rentable.'));
      } catch (err) {
        setLuminaMessage(window.currentLang === 'en'
          ? 'Your setup is on the right track. If you want, I can help you on WhatsApp in the next step.'
          : 'Tu configuracion esta bien encaminada. Si quieres, puedo ayudarte por WhatsApp en el siguiente paso.');
      } finally {
        dom.luminaSuggestBtn.disabled = false;
        if (dom.luminaMicBtn) dom.luminaMicBtn.disabled = false;
      }
    }

    function initLuminaDictation() {
      if (!dom.luminaMicBtn || !dom.luminaPrompt) return;
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        dom.luminaMicBtn.style.display = 'none';
        return;
      }

      speechState.recognition = new SpeechRecognition();
      speechState.recognition.lang = (window.currentLang === 'en' ? 'en-US' : 'es-MX');
      speechState.recognition.continuous = false;
      speechState.recognition.interimResults = false;

      speechState.recognition.onstart = function() {
        speechState.isRecording = true;
        dom.luminaMicBtn.innerHTML = '<i class="fa-solid fa-stop"></i> ' + (window.currentLang === 'en' ? 'Stop' : 'Detener');
      };

      speechState.recognition.onresult = function(event) {
        var transcript = event && event.results && event.results[0] && event.results[0][0]
          ? event.results[0][0].transcript
          : '';
        if (!transcript) return;
        var previous = String(dom.luminaPrompt.value || '').trim();
        dom.luminaPrompt.value = (previous ? previous + ' ' : '') + transcript;
      };

      speechState.recognition.onerror = function() {
        setLuminaMessage(window.currentLang === 'en'
          ? 'I could not capture dictation this time. You can type or try again.'
          : 'No pude capturar el dictado en este intento. Puedes escribir o volver a intentarlo.');
      };

      speechState.recognition.onend = function() {
        speechState.isRecording = false;
        dom.luminaMicBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> ' + t('ft_lumina_dictate', 'Dictar');
      };

      dom.luminaMicBtn.addEventListener('click', function() {
        if (!speechState.recognition) return;
        if (speechState.isRecording) {
          speechState.recognition.stop();
          return;
        }
        speechState.recognition.lang = (window.currentLang === 'en' ? 'en-US' : 'es-MX');
        speechState.recognition.start();
      });
    }

    async function createStripePayment() {
      setPaymentLoading(true);
      dom.simulateSuccessBtn.hidden = true;
      try {
        var payload = getPaymentPayload();
        var data = await requestPaymentJson('/api/stripe-checkout', payload);
        if (!data.checkoutUrl) {
          throw new Error('Stripe no devolvió checkoutUrl.');
        }
        state.lastPayment = { method: 'stripe', payload: payload, response: data };
        window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
        setPaymentStatus((window.currentLang === 'en' ? 'Stripe ready. Checkout opened for ' : 'Stripe listo. Checkout abierto por ') + formatMXN(data.amount) + '.', true);
        dom.simulateSuccessBtn.hidden = false;
      } catch (err) {
        setPaymentStatus((window.currentLang === 'en' ? 'Stripe error: ' : 'Error en Stripe: ') + err.message, false);
      } finally {
        setPaymentLoading(false);
      }
    }

    async function createMercadoPagoPayment() {
      setPaymentLoading(true);
      dom.simulateSuccessBtn.hidden = true;
      try {
        var payload = getPaymentPayload();
        var data = await requestPaymentJson('/api/mercadopago', payload);
        if (!data.preferenceId) {
          throw new Error('Mercado Pago no devolvió preferenceId.');
        }
        if (!data.initPoint) {
          throw new Error('Mercado Pago no devolvió initPoint para abrir el checkout.');
        }
        window.open(data.initPoint, '_blank', 'noopener,noreferrer');
        state.lastPayment = { method: 'mercado_pago', payload: payload, response: data };
        setPaymentStatus((window.currentLang === 'en' ? 'Mercado Pago ready. Checkout opened: ' : 'Mercado Pago listo. Checkout abierto: ') + data.preferenceId + '.', true);
        dom.simulateSuccessBtn.hidden = false;
      } catch (err) {
        setPaymentStatus((window.currentLang === 'en' ? 'Mercado Pago error: ' : 'Error en Mercado Pago: ') + err.message, false);
      } finally {
        setPaymentLoading(false);
      }
    }

    function buildWhatsAppMessage(action) {
      var formData = new FormData(dom.form);
      var actionLabel = {
        start: 'Enviar informacion y comenzar',
        later: 'La envio despues',
        help: 'No tengo esta informacion, por favor ayudame'
      }[action] || action;

      var lines = [
        '*FAST TRACK - NUEVO BRIEFING*',
        '',
        '*Accion elegida:* ' + actionLabel,
        '*Servicio principal:* ' + (getSummaryItems()[0] ? getSummaryItems()[0].source : 'Servicio web'),
        '*Modalidad de pago:* ' + (state.paymentMode === 'anticipo' ? '50% de anticipo' : 'Servicio completo'),
        '*Total proyecto:* ' + formatMXN(getTotals().projectTotal),
        '*Monto a pagar ahora:* ' + formatMXN(getTotals().payableNow),
        '*Modulos seleccionados:* ' + (getSummaryItems().slice(1).map(function(item) { return item.source; }).join(', ') || 'Sin extras'),
        '*Cupon:* ' + (state.coupon.code || 'Sin cupon'),
        '',
        '*Negocio:* ' + (formData.get('businessName') || 'Sin definir'),
        '*Contacto:* ' + (formData.get('contactName') || 'Sin definir'),
        '*Correo:* ' + (formData.get('contactEmail') || 'Sin definir'),
        '*WhatsApp:* ' + (formData.get('contactPhone') || 'No compartido'),
        '*Objetivo principal:* ' + (formData.get('mainGoal') || 'No especificado'),
        '*Servicios:* ' + (formData.get('services') || 'No especificado'),
        '*Referencias:* ' + (formData.get('references') || 'No especificado')
      ];

      if (state.lastPayment && state.lastPayment.response) {
        lines.push(
          '',
          '*Metodo de pago:* ' + state.lastPayment.method,
          '*Monto de pago:* ' + formatMXN(state.lastPayment.response.amount || getTotals().payableNow),
          '*Ref Stripe:* ' + (state.lastPayment.response.checkoutUrl || 'N/A'),
          '*Ref MP:* ' + (state.lastPayment.response.preferenceId || 'N/A')
        );
      }

      return lines.join('\n');
    }

    function handleActionClick(action) {
      if (action === 'start' && !dom.form.reportValidity()) return;
      var url = WA_URL_BASE + encodeURIComponent(buildWhatsAppMessage(action));
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    function applyFastTrackCoupon() {
      if (!dom.couponCode || !dom.couponMsg) return;
      var code = String(dom.couponCode.value || '').trim().toUpperCase();
      state.coupon = { code: '', discountType: null, discountValue: 0 };
      if (!code) {
        dom.couponMsg.textContent = '';
        refresh();
        return;
      }
      if (code === 'BRYANF10') {
        state.coupon = { code: code, discountType: 'percent', discountValue: 10 };
      } else if (code === 'DISENO500' || code === 'DISEÑO500') {
        state.coupon = { code: code, discountType: 'fixed', discountValue: 500 };
      } else {
        dom.couponMsg.textContent = window.currentLang === 'en' ? 'Invalid coupon.' : 'Cupon invalido.';
        dom.couponMsg.style.color = '#ff6b6b';
        refresh();
        return;
      }
      refresh();
    }

    function bindEvents() {
      if (dom.navFastTrackBtn) dom.navFastTrackBtn.addEventListener('click', smoothScrollToFastTrack);
      if (dom.mobileFastTrackLink) dom.mobileFastTrackLink.addEventListener('click', smoothScrollToFastTrack);

      dom.moduleInputs.forEach(function(input) {
        input.addEventListener('change', function() {
          if (input.value === 'sections') {
            state.modules.sections = !!input.checked;
            if (!input.checked) state.extraSections = 0;
            if (input.checked && state.extraSections < 1) state.extraSections = 1;
          } else {
            state.modules[input.value] = !!input.checked;
          }
          refresh();
        });
      });

      dom.planButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var plan = btn.getAttribute('data-ft-plan') || 'full';
          state.selectedPlan = plan;
          dom.planButtons.forEach(function(item) {
            var active = item === btn;
            item.classList.toggle('ft-plan--active', active);
            item.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
          refresh();
        });
      });

      if (dom.sectionsMinus) {
        dom.sectionsMinus.addEventListener('click', function() {
          state.extraSections = Math.max(0, state.extraSections - 1);
          state.modules.sections = state.extraSections > 0;
          var sectionsInput = root.querySelector('.ft-module-cb[value="sections"]');
          if (sectionsInput) sectionsInput.checked = state.extraSections > 0;
          refresh();
        });
      }

      if (dom.sectionsPlus) {
        dom.sectionsPlus.addEventListener('click', function() {
          state.modules.sections = true;
          state.extraSections = Math.min(30, state.extraSections + 1);
          var sectionsInput = root.querySelector('.ft-module-cb[value="sections"]');
          if (sectionsInput) sectionsInput.checked = true;
          refresh();
        });
      }

      dom.paymentModeRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
          state.paymentMode = radio.value || 'liquidacion';
          refresh();
        });
      });

      if (dom.applyCouponBtn) dom.applyCouponBtn.addEventListener('click', applyFastTrackCoupon);

      dom.luminaSuggestBtn.addEventListener('click', requestLuminaSuggestion);
      dom.payStripeBtn.addEventListener('click', createStripePayment);
      dom.payMPBtn.addEventListener('click', createMercadoPagoPayment);
      dom.simulateSuccessBtn.addEventListener('click', showOnboarding);

      dom.actionButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          handleActionClick(btn.getAttribute('data-ft-action'));
        });
      });
    }

    renderPriceLabels();
    refresh();
    bindEvents();
    initLuminaDictation();
  })();


