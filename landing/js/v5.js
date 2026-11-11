
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
/* APROVECHO · landing v5 · 01 Recuperá (Plan Base): un teléfono con las pantallas reales de la app.
   Escritorio: la sección se fija y las pantallas pasan con el scroll (deslizamiento + fundido).
   Celular: el teléfono queda arriba y cada paso del texto activa sus pantallas.
   Solo anima transform/opacity de las capas de pantalla; sin html.motion queda una grilla estática. */
APV5.scene('recupera', function (ctx) {
  'use strict';
  var gsap = ctx.gsap, ScrollTrigger = ctx.ScrollTrigger;
  var root = document.getElementById('plan-base');
  if (!root) return;
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var scr = $$('.rc-scr'), labs = $$('.rc-lab'), dots = $$('.rc-dots i'), lis = $$('.ch__steps li');
  var N = scr.length;
  if (!N || labs.length !== N || dots.length !== N || lis.length !== 5) return;
  var stepOf = scr.map(function (s) { return +s.getAttribute('data-step'); });

  // las pantallas se piden un poco antes de llegar, para que no aparezcan vacías al deslizar
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      scr.forEach(function (s) { var im = s.querySelector('img'); if (im) im.loading = 'eager'; });
    }, { rootMargin: '150% 0px' });
    io.observe(root);
  }

  var cur = -1;
  function paint(i) {
    if (i === cur) return;
    cur = i;
    var st = stepOf[i];
    for (var k = 0; k < N; k++) {
      scr[k].classList.toggle('is-cur', k === i);
      labs[k].classList.toggle('is-on', k === i);
      dots[k].classList.toggle('is-cur', k === i);
      dots[k].classList.toggle('is-done', k < i);
    }
    for (var j = 0; j < lis.length; j++) lis[j].classList.toggle('is-on', j === st);
  }
  function reset() {
    gsap.killTweensOf(scr);
    gsap.set(scr, { clearProps: 'transform,opacity,visibility' });
    scr.forEach(function (s) { s.classList.remove('is-cur'); });
    labs.forEach(function (l) { l.classList.remove('is-on'); });
    dots.forEach(function (d) { d.classList.remove('is-cur', 'is-done'); });
    lis.forEach(function (li, j) { li.classList.toggle('is-on', j === 0); });
    cur = -1;
  }

  // ---------- escritorio: sección fija, una pantalla por vez ----------
  ctx.mm.add(ctx.desktop, function () {
    var D = 0.5, HOLD = 0.9;
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    for (var i = 1; i < N; i++) {
      tl.fromTo(scr[i], { xPercent: 100 }, { xPercent: 0, duration: D, ease: 'power2.inOut', immediateRender: true }, i);
      tl.fromTo(scr[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: D * 0.55, immediateRender: true }, i);
      tl.to(scr[i - 1], { xPercent: -24, duration: D, ease: 'power2.inOut' }, i);
      tl.to(scr[i - 1], { autoAlpha: 0, duration: D * 0.5 }, i + D * 0.4);
    }
    tl.to({}, { duration: HOLD }, N - 1 + D);
    paint(0);
    tl.eventCallback('onUpdate', function () {
      var i = Math.floor(tl.time() - D / 2);
      paint(i < 0 ? 0 : (i > N - 1 ? N - 1 : i));
    });
    ScrollTrigger.create({
      trigger: root, start: 'top top', end: '+=320%', pin: true, scrub: 0.6, anticipatePin: 1,
      animation: tl, invalidateOnRefresh: true
    });
    return function () { reset(); };
  });

  // ---------- celular: teléfono fijo arriba; cada paso activa sus pantallas ----------
  ctx.mm.add(ctx.mobile, function () {
    var timer = 0, shown = 0;
    gsap.set(scr.slice(1), { autoAlpha: 0, xPercent: 100 });
    gsap.set(scr[0], { autoAlpha: 1, xPercent: 0 });
    paint(0);
    function show(i) {
      if (i === shown) return;
      var dir = i > shown ? 1 : -1, prev = scr[shown], next = scr[i];
      gsap.killTweensOf(scr);
      scr.forEach(function (s, k) { if (k !== shown && k !== i) gsap.set(s, { autoAlpha: 0, xPercent: 100 }); });
      gsap.set(next, { xPercent: 100 * dir, autoAlpha: 0 });
      gsap.to(next, { xPercent: 0, duration: 0.55, ease: 'power3.out' });
      gsap.to(next, { autoAlpha: 1, duration: 0.3, ease: 'none' });
      gsap.to(prev, { xPercent: -24 * dir, duration: 0.55, ease: 'power3.out' });
      gsap.to(prev, { autoAlpha: 0, duration: 0.3, ease: 'none', delay: 0.1 });
      shown = i;
      paint(i);
    }
    function play(st) {
      clearTimeout(timer);
      var idx = [];
      stepOf.forEach(function (s, k) { if (s === st) idx.push(k); });
      var n = 0;
      show(idx[0]);
      (function next() {
        if (++n >= idx.length) return;
        timer = setTimeout(function () { show(idx[n]); next(); }, 2100);
      })();
    }
    var tr = lis.map(function (li, i) {
      return ScrollTrigger.create({
        trigger: li, start: 'top 64%', end: 'bottom 64%',
        onEnter: function () { play(i); },
        onEnterBack: function () { play(i); }
      });
    });
    return function () { clearTimeout(timer); tr.forEach(function (t) { t.kill(); }); reset(); };
  });
});

