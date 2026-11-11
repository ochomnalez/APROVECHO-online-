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
