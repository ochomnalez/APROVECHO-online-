
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
  // v5.js se carga con defer: las escenas se registran después de este bloque, así que se arranca
  // recién en DOMContentLoaded (o en el próximo ciclo si el documento ya terminó de cargar).
  if (document.readyState === 'complete') setTimeout(start, 0); else document.addEventListener('DOMContentLoaded', start);
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
  var ids = ['plan-base', 'plan-smart', 'plan-intelligence'];
  var info = [
    { l: 'Menú', a: 0 }, { l: '01 · Recuperá', a: 1 }, { l: '02 · Medí', a: 2 }, { l: '03 · Anticipá', a: 3 }
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
    if (idx === 3) {
      var r = document.getElementById(ids[2]).getBoundingClientRect();
      if (r.bottom < mid) { idx = 4; st = { l: 'Menú', a: 3 }; }
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

  // «Sumá tu comercio» de la barra se oculta mientras se ve el de la portada
  var cta = document.querySelector('.nav__cta');
  var heroBtns = document.querySelector('.hr .hero__actions');
  if (cta && heroBtns && 'IntersectionObserver' in window) {
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
    new IntersectionObserver(function (es) {
      cta.classList.toggle('is-covered', es[0].isIntersecting);
    }, { rootMargin: '-' + navH + 'px 0px 0px 0px' }).observe(heroBtns);
  }

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
/* v5 · portada: rotador de 3 videos de fondo (publicá → medí con balanza → entrega) con fundido cruzado.
   Sin movimiento reducido ni ahorro de datos: solo el póster del primero. */
(function () {
  'use strict';
  var sec = document.querySelector('.hr');
  if (!sec) return;
  var clips = [].slice.call(sec.querySelectorAll('.hr__clip'));
  var vids = clips.map(function (c) { return c.querySelector('video'); });
  var imgs = clips.map(function (c) { return c.querySelector('img'); });
  var bars = [].slice.call(sec.querySelectorAll('.hr__bar'));
  var fills = bars.map(function (b) { return b.querySelector('b'); });
  var cap = sec.querySelector('[data-hr-cap]');
  var btn = sec.querySelector('[data-hr-pause]');
  var LABELS = ['Publicás en segundos', 'Medís con balanza', 'Tu vecino lo retira'];
  var DUR = 6000, FADE = 1000;
  var N = clips.length;
  var ahorro = !!(navigator.connection && navigator.connection.saveData);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || ahorro || !('IntersectionObserver' in window)) { sec.classList.add('is-static'); return; }

  var small = window.matchMedia('(max-width: 899px)').matches;
  var cur = 0, elapsed = 0, waited = 0, last = 0, raf = 0, started = false;
  var userPaused = false, offscreen = false, hidden = document.hidden;

  function load(i) {
    var v = vids[i];
    if (imgs[i].getAttribute('data-src')) { imgs[i].src = imgs[i].getAttribute('data-src'); imgs[i].removeAttribute('data-src'); }
    if (!v || v.getAttribute('src')) return;
    v.addEventListener('playing', function () { v.classList.add('is-ready'); }, { once: true });
    v.addEventListener('canplay', function () { if (cur === i && !isPaused()) play(i); });
    v.addEventListener('error', function () { v.setAttribute('data-err', '1'); });
    v.src = 'video/hero-ia/' + clips[i].getAttribute('data-clip') + (small ? '-1280.mp4' : '-1920.mp4');
    v.preload = 'auto';
    try { v.load(); } catch (e) {}
  }
  function play(i) {
    var v = vids[i];
    if (!v || !v.getAttribute('src')) return;
    var p = v.play();
    if (p && p.catch) p.catch(function (e) { if (e && e.name === 'NotAllowedError' && started && i === 0 && !v.currentTime) giveUp(); });
  }
  // si el navegador no deja reproducir (ahorro de batería, etc.) queda solo el póster
  function giveUp() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    sec.classList.remove('is-live'); sec.classList.add('is-static');
    started = false;
  }
  function isPaused() { return userPaused || offscreen || hidden; }

  function setBars() {
    for (var i = 0; i < N; i++) {
      var p = i < cur ? 1 : i === cur ? Math.min(1, elapsed / DUR) : 0;
      fills[i].style.transform = 'scaleX(' + p.toFixed(3) + ')';
    }
  }
  function label() {
    cap.classList.remove('is-in');
    cap.textContent = LABELS[cur];
    void cap.offsetWidth;
    cap.classList.add('is-in');
    bars.forEach(function (b, i) { if (i === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  }
  function go(next) {
    if (next === cur) return;
    var old = clips[cur], oldIdx = cur, nv = vids[next];
    load(next);
    if (nv && nv.getAttribute('src')) { try { nv.currentTime = 0; } catch (e) {} if (!isPaused()) play(next); }
    old.classList.remove('is-on'); old.classList.add('is-prev');
    clips[next].classList.add('is-on');
    setTimeout(function () {
      clips[oldIdx].classList.remove('is-prev');
      if (oldIdx !== cur && vids[oldIdx]) vids[oldIdx].pause();
    }, FADE + 80);
    cur = next; elapsed = 0; waited = 0;
    label();
    load((cur + 1) % N);
    setBars();
  }
  // el reloj corre solo mientras el clip actual realmente se está reproduciendo
  function running() {
    var v = vids[cur];
    return !v || v.getAttribute('data-err') || v.ended || (!v.paused && v.readyState >= 3);
  }
  function tick(t) {
    raf = 0;
    if (!started || isPaused()) return;
    var dt = Math.min(t - last, 100); last = t;
    if (running()) elapsed += dt;
    if (elapsed >= DUR) {
      var nxt = (cur + 1) % N, nv = vids[nxt];
      // espera (hasta 3 s) a que el próximo clip esté listo, así el fundido no tiene saltos
      if (nv && nv.getAttribute('src') && !nv.getAttribute('data-err') && nv.readyState < 3 && waited < 3000) { waited += dt; elapsed = DUR; }
      else go(nxt);
    }
    setBars();
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    if (!started) return;
    if (isPaused()) {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      vids.forEach(function (v) { if (v) v.pause(); });
    } else {
      play(cur);
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    }
  }
  function begin() {
    if (started) return;
    started = true;
    sec.classList.add('is-live');
    load(0); load(1);
    setBars();
    sync();
  }

  btn.addEventListener('click', function () {
    userPaused = !userPaused;
    sec.classList.toggle('is-userpaused', userPaused);
    btn.setAttribute('aria-label', userPaused ? 'Reproducir el video de fondo' : 'Pausar el video de fondo');
    sync();
  });
  bars.forEach(function (b, i) {
    b.addEventListener('click', function () {
      if (i === cur) return;
      go(i);
      if (userPaused) btn.click(); else sync();
    });
  });
  document.addEventListener('visibilitychange', function () { hidden = document.hidden; sync(); });

  // los videos se piden recién después del evento load; se pausan al salir de pantalla
  function afterLoad(fn) { if (document.readyState === 'complete') setTimeout(fn, 60); else window.addEventListener('load', function () { setTimeout(fn, 60); }, { once: true }); }
  afterLoad(begin);
  new IntersectionObserver(function (es) { offscreen = !es[0].isIntersecting; sync(); }).observe(sec);

  // paralaje y zoom lentos con el scroll (solo con movimiento; sin pin)
  APV5.scene('hero', function (ctx) {
    var g = ctx.gsap;
    var media = sec.querySelector('.hr__media');
    ctx.mm.add(ctx.desktop, function () {
      g.fromTo(media, { yPercent: 0, scale: 1 }, { yPercent: 5, scale: 1.06, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    });
    ctx.mm.add(ctx.mobile, function () {
      g.fromTo(media, { scale: 1 }, { scale: 1.08, ease: 'none', scrollTrigger: { trigger: sec.querySelector('.hr__bg'), start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });
  });
})();

/* 25-contadores.js */
/* v5 · contadores en tiempo real. Cuentan desde 0 solo mientras la franja se ve y la pestaña está visible.
   Con «movimiento reducido» no cuentan: queda el HTML con los valores de un minuto. */
(function () {
  'use strict';
  var sec = document.querySelector('[data-ct-sec]');
  if (!sec) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = {};
  [].forEach.call(sec.querySelectorAll('[data-ct]'), function (e) { els[e.getAttribute('data-ct')] = e; });
  var SEC_YEAR = 365 * 86400;
  var KG_S = 16e9 / SEC_YEAR;                     // 16 millones de t por año (MAGyP 2022)
  var RATES = { kg: KG_S, co2: KG_S * 2.53, agua: KG_S * 192 }; // × 2,53 kg CO2e/kg · × 192 L/kg (FAO)
  var fmt = function (n) { return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };

  // cada carácter va en su casillero de ancho fijo; solo se reescriben los que cambian
  function paint(el, str) {
    if (el.getAttribute('data-len') !== String(str.length)) {
      var html = '';
      for (var i = 0; i < str.length; i++) html += '<span class="' + (str.charAt(i) === '.' ? 'ct__p' : 'ct__d') + '">' + str.charAt(i) + '</span>';
      el.innerHTML = html;
      el.setAttribute('data-len', String(str.length));
    }
    var kids = el.children;
    for (var j = 0; j < kids.length; j++) if (kids[j].textContent !== str.charAt(j)) kids[j].textContent = str.charAt(j);
  }
  function show(sec_) { for (var k in els) paint(els[k], fmt(RATES[k] * sec_)); }

  if (reduce || !('IntersectionObserver' in window)) { show(60); return; } // un minuto, fijo

  sec.classList.add('ct--live');
  show(0);
  var acc = 0, last = 0, timer = null, inView = false;
  function tick() {
    var now = performance.now();
    acc += now - last; last = now;
    show(acc / 1000);
  }
  function sync() {
    var run = inView && !document.hidden;
    if (run && !timer) { last = performance.now(); timer = setInterval(tick, 100); }
    else if (!run && timer) { clearInterval(timer); timer = null; }
  }
  new IntersectionObserver(function (es) { inView = es[es.length - 1].isIntersecting; sync(); }, { threshold: 0.25 }).observe(sec);
  document.addEventListener('visibilitychange', sync);

  if (window.APV5) APV5.scene('contadores', function (ctx) {
    var items = sec.querySelectorAll('.ct__item, .ct__close');
    ctx.gsap.from(items, { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: sec, start: 'top 85%', once: true } });
  });
})();

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

/* 35-valor.js */
/* v5 · por qué sumar tu comercio: las tarjetas entran escalonadas y un hilo se dibuja de una a la siguiente */
APV5.scene('valor', function (ctx) {
  var g = ctx.gsap;
  var sec = document.getElementById('por-que-sumar');
  if (!sec) return;
  var cards = sec.querySelectorAll('.vl__card');
  var fills = sec.querySelectorAll('.vl__link i');
  var foot = sec.querySelector('.vl__foot');
  function run(axis) {
    var from = axis === 'x' ? { scaleX: 0 } : { scaleY: 0 };
    var to = axis === 'x' ? { scaleX: 1 } : { scaleY: 1 };
    g.set(cards, { opacity: 0, y: 36 });
    g.set(fills, from);
    g.set(foot, { opacity: 0, y: 20 });
    var tl = g.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: sec.querySelector('.vl__grid'), start: 'top 80%', once: true } });
    cards.forEach(function (c, i) {
      tl.to(c, { opacity: 1, y: 0, duration: 0.7 }, i * 0.45);
      if (fills[i]) tl.to(fills[i], Object.assign({ duration: 0.6, ease: 'power2.inOut' }, to), i * 0.45 + 0.35);
    });
    tl.to(foot, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
  }
  ctx.mm.add(ctx.desktop, function () { run('x'); });
  ctx.mm.add(ctx.mobile, function () { run('y'); });
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
    separation(tl, 19.2, 1.2, 11, 0, 1);
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
    tl.fromTo(tab, { xPercent: 11 * k, yPercent: 35.6 * k, rotation: 7 * k, scale: 1 - .06 * k }, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, duration: 3 }, 1)
      .fromTo(arm, { xPercent: 10.9 * k, yPercent: -17.8 * k }, { xPercent: 0, yPercent: 0, duration: 3 }, 1)
      .fromTo(bal, { xPercent: -24.8 * k, yPercent: -21.2 * k }, { xPercent: 0, yPercent: 0, duration: 3 }, 1)
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
      animation: tl, trigger: stage, start: 'top 85%', end: 'center 40%', scrub: .6,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        var t = self.progress * 10;
        calls.forEach(function (el, i) { el.classList.toggle('is-on', t >= 4.4 + i * 1.2 && t < 5.6 + i * 1.2); });
      }
    });
  });
});