/* 45-onboarding.js */
/* APROVECHO · landing v5 · Recorrido completo (video de onboarding).
   El video (13,7 MB) NO se descarga hasta que la persona toca el play (preload="none").
   Con html.motion: el marco entra suave y el póster se asienta con un leve escalado. */
APV5.scene('onboarding', function (ctx) {
  'use strict';
  var root = document.getElementById('recorrido');
  if (!root) return;
  var player = root.querySelector('.ob__player');
  var video = root.querySelector('.ob__video');
  var btn = root.querySelector('.ob__play');
  var poster = root.querySelector('.ob__poster');
  var chaps = Array.prototype.slice.call(root.querySelectorAll('.ob__chap button'));
  var frame = root.querySelector('.ob__frame');
  var cta = root.querySelector('.ob__cta .btn');
  var loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    video.preload = 'auto'; // recién ahora, tras el clic, se permite bajar el video
    video.src = video.getAttribute('data-src');
    video.controls = true;
    video.hidden = false;
    player.classList.add('is-playing');
    if (btn) btn.hidden = true;
  }
  function play(at) {
    var first = !loaded;
    load();
    function go() {
      if (typeof at === 'number') { try { video.currentTime = at; } catch (e) {} }
      var p = video.play();
      if (p && p.catch) p.catch(function () { video.controls = true; });
    }
    if (first && typeof at === 'number') video.addEventListener('loadedmetadata', go, { once: true }); else go();
    video.focus({ preventScroll: true });
  }
  function inView() {
    var r = frame.getBoundingClientRect();
    var top = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68) + 8;
    return r.top >= top - 40 && r.bottom <= window.innerHeight + 20;
  }

  if (btn) btn.addEventListener('click', function () { play(); });
  chaps.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = parseFloat(b.getAttribute('data-t'));
      chaps.forEach(function (c) { c.classList.toggle('is-cur', c === b); });
      if (!inView()) frame.scrollIntoView({ block: 'center', behavior: APV5.reduce ? 'auto' : 'smooth' });
      play(t);
    });
  });
  // el capítulo marcado sigue al video
  video.addEventListener('timeupdate', function () {
    var t = video.currentTime, k = -1;
    chaps.forEach(function (b, i) { if (t >= parseFloat(b.getAttribute('data-t')) - 0.5) k = i; });
    chaps.forEach(function (b, i) { b.classList.toggle('is-cur', i === k); });
  });
  if (cta) cta.addEventListener('click', function () { if (!video.paused) video.pause(); });

  // ---------- con movimiento ----------
  var g = ctx.gsap;
  function enter() {
    g.set(frame, { opacity: 0, y: 44, scale: 0.965, transformOrigin: '50% 0%' });
    g.set(poster, { scale: 1.07 });
    g.set(chaps.map(function (b) { return b.parentNode; }), { opacity: 0, y: 22 });
    g.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: frame, start: 'top 82%', once: true } })
      .to(frame, { opacity: 1, y: 0, scale: 1, duration: 0.95 }, 0)
      .to(poster, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
      .to(chaps.map(function (b) { return b.parentNode; }), { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.35);
  }
  ctx.mm.add(ctx.desktop, enter);
  ctx.mm.add(ctx.mobile, function () {
    g.set(frame, { opacity: 0, y: 28 });
    g.to(frame, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: frame, start: 'top 88%', once: true } });
  });
});

