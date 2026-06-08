/**
 * script.js – BryanF Design
 * Vanilla JS – No dependencies required
 * Production-ready for cPanel / static hosting
 */

(function () {
  'use strict';
  var ACTIVE_COUPONS = (window.ACTIVE_COUPONS && typeof window.ACTIVE_COUPONS === 'object') ? window.ACTIVE_COUPONS : {};
  window.dataLayer = window.dataLayer || [];

  function trackEvent(name, payload) {
    try {
      window.dataLayer.push(Object.assign({ event: name }, payload || {}));
    } catch (_err) {}
  }

  trackEvent('page_view', { page_path: window.location.pathname, page_title: document.title });

  /* ============================================================
     1. PRELOADER
     ============================================================ */
  (function initPreloader() {
    const el = document.getElementById('preloader');
    if (!el) return;
    var isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      el.classList.add('hidden');
      sessionStorage.setItem('bd-preloader-seen', '1');
      return;
    }

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
     2. IMAGE LOADING HINTS (performance)
     ============================================================ */
  (function initImagePerfHints() {
    var lazyTargets = document.querySelectorAll('main img, footer img, #aboutOverlay img');
    lazyTargets.forEach(function (img) {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });

    document.querySelectorAll('img').forEach(function (img) {
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (img.getAttribute('loading') === 'lazy' && !img.hasAttribute('fetchpriority')) {
        img.setAttribute('fetchpriority', 'low');
      }
    });

    var navbarLogo = document.querySelector('.navbar__logo img');
    if (navbarLogo) {
      navbarLogo.setAttribute('loading', 'eager');
      navbarLogo.setAttribute('fetchpriority', 'high');
      navbarLogo.setAttribute('decoding', 'sync');
    }
  })();

  /* ============================================================
     19. PRODUCTION POLISH OVERRIDES
     ============================================================ */
  (function initProductionPolish() {
    var root = document.getElementById('fast-track-section');
    if (!root) return;
    window.__FT_PRODUCTION_POLISH_ACTIVE = true;

    var API_BASE = String(window.PAYMENTS_API_BASE || '').replace(/\/$/, '');
    var WA_PHONE = '525663012505';
    var ORIGINAL_FASTTRACK_PRICES = {
      ecommerce: 3500,
      payments: 1500,
      sections: 350,
      maintenance: 1000
    };
    var ACTIVE = (window.ACTIVE_COUPONS && typeof window.ACTIVE_COUPONS === 'object') ? window.ACTIVE_COUPONS : {};
    var state = { coupon: { code: '', discountType: null, discountValue: 0 }, payment: null };

    var dom = {
      payStripeBtn: document.getElementById('ftPayStripeBtn'),
      payMPBtn: document.getElementById('ftPayMPBtn'),
      payTransferBtn: document.getElementById('ftPayTransferBtn'),
      moduleInputs: root.querySelectorAll('.ft-module-cb'),
      planButtons: root.querySelectorAll('.ft-plan[data-ft-plan]'),
      sectionsMinus: document.getElementById('ftSectionsMinus'),
      sectionsPlus: document.getElementById('ftSectionsPlus'),
      sectionsCount: document.getElementById('ftSectionsCount'),
      paymentModeRadios: root.querySelectorAll('input[name="ftPaymentMode"]'),
      total: document.getElementById('ftTotal'),
      summaryRows: document.getElementById('ftSummaryRows'),
      transferCard: document.getElementById('ftTransferCard'),
      transferDoneBtn: document.getElementById('ftTransferDoneBtn'),
      transferCopyButtons: root.querySelectorAll('.ft-copy-btn[data-copy-target]'),
      copyTransferAllBtn: document.getElementById('ftCopyTransferAllBtn'),
      transferCopyFeedback: document.getElementById('ftTransferCopyFeedback'),
      payStatus: document.getElementById('ftPayStatus'),
      couponCode: document.getElementById('ftCouponCode'),
      couponMsg: document.getElementById('ftCouponMsg'),
      applyCouponBtn: document.getElementById('ftApplyCouponBtn'),
      form: document.getElementById('ftOnboardingForm'),
      actionButtons: root.querySelectorAll('[data-ft-action]'),
      formAlert: document.getElementById('ftFormAlert'),
      attachments: document.getElementById('ftAttachments'),
      configState: document.getElementById('ftStateConfig'),
      onboardingState: document.getElementById('ftStateOnboarding'),
      wizardSummary: document.getElementById('ftWizardSummary')
    };

    function apiUrl(path) { return API_BASE ? (API_BASE + path) : path; }
    function formatMXN(value) { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value || 0); }
    function t(key, fallback) {
      var lang = window.currentLang || 'es';
      if (window.LANG && window.LANG[lang] && window.LANG[lang][key] !== undefined) return window.LANG[lang][key];
      return fallback || key;
    }

    function setStatus(msg, ok) {
      if (!dom.payStatus) return;
      dom.payStatus.textContent = msg;
      dom.payStatus.style.color = ok ? '#b4e332' : '#d4d8d0';
    }

    function setFormAlert(msg, kind) {
      if (!dom.formAlert) return;
      dom.formAlert.textContent = msg || '';
      dom.formAlert.classList.remove('is-error', 'is-success', 'is-info');
      if (kind) dom.formAlert.classList.add(kind);
    }

    function renderOriginalFastTrackPrices() {
      var priceEcommerce = document.getElementById('ftPriceEcommerce');
      var pricePayments = document.getElementById('ftPricePayments');
      var priceSections = document.getElementById('ftPriceSections');
      var priceMaintenance = document.getElementById('ftPriceMaintenance');
      if (priceEcommerce) priceEcommerce.textContent = '+' + formatMXN(ORIGINAL_FASTTRACK_PRICES.ecommerce) + ' MXN';
      if (pricePayments) pricePayments.textContent = '+' + formatMXN(ORIGINAL_FASTTRACK_PRICES.payments) + ' MXN';
      if (priceSections) priceSections.textContent = '+' + formatMXN(ORIGINAL_FASTTRACK_PRICES.sections) + ' MXN c/u';
      if (priceMaintenance) priceMaintenance.textContent = '+' + formatMXN(ORIGINAL_FASTTRACK_PRICES.maintenance) + ' MXN';
    }

    function getSummaryItems() {
      var items = [];
      var activePlan = root.querySelector('.ft-plan--active') || root.querySelector('.ft-plan[data-ft-plan="full"]');
      var planName = activePlan ? (activePlan.querySelector('strong') ? activePlan.querySelector('strong').textContent.trim() : 'Servicio web') : 'Servicio web';
      var planPrice = activePlan ? parseInt(String(activePlan.querySelector('.ft-plan__price') ? activePlan.querySelector('.ft-plan__price').textContent : '0').replace(/[^\d]/g, ''), 10) : 0;
      items.push({ source: planName, price: Number.isFinite(planPrice) ? planPrice : 0 });

      root.querySelectorAll('.ft-module-cb:checked').forEach(function(input) {
        var card = input.closest('.ft-module');
        var title = card && card.querySelector('.ft-module__title') ? card.querySelector('.ft-module__title').textContent.trim() : 'Módulo';
        var priceText = card && card.querySelector('.ft-module__meta') ? card.querySelector('.ft-module__meta').textContent : '';
        var detectedPrice = parseInt(String(priceText).replace(/[^\d]/g, ''), 10) || 0;
        var price = ORIGINAL_FASTTRACK_PRICES[input.value] || detectedPrice;
        if (input.value === 'sections') {
          var extraCount = parseInt((document.getElementById('ftSectionsCount') || { textContent: '0' }).textContent || '0', 10) || 0;
          if (extraCount > 0) items.push({ source: 'Secciones adicionales x' + extraCount, price: extraCount * ORIGINAL_FASTTRACK_PRICES.sections });
        } else {
          items.push({ source: title, price: price });
        }
      });
      return items;
    }

    function getPaymentMode() {
      var selected = root.querySelector('input[name="ftPaymentMode"]:checked');
      return selected ? selected.value : 'liquidacion';
    }

    function getTotals() {
      var subtotal = getSummaryItems().reduce(function(acc, item) { return acc + item.price; }, 0);
      var projectTotal = subtotal;
      if (state.coupon.discountValue > 0) {
        if (state.coupon.discountType === 'percent') projectTotal = subtotal - (subtotal * (state.coupon.discountValue / 100));
        if (state.coupon.discountType === 'fixed') projectTotal = subtotal - state.coupon.discountValue;
      }
      projectTotal = Math.max(0, Math.round(projectTotal));
      var payableNow = getPaymentMode() === 'anticipo' ? Math.round(projectTotal * 0.5) : projectTotal;
      return { projectTotal: projectTotal, payableNow: payableNow };
    }

    function getPayload() {
      var totals = getTotals();
      var items = getSummaryItems();
      var moduleList = items.slice(1).map(function(item) { return item.source; }).join(', ');
      return {
        monto: totals.projectTotal,
        modalidad: getPaymentMode(),
        descripcion: 'Configura tu Proyecto Web - ' + (items[0] ? items[0].source : 'Servicio web'),
        metadata: {
          flow: 'fast-track',
          modules: moduleList || 'none',
          coupon: state.coupon.code || 'none'
        }
      };
    }

    function renderSummary() {
      if (!dom.total || !dom.summaryRows) return;
      var items = getSummaryItems();
      var totals = getTotals();
      dom.summaryRows.innerHTML = items.map(function(item) {
        return '<div class="ft-summary-row"><div><span>Concepto</span><br><strong>' + item.source + '</strong></div><strong>' + formatMXN(item.price) + ' MXN</strong></div>';
      }).join('');
      dom.total.textContent = formatMXN(totals.payableNow) + ' MXN';
      if (dom.sectionsCount) {
        var sectionItem = items.find(function(item) { return item.source.indexOf('Secciones adicionales x') === 0; });
        dom.sectionsCount.textContent = sectionItem ? String(parseInt(sectionItem.source.replace(/[^\d]/g, ''), 10) || 0) : '0';
      }
    }

    function renderWizardSummary() {
      if (!dom.wizardSummary) return;
      var rows = getSummaryItems();
      var totals = getTotals();
      dom.wizardSummary.innerHTML = rows.map(function(item) {
        return '<span class="ft-wizard-chip">' + item.source + ' - ' + formatMXN(item.price) + '</span>';
      }).join('') + '<span class="ft-wizard-chip">Total proyecto: ' + formatMXN(totals.projectTotal) + '</span><span class="ft-wizard-chip">Pago ahora: ' + formatMXN(totals.payableNow) + '</span>';
    }

    function showOnboarding() {
      if (dom.configState) dom.configState.classList.remove('ft-state--active');
      if (dom.onboardingState) dom.onboardingState.classList.add('ft-state--active');
      renderWizardSummary();
      if (dom.onboardingState) dom.onboardingState.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showTransferCard() {
      if (dom.transferCard) dom.transferCard.hidden = false;
      state.payment = { method: 'transferencia_bbva', amount: getTotals().payableNow };
      trackEvent('payment_start', {
        source: 'fast_track',
        method: 'transferencia_bbva',
        payment_mode: getPaymentMode(),
        amount: state.payment.amount
      });
      setStatus(window.currentLang === 'en' ? 'Bank transfer selected. Send your receipt to validate payment.' : 'Transferencia seleccionada. Envía tu comprobante para validar el pago.', true);
    }

    function hideTransferCard() {
      if (dom.transferCard) dom.transferCard.hidden = true;
    }

    function setTransferCopyFeedback(message, ok) {
      if (!dom.transferCopyFeedback) return;
      dom.transferCopyFeedback.textContent = message || '';
      dom.transferCopyFeedback.classList.toggle('is-visible', Boolean(message));
      dom.transferCopyFeedback.style.color = ok ? '#b4e332' : '#ff7b7b';
      if (!message) return;
      window.clearTimeout(setTransferCopyFeedback._timer);
      setTransferCopyFeedback._timer = window.setTimeout(function() {
        if (dom.transferCopyFeedback) {
          dom.transferCopyFeedback.textContent = '';
          dom.transferCopyFeedback.classList.remove('is-visible');
        }
      }, 2200);
    }

    async function copyText(textValue) {
      var text = String(textValue || '').trim();
      if (!text) return false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch (_err) {}
      var helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      helper.setSelectionRange(0, helper.value.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (_copyErr) { ok = false; }
      document.body.removeChild(helper);
      return ok;
    }

    async function createPayment(endpoint, methodKey, successText) {
      hideTransferCard();
      trackEvent('payment_start', {
        source: 'fast_track',
        method: methodKey,
        payment_mode: getPaymentMode(),
        amount: getTotals().payableNow
      });
      try {
        var response = await fetch(apiUrl(endpoint), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(getPayload())
        });
        var data = await response.json();
        if (!response.ok || data.error) throw new Error(data.error || 'Error de pago');
        if (endpoint.indexOf('stripe') > -1 && data.checkoutUrl) window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
        if (endpoint.indexOf('mercadopago') > -1 && data.initPoint) window.open(data.initPoint, '_blank', 'noopener,noreferrer');
        state.payment = { method: methodKey, amount: data.amount || getTotals().payableNow, reference: data.preferenceId || data.checkoutUrl || '' };
        trackEvent('payment_checkout_opened', {
          source: 'fast_track',
          method: methodKey,
          amount: state.payment.amount
        });
        setStatus(successText, true);
      } catch (err) {
        setStatus((window.currentLang === 'en' ? 'Payment error: ' : 'Error de pago: ') + err.message, false);
      }
    }

    async function readAttachments() {
      var files = Array.from((dom.attachments && dom.attachments.files) || []).slice(0, 5);
      var valid = files.filter(function(file) { return file.size > 0 && file.size <= (7 * 1024 * 1024); });
      return Promise.all(valid.map(function(file) {
        return new Promise(function(resolve) {
          var reader = new FileReader();
          reader.onload = function(evt) {
            var dataUrl = String(evt.target && evt.target.result || '');
            var base64 = dataUrl.indexOf(',') > -1 ? dataUrl.split(',')[1] : dataUrl;
            resolve({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, base64: base64 });
          };
          reader.onerror = function() { resolve(null); };
          reader.readAsDataURL(file);
        });
      })).then(function(rows) { return rows.filter(Boolean); });
    }

    function buildWhatsAppText(action, formData) {
      var actionLabel = {
        start: 'Enviar información y comenzar',
        later: 'La envío después',
        help: 'No tengo esta información, por favor ayúdame'
      }[action] || action;
      var totals = getTotals();
      var items = getSummaryItems();
      var lines = [
        '*INICIO DE PROYECTO - BRYANF DESIGN*',
        '',
        '*Acción:* ' + actionLabel,
        '*Servicio:* ' + (items[0] ? items[0].source : 'Servicio web'),
        '*Módulos:* ' + (items.slice(1).map(function(item) { return item.source; }).join(', ') || 'Sin extras'),
        '*Modalidad:* ' + (getPaymentMode() === 'anticipo' ? '50% anticipo' : 'Pago completo'),
        '*Total proyecto:* ' + formatMXN(totals.projectTotal),
        '*Pago ahora:* ' + formatMXN(totals.payableNow),
        '*Cupón:* ' + (state.coupon.code || 'Sin cupón'),
        '',
        '*Nombre completo:* ' + (formData.get('fullName') || 'Sin definir'),
        '*Negocio:* ' + (formData.get('businessName') || 'Sin definir'),
        '*WhatsApp:* ' + (formData.get('contactPhone') || 'Sin definir'),
        '*Correo:* ' + (formData.get('contactEmail') || 'Sin definir'),
        '*Contacto secundario:* ' + (formData.get('secondaryContact') || 'Sin definir'),
        '*Productos/servicios:* ' + (formData.get('services') || 'Sin definir'),
        '*Descripción del proyecto:* ' + (formData.get('projectBrief') || 'Sin definir'),
        '*Objetivos del sitio:* ' + (formData.get('mainGoal') || 'Sin definir'),
        '*Referencias:* ' + (formData.get('references') || 'Sin definir')
      ];
      if (state.payment) lines.push('', '*Pago:* ' + state.payment.method);
      return lines.join('\n');
    }

    async function submitOnboarding(action) {
      if (!dom.form) return;
      var formData = new FormData(dom.form);
      var fullName = String(formData.get('fullName') || '').trim();
      var businessName = String(formData.get('businessName') || '').trim();
      var contactPhone = String(formData.get('contactPhone') || '').trim();
      if (!fullName || !businessName || !contactPhone) {
        setFormAlert(t('ft_onboard_required', 'Completa nombre completo, nombre del negocio y WhatsApp para continuar.'), 'is-error');
        return;
      }
      setFormAlert(t('ft_onboard_sending', 'Enviando onboarding...'), 'is-info');

      var attachments = await readAttachments();
      var payload = {
        action: action,
        source: 'fast-track',
        summaryItems: getSummaryItems(),
        totals: getTotals(),
        paymentMode: getPaymentMode(),
        payment: state.payment || { method: 'pendiente' },
        coupon: state.coupon,
        form: {
          fullName: fullName,
          businessName: businessName,
          contactPhone: contactPhone,
          contactEmail: String(formData.get('contactEmail') || '').trim(),
          secondaryContact: String(formData.get('secondaryContact') || '').trim(),
          services: String(formData.get('services') || '').trim(),
          projectBrief: String(formData.get('projectBrief') || '').trim(),
          mainGoal: String(formData.get('mainGoal') || '').trim(),
          references: String(formData.get('references') || '').trim()
        },
        attachments: attachments
      };

      try {
        var response = await fetch(apiUrl('/api/onboarding-submit'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        var data = await response.json();
        if (!response.ok || data.error) throw new Error(data.error || 'No se pudo enviar');
        trackEvent('onboarding_submitted', {
          source: 'fast_track',
          action: action,
          payment_method: state.payment && state.payment.method ? state.payment.method : 'unknown'
        });
        setFormAlert(t('ft_onboard_sent', 'Brief enviado correctamente. Te contactaremos para iniciar el proyecto.'), 'is-success');
        window.open('https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(buildWhatsAppText(action, formData)), '_blank', 'noopener,noreferrer');
      } catch (_err) {
        setFormAlert(t('ft_onboard_error', 'No se pudo enviar en este momento. Intenta de nuevo o contáctanos por WhatsApp.'), 'is-error');
      }
    }

    function applyCouponOverride(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!dom.couponCode || !dom.couponMsg) return;
      var code = String(dom.couponCode.value || '').trim().toUpperCase();
      state.coupon = { code: '', discountType: null, discountValue: 0 };
      if (!code) {
        dom.couponMsg.textContent = '';
        return;
      }
      var couponData = ACTIVE[code];
      if (couponData && typeof couponData === 'object') {
        state.coupon = {
          code: code,
          discountType: couponData.type === 'fixed' ? 'fixed' : 'percent',
          discountValue: Math.max(0, Number(couponData.value || 0))
        };
        dom.couponMsg.textContent = window.currentLang === 'en' ? 'Coupon applied successfully.' : 'Cupón aplicado correctamente.';
        dom.couponMsg.style.color = '#b4e332';
      } else if (Object.keys(ACTIVE).length === 0) {
        dom.couponMsg.textContent = window.currentLang === 'en' ? 'There are no active coupons right now.' : 'No hay cupones activos por el momento.';
        dom.couponMsg.style.color = '#d4d8d0';
      } else {
        dom.couponMsg.textContent = window.currentLang === 'en' ? 'Invalid coupon.' : 'Cupón inválido.';
        dom.couponMsg.style.color = '#ff6b6b';
      }
      renderSummary();
    }

    function handleReturnStatus() {
      var params = new URLSearchParams(window.location.search);
      var status = params.get('status');
      if (!status) return;
      if (status === 'success' || status === 'approved') {
        trackEvent('payment_completed', { method: params.get('provider') || 'unknown', status: status, source: 'return_url' });
        setStatus(window.currentLang === 'en' ? 'Payment confirmed. Please complete onboarding.' : 'Pago confirmado. Completa tu onboarding para iniciar.', true);
        showOnboarding();
      } else if (status === 'pending') {
        trackEvent('payment_pending', { method: params.get('provider') || 'unknown', status: status, source: 'return_url' });
        setStatus(window.currentLang === 'en' ? 'Payment pending confirmation.' : 'Pago pendiente de confirmación.', false);
      } else if (status === 'cancel' || status === 'failure') {
        trackEvent('payment_failed', { method: params.get('provider') || 'unknown', status: status, source: 'return_url' });
        setStatus(window.currentLang === 'en' ? 'Payment not completed. You can try again.' : 'El pago no se completó. Puedes intentarlo nuevamente.', false);
      }
      params.delete('status');
      var cleanUrl = window.location.pathname + (params.toString() ? ('?' + params.toString()) : '') + window.location.hash;
      window.history.replaceState({}, '', cleanUrl);
    }

    function reorderSections() {
      var main = document.querySelector('main');
      var faq = document.getElementById('faq');
      var cta = document.querySelector('.cta');
      if (!main || !faq || !cta || !root) return;
      main.insertBefore(faq, cta);
    }

    function setMobileConfiguratorMode() {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          document.body.classList.toggle('in-fast-track', entry.isIntersecting);
        });
      }, { threshold: 0.35 });
      observer.observe(root);
    }

    function normalizeLuminaQuickChips() {
      var wrap = document.getElementById('luminaChips');
      if (!wrap) return;
      var chips = [
        { text: 'Qué incluye el servicio', msg: '¿Qué incluye el servicio base de BryanF Design para una web nueva?' },
        { text: 'Cómo funciona el cotizador', msg: '¿Cómo funciona el cotizador y qué módulos recomiendas para mi negocio?' },
        { text: 'Cupones activos', msg: '¿Tienen cupones activos ahora mismo?' },
        { text: 'Tiempos y proceso', msg: '¿Cuánto tardan en entregar y cómo es el proceso de trabajo?' },
        { text: 'Transferencia bancaria', msg: 'Si pago por transferencia BBVA, ¿cómo envío mi comprobante?' },
        { text: 'Branding, SEO y mantenimiento', msg: '¿Me pueden ayudar con branding, SEO, performance y mantenimiento continuo?' }
      ];
      wrap.innerHTML = chips.map(function(chip) {
        return '<button class="lumina-chip" data-msg="' + chip.msg.replace(/"/g, '&quot;') + '">' + chip.text + '</button>';
      }).join('');
    }

    function setupClientBrands() {
      var clientsSection = document.querySelector('.clients');
      var millerCard = document.querySelector('.client-card--miller');
      if (!clientsSection || !millerCard) return;

      function open() { clientsSection.classList.add('clients--expanded'); }
      function close() { clientsSection.classList.remove('clients--expanded'); }

      millerCard.setAttribute('role', 'button');
      millerCard.setAttribute('tabindex', '0');
      millerCard.setAttribute('aria-expanded', 'false');

      millerCard.addEventListener('mouseenter', function() {
        open();
        millerCard.setAttribute('aria-expanded', 'true');
      });
      millerCard.addEventListener('mouseleave', function() {
        if (window.matchMedia('(max-width: 980px)').matches) return;
        close();
        millerCard.setAttribute('aria-expanded', 'false');
      });
      millerCard.addEventListener('click', function() {
        clientsSection.classList.toggle('clients--expanded');
        millerCard.setAttribute('aria-expanded', clientsSection.classList.contains('clients--expanded') ? 'true' : 'false');
      });
      millerCard.addEventListener('keydown', function(ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          millerCard.click();
        }
      });
      document.addEventListener('click', function(ev) {
        if (!clientsSection.contains(ev.target)) {
          close();
          millerCard.setAttribute('aria-expanded', 'false');
        }
      });
    }

    function bindEvents() {
      var simBtn = document.getElementById('ftSimulateSuccessBtn');
      if (simBtn) simBtn.remove();
      setStatus(t('ft_pay_status_idle', 'Elige tu método de pago para continuar con tu proyecto.'), false);

      Array.from(dom.planButtons || []).forEach(function(btn) {
        btn.addEventListener('click', function() {
          Array.from(dom.planButtons).forEach(function(other) {
            var active = other === btn;
            other.classList.toggle('ft-plan--active', active);
            other.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
          renderSummary();
        });
      });

      Array.from(dom.moduleInputs || []).forEach(function(input) {
        input.addEventListener('change', function() {
          if (input.value === 'sections' && !input.checked && dom.sectionsCount) {
            dom.sectionsCount.textContent = '0';
          }
          renderSummary();
        });
      });

      if (dom.sectionsMinus) {
        dom.sectionsMinus.addEventListener('click', function() {
          if (!dom.sectionsCount) return;
          var current = parseInt(dom.sectionsCount.textContent || '0', 10) || 0;
          var next = Math.max(0, current - 1);
          dom.sectionsCount.textContent = String(next);
          var sectionsCb = root.querySelector('.ft-module-cb[value="sections"]');
          if (sectionsCb) sectionsCb.checked = next > 0;
          renderSummary();
        });
      }

      if (dom.sectionsPlus) {
        dom.sectionsPlus.addEventListener('click', function() {
          if (!dom.sectionsCount) return;
          var current = parseInt(dom.sectionsCount.textContent || '0', 10) || 0;
          var next = Math.min(30, current + 1);
          dom.sectionsCount.textContent = String(next);
          var sectionsCb = root.querySelector('.ft-module-cb[value="sections"]');
          if (sectionsCb) sectionsCb.checked = true;
          renderSummary();
        });
      }

      Array.from(dom.paymentModeRadios || []).forEach(function(radio) {
        radio.addEventListener('change', renderSummary);
      });

      if (dom.applyCouponBtn) dom.applyCouponBtn.addEventListener('click', applyCouponOverride, true);
      if (dom.payStripeBtn) dom.payStripeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        createPayment('/api/stripe-checkout', 'stripe', window.currentLang === 'en' ? 'Stripe checkout opened successfully.' : 'Stripe abierto correctamente. Completa tu pago para continuar.');
      }, true);
      if (dom.payMPBtn) dom.payMPBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        createPayment('/api/mercadopago', 'mercado_pago', window.currentLang === 'en' ? 'Mercado Pago checkout opened successfully.' : 'Mercado Pago abierto correctamente. Completa tu pago para continuar.');
      }, true);
      if (dom.payTransferBtn) dom.payTransferBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showTransferCard();
      }, true);
      if (dom.transferDoneBtn) dom.transferDoneBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showOnboarding();
      }, true);
      Array.from(dom.transferCopyButtons || []).forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var targetId = btn.getAttribute('data-copy-target');
          var target = targetId ? document.getElementById(targetId) : null;
          copyText(target ? target.textContent : '').then(function(ok) {
            var originalText = btn.textContent;
            btn.textContent = ok ? 'Copiado' : 'No se pudo copiar';
            btn.classList.add(ok ? 'is-copied' : 'is-error');
            window.setTimeout(function() {
              btn.textContent = originalText;
              btn.classList.remove('is-copied', 'is-error');
            }, 1400);
            setTransferCopyFeedback(ok ? 'Dato copiado correctamente.' : 'No se pudo copiar. Inténtalo de nuevo.', ok);
          });
        });
      });
      if (dom.copyTransferAllBtn) dom.copyTransferAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var fullText = [
          'Banco: BBVA Bancomer',
          'Titular: Bryan Fernando López López',
          'Cuenta: 1534366643',
          'CLABE: 012180015343666431',
          'SWIFT: BCMRMXMMPYM'
        ].join('\n');
        copyText(fullText).then(function(ok) {
          setTransferCopyFeedback(ok ? 'Datos completos copiados.' : 'No se pudieron copiar los datos completos.', ok);
        });
      }, true);

      Array.from(dom.actionButtons).forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          submitOnboarding(btn.getAttribute('data-ft-action') || 'start');
        }, true);
      });
    }

    renderOriginalFastTrackPrices();
    renderSummary();
    bindEvents();
    handleReturnStatus();
    reorderSections();
    setMobileConfiguratorMode();
    normalizeLuminaQuickChips();
    setupClientBrands();
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
    if (window.matchMedia('(max-width: 767px)').matches) {
      navbar.classList.add('scrolled');
      return;
    }

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
    if (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches) return;

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
      nav_home: 'Inicio', nav_projects: 'Proyectos', nav_talk: "Let's talk", nav_fasttrack: 'Inicia tu Web Rápido', nav_motion: 'Motion',
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
      stack_motion_cta: 'Explora como usamos Motion, React, JavaScript y CSS Studio para crear experiencias fluidas sin sacrificar performance.',
      stack_motion_link: 'Ver experiencia Motion',
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
      nav_home: 'Home', nav_projects: 'Projects', nav_talk: "Let's talk", nav_fasttrack: 'Start Your Web Fast', nav_motion: 'Motion',
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
      stack_motion_cta: 'Explore how we use Motion, React, JavaScript, and CSS Studio to create fluid experiences without sacrificing performance.',
      stack_motion_link: 'View Motion experience',
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

  Object.assign(window.LANG.es, {
    ft_coupon_ph: 'Ingresa tu cupón',
    ft_coupon_disclaimer: '¿Tienes un cupón? Revisa nuestras redes sociales o pregunta a Lumina si hay alguno activo.',
    ft_pay_transfer: 'Pagar por transferencia',
    ft_pay_status_idle: 'Elige tu método de pago para continuar con tu proyecto.',
    ft_transfer_title: 'Transferencia bancaria BBVA',
    ft_transfer_bank: 'Banco',
    ft_transfer_owner: 'Titular',
    ft_transfer_account: 'Cuenta',
    ft_transfer_note: 'Cuando completes la transferencia, envía tu comprobante por WhatsApp o correo para validar el pago. Iniciamos tu proyecto en cuanto quede confirmado.',
    ft_transfer_whatsapp: 'Enviar comprobante por WhatsApp',
    ft_transfer_email: 'Enviar comprobante por correo',
    ft_transfer_continue: 'Ya envié el comprobante, continuar',
    ft_usd_disclaimer: 'Referencia en USD disponible al pagar. El tipo de cambio final depende de tu banco o plataforma.',
    ft_onboard_title: 'Inicio de proyecto',
    ft_onboard_sub: 'Pago confirmado. Comparte esta información para arrancar producción de inmediato.',
    ft_field_full_name: 'Nombre completo *',
    ft_field_business: 'Nombre del negocio *',
    ft_field_contact_secondary: 'Nombre de contacto secundario',
    ft_field_whatsapp: 'WhatsApp *',
    ft_field_goal: 'Objetivos del sitio',
    ft_field_project_brief: 'Descripción breve del proyecto',
    ft_field_notes: 'Referencias o inspiración',
    ft_field_files: 'Archivos adjuntos',
    ft_field_files_help: 'Puedes adjuntar propuestas, logos, PDFs o referencias (máx. 5 archivos de 7 MB cada uno).',
    ft_onboard_required: 'Completa nombre completo, nombre del negocio y WhatsApp para continuar.',
    ft_onboard_sending: 'Enviando onboarding...',
    ft_onboard_sent: 'Brief enviado correctamente. Te contactaremos para iniciar el proyecto.',
    ft_onboard_error: 'No se pudo enviar en este momento. Intenta de nuevo o contáctanos por WhatsApp.',
    cq_coupon_ph: 'Ingresa tu cupón'
  });

  Object.assign(window.LANG.en, {
    ft_coupon_ph: 'Enter your coupon',
    ft_coupon_disclaimer: 'Do you have a coupon? Check our social media or ask Lumina if any coupon is active.',
    ft_pay_transfer: 'Pay by bank transfer',
    ft_pay_status_idle: 'Choose your payment method to continue your project.',
    ft_transfer_title: 'BBVA bank transfer',
    ft_transfer_bank: 'Bank',
    ft_transfer_owner: 'Account holder',
    ft_transfer_account: 'Account',
    ft_transfer_note: 'Once your transfer is complete, send your receipt by WhatsApp or email so we can validate payment. We start your project as soon as it is confirmed.',
    ft_transfer_whatsapp: 'Send receipt by WhatsApp',
    ft_transfer_email: 'Send receipt by email',
    ft_transfer_continue: 'I already sent the receipt, continue',
    ft_usd_disclaimer: 'USD reference is available at checkout. Final exchange rate depends on your bank or platform.',
    ft_onboard_title: 'Project kickoff',
    ft_onboard_sub: 'Payment confirmed. Share this information so we can start production right away.',
    ft_field_full_name: 'Full name *',
    ft_field_business: 'Business name *',
    ft_field_contact_secondary: 'Secondary contact name',
    ft_field_whatsapp: 'WhatsApp *',
    ft_field_goal: 'Website goals',
    ft_field_project_brief: 'Short project brief',
    ft_field_notes: 'References or inspiration',
    ft_field_files: 'Attachments',
    ft_field_files_help: 'Attach proposals, logos, PDFs, or references (max 5 files, 7 MB each).',
    ft_onboard_required: 'Please complete full name, business name, and WhatsApp to continue.',
    ft_onboard_sending: 'Sending onboarding...',
    ft_onboard_sent: 'Brief sent successfully. We will contact you to kick off your project.',
    ft_onboard_error: 'We could not send it right now. Please try again or contact us on WhatsApp.',
    cq_coupon_ph: 'Enter your coupon'
  });

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
    trackEvent('cotizador_click', { source: 'site_cta' });
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

  ['footerStartBtn'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', openCotizar);
  });

  /* ── LET'S TALK MODAL ── */
  var letsTalkOverlay = document.getElementById('letsTalkOverlay');
  var letsTalkClose = document.getElementById('letsTalkClose');
  var letsTalkForm = document.getElementById('letsTalkForm');

  function openLetsTalk() {
    if (!letsTalkOverlay) return;
    letsTalkOverlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    window.setTimeout(function () {
      var first = document.getElementById('ltName');
      if (first) first.focus();
    }, 120);
  }

  function closeLetsTalk() {
    if (!letsTalkOverlay) return;
    letsTalkOverlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  ['navTalkBtn','heroTalkBtn','footerTalkBtn','mobileCotizarBtn'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', openLetsTalk);
  });

  if (letsTalkClose) letsTalkClose.addEventListener('click', closeLetsTalk);
  if (letsTalkOverlay) {
    letsTalkOverlay.addEventListener('click', function (e) {
      if (e.target === letsTalkOverlay) closeLetsTalk();
    });
  }

  if (letsTalkForm) {
    letsTalkForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = String((document.getElementById('ltName') || {}).value || '').trim();
      var contact = String((document.getElementById('ltContact') || {}).value || '').trim();
      var message = String((document.getElementById('ltMessage') || {}).value || '').trim();
      var text = [
        "*Nuevo contacto desde Let's Talk*",
        '*Nombre:* ' + (name || 'Sin nombre'),
        '*WhatsApp o correo:* ' + (contact || 'Sin dato'),
        '*Mensaje:* ' + (message || 'Sin mensaje')
      ].join('\n');
      window.open('https://wa.me/525663012505?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
    });
  }

  var cqClose = document.getElementById('cqClose');
  if (cqClose) cqClose.addEventListener('click', closeCotizar);
  if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCotizar(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && letsTalkOverlay && !letsTalkOverlay.hasAttribute('hidden')) {
      closeLetsTalk();
      return;
    }
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
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var code = document.getElementById('cqCouponCode').value.trim().toUpperCase();
      var msgEl = document.getElementById('cqCouponMsg');
      cqDiscount = 0;
      cqCoupon = '';
      if (!code) {
        msgEl.textContent = '';
        updateEstimator();
        return;
      }
      var couponData = ACTIVE_COUPONS[code];
      if (couponData && typeof couponData === 'object') {
        if (couponData.type === 'percent') cqDiscount = Math.max(0, Number(couponData.value || 0));
        if (couponData.type === 'fixed') cqDiscount = Math.max(0, Number(couponData.value || 0));
        cqCoupon = code;
        msgEl.textContent = window.currentLang === 'en' ? 'Coupon applied successfully.' : 'Cupón aplicado correctamente.';
        msgEl.style.color = '#25d366';
      } else if (Object.keys(ACTIVE_COUPONS).length === 0) {
        msgEl.textContent = window.currentLang === 'en' ? 'There are no active coupons right now.' : 'No hay cupones activos por el momento.';
        msgEl.style.color = '#d4d8d0';
      } else {
        msgEl.textContent = window.currentLang === 'en' ? 'Invalid coupon.' : 'Cupón inválido.';
        msgEl.style.color = '#ff4d4d';
      }
      updateEstimator();
    }, true);
  }

  var aiBtn = document.getElementById('cqAiBtn');
  if (aiBtn) {
    aiBtn.addEventListener('click', function() {
      var msg = val('cqMessage');
      if (msg.length < 10) { setErr('cqMsgErr', 'Escribe o dicta tu idea primero.'); return; }
      setErr('cqMsgErr', '');
      
      var origText = document.getElementById('cqAiText').innerHTML;
      document.getElementById('cqAiText').innerHTML = 'Analizando con Lumina IA...';
      
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
  const SYSTEM_PROMPT = `Eres LUMINA, asistente comercial de BryanF Design.
Tu meta es orientar, resolver dudas y guiar al usuario al cotizador o al inicio del proyecto.

Temas que debes cubrir con claridad:
- Qué hace BryanF Design: branding, diseño UX/UI, desarrollo web, WordPress, SEO técnico, performance, mantenimiento, e-commerce, landing pages y automatización.
- Cómo funciona el cotizador: paquete base + módulos + modalidad de pago.
- Tiempos de entrega: inician desde 3 días hábiles cuando la información está completa.
- Pagos: Stripe, Mercado Pago o transferencia bancaria BBVA.
- Transferencia bancaria: el cliente envía comprobante por WhatsApp o correo y el proyecto inicia al validarse.
- Cupones: solo si hay uno activo; si no, invitar a revisar redes o preguntar al equipo.

Reglas:
- Si preguntan precios, responde que el monto depende del alcance, desde $3,500 MXN, y dirige a WhatsApp con este link: <a href="https://wa.me/525663012505" target="_blank">Contactar por WhatsApp</a>.
- Si preguntan privacidad o seguridad de pagos, remite a <a href="/privacidad" target="_blank">Aviso de Privacidad</a> y <a href="/terminos" target="_blank">Términos y Condiciones</a>.
- Responde en tono premium, concreto y comercial, sin texto técnico interno.
- Usa HTML básico: <strong>, <br>, <ul>, <li>, <a>.
- OBLIGATORIO: Responde con excelente ortografía, usando correctamente los acentos, signos de puntuación y la letra ñ. Utiliza saltos de línea (<br>) para separar los párrafos y hacer el texto muy legible y fácil de leer.

Acción de apertura de formulario:
Si el usuario ya compartió intención clara de iniciar o cotizar, agrega al final:
[ACTION:OPEN_FORM:{"name":"nombre si lo dio","message":"resumen del proyecto en una frase"}]`;

  const fab = document.getElementById('luminaFab');
  const panel = document.getElementById('luminaPanel');
  const closeBtn = document.getElementById('luminaClose');
  const messagesContainer = document.getElementById('luminaMessages');
  const input = document.getElementById('luminaInput');
  const sendBtn = document.getElementById('luminaSend');
  const chips = document.querySelectorAll('.lumina-chip');
  const chipsWrap = document.getElementById('luminaChips');
  const a11yMenu = document.getElementById('a11yMenu');
  if (!fab || !panel || !closeBtn || !messagesContainer || !input || !sendBtn) return;

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
      if (a11yMenu) {
        a11yMenu.setAttribute('hidden', '');
        document.body.classList.remove('a11y-open');
      }
      panel.removeAttribute('hidden');
      document.body.classList.add('lumina-open');
      fab.style.transform = 'scale(0)';
      fab.style.opacity = '0';
      fab.style.pointerEvents = 'none';
      if (!hasOpened) {
        addMessage('Bienvenido. Soy Lumina y puedo ayudarte con estrategia, cotización, tiempos de entrega, pagos y el mejor plan para tu proyecto web.', 'ai');
        hasOpened = true;
      }
      setTimeout(() => {
        input.focus({ preventScroll: true });
        scrollToBottom();
      }, 220);
    } else {
      panel.setAttribute('hidden', '');
      document.body.classList.remove('lumina-open');
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

  function normalizeIntentText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function scrollToSection(selector, offset) {
    var section = document.querySelector(selector);
    if (!section) return false;
    var top = section.getBoundingClientRect().top + window.scrollY - (offset || 92);
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    return true;
  }

  function getQuickActionIntent(rawText) {
    var text = normalizeIntentText(rawText);
    var intents = [
      {
        key: 'pricing',
        keywords: ['precio', 'precios', 'costo', 'costos', 'cuanto cuesta', 'cotizacion', 'cotizar', 'cotizador', 'pago', 'pagos', 'stripe', 'mercado pago', 'anticipo', 'transferencia', 'metodos de pago'],
        reply: 'Te ayudo con eso. El costo depende del alcance y módulos que necesites. Te llevo al <strong>configurador</strong> para que obtengas una referencia clara en MXN.',
        target: '#fast-track-section',
        after: function() {
          var pricingCard = document.querySelector('#fast-track-section .ft-card h3');
          if (pricingCard) pricingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
      {
        key: 'services',
        keywords: ['servicio', 'servicios', 'que hacen', 'que incluye', 'incluye el servicio', 'wordpress', 'tiendas', 'branding', 'seo', 'automatizacion', 'desarrollo web'],
        reply: 'Perfecto. Te muestro la parte de <strong>servicios</strong> para que veas cómo trabajamos branding, desarrollo, SEO y automatización.',
        target: '#servicios'
      },
      {
        key: 'projects',
        keywords: ['trabajos', 'portafolio', 'proyectos', 'proyecto', 'ejemplos', 'casos'],
        reply: 'Excelente, te llevo a <strong>Trabajos destacados</strong> para que revises casos reales y estilo de ejecución.',
        target: '#projects'
      },
      {
        key: 'coupons',
        keywords: ['cupon', 'cupones', 'promocion', 'promociones', 'descuento', 'descuentos'],
        reply: 'Claro. Si hay cupón activo lo puedes aplicar en el configurador. Si hoy no hay activo, te recomiendo revisar redes o preguntarnos directo por WhatsApp.',
        target: '#fast-track-section',
        after: function() {
          var couponInput = document.getElementById('ftCouponCode');
          if (couponInput) couponInput.focus({ preventScroll: true });
        }
      },
      {
        key: 'contact',
        keywords: ['contacto', 'hablar con alguien', 'whatsapp', 'asesoria', 'asesoria', 'empecemos', 'iniciar proyecto'],
        reply: 'Vamos a avanzar. Te llevo al cierre para que inicies de inmediato o, si prefieres, pasamos directo al configurador para cotizar.',
        target: '.cta',
        after: function() {
          var ctaPrimary = document.getElementById('ctaCotizarBtn') || document.getElementById('heroTalkBtn');
          if (ctaPrimary) ctaPrimary.focus({ preventScroll: true });
        }
      }
    ];

    for (var i = 0; i < intents.length; i += 1) {
      var intent = intents[i];
      for (var k = 0; k < intent.keywords.length; k += 1) {
        if (text.indexOf(intent.keywords[k]) > -1) {
          return intent;
        }
      }
    }
    return null;
  }

  function runQuickAction(intent, promptText) {
    if (!intent) return false;
    addMessage(promptText, 'user');
    addMessage(intent.reply, 'ai');
    window.setTimeout(function() {
      if (intent.target) scrollToSection(intent.target, 88);
      if (typeof intent.after === 'function') {
        window.setTimeout(intent.after, 300);
      }
    }, 220);
    trackEvent('lumina_quick_action', {
      source: 'lumina_chip',
      intent: intent.key,
      target: intent.target || 'none'
    });
    return true;
  }

  // Chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      var chipMessage = chip.getAttribute('data-msg') || chip.textContent || '';
      var intent = getQuickActionIntent(chipMessage);
      if (runQuickAction(intent, chipMessage)) return;
      input.value = chipMessage;
      input.style.height = 'auto';
      handleSend();
    });
  });

  function initChipScroller() {
    if (!chipsWrap) return;
    chipsWrap.addEventListener('wheel', function(ev) {
      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) {
        chipsWrap.scrollLeft += ev.deltaY;
        ev.preventDefault();
      }
    }, { passive: false });

    let pointerActive = false;
    let startX = 0;
    let startScroll = 0;
    chipsWrap.addEventListener('pointerdown', function(ev) {
      if (ev.target && ev.target.closest && ev.target.closest('.lumina-chip')) return;
      pointerActive = true;
      startX = ev.clientX;
      startScroll = chipsWrap.scrollLeft;
      chipsWrap.classList.add('is-dragging');
      if (chipsWrap.setPointerCapture) chipsWrap.setPointerCapture(ev.pointerId);
    });
    chipsWrap.addEventListener('pointermove', function(ev) {
      if (!pointerActive) return;
      var distance = ev.clientX - startX;
      chipsWrap.scrollLeft = startScroll - distance;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(evtName) {
      chipsWrap.addEventListener(evtName, function() {
        pointerActive = false;
        chipsWrap.classList.remove('is-dragging');
      });
    });
  }

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
    setTimeout(() => input.focus({ preventScroll: true }), 10);
  }

  function setLuminaState(state) {
    const img = document.getElementById('luminaAvatarImg');
    if (!img) return;
    const path = 'img/lumina/';
    switch(state) {
      case 'typing': img.src = path + 'Enfocada.png'; break;
      case 'error': img.src = path + 'Offline.png'; break;
      case 'question': img.src = path + 'Duda.png'; break;
      case 'surprised': img.src = path + 'Sorprendida.png'; break;
      case 'normal': default: img.src = path + 'Normal.png'; break;
    }
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function setLuminaState(state) {
    const img = document.getElementById('luminaAvatarImg');
    if (!img) return;
    const path = 'img/lumina/';
    switch(state) {
      case 'typing': img.src = path + 'Enfocada.png'; break;
      case 'error': img.src = path + 'Offline.png'; break;
      case 'question': img.src = path + 'Duda.png'; break;
      case 'surprised': img.src = path + 'Sorprendida.png'; break;
      case 'normal': default: img.src = path + 'Normal.png'; break;
    }
  }

  async function handleSend() {
    const text = input.value.trim();
    if (!text || isTyping) return;

    // UI Updates
    input.value = '';
    input.style.height = 'auto';
    addMessage(text, 'user');
    showTyping();
    
    if (text.includes('?')) {
      setLuminaState('question');
      setTimeout(() => setLuminaState('typing'), 1500);
    } else {
      setLuminaState('typing');
    }

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
        addMessage('Lo siento, tuve un problema temporal al conectarme. Por favor, intenta de nuevo o escr�benos por <a href="https://wa.me/525663012505" target="_blank">WhatsApp</a>.', 'ai');
        setLuminaState('error');
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
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong></strong>')
        .replace(/\*(.*?)\*/g, '<em></em>');
        
      addMessage(formattedText, 'ai');
      setLuminaState('normal');

    } catch (err) {
      hideTyping();
      console.error('Fetch Error:', err);
      addMessage('Error de red o de API (sin saldo). Por favor escr�benos por WhatsApp.', 'ai');
      setLuminaState('error');
      chatHistory.pop();
    }
  }

  initChipScroller();
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
    var appDock = document.getElementById('appActionsDock');
    if (!fab || !menu) return;

    function setMenuOpen(open) {
      if (open) {
        menu.removeAttribute('hidden');
        document.body.classList.add('a11y-open');
        fab.setAttribute('aria-expanded', 'true');
      } else {
        menu.setAttribute('hidden', '');
        document.body.classList.remove('a11y-open');
        fab.setAttribute('aria-expanded', 'false');
      }
    }
    window.__setA11yMenuOpen = setMenuOpen;
    window.__toggleA11yMenu = function() {
      setMenuOpen(menu.hasAttribute('hidden'));
    };

    fab.addEventListener('click', function(e) {
      e.stopPropagation();
      setMenuOpen(menu.hasAttribute('hidden'));
    });

    document.addEventListener('click', function(e) {
      if(
        !menu.contains(e.target) &&
        e.target !== fab &&
        !fab.contains(e.target) &&
        !(appDock && appDock.contains(e.target))
      ) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
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
     17. MOBILE APP ACTIONS DOCK
     ============================================================ */
  (function initMobileAppActionsDock() {
    var dockLuminaBtn = document.getElementById('appDockLuminaBtn');
    var dockA11yBtn = document.getElementById('appDockA11yBtn');
    var luminaFab = document.getElementById('luminaFab');
    var a11yFab = document.getElementById('a11yFab');
    var a11yMenu = document.getElementById('a11yMenu');
    if (!dockLuminaBtn && !dockA11yBtn) return;

    if (dockLuminaBtn) {
      dockLuminaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (a11yMenu) {
          a11yMenu.setAttribute('hidden', '');
          document.body.classList.remove('a11y-open');
        }
        if (luminaFab) luminaFab.click();
      });
    }

    if (dockA11yBtn) {
      dockA11yBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (document.body.classList.contains('lumina-open') && luminaFab) {
          luminaFab.click();
        }
        if (typeof window.__toggleA11yMenu === 'function') {
          window.__toggleA11yMenu();
          return;
        }
        if (a11yFab) {
          a11yFab.click();
          return;
        }
        if (!a11yMenu) return;
        if (a11yMenu.hasAttribute('hidden')) {
          a11yMenu.removeAttribute('hidden');
          document.body.classList.add('a11y-open');
        } else {
          a11yMenu.setAttribute('hidden', '');
          document.body.classList.remove('a11y-open');
        }
      });
    }
  })();

  /* ============================================================
     18. FLOATING BUTTONS FOOTER HIDER
     ============================================================ */
  (function initFloatingHider() {
    var footer = document.querySelector('.footer');
    var luminaFab = document.getElementById('luminaFab');
    var a11yModule = document.querySelector('.a11y-module');
    var appDock = document.getElementById('appActionsDock');
    
    if(!footer || (!luminaFab && !a11yModule && !appDock)) return;
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if(luminaFab) luminaFab.classList.add('hide-floating');
          if(a11yModule) a11yModule.classList.add('hide-floating');
          if(appDock) appDock.classList.add('hide-floating');
        } else {
          if(luminaFab) luminaFab.classList.remove('hide-floating');
          if(a11yModule) a11yModule.classList.remove('hide-floating');
          if(appDock) appDock.classList.remove('hide-floating');
        }
      });
    }, { rootMargin: '0px', threshold: 0.1 });
    
    observer.observe(footer);
  })();