/* 60-anticipa.js */
/* v5 · 03 Anticipá · el tablero se arma con las piezas de todas las sucursales y se dibuja la línea. */
APV5.scene('anticipa', function (ctx) {
  var gsap = ctx.gsap;
  var root = document.getElementById('plan-intelligence');
  if (!root) return;
  var board = root.querySelector('.an-board');
  var tiles = gsap.utils.toArray('[data-an-t]', root);
  var shadows = root.querySelectorAll('.an-t__sh');
  var full = root.querySelector('.an-full');
  var frame = root.querySelector('.an-frame');
  var cap = root.querySelector('.an-cap');
  var line = root.querySelector('.an-line__m');
  var dots = root.querySelectorAll('.an-line__dots circle');
  var pt = root.querySelector('.an-line__pt');
  var base = root.querySelector('.an-line__base');
  var note = root.querySelector('.an-note');
  var steps = root.querySelectorAll('.ch__steps li');

  // desde dónde llega cada pieza (en % de su propio tamaño): sucursales sueltas que llegan de los costados
  var FROM = [
    { x: -50, y: -60, r: -13 }, { x: 8, y: -105, r: 5 }, { x: 80, y: -40, r: 11 },
    { x: -50, y: 75, r: 9 }, { x: -6, y: 100, r: -6 }, { x: 85, y: 50, r: -10 }
  ];
  // se llega en este orden escalonado
  var ORDER = [0, 2, 3, 5, 1, 4];
  var RAD = ['16px 0 0 0', '0', '0 16px 0 0', '0 0 0 16px', '0', '0 0 16px 0'];
  var spans = tiles.map(function (t) { return t.querySelectorAll('span'); });

  function build(k) {
    var tl = gsap.timeline();
    gsap.set(full, { opacity: 0 });
    gsap.set(frame, { opacity: 0 });
    gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set([dots, pt], { opacity: 0, transformOrigin: '50% 50%' });
    gsap.set([base, note, cap], { opacity: 0 });
    tiles.forEach(function (t, i) {
      var f = FROM[i], n = ORDER.indexOf(i);
      var at = .4 + n * .35;
      tl.fromTo(t, { xPercent: f.x * k, yPercent: f.y * k, rotation: f.r * k, scale: .94, opacity: 0 },
        { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 2.1, ease: 'power3.out' }, at);
      tl.fromTo(shadows[i], { opacity: 0 }, { opacity: 1, duration: 1, ease: 'none' }, at);
      tl.to(shadows[i], { opacity: 0, duration: 1, ease: 'none' }, at + 1.1);
      // esquinas redondeadas mientras viaja; al encastrar, solo quedan las del borde del tablero
      tl.fromTo(spans[i], { borderRadius: '16px' }, { borderRadius: RAD[i], duration: .6, ease: 'none', immediateRender: true }, at + 1.5);
    });
    // clic de encastre: tablero de una sola pieza
    tl.to(full, { opacity: 1, duration: .1, ease: 'none' }, 4.1)
      .to(tiles, { opacity: 0, duration: .05, ease: 'none' }, 4.3)
      .to(frame, { opacity: 1, duration: .5, ease: 'none' }, 4.1)
      .to(cap, { opacity: 1, duration: .5, ease: 'none' }, 4.3)
      .fromTo(board, { scale: 1 }, { scale: 1.025, duration: .22, ease: 'power2.out', transformOrigin: '50% 50%' }, 4.1)
      .to(board, { scale: 1, duration: .38, ease: 'power2.inOut' }, 4.32)
      // línea ilustrativa
      .to(base, { opacity: 1, duration: .5, ease: 'none' }, 4.9)
      .to(note, { opacity: 1, duration: .6, ease: 'none' }, 4.9)
      .to(line, { strokeDashoffset: 0, duration: 2.2, ease: 'none' }, 5.2)
      .to(pt, { opacity: 1, duration: .3, ease: 'none' }, 7.3)
      .fromTo(pt, { scale: .3 }, { scale: 1, duration: .5, ease: 'back.out(2.5)' }, 7.3)
      .to(dots, { opacity: 1, duration: .25, stagger: .07, ease: 'none' }, 7.7);
    tl.to({}, { duration: .4 }, 9.6);
    return tl;
  }

  var cur = -1;
  function mark(p) {
    var t = p * 10, s = t < 4.4 ? 0 : t < 6.4 ? 1 : t < 8.2 ? 2 : 3;
    if (s !== cur) {
      cur = s;
      steps.forEach(function (li, i) { li.classList.toggle('is-on', i === s); });
    }
  }

  ctx.mm.add(ctx.desktop, function () {
    var tl = build(1);
    mark(0);
    ctx.ScrollTrigger.create({
      animation: tl, trigger: root, start: 'top top', end: '+=180%',
      pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (self) { mark(self.progress); }
    });
    return function () { steps.forEach(function (li) { li.classList.remove('is-on'); }); cur = -1; };
  });

  ctx.mm.add(ctx.mobile, function () {
    var tl = build(.55);
    steps.forEach(function (li) { li.classList.remove('is-on'); });
    ctx.ScrollTrigger.create({
      animation: tl, trigger: root.querySelector('.an-stage'), start: 'top 85%', end: 'bottom 62%', scrub: .6,
      invalidateOnRefresh: true
    });
  });
});

