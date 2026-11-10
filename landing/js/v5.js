
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

/* 20-hero.js */
/* v5 · portada: «el anillo se abre» al bajar (solo con movimiento) */
APV5.scene('hero', function (ctx) {
  var g = ctx.gsap;
  var hero = document.querySelector('.hr');
  if (!hero) return;
  var wrap = hero.querySelector('.hr__ringwrap');
  var core = hero.querySelector('.hr__core');
  var chips = hero.querySelectorAll('.hr__chip');
  var arcs = hero.querySelectorAll('.hr-a');
  var copy = hero.querySelector('.hr__copy');
  var foot = hero.querySelector('.hr__foot');

  function build(trig, dist, pinEnd, start, scaleTo, copyY) {
    var tl = g.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: trig, start: start, end: pinEnd, scrub: 0.6, pin: pinEnd.indexOf('+=') === 0, anticipatePin: 1, invalidateOnRefresh: true }
    });
    tl.to(wrap, { scale: scaleTo, duration: 1 }, 0);
    arcs.forEach(function (a) {
      tl.to(a, { x: a.getAttribute('data-dx') * dist, y: a.getAttribute('data-dy') * dist, opacity: 0, svgOrigin: '160 160', duration: 1 }, 0);
    });
    tl.to(core, { scale: 0.55, opacity: 0.25, duration: 1 }, 0);
    tl.to(chips, { opacity: 0, duration: 0.35 }, 0);
    if (copyY !== null) {
      tl.to(copy, { y: copyY, opacity: 0, duration: 0.7 }, 0);
      tl.to(foot, { opacity: 0, duration: 0.4 }, 0);
    }
    return tl;
  }
  ctx.mm.add(ctx.desktop, function () {
    build(hero, 1, '+=60%', 'top top+=68', 1.2, -90);
  });
  ctx.mm.add(ctx.mobile, function () {
    build(hero.querySelector('.hr__art'), 0.7, 'bottom top+=68', 'center 75%', 1.1, null);
  });
});

/* 30-problema.js */
/* v5 · el problema: la cifra cuenta de 0 a 58,4 y la foto de adentro se desplaza (solo con movimiento) */
APV5.scene('problema', function (ctx) {
  var g = ctx.gsap;
  var live = document.querySelector('[data-pb-count]');
  var sec = document.getElementById('problema');
  if (!live || !sec) return;
  var fmt = function (n) { return n.toFixed(1).replace('.', ',') + '%'; };
  var o = { v: 0 };
  live.textContent = fmt(0);
  g.to(o, {
    v: 58.4, duration: 1.7, ease: 'power2.out',
    onUpdate: function () { live.textContent = fmt(o.v); },
    onComplete: function () { live.textContent = '58,4%'; },
    scrollTrigger: { trigger: live, start: 'top 82%', once: true }
  });
  g.fromTo(live, { backgroundPositionY: '10%' }, {
    backgroundPositionY: '90%', ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
  });
  var items = sec.querySelectorAll('.pb__side li, .pb__cap');
  g.set(items, { opacity: 0, y: 28 });
  g.to(items, {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.14,
    scrollTrigger: { trigger: sec.querySelector('.pb__cap'), start: 'top 88%', once: true }
  });
});

/* 40-recupera.js */
/* APROVECHO · landing v5 · 01 Recuperá (Plan Base): la app se desarma capa por capa al bajar.
   Solo corre con html.motion; sin eso la pila queda desarmada y estática (CSS). */
