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
    { x: -75, y: -45, r: -13 }, { x: 8, y: -105, r: 5 }, { x: 80, y: -40, r: 11 },
    { x: -80, y: 55, r: 9 }, { x: -6, y: 100, r: -6 }, { x: 85, y: 50, r: -10 }
  ];
  // se llega en este orden escalonado
  var ORDER = [0, 2, 3, 5, 1, 4];

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
        { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 2.4, ease: 'power3.out' }, at);
      tl.fromTo(shadows[i], { opacity: 0 }, { opacity: 1, duration: 1, ease: 'none' }, at);
      tl.to(shadows[i], { opacity: 0, duration: .6, ease: 'none' }, 4.1);
    });
    // clic de encastre: tablero de una sola pieza
    tl.to(full, { opacity: 1, duration: .3, ease: 'none' }, 4.1)
      .to(tiles, { opacity: 0, duration: .1, ease: 'none' }, 4.45)
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
