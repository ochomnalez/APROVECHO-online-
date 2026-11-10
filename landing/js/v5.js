
/* 00-core.js */
/* APROVECHO · landing v5 · núcleo de movimiento.
   Cada escena se registra con APV5.scene(nombre, fn). Si la persona pidió «movimiento reducido»
   o GSAP no cargó, no se inicia nada y la página queda como secciones normales (CSS sin .motion). */
window.APV5 = (function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scenes = [];
  function start() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('motion');
    var mm = gsap.matchMedia();
    var ctx = { gsap: gsap, ScrollTrigger: ScrollTrigger, mm: mm, desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' };
    scenes.forEach(function (s) { try { s[1](ctx); } catch (e) { if (window.console) console.warn('escena ' + s[0], e); } });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  if (document.readyState !== 'loading') start(); else document.addEventListener('DOMContentLoaded', start);
  return { reduce: reduce, scene: function (name, fn) { scenes.push([name, fn]); } };
})();

/* 10-nav.js */
/* v5 · nav: capítulo actual en el mini anillo (siempre) + giro con el scroll (solo con movimiento) */
(function () {
  'use strict';
  var btn = document.querySelector('.nv-ring');
  if (!btn) return;
  var label = btn.querySelector('[data-nv-label]');
  var menu = document.getElementById('menu');
  var ids = ['problema', 'plan-base', 'plan-smart', 'plan-intelligence'];
  var info = [
    { l: 'Menú', a: 0 }, { l: 'El problema', a: 0 }, { l: '01 · Recuperá', a: 1 },
    { l: '02 · Medí', a: 2 }, { l: '03 · Anticipá', a: 3 }
  ];
  var last = -1, raf = 0;

  function calc() {
    raf = 0;
    var mid = window.innerHeight * 0.5, idx = 0, i, el;
    for (i = 0; i < ids.length; i++) {
      el = document.getElementById(ids[i]);
      if (el && el.getBoundingClientRect().top <= mid) idx = i + 1;
    }
    var st = info[idx];
    if (idx === 4) {
      var r = document.getElementById(ids[3]).getBoundingClientRect();
      if (r.bottom < mid) { idx = 5; st = { l: 'Menú', a: 3 }; }
    }
    if (idx === last) return;
    last = idx;
    btn.setAttribute('data-ch', st.a);
    label.textContent = st.l;
    btn.setAttribute('aria-label', st.l === 'Menú' ? 'Menú' : 'Menú, capítulo actual: ' + st.l);
  }
  function ask() { if (!raf) raf = requestAnimationFrame(calc); }
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
  window.addEventListener('load', function () { ask(); setTimeout(ask, 400); });
  calc();

  // tocar fuera del panel lo cierra (main.js alterna el menú al hacer clic en el botón)
  document.addEventListener('click', function (e) {
    if (!menu || !menu.classList.contains('is-open')) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    btn.click();
  });

  APV5.scene('nav-giro', function (ctx) {
    var svg = btn.querySelector('.nv-ring__svg');
    ctx.gsap.to(svg, {
      rotation: 720, ease: 'none', transformOrigin: '50% 50%',
      scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.6 }
    });
  });
})();

/* 50-medi.js */
/* v5 · 02 Medí · la estación se desarma pieza por pieza (tablet, soporte, balanza). */
APV5.scene('medi', function (ctx) {
  var gsap = ctx.gsap;
  var root = document.getElementById('plan-smart');
  if (!root) return;
  var tab = root.querySelector('[data-md="tab"]');
  var arm = root.querySelector('[data-md="arm"]');
  var bal = root.querySelector('[data-md="bal"]');
  var shadows = root.querySelectorAll('.md-sh');
  var lines = root.querySelectorAll('.md-lines path');
  var dots = root.querySelectorAll('.md-dots circle');
  var calls = root.querySelectorAll('[data-md-c]');
  var datums = root.querySelectorAll('[data-md-d]');
  var steps = root.querySelectorAll('.ch__steps li');
  var stage = root.querySelector('.md-stage');

  // pose armada = pose final (CSS) + este desplazamiento; k reduce el despiece en celular
  function build(k) {
    var tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.fromTo(tab, { xPercent: 20.75 * k, yPercent: 53.7 * k, rotation: 7 * k }, { xPercent: 0, yPercent: 0, rotation: 0, duration: 3 }, 1)
      .fromTo(arm, { xPercent: -4.7 * k, yPercent: -16 * k }, { xPercent: 0, yPercent: 0, duration: 3 }, 1)
      .fromTo(bal, { xPercent: -22.9 * k, yPercent: -27 * k }, { xPercent: 0, yPercent: 0, duration: 3 }, 1)
      .fromTo(shadows, { opacity: 0, scaleX: .45 }, { opacity: 1, scaleX: 1, duration: 3 }, 1)
      .fromTo(lines, { opacity: 0 }, { opacity: .55, duration: .8, ease: 'none' }, 3.6)
      .fromTo(dots, { opacity: 0, scale: .2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .6, stagger: .08, ease: 'back.out(2)' }, 3.7);
    gsap.set(calls, { opacity: 0 });
    gsap.set(datums, { opacity: 0 });
    calls.forEach(function (c, i) {
      tl.fromTo(c, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, 4.4 + i * 1.2);
    });
    datums.forEach(function (d, i) {
      tl.fromTo(d, { opacity: 0, y: 18, scale: .92 }, { opacity: 1, y: 0, scale: 1, duration: .8, ease: 'power3.out' }, 8 + i * .8);
    });
    tl.to({}, { duration: .4 }, 9.6); // pausa final: total 10
    return tl;
  }

  var cur = -1, called = -1;
  function mark(p) {
    var t = p * 10, s = t < 4.4 ? 0 : t < 6.8 ? 1 : t < 8.4 ? 2 : 3;
    if (s !== cur) {
      cur = s;
      steps.forEach(function (li, i) { li.classList.toggle('is-on', i === s); });
    }
    var c = t < 4.4 ? -1 : t < 5.6 ? 0 : t < 6.8 ? 1 : 2;
    if (c !== called) {
      called = c;
      calls.forEach(function (el, i) { el.classList.toggle('is-on', i === c); });
    }
  }

  ctx.mm.add(ctx.desktop, function () {
    var tl = build(1);
    mark(0);
    ctx.ScrollTrigger.create({
      animation: tl, trigger: root, start: 'top top', end: '+=200%',
      pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (self) { mark(self.progress); }
    });
    return function () { steps.forEach(function (li) { li.classList.remove('is-on'); }); cur = called = -1; };
  });

  ctx.mm.add(ctx.mobile, function () {
    var tl = build(.7);
    steps.forEach(function (li) { li.classList.remove('is-on'); });
    ctx.ScrollTrigger.create({
      animation: tl, trigger: stage, start: 'top 88%', end: 'bottom 38%', scrub: .6,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        var t = self.progress * 10;
        calls.forEach(function (el, i) { el.classList.toggle('is-on', t >= 4.4 + i * 1.2 && t < 5.6 + i * 1.2); });
      }
    });
  });
});
