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
