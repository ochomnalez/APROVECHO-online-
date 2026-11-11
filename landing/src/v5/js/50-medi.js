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
    if (datums[0]) tl.fromTo(datums[0], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, m.a);
    tl.to({}, { duration: .4 }, m.total - .4);
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
    tl.eventCallback('onUpdate', function () { mark(tl.progress(), D); });
    ctx.ScrollTrigger.create({
      animation: tl, trigger: root, start: 'top top', end: '+=220%',
      pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true
    });
    return reset;
  });

  ctx.mm.add(ctx.mobile, function () {
    steps.forEach(function (li, i) {
      ctx.ScrollTrigger.create({ trigger: li, start: 'top 65%', end: 'bottom 65%',
        onEnter: function () { steps.forEach(function (item, j) { item.classList.toggle('is-on', i === j); }); },
        onEnterBack: function () { steps.forEach(function (item, j) { item.classList.toggle('is-on', i === j); }); }
      });
    });
    var tl = build(M);
    steps.forEach(function (li) { li.classList.remove('is-on'); });
    mark(0, M);
    tl.eventCallback('onUpdate', function () { mark(tl.progress(), M); });
    ctx.ScrollTrigger.create({
      animation: tl, trigger: stage, start: 'top 85%', end: 'bottom 40%', scrub: .6, invalidateOnRefresh: true
    });
    return reset;
  });
});