/* 75-inversores.js */
/* Inversores adentro de «Quiénes somos»: un botón abre y cierra el panel; los enlaces #inversores, #equipo
   e #inv-* también lo abren (aunque lleguen por la barra de direcciones). Sin JS, el panel se ve siempre. */
(function () {
  'use strict';
  var hub = document.getElementById('inversores');
  var btn = document.querySelector('[data-inv-toggle]');
  if (!hub || !btn) return;
  var label = btn.querySelector('[data-inv-label]');
  var CERRADO = 'Ver información para inversores', ABIERTO = 'Ocultar información para inversores';
  function set(open) {
    hub.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (label) label.textContent = open ? ABIERTO : CERRADO;
    if (open && window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 60);
  }
  function esInv(id) { return id === 'inversores' || id === 'equipo' || id.indexOf('inv-') === 0; }
  btn.addEventListener('click', function () { set(hub.hidden); });
  // captura: abrir el panel antes de que main.js mueva el scroll o seleccione la pestaña
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a && esInv(a.getAttribute('href').slice(1)) && hub.hidden) set(true);
  }, true);
  function porHash() { var id = location.hash.slice(1); if (id && esInv(id) && hub.hidden) set(true); }
  window.addEventListener('hashchange', porHash);
  porHash();
  if (!hub.hidden) set(true);
  else btn.hidden = false;
})();