/* 50-medi.js */
/* v5 · ESTACIÓN (componente compartido, APV5.st) + 02 Medí.
   ------------------------------------------------------------------------------------------------
   ESTACIÓN (markup generado por src/v5/estacion-gen.py, estilos st- en css/50-medi.css):
   · .st-armada = foto armada (img/estacion/armada.webp). .st-p = cada pieza suelta (pieza-*.webp), con
     su posición final en data-x/y/w/h (unidades del cuadro 1774×887) y su arranque en la foto armada
     (data-u/v = centro dentro de la foto armada, data-ss/sr/sd = tamaño, rotación y retraso iniciales).
   · Reemplazar fotos: mismo nombre de archivo en img/estacion/. Si cambia la composición, actualizar
     piezas.json y correr estacion-gen.py.

   GIRO 360° (preparado, apagado por defecto):
   · Frames numerados en  img/estacion/giro/001.webp … NNN.webp  (3 dígitos; hoy 48 cuadros de 1500×1080, fondo
     blanco OPACO, un giro completo; 001 = vista armada). Se mezclan con multiply sobre el fondo del escenario.
   · Se activa poniendo data-giro-frames="NNN" en el .st-stage (partial de Medí y/o de Anticipá, vía
     estacion-gen.py). Opcionales: data-giro-dir="otra/carpeta/" y data-giro-ext="webp".
   · Cuando está activo, sobre la estación ARMADA se arrastra (mouse/touch, el scroll vertical sigue andando)
     o se usan las flechas ← → (la foto armada recibe foco) para girarla frame a frame. Sin el atributo (o con 0)
     no se pide ningún archivo y no hay errores.

   SECUENCIA DE ETAPAS (preparada, apagada): data-seq-frames="NNN" + img/estacion/secuencia/001.webp … NNN.webp
   (cuadro completo 1774×887, de armada a desarmada). Con eso el despiece se reproduce frame a frame con el scroll
   (en vez de mover las piezas); al llegar al último frame se funde con las piezas sueltas (mismas posiciones). */
