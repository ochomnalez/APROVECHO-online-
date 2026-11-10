/* v5 · quiénes somos: rotador de 4 videos de fondo (campo → fábrica → camiones → supermercado) */
(function () {
  'use strict';
  var sec = document.querySelector('.qs');
  if (!sec) return;
  var clips = [].slice.call(sec.querySelectorAll('.qs__clip'));
  var vids = clips.map(function (c) { return c.querySelector('video'); });
  var bars = [].slice.call(sec.querySelectorAll('.qs__bars b'));
  var cap = sec.querySelector('[data-qs-cap]');
  var btn = sec.querySelector('[data-qs-pause]');
  var LABELS = ['Se cultiva', 'Se produce', 'Se transporta', 'Llega a la góndola'];
  var DUR = 4500, FADE = 1000;
  var N = clips.length;
  var ahorro = !!(navigator.connection && navigator.connection.saveData);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || ahorro || !('IntersectionObserver' in window)) { sec.classList.add('is-static'); return; }

  var small = window.matchMedia('(max-width: 899px)').matches;
  var cur = 0, elapsed = 0, waited = 0, last = 0, raf = 0, started = false;
  var userPaused = false, offscreen = true, hidden = document.hidden;

  function load(i) {
    var v = vids[i];
    if (!v || v.getAttribute('src')) return;
    v.addEventListener('playing', function () { v.classList.add('is-ready'); }, { once: true });
    v.src = 'video/hero/' + clips[i].getAttribute('data-clip') + (small ? '-640.mp4' : '-1280.mp4');
    v.preload = 'auto';
    try { v.load(); } catch (e) {}
  }
  function play(i) {
    var v = vids[i];
    if (!v || !v.getAttribute('src')) return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  function isPaused() { return userPaused || offscreen || hidden; }

  function setBars() {
    for (var i = 0; i < N; i++) {
      var p = i < cur ? 1 : i === cur ? Math.min(1, elapsed / DUR) : 0;
      bars[i].style.transform = 'scaleX(' + p.toFixed(3) + ')';
    }
  }
  function go(next) {
    var old = clips[cur];
    var nv = vids[next];
    if (nv && nv.getAttribute('src')) { try { nv.currentTime = 0; } catch (e) {} play(next); }
    old.classList.remove('is-on'); old.classList.add('is-prev');
    clips[next].classList.add('is-on');
    var oldIdx = cur;
    setTimeout(function () {
      clips[oldIdx].classList.remove('is-prev');
      if (oldIdx !== cur && vids[oldIdx]) { vids[oldIdx].pause(); }
    }, FADE + 80);
    cur = next; elapsed = 0; waited = 0;
    cap.textContent = LABELS[cur];
    load((cur + 1) % N);
    setBars();
  }
  function tick(t) {
    raf = 0;
    if (isPaused()) return;
    var dt = Math.min(t - last, 100); last = t;
    elapsed += dt;
    if (elapsed >= DUR) {
      var nxt = (cur + 1) % N, nv = vids[nxt];
      // espera (hasta 3 s) a que el próximo clip esté listo, así el fundido no tiene saltos
      if (nv && nv.getAttribute('src') && nv.readyState < 2 && waited < 3000) { waited += dt; elapsed = DUR; setBars(); }
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
    load(0); load(1);
    clips[0].querySelector('video').addEventListener('canplay', function () { if (!isPaused()) play(0); }, { once: true });
    setBars();
    sync();
  }

  btn.addEventListener('click', function () {
    userPaused = !userPaused;
    sec.classList.toggle('is-userpaused', userPaused);
    btn.setAttribute('aria-label', userPaused ? 'Reproducir el video de fondo' : 'Pausar el video de fondo');
    sync();
  });
  document.addEventListener('visibilitychange', function () { hidden = document.hidden; sync(); });

  // los videos se piden cuando la sección se acerca; se pausan al salir de pantalla
  function afterLoad(fn) { if (document.readyState === 'complete') fn(); else window.addEventListener('load', fn, { once: true }); }
  var near = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { near.disconnect(); afterLoad(begin); }
  }, { rootMargin: '700px 0px' });
  near.observe(sec);
  new IntersectionObserver(function (es) { offscreen = !es[0].isIntersecting; sync(); }).observe(sec);

  // entrada escalonada y paralaje leve (solo con movimiento)
  APV5.scene('quienes', function (ctx) {
    var g = ctx.gsap;
    var items = sec.querySelectorAll('.eyebrow, .qs__title, .qs__lead, .qs__card');
    g.set(items, { opacity: 0, y: 34 });
    g.to(items, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: sec, start: 'top 65%', once: true } });
    g.fromTo(sec.querySelector('.qs__bg'), { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  });
})();
