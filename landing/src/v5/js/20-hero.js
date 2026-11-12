/* v5 · portada: rotador de 3 videos de fondo (publicá → medí con balanza → entrega) con fundido cruzado.
   Sin movimiento reducido ni ahorro de datos: solo el póster del primero. */
(function () {
  'use strict';
  var sec = document.querySelector('.hr');
  if (!sec) return;
  var clips = [].slice.call(sec.querySelectorAll('.hr__clip'));
  var vids = clips.map(function (c) { return c.querySelector('video'); });
  var imgs = clips.map(function (c) { return c.querySelector('img'); });
  var bars = [].slice.call(sec.querySelectorAll('.hr__bar'));
  var fills = bars.map(function (b) { return b.querySelector('b'); });
  var fillValues = [];
  var cap = sec.querySelector('[data-hr-cap]');
  var LABELS = ['Publicás en segundos', 'Medís con balanza', 'Tu vecino lo retira'];
  var DUR = 6000, FADE = 1000;
  var N = clips.length;
  var ahorro = !!(navigator.connection && navigator.connection.saveData);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || ahorro || !('IntersectionObserver' in window)) { sec.classList.add('is-static'); return; }

  var small = window.matchMedia('(max-width: 899px)').matches;
  var cur = 0, elapsed = 0, waited = 0, last = 0, raf = 0, started = false;
  var userPaused = false, offscreen = false, hidden = document.hidden;

  function load(i) {
    var v = vids[i];
    if (imgs[i].getAttribute('data-src')) {
      var poster = imgs[i].getAttribute('data-src');
      imgs[i].sizes = '100vw';
      imgs[i].srcset = poster.replace('.webp', '-640.webp') + ' 960w, ' + poster + ' 1920w';
      imgs[i].src = poster;
      imgs[i].removeAttribute('data-src');
    }
    if (!v || v.getAttribute('src')) return;
    v.addEventListener('playing', function () { v.classList.add('is-ready'); }, { once: true });
    v.addEventListener('canplay', function () { if (cur === i && !isPaused()) play(i); });
    v.addEventListener('error', function () { v.setAttribute('data-err', '1'); });
    v.src = 'video/hero-ia/' + clips[i].getAttribute('data-clip') + (small ? '-1280.mp4' : '-1920.mp4');
    v.preload = 'auto';
    try { v.load(); } catch (e) {}
  }
  function play(i) {
    var v = vids[i];
    if (!v || !v.getAttribute('src')) return;
    var p = v.play();
    if (p && p.catch) p.catch(function (e) { if (e && e.name === 'NotAllowedError' && started && i === 0 && !v.currentTime) giveUp(); });
  }
  // si el navegador no deja reproducir (ahorro de batería, etc.) queda solo el póster
  function giveUp() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    sec.classList.remove('is-live'); sec.classList.add('is-static');
    started = false;
  }
  function isPaused() { return userPaused || offscreen || hidden; }

  function setBars() {
    for (var i = 0; i < N; i++) {
      var p = i < cur ? 1 : i === cur ? Math.min(1, elapsed / DUR) : 0;
      var value = p.toFixed(3);
      if (fillValues[i] !== value) {
        fills[i].style.transform = 'scaleX(' + value + ')';
        fillValues[i] = value;
      }
    }
  }
  function label() {
    cap.classList.remove('is-in');
    cap.textContent = LABELS[cur];
    void cap.offsetWidth;
    cap.classList.add('is-in');
    bars.forEach(function (b, i) { if (i === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  }
  function go(next) {
    if (next === cur) return;
    var old = clips[cur], oldIdx = cur, nv = vids[next];
    load(next);
    if (nv && nv.getAttribute('src')) { try { nv.currentTime = 0; } catch (e) {} if (!isPaused()) play(next); }
    old.classList.remove('is-on'); old.classList.add('is-prev');
    clips[next].classList.add('is-on');
    setTimeout(function () {
      clips[oldIdx].classList.remove('is-prev');
      if (oldIdx !== cur && vids[oldIdx]) vids[oldIdx].pause();
    }, FADE + 80);
    cur = next; elapsed = 0; waited = 0;
    label();
    load((cur + 1) % N);
    setBars();
  }
  // el reloj corre solo mientras el clip actual realmente se está reproduciendo
  function running() {
    var v = vids[cur];
    return !v || v.getAttribute('data-err') || v.ended || (!v.paused && v.readyState >= 3);
  }
  function tick(t) {
    raf = 0;
    if (!started || isPaused()) return;
    var dt = Math.min(t - last, 100); last = t;
    if (running()) elapsed += dt;
    if (elapsed >= DUR) {
      var nxt = (cur + 1) % N, nv = vids[nxt];
      // espera (hasta 3 s) a que el próximo clip esté listo, así el fundido no tiene saltos
      if (nv && nv.getAttribute('src') && !nv.getAttribute('data-err') && nv.readyState < 3 && waited < 3000) { waited += dt; elapsed = DUR; }
      else go(nxt);
    }
    setBars();
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    if (!started) return;
    if (isPaused()) {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      vids.forEach(function (v) { if (v) v.pause(); });
    } else {
      play(cur);
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    }
  }
  function begin() {
    if (started) return;
    started = true;
    sec.classList.add('is-live');
    load(0);
    vids[0].addEventListener('playing', function () {
      if (small) setTimeout(function () { load(1); }, 1200);
      else load(1);
    }, { once: true });
    setBars();
    sync();
  }

  bars.forEach(function (b, i) {
    b.addEventListener('click', function () {
      if (i === cur) return;
      go(i);
      sync();
    });
  });
  document.addEventListener('visibilitychange', function () { hidden = document.hidden; sync(); });

  // El póster ya es visible; comenzar el primer clip sin esperar window.load.
  if (small && imgs[0].decode) {
    // Dar prioridad al primer póster antes de abrir las descargas de video en teléfono.
    imgs[0].decode().catch(function () {}).then(function () {
      requestAnimationFrame(function () { requestAnimationFrame(begin); });
    });
  } else begin();
  new IntersectionObserver(function (es) { offscreen = !es[0].isIntersecting; sync(); }).observe(sec);

  // paralaje y zoom lentos con el scroll (solo con movimiento; sin pin)
  APV5.scene('hero', function (ctx) {
    var g = ctx.gsap;
    var media = sec.querySelector('.hr__media');
    ctx.mm.add(ctx.desktop, function () {
      g.fromTo(media, { yPercent: 0, scale: 1 }, { yPercent: 5, scale: 1.06, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    });
  });
})();