(function () {
  'use strict';
  var ST = APV5.st = {};
  var noop = function () {};
  function num(el, k, d) { var v = parseFloat(el.getAttribute('data-' + k)); return isNaN(v) ? d : v; }
  function pad(i, n) { var s = String(i); while (s.length < n) s = '0' + s; return s; }
  function flag(el, cls, on) { if (el.classList.contains(cls) !== !!on) el.classList.toggle(cls, !!on); }
  ST.flag = flag;

  // geometría: en unidades del cuadro; el arranque de cada pieza sale de dónde está en la foto armada
  function read(stage) {
    var arm = stage.querySelector('.st-armada');
    var a = { el: arm, x: num(arm, 'x', 0), y: num(arm, 'y', 0), w: num(arm, 'w', 1), h: num(arm, 'h', 1), s: num(arm, 's', 1.15) };
    a.cx = a.x + a.w / 2; a.cy = a.y + a.h / 2;
    var ps = Array.prototype.map.call(stage.querySelectorAll('.st-p'), function (el) {
      var p = { el: el, key: el.getAttribute('data-st'), x: num(el, 'x', 0), y: num(el, 'y', 0), w: num(el, 'w', 1), h: num(el, 'h', 1),
        u: num(el, 'u', .5), v: num(el, 'v', .5), ss: num(el, 'ss', 1), sr: num(el, 'sr', 0), sd: num(el, 'sd', 0) };
      var px = a.x + p.u * a.w, py = a.y + p.v * a.h;
      var sx = a.cx + a.s * (px - a.cx), sy = a.cy + a.s * (py - a.cy);
      p.dx = (sx - (p.x + p.w / 2)) / p.w * 100;
      p.dy = (sy - (p.y + p.h / 2)) / p.h * 100;
      return p;
    });
    return { a: a, ps: ps };
  }

  // frames numerados (giro y secuencia)
  function frameList(stage, dirAttr, defDir, n) {
    var dir = stage.getAttribute(dirAttr) || defDir, ext = stage.getAttribute('data-giro-ext') || 'webp';
    var out = [];
    for (var i = 1; i <= n; i++) { var im = new Image(); im.decoding = 'async'; im.src = dir + pad(i, 3) + '.' + ext; out.push(im); }
    return out;
  }

  // Agrega al timeline el despiece: la armada se funde hacia atrás y las piezas salen de donde estaban.
  // k (0-1) afloja las rotaciones en celular.
  ST.separate = function (tl, stage, at, dur, k) {
    var d = read(stage), a = d.a, ps = d.ps;
    var gw = stage.querySelector('.st-gw'), armT = gw ? [a.el, gw] : [a.el];
    var nseq = parseInt(stage.getAttribute('data-seq-frames'), 10) || 0;
    var seq = stage.querySelector('.st-seq');
    if (nseq > 1 && seq) {
      var frames = frameList(stage, 'data-seq-dir', 'img/estacion/secuencia/', nseq), o = { f: 0 }, last = -1;
      seq.hidden = false;
      seq.style.opacity = 0;
      gsap.set(ps.map(function (p) { return p.el; }), { opacity: 0 });
      tl.set(seq, { opacity: 1 }, at).set(armT, { opacity: 0 }, at)
        .to(o, { f: nseq - 1, duration: dur, ease: 'none', onUpdate: function () {
          var i = Math.round(o.f); if (i === last) return; last = i;
          if (frames[i] && frames[i].complete && frames[i].naturalWidth) seq.src = frames[i].src;
        } }, at)
        .to(ps.map(function (p) { return p.el; }), { opacity: 1, duration: dur * .12, ease: 'none' }, at + dur * .92)
        .set(seq, { opacity: 0 }, at + dur * 1.04);
      return;
    }
    // la armada: escala apenas hacia atrás mientras se funde
    tl.fromTo(armT, { scale: a.s }, { scale: 1 - .05 * k, duration: dur * .7, ease: 'power2.out' }, at)
      .to(armT, { opacity: 0, duration: dur * .22, ease: 'none' }, at + dur * .1);
    ps.forEach(function (p) {
      var t0 = at + dur * p.sd, dd = dur * (1 - p.sd);
      gsap.set(p.el, { opacity: 0 });
      tl.fromTo(p.el, { xPercent: p.dx, yPercent: p.dy, rotation: p.sr * k, scale: a.s * p.ss },
        { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, duration: dd, ease: 'power2.inOut', immediateRender: true }, t0)
        .to(p.el, { opacity: 1, duration: Math.min(dd * .3, dur * .09), ease: 'none' }, t0);
    });
  };

  // resalta piezas (por clave) y atenúa el resto
  ST.on = function (stage, keys) {
    var sig = keys.join('|');
    if (stage._on === sig) return;
    stage._on = sig;
    Array.prototype.forEach.call(stage.querySelectorAll('.st-p'), function (el) {
      flag(el, 'is-on', keys.indexOf(el.getAttribute('data-st')) > -1);
    });
    flag(stage, 'has-on', keys.length > 0);
  };

  // interacción: carga anticipada, toque en celular y giro 360°
  ST.bind = function (stage) {
    if (stage._stb) return;
    stage._stb = 1;
    var imgs = Array.prototype.slice.call(stage.querySelectorAll('img[loading="lazy"]'));
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        imgs.forEach(function (im) { im.loading = 'eager'; if (im.decode) im.decode().catch(noop); });
      }, { rootMargin: '1400px 0px' });
      io.observe(stage);
    }
    // táctil: tocar una pieza muestra su etiqueta; tocar afuera o Esc la cierra
    function clearTap() { Array.prototype.forEach.call(stage.querySelectorAll('.st-p.is-tap'), function (el) { el.classList.remove('is-tap'); }); }
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      var p = e.target.closest && e.target.closest('.st-p');
      if (!p) return;
      var was = p.classList.contains('is-tap');
      clearTap();
      if (!was) p.classList.add('is-tap');
    });
    document.addEventListener('pointerdown', function (e) { if (!stage.contains(e.target)) clearTap(); });
    stage.addEventListener('keydown', function (e) { if (e.key === 'Escape') clearTap(); });
    giro(stage);
  };

  function giro(stage) {
    var n = parseInt(stage.getAttribute('data-giro-frames'), 10) || 0;
    var gw = stage.querySelector('.st-gw'), img = gw && gw.querySelector('.st-giro');
    if (n < 2 || !gw || !img) return;
    var frames = [], ok = [], cur = 0, drag = false, x0 = 0, f0 = 0, ppf = 8, started = false;
    // carga progresiva: 001 primero; después cada 8, cada 4, cada 2 y el resto (solo cuando la escena está cerca)
    function order() {
      var seen = {}, out = [];
      [n, 8, 4, 2, 1].forEach(function (st) { for (var i = 0; i < n; i += st === n ? n : st) if (!seen[i]) { seen[i] = 1; out.push(i); } });
      return out;
    }
    function start() {
      if (started) return; started = true;
      var q = order(), pend = 0;
      function next() {
        while (pend < 3 && q.length) {
          var i = q.shift(), im = new Image(); pend++;
          im.decoding = 'async'; frames[i] = im;
          im.onload = im.onerror = (function (i, im) { return function () {
            pend--; if (im.naturalWidth) { ok[i] = true; if (i === 0) { img.src = im.src; gw.hidden = false; stage.classList.add('is-giro'); } }
            next();
          }; })(i, im);
          im.src = (stage.getAttribute('data-giro-dir') || 'img/estacion/giro/') + pad(i + 1, 3) + '.' + (stage.getAttribute('data-giro-ext') || 'webp');
        }
      }
      next();
    }
    function show(i) {
      i = ((i % n) + n) % n;
      var j = i, k = 0;
      while (!ok[j] && k++ < n) j = (j + 1) % n;       // si el cuadro todavía no llegó, el más cercano que sí
      if (!ok[j]) return;
      cur = i; img.src = frames[j].src;
    }
    stage.classList.add('has-giro');
    gw.tabIndex = 0;
    gw.setAttribute('role', 'img');
    gw.setAttribute('aria-label', 'Estación armada. Arrastrala o usá las flechas izquierda y derecha para girarla.');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: '1200px 0px' });
      io.observe(stage);
    } else gw.addEventListener('pointerenter', start);
    gw.addEventListener('focus', start);
    gw.addEventListener('pointerdown', function (e) {
      if (!stage.classList.contains('is-armed')) return;
      start(); drag = true; x0 = e.clientX; f0 = cur; ppf = Math.max(3, gw.offsetWidth * 1.1 / n);
      try { gw.setPointerCapture(e.pointerId); } catch (err) { noop(); }
      gw.classList.add('is-drag');
    });
    gw.addEventListener('pointermove', function (e) { if (drag) show(f0 + Math.round((e.clientX - x0) / ppf)); });
    function end() { drag = false; gw.classList.remove('is-drag'); }
    gw.addEventListener('pointerup', end);
    gw.addEventListener('pointercancel', end);
    gw.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      start(); e.preventDefault(); show(cur + (e.key === 'ArrowRight' ? 1 : -1));
    });
  }
})();