APV5.scene('recupera', function (ctx) {
  'use strict';
  var gsap = ctx.gsap, ScrollTrigger = ctx.ScrollTrigger;
  var root = document.getElementById('plan-base');
  if (!root) return;
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var pls = $$('.rc-pl'), labws = $$('.rc-labw'), labs = $$('.rc-lab'), layers = $$('.rc-layer');
  var lis = $$('.ch__steps li'), rects = $$('.rc-det rect'), tags = $$('.rc-tag');
  var amount = root.querySelector('.rc-amount');
  var stage = root.querySelector('.rc-stage');
  if (pls.length !== 5 || labws.length !== 5 || lis.length !== 5) return;
  var H = 23; // alto de una placa, en em (las posiciones se animan en % de ese alto: escalan solas)

  // recuadros de detección: se dibujan al activarse el paso 2
  var detTl = gsap.timeline({ paused: true })
    .fromTo(rects, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out', stagger: 0.14 }, 0)
    .fromTo(tags, { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.14 }, 0.35);
  detTl.progress(0);
  var counter = { v: 4575 };
  function fmt(n) { return '$' + Math.round(n).toLocaleString('es-AR'); }

  var cur = { idx: -2, hl: -2 };
  function apply(idx, hl) {
    if (idx !== cur.idx) {
      lis.forEach(function (li, i) { li.classList.toggle('is-on', i === idx); });
    }
    if (hl !== cur.hl) {
      layers.forEach(function (l, i) { l.classList.toggle('is-on', i === hl); });
      labs.forEach(function (l, i) { l.classList.toggle('is-on', i === hl); });
      pls.forEach(function (p, i) {
        gsap.to(p, { xPercent: i === hl ? -4 : 0, scale: i === hl ? 1.045 : 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      });
      // detección
      if (hl >= 1) detTl.play(); else detTl.reverse();
      // conteo de la plata
      if (amount) {
        gsap.killTweensOf(counter);
        if (hl === 4) {
          counter.v = 0;
          gsap.to(counter, { v: 4575, duration: 0.9, ease: 'power2.out', onUpdate: function () { amount.textContent = fmt(counter.v); }, onComplete: function () { amount.textContent = '$4.575'; } });
        } else { counter.v = 4575; amount.textContent = '$4.575'; }
      }
    }
    cur.idx = idx; cur.hl = hl;
  }
  function reset() {
    lis.forEach(function (li, i) { li.classList.toggle('is-on', i === 0); });
    layers.concat(labs).forEach(function (l) { l.classList.remove('is-on'); });
    gsap.killTweensOf(pls);
    gsap.set(pls, { clearProps: 'all' });
    detTl.progress(1);
    if (amount) amount.textContent = '$4.575';
    cur = { idx: -2, hl: -2 };
  }

  // separación de las capas (compacta -> desarmada) y aparición de los rótulos
  function separation(tl, y0, c, pitch, t0, dur) {
    pls.forEach(function (p, i) {
      tl.fromTo(p, { yPercent: (y0 + c * i) / H * 100 }, { yPercent: pitch * i / H * 100, ease: 'power2.inOut', duration: dur }, t0 + i * dur * 0.05);
    });
    labws.forEach(function (w, i) {
      tl.fromTo(w, { yPercent: (y0 + c * i) / H * 100 }, { yPercent: pitch * i / H * 100, ease: 'power2.inOut', duration: dur }, t0 + i * dur * 0.05);
    });
    labs.forEach(function (l, i) {
      tl.fromTo(l, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, ease: 'power2.out', duration: dur * 0.28 }, t0 + dur * 0.4 + i * dur * 0.11);
    });
  }

  // ---------- escritorio: la sección se fija y se recorre paso por paso ----------
  ctx.mm.add(ctx.desktop, function () {
    var SEP = 0.28, STEP = (1 - SEP) / 5;
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    separation(tl, 24.25, 1.4, 13.5, 0, 2.8);
    tl.set({}, {}, 10);
    apply(0, -1);
    ScrollTrigger.create({
      trigger: root, start: 'top top', end: '+=220%', pin: true, scrub: 0.6, anticipatePin: 1,
      animation: tl, invalidateOnRefresh: true,
      onUpdate: function (self) {
        var p = self.progress;
        if (p < SEP) apply(0, -1);
        else { var i = Math.min(4, Math.floor((p - SEP) / STEP)); apply(i, i); }
      }
    });
    return function () { reset(); };
  });

  // ---------- celular: pila chica y fija arriba; los pasos la activan al bajar ----------
  ctx.mm.add(ctx.mobile, function () {
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    separation(tl, 17.2, 1.2, 10, 0, 1);
    ScrollTrigger.create({ trigger: stage, start: 'top 92%', end: 'top 32%', scrub: 0.5, animation: tl, invalidateOnRefresh: true });
    apply(0, -1);
    lis.forEach(function (li, i) {
      ScrollTrigger.create({
        trigger: li, start: 'top 74%', end: 'bottom 74%',
        onEnter: function () { apply(i, i); },
        onEnterBack: function () { apply(i, i); },
        onLeaveBack: function () { if (i === 0) apply(0, -1); }
      });
    });
    return function () { reset(); };
  });
});

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
