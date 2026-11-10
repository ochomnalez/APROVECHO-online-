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
      tl.to(a, { x: a.getAttribute('data-dx') * dist, y: a.getAttribute('data-dy') * dist, opacity: 0.08, svgOrigin: '160 160', duration: 1 }, 0);
    });
    tl.to(core, { scale: 0.6, opacity: 0.55, duration: 1 }, 0);
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