/* 80-pasos.js */
/* v5 · sumate en 3 pasos: al bajar, la línea se dibuja y cada número se llena al llegar la línea */
APV5.scene('pasos', function (ctx) {
  var g = ctx.gsap;
  var sec = document.getElementById('pasos');
  if (!sec) return;
  var list = sec.querySelector('.ps__list');
  var steps = [].slice.call(sec.querySelectorAll('.ps__step'));
  var fills = steps.map(function (s) { return s.querySelector('.ps__link i'); });
  var n = steps.length;
  function run(axis) {
    var prop = axis === 'x' ? 'scaleX' : 'scaleY';
    fills.forEach(function (f) { if (f) g.set(f, axis === 'x' ? { scaleX: 0 } : { scaleY: 0 }); });
    steps.forEach(function (s, i) { s.classList.toggle('is-on', i === 0); });
    ctx.ScrollTrigger.create({
      trigger: list, start: 'top 72%', end: 'bottom 52%', scrub: 0.6,
      onUpdate: function (self) {
        var t = self.progress * (n - 1);
        fills.forEach(function (f, i) { if (f) { var o = {}; o[prop] = Math.max(0, Math.min(1, t - i)); g.set(f, o); } });
        steps.forEach(function (s, i) { s.classList.toggle('is-on', t >= i - 0.02); });
      }
    });
    return function () { steps.forEach(function (s) { s.classList.add('is-on'); }); };
  }
  ctx.mm.add(ctx.desktop, function () { return run('x'); });
  ctx.mm.add(ctx.mobile, function () { return run('y'); });
});
