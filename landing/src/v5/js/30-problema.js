/* v5 · el problema: la cifra cuenta de 0 a 12,5 y la foto de adentro se desplaza (solo con movimiento) */
APV5.scene('problema', function (ctx) {
  var g = ctx.gsap;
  var live = document.querySelector('[data-pb-count]');
  var sec = document.getElementById('problema');
  if (!live || !sec) return;
  var fmt = function (n) { return n.toFixed(1).replace('.', ',') + '%'; };
  var o = { v: 0 };
  live.textContent = fmt(0);
  g.to(o, {
    v: 12.5, duration: 1.7, ease: 'power2.out',
    onUpdate: function () { live.textContent = fmt(o.v); },
    onComplete: function () { live.textContent = '12,5%'; },
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
