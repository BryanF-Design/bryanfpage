(function () {
  'use strict';

  var API_BASE = String(window.PAYMENTS_API_BASE || '').replace(/\/$/, '');
  var WA_PHONE = '525663012505';
  var PRICES = {
    plans: { full: 3500, update: 1800, maintenance: 1000 },
    extras: { ecommerce: 3500, payments: 1500, maintenance: 1000, sections: 350 }
  };
  var SECTION_OPTIONS = [
    'Inicio', 'Servicios', 'Contacto', 'Nosotros', 'Portafolio', 'Testimonios', 'FAQ', 'Blog', 'Reservas', 'Tienda'
  ];
  var COPY = {
    es: {
      navBack: 'Volver',
      kicker: 'Experiencia guiada',
      title: 'Crea tu web personalizada sin hacerlo tedioso.',
      subtitle: 'Responde paso por paso, Lumina te orienta y al final recibes una configuracion clara con pago seguro.',
      step1Eyebrow: 'Primero lo importante',
      step1Title: 'Que tipo de proyecto necesitas?',
      step1Copy: 'Elige la base. Puedes ajustar extras y pago al final.',
      planFullBadge: 'Web nueva',
      planFullTitle: 'Desarrollo Base Optimizado',
      planFullCopy: 'Dominio, hosting, correos, diseno personalizado y 3 secciones.',
      planUpdateBadge: 'Actualizar',
      planUpdateTitle: 'Mejorar mi sitio actual',
      planUpdateCopy: 'Ajustes visuales, contenido y rendimiento sin rehacer todo.',
      planMaintBadge: 'Soporte',
      planMaintTitle: 'Mantenimiento mensual',
      planMaintCopy: 'Respaldos, correcciones, monitoreo y soporte tecnico.',
      step2Eyebrow: 'Estructura',
      step2Title: 'Que secciones quieres incluir?',
      step2Copy: 'El plan base incluye 3 secciones. Las adicionales se calculan automaticamente.',
      manualSectionsTitle: 'Secciones especiales extra',
      manualSectionsCopy: 'Para areas como reservas, cursos, directorios o layouts muy especificos.',
      step3Eyebrow: 'Potenciadores',
      step3Title: 'Que extras harian mas fuerte tu web?',
      step3Copy: 'Lumina te deja una recomendacion breve para que no elijas a ciegas.',
      extraEcommerce: 'E-commerce / tienda online',
      extraEcommerceCopy: 'Catalogo, carrito y flujo comercial.',
      extraPayments: 'Pasarelas de pago directo',
      extraPaymentsCopy: 'Stripe, Mercado Pago o pagos directos segun alcance.',
      extraMaintenance: 'Mantenimiento especializado',
      extraMaintenanceCopy: 'Soporte, estabilidad y mejoras continuas.',
      luminaSuggest: 'Que recomienda Lumina?',
      luminaPromptLabel: 'Dile a Lumina que necesitas',
      luminaPromptPh: 'Ej. Quiero una tienda con pagos, catalogo y seccion de contacto',
      luminaMic: 'Dictar',
      luminaStop: 'Detener',
      luminaApply: 'Configurar',
      luminaApplied: 'Listo: Lumina preparo una configuracion inicial segun tu idea. Puedes ajustarla cuando quieras.',
      luminaListening: 'Te escucho. Dicta tu idea y preparo una configuracion base.',
      luminaNoSpeech: 'Tu navegador no permite dictado aqui, pero puedes escribirle a Lumina.',
      step4Eyebrow: 'Tu idea',
      step4Title: 'Cuentame lo minimo para aterrizarlo.',
      step4Copy: 'Solo pedimos lo necesario para que la confirmacion tenga contexto.',
      fieldName: 'Nombre completo *',
      fieldBusiness: 'Nombre del negocio *',
      fieldPhone: 'WhatsApp *',
      fieldEmail: 'Correo',
      fieldServices: 'Productos o servicios principales',
      fieldBrief: 'Describe tu proyecto en una frase',
      step5Eyebrow: 'Pago',
      step5Title: 'Como prefieres iniciar?',
      step5Copy: 'Puedes liquidar todo o arrancar con anticipo del 50%.',
      payFull: 'Pagar servicio completo',
      payHalf: 'Pagar 50% de anticipo',
      couponLabel: 'Cupon opcional',
      step6Eyebrow: 'Confirmacion',
      step6Title: 'Tu configuracion esta lista.',
      step6Copy: 'Revisa el resumen y elige como quieres continuar.',
      payMercado: 'Pagar con Mercado Pago',
      payStripe: 'Pagar con Stripe',
      payTransfer: 'Pagar por transferencia',
      transferTitle: 'Transferencia BBVA',
      copyTransfer: 'Copiar datos',
      submitBrief: 'Enviar briefing y abrir WhatsApp',
      prev: 'Anterior',
      next: 'Siguiente',
      finish: 'Confirmar',
      liveSummary: 'Resumen en vivo',
      payNow: 'Pago ahora',
      showcaseLabel: 'Referencias reales',
      helpFloat: 'Ayuda personalizada',
      progress: 'Paso {current} de {total}',
      concept: 'Concepto',
      base: 'Base',
      sections: 'Secciones',
      extras: 'Extras',
      paymentMode: 'Modalidad',
      projectTotal: 'Total proyecto',
      couponApplied: 'Cupon aplicado correctamente.',
      couponInvalid: 'Cupon invalido.',
      paymentOpening: 'Preparando checkout...',
      mpReady: 'Mercado Pago listo. Se abrio el checkout.',
      stripeReady: 'Stripe listo. Se abrio el checkout.',
      paymentError: 'Error de pago: ',
      transferReady: 'Transferencia seleccionada. Envia tu comprobante para validar el pago.',
      copied: 'Datos copiados.',
      copyFail: 'No se pudo copiar.',
      required: 'Completa nombre, negocio y WhatsApp para continuar.',
      sending: 'Enviando briefing...',
      sent: 'Briefing enviado. Tambien abrimos WhatsApp para darle seguimiento.',
      sendFallback: 'No se pudo enviar el briefing ahora. Abrimos WhatsApp para continuar.',
      lumina0: 'Empezamos con una web base potente. Despues ajustamos secciones, extras y forma de pago.',
      lumina1: 'Tres secciones suelen bastar para una landing fuerte; agrega mas si necesitas explicar servicios, mostrar pruebas o vender.',
      lumina2: 'Si vendes productos, e-commerce y pagos directos van juntos. Para sitios informativos, mantenimiento suele dar mas valor.',
      lumina3: 'Con nombre, negocio y WhatsApp ya podemos iniciar. Los detalles extra afinan la propuesta.',
      lumina4: 'El anticipo del 50% ayuda a arrancar sin friccion; el pago completo deja cerrado el inicio.',
      lumina5: 'Revisa que el resumen refleje tu idea. Si algo no cuadra, puedes volver y ajustarlo.'
    },
    en: {
      navBack: 'Back',
      kicker: 'Guided experience',
      title: 'Create your custom website without the drag.',
      subtitle: 'Answer step by step, Lumina guides you, and you finish with a clear setup and secure payment.',
      step1Eyebrow: 'Start here',
      step1Title: 'What kind of project do you need?',
      step1Copy: 'Choose the base. Extras and payment can be adjusted at the end.',
      planFullBadge: 'New website',
      planFullTitle: 'Optimized Base Build',
      planFullCopy: 'Domain, hosting, email accounts, custom design, and 3 sections.',
      planUpdateBadge: 'Update',
      planUpdateTitle: 'Improve my current site',
      planUpdateCopy: 'Visual, content, and performance improvements without rebuilding.',
      planMaintBadge: 'Support',
      planMaintTitle: 'Monthly maintenance',
      planMaintCopy: 'Backups, fixes, monitoring, and technical support.',
      step2Eyebrow: 'Structure',
      step2Title: 'Which sections do you want?',
      step2Copy: 'The base plan includes 3 sections. Additional sections are calculated automatically.',
      manualSectionsTitle: 'Special extra sections',
      manualSectionsCopy: 'For bookings, courses, directories, or very specific layouts.',
      step3Eyebrow: 'Boosters',
      step3Title: 'Which extras would strengthen your site?',
      step3Copy: 'Lumina gives you a short recommendation so you do not choose blindly.',
      extraEcommerce: 'E-commerce / online store',
      extraEcommerceCopy: 'Catalog, cart, and commercial flow.',
      extraPayments: 'Direct payment gateways',
      extraPaymentsCopy: 'Stripe, Mercado Pago, or direct payments depending on scope.',
      extraMaintenance: 'Specialized maintenance',
      extraMaintenanceCopy: 'Support, stability, and continuous improvements.',
      luminaSuggest: 'What does Lumina recommend?',
      luminaPromptLabel: 'Tell Lumina what you need',
      luminaPromptPh: 'Ex. I need an online store with payments, catalog, and contact section',
      luminaMic: 'Dictate',
      luminaStop: 'Stop',
      luminaApply: 'Configure',
      luminaApplied: 'Done: Lumina prepared a starting setup based on your idea. You can adjust it anytime.',
      luminaListening: 'I am listening. Dictate your idea and I will prepare a base setup.',
      luminaNoSpeech: 'Your browser does not allow dictation here, but you can type to Lumina.',
      step4Eyebrow: 'Your idea',
      step4Title: 'Tell me the minimum to ground it.',
      step4Copy: 'We only ask what is needed so the final confirmation has context.',
      fieldName: 'Full name *',
      fieldBusiness: 'Business name *',
      fieldPhone: 'WhatsApp *',
      fieldEmail: 'Email',
      fieldServices: 'Main products or services',
      fieldBrief: 'Describe your project in one sentence',
      step5Eyebrow: 'Payment',
      step5Title: 'How would you like to start?',
      step5Copy: 'You can pay in full or start with a 50% deposit.',
      payFull: 'Pay full service',
      payHalf: 'Pay 50% deposit',
      couponLabel: 'Optional coupon',
      step6Eyebrow: 'Confirmation',
      step6Title: 'Your setup is ready.',
      step6Copy: 'Review the summary and choose how to continue.',
      payMercado: 'Pay with Mercado Pago',
      payStripe: 'Pay with Stripe',
      payTransfer: 'Pay by bank transfer',
      transferTitle: 'BBVA bank transfer',
      copyTransfer: 'Copy details',
      submitBrief: 'Send brief and open WhatsApp',
      prev: 'Previous',
      next: 'Next',
      finish: 'Confirm',
      liveSummary: 'Live summary',
      payNow: 'Pay now',
      showcaseLabel: 'Real references',
      helpFloat: 'Personalized help',
      progress: 'Step {current} of {total}',
      concept: 'Concept',
      base: 'Base',
      sections: 'Sections',
      extras: 'Extras',
      paymentMode: 'Payment',
      projectTotal: 'Project total',
      couponApplied: 'Coupon applied.',
      couponInvalid: 'Invalid coupon.',
      paymentOpening: 'Preparing checkout...',
      mpReady: 'Mercado Pago ready. Checkout opened.',
      stripeReady: 'Stripe ready. Checkout opened.',
      paymentError: 'Payment error: ',
      transferReady: 'Bank transfer selected. Send your receipt to validate payment.',
      copied: 'Details copied.',
      copyFail: 'Could not copy.',
      required: 'Complete name, business, and WhatsApp to continue.',
      sending: 'Sending brief...',
      sent: 'Brief sent. WhatsApp also opened for follow-up.',
      sendFallback: 'Could not send the brief now. WhatsApp opened to continue.',
      lumina0: 'We start with a strong base website. Then we adjust sections, extras, and payment.',
      lumina1: 'Three sections are often enough for a strong landing page; add more when you need proof, services, or sales detail.',
      lumina2: 'If you sell products, e-commerce and direct payments usually belong together. For informational sites, maintenance often adds more value.',
      lumina3: 'With name, business, and WhatsApp we can start. Extra details sharpen the proposal.',
      lumina4: 'A 50% deposit helps start smoothly; full payment closes the kickoff immediately.',
      lumina5: 'Check that the summary reflects your idea. If something feels off, go back and adjust it.'
    }
  };

  var state = {
    step: 0,
    lang: localStorage.getItem('bd-create-lang') || 'es',
    plan: 'full',
    sections: ['Inicio', 'Servicios', 'Contacto'],
    manualSections: 0,
    extras: { ecommerce: false, payments: false, maintenance: false },
    paymentMode: 'liquidacion',
    coupon: { code: '', discountType: null, discountValue: 0 },
    payment: null
  };

  var dom = {
    steps: Array.from(document.querySelectorAll('.cw-step')),
    progressText: document.getElementById('cwProgressText'),
    progressBar: document.getElementById('cwProgressBar'),
    prev: document.getElementById('cwPrev'),
    next: document.getElementById('cwNext'),
    sectionsGrid: document.getElementById('cwSectionsGrid'),
    sectionsMinus: document.getElementById('cwSectionsMinus'),
    sectionsPlus: document.getElementById('cwSectionsPlus'),
    manualSectionsCount: document.getElementById('cwManualSectionsCount'),
    summaryRows: document.getElementById('cwSummaryRows'),
    finalSummary: document.getElementById('cwFinalSummary'),
    payNow: document.getElementById('cwPayNow'),
    luminaMessage: document.getElementById('cwLuminaMessage'),
    couponCode: document.getElementById('cwCouponCode'),
    couponStatus: document.getElementById('cwCouponStatus'),
    paymentStatus: document.getElementById('cwPaymentStatus'),
    transferBox: document.getElementById('cwTransferBox'),
    helpFloat: document.getElementById('cwHelpFloat'),
    form: document.getElementById('cwWizardForm'),
    shots: Array.from(document.querySelectorAll('.cw-shot')),
    luminaPrompt: document.getElementById('cwLuminaPrompt'),
    luminaMic: document.getElementById('cwLuminaMic'),
    luminaApply: document.getElementById('cwLuminaApply')
  };
  var speechState = {
    recognition: null,
    isRecording: false
  };

  function copy(key) {
    return (COPY[state.lang] && COPY[state.lang][key]) || COPY.es[key] || key;
  }

  function apiUrl(path) {
    return API_BASE ? API_BASE + path : path;
  }

  function money(value) {
    return new Intl.NumberFormat(state.lang === 'en' ? 'en-US' : 'es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value || 0) + ' MXN';
  }

  function selectedSectionsExtraCount() {
    return Math.max(0, state.sections.length - 3) + state.manualSections;
  }

  function getPlanLabel() {
    if (state.plan === 'update') return copy('planUpdateTitle');
    if (state.plan === 'maintenance') return copy('planMaintTitle');
    return copy('planFullTitle');
  }

  function getItems() {
    var items = [{ label: copy('base'), source: getPlanLabel(), price: PRICES.plans[state.plan] || 0 }];
    var extraSections = selectedSectionsExtraCount();
    if (extraSections > 0) {
      items.push({ label: copy('sections'), source: 'Secciones adicionales x' + extraSections, price: extraSections * PRICES.extras.sections });
    }
    if (state.extras.ecommerce) items.push({ label: copy('extras'), source: copy('extraEcommerce'), price: PRICES.extras.ecommerce });
    if (state.extras.payments) items.push({ label: copy('extras'), source: copy('extraPayments'), price: PRICES.extras.payments });
    if (state.extras.maintenance) items.push({ label: copy('extras'), source: copy('extraMaintenance'), price: PRICES.extras.maintenance });
    return items;
  }

  function getTotals() {
    var subtotal = getItems().reduce(function (sum, item) { return sum + item.price; }, 0);
    var total = subtotal;
    if (state.coupon.discountValue > 0) {
      if (state.coupon.discountType === 'percent') total = subtotal - (subtotal * (state.coupon.discountValue / 100));
      if (state.coupon.discountType === 'fixed') total = subtotal - state.coupon.discountValue;
    }
    total = Math.max(0, Math.round(total));
    return {
      projectTotal: total,
      payableNow: state.paymentMode === 'anticipo' ? Math.round(total * 0.5) : total
    };
  }

  function getFormData() {
    return new FormData(dom.form);
  }

  function getPaymentPayload() {
    var items = getItems();
    var modules = items.slice(1).map(function (item) { return item.source; });
    return {
      monto: getTotals().projectTotal,
      modalidad: state.paymentMode,
      descripcion: 'Configura tu Proyecto Web - ' + getPlanLabel() + (modules.length ? ' + ' + modules.join(', ') : ''),
      metadata: {
        flow: 'guided-create-web',
        service: getPlanLabel(),
        modules: modules.join(', ') || 'none',
        sections: state.sections.join(', '),
        extra_sections: String(selectedSectionsExtraCount()),
        coupon: state.coupon.code || 'none'
      }
    };
  }

  function buildWhatsAppText(action) {
    var formData = getFormData();
    var totals = getTotals();
    var lines = [
      '*CREAR WEB PERSONALIZADA - BRYANF DESIGN*',
      '',
      '*Accion:* ' + (action || 'Ayuda personalizada'),
      '*Servicio:* ' + getPlanLabel(),
      '*Secciones:* ' + state.sections.join(', '),
      '*Extras:* ' + (getItems().slice(1).map(function (item) { return item.source; }).join(', ') || 'Sin extras'),
      '*Modalidad:* ' + (state.paymentMode === 'anticipo' ? '50% anticipo' : 'Pago completo'),
      '*Total proyecto:* ' + money(totals.projectTotal),
      '*Pago ahora:* ' + money(totals.payableNow),
      '*Cupon:* ' + (state.coupon.code || 'Sin cupon'),
      '',
      '*Nombre:* ' + (formData.get('fullName') || 'Sin definir'),
      '*Negocio:* ' + (formData.get('businessName') || 'Sin definir'),
      '*WhatsApp:* ' + (formData.get('contactPhone') || 'Sin definir'),
      '*Correo:* ' + (formData.get('contactEmail') || 'Sin definir'),
      '*Productos/servicios:* ' + (formData.get('services') || 'Sin definir'),
      '*Idea:* ' + (formData.get('projectBrief') || 'Sin definir')
    ];
    if (state.payment) lines.push('', '*Pago:* ' + state.payment.method);
    return lines.join('\n');
  }

  function validateContactStep() {
    var data = getFormData();
    return Boolean(String(data.get('fullName') || '').trim() && String(data.get('businessName') || '').trim() && String(data.get('contactPhone') || '').trim());
  }

  function setLanguage(lang) {
    state.lang = lang === 'en' ? 'en' : 'es';
    localStorage.setItem('bd-create-lang', state.lang);
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = copy(node.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (node) {
      node.setAttribute('placeholder', copy(node.getAttribute('data-i18n-ph')));
    });
    document.querySelectorAll('.cw-lang__btn').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-cw-lang') === state.lang);
    });
    renderSections();
    renderAll();
  }

  function renderSections() {
    dom.sectionsGrid.innerHTML = SECTION_OPTIONS.map(function (name) {
      var selected = state.sections.indexOf(name) > -1;
      return '<button type="button" class="cw-section' + (selected ? ' is-selected' : '') + '" data-section="' + name + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' + name + '</button>';
    }).join('');
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function addSection(list, sectionName) {
    if (list.indexOf(sectionName) === -1) list.push(sectionName);
  }

  function syncChoiceControls() {
    document.querySelectorAll('[data-choice-group="plan"]').forEach(function (item) {
      var selected = item.getAttribute('data-value') === state.plan;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    document.querySelectorAll('.cw-toggle input').forEach(function (input) {
      input.checked = Boolean(state.extras[input.value]);
    });
    document.querySelectorAll('input[name="paymentMode"]').forEach(function (input) {
      input.checked = input.value === state.paymentMode;
    });
  }

  function applyLuminaConfiguration() {
    var prompt = dom.luminaPrompt ? dom.luminaPrompt.value : '';
    var text = normalizeText(prompt);
    var sections = ['Inicio', 'Servicios', 'Contacto'];
    var extras = { ecommerce: false, payments: false, maintenance: false };
    var plan = 'full';

    if (/(actualizar|redisen|mejorar|optimizar|ya tengo|sitio actual|update|improve|redesign)/.test(text)) {
      plan = 'update';
    }
    if (/(mantenimiento|soporte|mensual|cuidar|actualizaciones|maintenance|support)/.test(text) && !/(tienda|ecommerce|web nueva|landing|catalogo|store|shop)/.test(text)) {
      plan = 'maintenance';
    }
    if (/(tienda|ecommerce|e-commerce|catalogo|productos|carrito|vender online|shop|store|cart|catalog)/.test(text)) {
      plan = plan === 'maintenance' ? 'full' : plan;
      addSection(sections, 'Tienda');
      extras.ecommerce = true;
      extras.payments = true;
    }
    if (/(pago|pagos|stripe|mercado pago|pasarela|checkout|deposito|payment)/.test(text)) {
      extras.payments = true;
    }
    if (/(reserva|reservas|citas|agenda|booking|appointment)/.test(text)) {
      addSection(sections, 'Reservas');
      extras.payments = true;
    }
    if (/(blog|noticias|contenido|articles|news)/.test(text)) addSection(sections, 'Blog');
    if (/(portafolio|galeria|proyectos|trabajos|portfolio|gallery|projects)/.test(text)) addSection(sections, 'Portafolio');
    if (/(faq|preguntas|dudas|questions)/.test(text)) addSection(sections, 'FAQ');
    if (/(nosotros|equipo|historia|about|team)/.test(text)) addSection(sections, 'Nosotros');
    if (/(seo|mantenimiento|performance|velocidad|seguridad|support|speed|security)/.test(text) && plan !== 'maintenance') {
      extras.maintenance = true;
    }
    if (/(landing|captar leads|leads|contacto|whatsapp)/.test(text) && !extras.ecommerce) {
      plan = plan === 'maintenance' ? 'full' : plan;
    }

    state.plan = plan;
    state.sections = sections;
    state.manualSections = /(muchas secciones|varias secciones|multi pagina|multipagina|many pages|multiple pages)/.test(text) ? 2 : 0;
    state.extras = extras;
    state.paymentMode = /(anticipo|50|mitad|deposit|half)/.test(text) ? 'anticipo' : state.paymentMode;

    var briefField = document.querySelector('textarea[name="projectBrief"]');
    if (briefField && prompt.trim() && !briefField.value.trim()) briefField.value = prompt.trim();
    var servicesField = document.querySelector('textarea[name="services"]');
    if (servicesField && !servicesField.value.trim()) {
      if (extras.ecommerce) servicesField.value = state.lang === 'en' ? 'Online products or catalog' : 'Productos o catalogo en linea';
      else if (plan === 'maintenance') servicesField.value = state.lang === 'en' ? 'Website support and maintenance' : 'Soporte y mantenimiento web';
    }

    syncChoiceControls();
    renderSections();
    renderAll();
    dom.luminaMessage.textContent = copy('luminaApplied');
  }

  function renderSummaryRows(target) {
    var rows = getItems().map(function (item) {
      return '<div class="cw-summary-row"><span>' + item.label + '<br><strong>' + item.source + '</strong></span><b>' + money(item.price) + '</b></div>';
    });
    var totals = getTotals();
    rows.push('<div class="cw-summary-row"><span>' + copy('paymentMode') + '<br><strong>' + (state.paymentMode === 'anticipo' ? copy('payHalf') : copy('payFull')) + '</strong></span><b>' + money(totals.payableNow) + '</b></div>');
    rows.push('<div class="cw-summary-row"><span>' + copy('projectTotal') + '</span><b>' + money(totals.projectTotal) + '</b></div>');
    target.innerHTML = rows.join('');
  }

  function renderAll() {
    var totalSteps = dom.steps.length;
    dom.steps.forEach(function (step, index) {
      step.classList.toggle('is-active', index === state.step);
    });
    dom.progressText.textContent = copy('progress').replace('{current}', String(state.step + 1)).replace('{total}', String(totalSteps));
    dom.progressBar.style.width = (((state.step + 1) / totalSteps) * 100) + '%';
    dom.prev.disabled = state.step === 0;
    dom.next.hidden = state.step === totalSteps - 1;
    dom.next.textContent = copy('next');
    dom.manualSectionsCount.textContent = String(state.manualSections);
    renderSummaryRows(dom.summaryRows);
    renderSummaryRows(dom.finalSummary);
    var totals = getTotals();
    dom.payNow.textContent = money(totals.payableNow);
    
    var payFullLabel = document.querySelector('input[value="liquidacion"] + span');
    var payHalfLabel = document.querySelector('input[value="anticipo"] + span');
    if (payFullLabel) payFullLabel.textContent = copy('payFull') + ' (' + money(totals.projectTotal) + ')';
    if (payHalfLabel) payHalfLabel.textContent = copy('payHalf') + ' (' + money(Math.round(totals.projectTotal * 0.5)) + ')';

    dom.luminaMessage.textContent = copy('lumina' + state.step);
    dom.helpFloat.href = 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(buildWhatsAppText('Ayuda personalizada'));
    dom.shots.forEach(function (shot, index) {
      shot.classList.toggle('is-active', index === (state.step % dom.shots.length));
    });
    if (state.step !== 5 && dom.transferBox) dom.transferBox.hidden = true;
  }

  function goToStep(step) {
    state.step = Math.max(0, Math.min(dom.steps.length - 1, step));
    renderAll();
  }

  function applyCoupon() {
    var code = String(dom.couponCode.value || '').trim().toUpperCase();
    state.coupon = { code: '', discountType: null, discountValue: 0 };
    if (!code) {
      dom.couponStatus.textContent = '';
      renderAll();
      return;
    }
    if (code === 'BRYANF10') {
      state.coupon = { code: code, discountType: 'percent', discountValue: 10 };
      dom.couponStatus.textContent = copy('couponApplied');
      dom.couponStatus.style.color = '#b4e332';
    } else if (code === 'DISENO500' || code === 'DISEÑO500') {
      state.coupon = { code: code, discountType: 'fixed', discountValue: 500 };
      dom.couponStatus.textContent = copy('couponApplied');
      dom.couponStatus.style.color = '#b4e332';
    } else {
      dom.couponStatus.textContent = copy('couponInvalid');
      dom.couponStatus.style.color = '#ff7b7b';
    }
    renderAll();
  }

  async function requestPayment(endpoint, method) {
    dom.paymentStatus.textContent = copy('paymentOpening');
    dom.paymentStatus.style.color = '#d4d8d0';
    try {
      var response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPaymentPayload())
      });
      var data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Error');
      if (method === 'mercado_pago' && data.initPoint) { window.open(data.initPoint, '_blank', 'noopener,noreferrer'); }
      if (method === 'stripe' && data.checkoutUrl) { window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer'); }
      state.payment = { method: method, amount: data.amount || getTotals().payableNow, reference: data.preferenceId || data.checkoutUrl || '' };
      dom.paymentStatus.textContent = method === 'mercado_pago' ? copy('mpReady') : copy('stripeReady');
      dom.paymentStatus.style.color = '#b4e332';
      // Redirect to gracias page after short delay
      setTimeout(function() { window.location.href = '/gracias?source=' + method; }, 2500);
    } catch (err) {
      dom.paymentStatus.textContent = copy('paymentError') + err.message;
      dom.paymentStatus.style.color = '#ff7b7b';
    }
  }

  async function submitBrief() {
    if (!validateContactStep()) {
      dom.paymentStatus.textContent = copy('required');
      dom.paymentStatus.style.color = '#ff7b7b';
      goToStep(3);
      return;
    }

    var formData = getFormData();
    var payload = {
      action: 'guided-submit',
      source: 'guided-create-web',
      summaryItems: getItems(),
      totals: getTotals(),
      paymentMode: state.paymentMode,
      payment: state.payment || { method: 'pendiente' },
      coupon: state.coupon,
      form: {
        fullName: String(formData.get('fullName') || '').trim(),
        businessName: String(formData.get('businessName') || '').trim(),
        contactPhone: String(formData.get('contactPhone') || '').trim(),
        contactEmail: String(formData.get('contactEmail') || '').trim(),
        services: String(formData.get('services') || '').trim(),
        projectBrief: String(formData.get('projectBrief') || '').trim(),
        mainGoal: 'Configuracion guiada: ' + state.sections.join(', '),
        references: 'Referencias de portfolio BryanF'
      },
      attachments: []
    };

    dom.paymentStatus.textContent = copy('sending');
    dom.paymentStatus.style.color = '#d4d8d0';
    try {
      var response = await fetch(apiUrl('/api/onboarding-submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Error');
      dom.paymentStatus.textContent = copy('sent');
      dom.paymentStatus.style.color = '#b4e332';
    } catch (_err) {
      dom.paymentStatus.textContent = copy('sendFallback');
      dom.paymentStatus.style.color = '#ffcc66';
    }
    window.open('https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(buildWhatsAppText('Enviar briefing')), '_blank', 'noopener,noreferrer');
  }

  function bindEvents() {
    document.querySelectorAll('[data-cw-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLanguage(btn.getAttribute('data-cw-lang')); });
    });

    document.querySelectorAll('[data-choice-group="plan"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.plan = btn.getAttribute('data-value') || 'full';
        document.querySelectorAll('[data-choice-group="plan"]').forEach(function (item) {
          var selected = item === btn;
          item.classList.toggle('is-selected', selected);
          item.setAttribute('aria-pressed', selected ? 'true' : 'false');
        });
        renderAll();
      });
    });

    dom.sectionsGrid.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-section]');
      if (!btn) return;
      var section = btn.getAttribute('data-section');
      var idx = state.sections.indexOf(section);
      if (idx > -1 && state.sections.length > 1) state.sections.splice(idx, 1);
      if (idx === -1) state.sections.push(section);
      renderSections();
      renderAll();
    });

    dom.sectionsMinus.addEventListener('click', function () {
      state.manualSections = Math.max(0, state.manualSections - 1);
      renderAll();
    });
    dom.sectionsPlus.addEventListener('click', function () {
      state.manualSections = Math.min(30, state.manualSections + 1);
      renderAll();
    });

    document.querySelectorAll('.cw-toggle input').forEach(function (input) {
      input.addEventListener('change', function () {
        state.extras[input.value] = input.checked;
        renderAll();
      });
    });

    document.querySelectorAll('input[name="paymentMode"]').forEach(function (input) {
      input.addEventListener('change', function () {
        state.paymentMode = input.value === 'anticipo' ? 'anticipo' : 'liquidacion';
        renderAll();
      });
    });

    dom.couponCode.addEventListener('change', applyCoupon);
    dom.couponCode.addEventListener('blur', applyCoupon);

    document.getElementById('cwLuminaSuggest').addEventListener('click', function () {
      if (state.sections.indexOf('Tienda') > -1 || state.sections.indexOf('Reservas') > -1) {
        state.extras.payments = true;
      }
      if (state.sections.indexOf('Tienda') > -1) {
        state.extras.ecommerce = true;
      }
      if (state.plan !== 'maintenance') {
        state.extras.maintenance = true;
      }
      document.querySelectorAll('.cw-toggle input').forEach(function (input) {
        input.checked = Boolean(state.extras[input.value]);
      });
      dom.luminaMessage.textContent = copy('lumina2');
      renderAll();
    });
    if (dom.luminaApply) dom.luminaApply.addEventListener('click', applyLuminaConfiguration);

    dom.prev.addEventListener('click', function () { goToStep(state.step - 1); });
    dom.next.addEventListener('click', function () {
      if (state.step === 3 && !validateContactStep()) {
        var firstInvalid = dom.form.querySelector('[required]:invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (state.step === 4) applyCoupon();
      if (state.step < dom.steps.length - 1) goToStep(state.step + 1);
    });

    document.getElementById('cwPayMP').addEventListener('click', function () {
      requestPayment('/api/mercadopago', 'mercado_pago');
    });
    document.getElementById('cwPayStripe').addEventListener('click', function () {
      requestPayment('/api/stripe-checkout', 'stripe');
    });
    document.getElementById('cwPayTransfer').addEventListener('click', function () {
      dom.transferBox.hidden = false;
      state.payment = { method: 'transferencia_bbva', amount: getTotals().payableNow };
      dom.paymentStatus.textContent = copy('transferReady');
      dom.paymentStatus.style.color = '#b4e332';
      renderAll();
      dom.transferBox.hidden = false;
    });
    document.getElementById('cwCopyTransfer').addEventListener('click', async function () {
      var text = 'Banco: BBVA Bancomer\nTitular: Bryan Fernando Lopez Lopez\nCuenta: 1534366643\nCLABE: 012180015343666431\nSWIFT: BCMRMXMMPYM';
      try {
        await navigator.clipboard.writeText(text);
        dom.paymentStatus.textContent = copy('copied');
        dom.paymentStatus.style.color = '#b4e332';
      } catch (_err) {
        dom.paymentStatus.textContent = copy('copyFail');
        dom.paymentStatus.style.color = '#ff7b7b';
      }
    });
    document.getElementById('cwSubmitBrief').addEventListener('click', submitBrief);

    dom.form.addEventListener('input', renderAll);
  }

  function initLuminaSpeech() {
    if (!dom.luminaMic || !dom.luminaPrompt) return;
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      dom.luminaMic.addEventListener('click', function () {
        dom.luminaMessage.textContent = copy('luminaNoSpeech');
        dom.luminaPrompt.focus();
      });
      return;
    }

    speechState.recognition = new SpeechRecognition();
    speechState.recognition.lang = state.lang === 'en' ? 'en-US' : 'es-MX';
    speechState.recognition.continuous = false;
    speechState.recognition.interimResults = false;

    speechState.recognition.onstart = function () {
      speechState.isRecording = true;
      dom.luminaMic.classList.add('is-recording');
      dom.luminaMic.querySelector('span').textContent = copy('luminaStop');
      dom.luminaMessage.textContent = copy('luminaListening');
    };

    speechState.recognition.onresult = function (event) {
      var transcript = event && event.results && event.results[0] && event.results[0][0]
        ? event.results[0][0].transcript
        : '';
      if (!transcript) return;
      var previous = String(dom.luminaPrompt.value || '').trim();
      dom.luminaPrompt.value = (previous ? previous + ' ' : '') + transcript;
      applyLuminaConfiguration();
    };

    speechState.recognition.onerror = function () {
      dom.luminaMessage.textContent = copy('luminaNoSpeech');
    };

    speechState.recognition.onend = function () {
      speechState.isRecording = false;
      dom.luminaMic.classList.remove('is-recording');
      dom.luminaMic.querySelector('span').textContent = copy('luminaMic');
    };

    dom.luminaMic.addEventListener('click', function () {
      if (speechState.isRecording) {
        speechState.recognition.stop();
        return;
      }
      speechState.recognition.lang = state.lang === 'en' ? 'en-US' : 'es-MX';
      speechState.recognition.start();
    });
  }

  renderSections();
  bindEvents();
  initLuminaSpeech();
  setLanguage(state.lang);
})();


