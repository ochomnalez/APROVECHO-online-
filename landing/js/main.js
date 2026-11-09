/* APROVECHO · landing · interacciones */
(function () {
  'use strict';

  // ===== CONFIGURACIÓN (completar cuando Octavio confirme) =====
  var WHATSAPP_URL = ''; // ej. 'https://wa.me/54911XXXXXXXX'. Vacío = el link lleva al formulario.
  // =============================================================

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // WhatsApp
  if (WHATSAPP_URL) $$('[data-whatsapp]').forEach(function (a) { a.href = WHATSAPP_URL; a.target = '_blank'; a.rel = 'noopener'; });

  // Menú mobile
  var burger = $('.nav__burger'), menu = $('#menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); } });

  // Barra fija mobile: se oculta cuando el formulario está a la vista
  var sticky = $('[data-sticky]'), alta = $('#alta');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { sticky.classList.toggle('is-hidden', es[0].isIntersecting); }, { threshold: 0.12 }).observe(alta);
  }

  // Cuenta: "Mirá cuánto te queda"
  var slider = $('#valor');
  if (slider) {
    var fmt = function (n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    var out = $('#valor-out');
    var pintar = function () {
      var v = +slider.value, pack = v / 2, com = pack * 0.75;
      out.textContent = fmt(v);
      $('[data-out="valor"]').textContent = fmt(v);
      $('[data-out="pack"]').textContent = fmt(pack);
      $('[data-out="comercio"]').textContent = fmt(com);
    };
    slider.addEventListener('input', pintar);
    pintar();
  }

  // Cómo funciona: la imagen cambia con el paso (desktop)
  var steps = $$('#como-steps .step'), layers = $$('.stage .layer');
  if (steps.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = +e.target.getAttribute('data-layer');
        steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
        layers.forEach(function (l, k) { l.classList.toggle('is-on', k === i); });
      });
    }, { rootMargin: '-42% 0px -50% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  }

  // Clips: se reproducen solo cuando están a la vista
  var vids = $$('video[data-lazyvideo]');
  if (vids.length && 'IntersectionObserver' in window && !reduce) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); }
      });
    }, { threshold: 0.4 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  // Video completo: se carga al tocar
  var fv = $('[data-fullvideo]');
  if (fv) {
    $('button', fv).addEventListener('click', function () {
      var v = document.createElement('video');
      v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('aria-label', 'Video de onboarding de APROVECHO');
      v.innerHTML = '<source src="video/onboarding.mp4" type="video/mp4">';
      fv.innerHTML = ''; fv.appendChild(v);
      v.play().catch(function () {});
    });
  }

  // ===== Onboarding scroll-driven =====
  var onb = $('#onboarding'), track = $('[data-onb]');
  var scene = $('.scene', onb);
  var weights = $$('[data-weight]', onb), weights2 = $$('[data-weight2]', onb);
  var fmtKg = function (n) { return n.toFixed(2).replace('.', ','); };

  function estatica() {
    onb.classList.add('onb--static');
    weights.forEach(function (w) { w.textContent = '1,24 kg'; });
    weights2.forEach(function (w) { w.textContent = '1,24'; });
  }

  if (!reduce && scene) {
    onb.classList.add('onb--scroll');
    var items = $$('[data-f]', scene).map(function (el) {
      var a = el.getAttribute('data-f').split(',').map(Number), o = el.getAttribute('data-o');
      return { el: el, a: a, o: o ? o.split(',').map(Number) : null, t: -1, ov: -1 };
    });
    var ostep = $$('.ostep', onb), rail = $$('.onb__rail i', onb);
    var cur = -1, ticking = false;
    var clamp = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };

    var update = function () {
      ticking = false;
      var r = track.getBoundingClientRect();
      var span = r.height - window.innerHeight * 0.9;
      var p = clamp(-(r.top - 68) / Math.max(1, span));
      var f = Math.min(7, p * 7.15);
      items.forEach(function (it) {
        var t = clamp((f - it.a[0]) / (it.a[1] - it.a[0]));
        var o = it.o ? clamp((f - it.o[0]) / (it.o[1] - it.o[0])) : 0;
        if (t !== it.t) { it.el.style.setProperty('--t', t.toFixed(3)); it.t = t; }
        if (o !== it.ov) { it.el.style.setProperty('--o', o.toFixed(3)); it.ov = o; }
      });
      var idx = Math.min(6, Math.floor(f));
      if (idx !== cur) {
        cur = idx;
        ostep.forEach(function (s, k) { s.classList.toggle('is-on', k === idx); });
        rail.forEach(function (d, k) { d.className = k < idx ? 'is-done' : (k === idx ? 'is-now' : ''); });
      }
      var kg = 1.24 * (1 - Math.pow(1 - clamp((f - 6.1) / 0.45), 3));
      var txt = fmtKg(kg);
      weights.forEach(function (w) { w.textContent = txt + ' kg'; });
      weights2.forEach(function (w) { w.textContent = txt; });
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  } else {
    estatica();
  }
})();
