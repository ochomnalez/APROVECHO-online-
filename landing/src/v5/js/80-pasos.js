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