/* ---------- 02 Medí: armada → desarmada → nombres → los 4 pasos ---------- */
APV5.scene('medi', function (ctx) {
  var gsap = ctx.gsap, ST = APV5.st;
  var root = document.getElementById('plan-smart');
  if (!root) return;
  var stage = root.querySelector('[data-st-stage]');
  var datums = Array.prototype.slice.call(root.querySelectorAll('[data-md-d]'));
  var steps = root.querySelectorAll('.ch__steps li');
  if (!stage) return;
  ST.bind(stage);

  // tiempos (desktop, total 10): 0,6-4,6 despiece · 4,7 nombres · pasos 4,7 / 6,2 / 7,6 / 8,8
  function build(m) {
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    gsap.set(datums, { opacity: 0 });
    ST.separate(tl, stage, m.at, m.dur, m.k);
    tl.fromTo(datums[0], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, m.a)
      .fromTo(datums[1], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, m.b)
      .to({}, { duration: .4 }, m.total - .4);
    return tl;
  }
  var D = { at: .6, dur: 4, k: 1, a: 5, b: 7.7, total: 10 };
  var M = { at: .2, dur: 5.2, k: .7, a: 6.1, b: 6.9, total: 7.6 };

  var cur = -2;
  function mark(p, m) {
    var t = p * m.total;
    ST.flag(stage, 'is-anim', t > .02 && t < m.at + m.dur + .3);
    ST.flag(stage, 'is-armed', t < m.at - .05);
    ST.flag(stage, 'is-sep', t >= m.at - .05);
    ST.flag(stage, 'is-names', m === D && t >= 4.7);
    if (m !== D) return;
    var s = t < 4.7 ? -1 : t < 6.2 ? 0 : t < 7.6 ? 1 : t < 8.8 ? 2 : 3;
    if (s === cur) return;
    cur = s;
    steps.forEach(function (li, i) { li.classList.toggle('is-on', i === s); });
    ST.on(stage, s === 0 ? ['balanza'] : s === 1 || s === 2 ? ['tablet'] : []);
  }
  function reset() {
    steps.forEach(function (li) { li.classList.remove('is-on'); });
    ['is-anim', 'is-armed', 'is-sep', 'is-names', 'has-on'].forEach(function (c) { stage.classList.remove(c); });
    ST.on(stage, []); stage._on = null; cur = -2;
  }

  ctx.mm.add(ctx.desktop, function () {
    var tl = build(D);
    mark(0, D);
    ctx.ScrollTrigger.create({
      animation: tl, trigger: root, start: 'top top', end: '+=220%',
      pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (self) { mark(self.progress, D); }
    });
    return reset;
  });

  ctx.mm.add(ctx.mobile, function () {
    var tl = build(M);
    steps.forEach(function (li) { li.classList.remove('is-on'); });
    mark(0, M);
    ctx.ScrollTrigger.create({
      animation: tl, trigger: stage, start: 'top 85%', end: 'bottom 40%', scrub: .6, invalidateOnRefresh: true,
      onUpdate: function (self) { mark(self.progress, M); }
    });
    return reset;
  });
});

