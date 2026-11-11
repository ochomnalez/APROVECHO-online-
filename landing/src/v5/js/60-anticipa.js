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
