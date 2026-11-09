/* APROVECHO · landing v2 · interacciones (IIFE, sin módulos) */
(function () {
  'use strict';

  // ===== CONFIGURACIÓN (completar cuando Octavio confirme) =====
  var WHATSAPP_URL = ''; // ej. 'https://wa.me/54911XXXXXXXX'. Vacío = el link lleva al formulario.
  // =============================================================

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.warn('init ' + name, e); } }

  safe(function () {
    if (WHATSAPP_URL) $$('[data-whatsapp]').forEach(function (a) { a.href = WHATSAPP_URL; a.target = '_blank'; a.rel = 'noopener'; });
  }, 'whatsapp');

  // Menú mobile
  safe(function () {
    var burger = $('.nav__burger'), menu = $('#menu');
    function cerrar() { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });
    $$('#menu a').forEach(function (a) { a.addEventListener('click', cerrar); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  }, 'menu');

  // Barra fija mobile: se oculta cuando el formulario está a la vista
  safe(function () {
    var sticky = $('[data-sticky]'), alta = $('#alta');
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) { sticky.classList.toggle('is-hidden', es[0].isIntersecting); }, { threshold: 0.1 }).observe(alta);
  }, 'sticky');

  // Mirá cuánto te queda
  safe(function () {
    var slider = $('#valor'); if (!slider) return;
    var fmt = function (n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    var out = $('#valor-out');
    var pintar = function () {
      var v = +slider.value, pack = v / 2, com = pack * 0.75;
      out.textContent = fmt(v);
      $$('[data-out="valor"]').forEach(function (n) { n.textContent = fmt(v); });
      $$('[data-out="pack"]').forEach(function (n) { n.textContent = fmt(pack); });
      $$('[data-out="comercio"]').forEach(function (n) { n.textContent = fmt(com); });
    };
    slider.addEventListener('input', pintar); pintar();
  }, 'cuenta');

  // Recorridos de planes: la escena queda fija y se va contando al bajar
  safe(function () {
    var stories = $$('[data-story]'); if (!stories.length) return;
    var tabs = $$('[data-tab]');
    var HEAD = window.innerWidth < 900 ? 116 : 122;
    var data = stories.map(function (s) {
      s.classList.add('story--scroll');
      return {
        el: s,
        steps: $$('.sstep', s),
        layers: $$('.layer', s),
        rail: $$('.story__rail i', s),
        cur: -1
      };
    });
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight, head = window.innerWidth < 900 ? 116 : 122;
      var activo = null;
      data.forEach(function (d) {
        var r = d.el.getBoundingClientRect();
        var span = r.height - (vh - head);
        var p = clamp((head - r.top) / Math.max(1, span));
        var n = d.steps.length;
        var idx = Math.min(n - 1, Math.floor(p * n));
        if (idx !== d.cur) {
          d.cur = idx;
          d.steps.forEach(function (s, k) { s.classList.toggle('is-on', k === idx); });
          d.layers.forEach(function (l, k) { l.classList.toggle('is-on', k === idx); });
          d.rail.forEach(function (i, k) { i.className = k < idx ? 'is-done' : (k === idx ? 'is-now' : ''); });
        }
        if (r.top <= vh * 0.45 && r.bottom > vh * 0.45) activo = d.el.id;
      });
      if (activo) tabs.forEach(function (t) { t.classList.toggle('is-on', t.getAttribute('data-tab') === activo); });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }, 'stories');

  // Balanza y tablet flotando: se mueven con el mouse o el dedo
  safe(function () {
    $$('[data-tilt]').forEach(function (el) {
      var drag = false;
      function mover(e) {
        var r = el.getBoundingClientRect();
        var x = clamp((e.clientX - r.left) / r.width), y = clamp((e.clientY - r.top) / r.height);
        el.style.setProperty('--ry', ((x - 0.5) * 36).toFixed(1) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 20).toFixed(1) + 'deg');
      }
      function reset() { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); }
      el.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || drag) mover(e); });
      el.addEventListener('pointerdown', function (e) { drag = true; el.classList.add('is-drag'); try { el.setPointerCapture(e.pointerId); } catch (x) {} mover(e); });
      function fin() { drag = false; el.classList.remove('is-drag'); }
      el.addEventListener('pointerup', fin);
      el.addEventListener('pointercancel', fin);
      el.addEventListener('pointerleave', function () { if (!drag) reset(); });
    });
  }, 'tilt');

  // Balanza y tablet: también con teclado
  safe(function () {
    $$('[data-tilt]').forEach(function (el) {
      var ry = 0, rx = 0;
      el.addEventListener('keydown', function (e) {
        var k = e.key, h = false;
        if (k === 'ArrowLeft') { ry -= 8; h = true; } else if (k === 'ArrowRight') { ry += 8; h = true; }
        else if (k === 'ArrowUp') { rx += 6; h = true; } else if (k === 'ArrowDown') { rx -= 6; h = true; }
        else if (k === 'Escape' || k === '0') { ry = 0; rx = 0; h = true; }
        if (!h) return;
        e.preventDefault();
        ry = Math.max(-18, Math.min(18, ry)); rx = Math.max(-10, Math.min(10, rx));
        el.style.setProperty('--ry', ry + 'deg'); el.style.setProperty('--rx', rx + 'deg');
      });
    });
  }, 'tilt-teclado');

  // Pausa el anillo del hero cuando no se ve
  safe(function () {
    var hero = $('.hero'); if (!hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) { hero.classList.toggle('is-offscreen', !es[0].isIntersecting); }).observe(hero);
  }, 'hero-pausa');

  // Regiones con scroll horizontal: accesibles con teclado
  safe(function () {
    $$('.tablewrap,.road,.tabsbar__in').forEach(function (n) { n.setAttribute('tabindex', '0'); });
  }, 'a11y');
})();