/* 60-anticipa.js */
/* v5 · 03 Anticipá · PRIMERO la estación (armada → desarmada → nombres), DESPUÉS «lo demás»:
   la estación se achica a un costado, el tablero se arma con las piezas de todas las sucursales y se dibuja la línea. */
APV5.scene('anticipa', function (ctx) {
  var gsap = ctx.gsap, ST = APV5.st;
  var root = document.getElementById('plan-intelligence');
  if (!root) return;
  var area = root.querySelector('.an-stage');
  var stage = root.querySelector('[data-st-stage]');
  var st = root.querySelector('.an-st');
  var rot = root.querySelector('.an-rot');
  var bd = root.querySelector('.an-bd');
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
  if (!stage || !st || !bd) return;
  ST.bind(stage);

  // desde dónde llega cada pieza del tablero (en % de su propio tamaño): sucursales sueltas que llegan de los costados
  var FROM = [
    { x: -50, y: -60, r: -13 }, { x: 8, y: -105, r: 5 }, { x: 80, y: -40, r: 11 },
    { x: -50, y: 75, r: 9 }, { x: -6, y: 100, r: -6 }, { x: 85, y: 50, r: -10 }
  ];
  var ORDER = [0, 2, 3, 5, 1, 4];

  // el tablero y la línea; `at` = segundo de arranque, f = factor de duración
  function addBoard(tl, at, k, f) {
    gsap.set(full, { opacity: 0 });
    gsap.set(frame, { opacity: 0 });
    gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set([dots, pt], { opacity: 0, transformOrigin: '50% 50%' });
    gsap.set([base, note, cap], { opacity: 0 });
    tiles.forEach(function (t, i) {
      var fr = FROM[i], n = ORDER.indexOf(i), s = at + (.4 + n * .35) * f;
      tl.fromTo(t, { xPercent: fr.x * k, yPercent: fr.y * k, rotation: fr.r * k, scale: .94, opacity: 0 },
        { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 2.1 * f, ease: 'power3.out' }, s);
      tl.fromTo(shadows[i], { opacity: 0 }, { opacity: 1, duration: 1 * f, ease: 'none' }, s);
      tl.to(shadows[i], { opacity: 0, duration: 1 * f, ease: 'none' }, s + 1.1 * f);
    });
    // clic de encastre: tablero de una sola pieza
    var q = function (v) { return at + v * f; };
    tl.to(full, { opacity: 1, duration: .1, ease: 'none' }, q(4.1))
      .to(tiles, { opacity: 0, duration: .05, ease: 'none' }, q(4.3))
      .to(frame, { opacity: 1, duration: .5 * f, ease: 'none' }, q(4.1))
      .to(cap, { opacity: 1, duration: .5 * f, ease: 'none' }, q(4.3))
      .fromTo(board, { scale: 1 }, { scale: 1.025, duration: .22 * f, ease: 'power2.out', transformOrigin: '50% 50%' }, q(4.1))
      .to(board, { scale: 1, duration: .38 * f, ease: 'power2.inOut' }, q(4.32))
      // línea ilustrativa
      .to(base, { opacity: 1, duration: .5 * f, ease: 'none' }, q(5.2))
      .to(note, { opacity: 1, duration: .6 * f, ease: 'none' }, q(5.2))
      .to(line, { strokeDashoffset: 0, duration: 2.2 * f, ease: 'none' }, q(5.5))
      .to(pt, { opacity: 1, duration: .3 * f, ease: 'none' }, q(7.7))
      .fromTo(pt, { scale: .3 }, { scale: 1, duration: .5 * f, ease: 'back.out(2.5)' }, q(7.7))
      .to(dots, { opacity: 1, duration: .25 * f, stagger: .07 * f, ease: 'none' }, q(8.1));
  }

  // medidas del escenario: se leen una vez por refresh (no por cuadro)
  var geo = null;
  function measure() {
    var W = area.offsetWidth, H = area.offsetHeight;
    var bh = bd.offsetHeight, bt = H / 2 - bh / 2, boardH = board.offsetHeight;
    var S = W < 640 ? .34 : .3;
    var ty = bt + boardH / 2 - H / 2;                    // la estación chica queda a la altura del tablero
    geo = { S: S, ty: ty, cx: S * W / 2 - W / 2, cy: ty + S * .25 * W + 12 - .3 * W };
    return geo;
  }

  // desktop: pin ≤ +=300%  ·  total 14,2
  var A = { sep: .8, dur: 4, names: 4.9, shrink: 6, bd: 6.4, f: .8, total: 14.2, s: [6.4, 9.8, 12.4, 13.4] };
  var cur = -2;
  function mark(p) {
    var t = p * A.total;
    ST.flag(stage, 'is-armed', t < A.sep - .05);
    ST.flag(stage, 'is-sep', t >= A.sep - .05);
    ST.flag(stage, 'is-anim', t > .02 && t < A.shrink + 1.6);
    ST.flag(stage, 'is-names', t >= A.names && t < A.shrink);
    ST.flag(stage, 'is-mini', t >= A.shrink);
    ST.flag(area, 'is-st-anim', t > .02 && t < A.shrink + 1.6);
    ST.flag(area, 'is-bd-anim', t > A.bd - .1 && t < A.bd + 4.6 * A.f);
    var s = t < A.s[0] ? -1 : t < A.s[1] ? 0 : t < A.s[2] ? 1 : t < A.s[3] ? 2 : 3;
    if (s !== cur) {
      cur = s;
      steps.forEach(function (li, i) { li.classList.toggle('is-on', i === s); });
    }
  }
  function reset() {
    steps.forEach(function (li) { li.classList.remove('is-on'); });
    ['is-anim', 'is-armed', 'is-sep', 'is-names', 'is-mini', 'has-on'].forEach(function (c) { stage.classList.remove(c); });
    area.classList.remove('is-st-anim', 'is-bd-anim');
    cur = -2;
  }

  ctx.mm.add(ctx.desktop, function () {
    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    ST.separate(tl, stage, A.sep, A.dur, 1);
    gsap.set(st, { transformOrigin: '0% 50%' });
    gsap.set(rot, { xPercent: -50 });
    // la estación se achica y se corre a la izquierda; el rótulo la acompaña (solo se traslada: se lee siempre)
    tl.to(st, { scale: function () { return measure().S; }, x: 0, y: function () { return (geo || measure()).ty; }, duration: 1.4, ease: 'power2.inOut' }, A.shrink)
      .to(rot, { x: function () { return (geo || measure()).cx; }, y: function () { return (geo || measure()).cy; }, duration: 1.4, ease: 'power2.inOut' }, A.shrink);
    addBoard(tl, A.bd, 1, A.f);
    tl.to({}, { duration: .4 }, A.total - .4);
    mark(0);
    ctx.ScrollTrigger.create({
      animation: tl, trigger: root, start: 'top top', end: '+=300%',
      pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (self) { mark(self.progress); }
    });
    return reset;
  });

  ctx.mm.add(ctx.mobile, function () {
    steps.forEach(function (li) { li.classList.remove('is-on'); });
    var tlS = gsap.timeline({ defaults: { ease: 'none' } });
    ST.separate(tlS, stage, .2, 5.2, .7);
    tlS.to({}, { duration: .6 }, 5.4);
    ctx.ScrollTrigger.create({
      animation: tlS, trigger: stage, start: 'top 85%', end: 'bottom 45%', scrub: .6, invalidateOnRefresh: true,
      onUpdate: function (self) {
        var t = self.progress * 6;
        ST.flag(stage, 'is-armed', t < .15);
        ST.flag(stage, 'is-sep', t >= .15);
        ST.flag(stage, 'is-anim', t > .02 && t < 5.6);
      }
    });
    var tlB = gsap.timeline();
    addBoard(tlB, 0, .55, 1);
    ctx.ScrollTrigger.create({
      animation: tlB, trigger: board, start: 'top 85%', end: 'bottom 55%', scrub: .6, invalidateOnRefresh: true
    });
    ST.flag(stage, 'is-sep', false);
    return reset;
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
