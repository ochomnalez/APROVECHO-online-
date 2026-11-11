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
