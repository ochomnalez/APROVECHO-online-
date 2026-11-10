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
