/* APROVECHO · landing v5 · Recorrido completo (video de onboarding).
   El video (13,7 MB) NO se descarga hasta que la persona toca el play (preload="none").
   Con html.motion: el marco entra suave y el póster se asienta con un leve escalado. */
APV5.scene('onboarding', function (ctx) {
  'use strict';
  var root = document.getElementById('recorrido');
  if (!root) return;
  var player = root.querySelector('.ob__player');
  var video = root.querySelector('.ob__video');
  var btn = root.querySelector('.ob__play');
  var poster = root.querySelector('.ob__poster');
  var chaps = Array.prototype.slice.call(root.querySelectorAll('.ob__chap button'));
  var frame = root.querySelector('.ob__frame');
  var cta = root.querySelector('.ob__cta .btn');
  var loaded = false;

  function load() {
    if (loaded) return;
    loaded = true;
    video.preload = 'auto'; // recién ahora, tras el clic, se permite bajar el video
    video.src = video.getAttribute('data-src');
    video.controls = true;
    video.hidden = false;
    player.classList.add('is-playing');
    if (btn) btn.hidden = true;
  }
  function play(at) {
    var first = !loaded;
    load();
    function go() {
      if (typeof at === 'number') { try { video.currentTime = at; } catch (e) {} }
      var p = video.play();
      if (p && p.catch) p.catch(function () { video.controls = true; });
    }
    if (first && typeof at === 'number') video.addEventListener('loadedmetadata', go, { once: true }); else go();
    video.focus({ preventScroll: true });
  }
  function inView() {
    var r = frame.getBoundingClientRect();
    var top = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68) + 8;
    return r.top >= top - 40 && r.bottom <= window.innerHeight + 20;
  }

  if (btn) btn.addEventListener('click', function () { play(); });
  chaps.forEach(function (b) {
    b.addEventListener('click', function () {
      var t = parseFloat(b.getAttribute('data-t'));
      chaps.forEach(function (c) { c.classList.toggle('is-cur', c === b); });
      if (!inView()) frame.scrollIntoView({ block: 'center', behavior: APV5.reduce ? 'auto' : 'smooth' });
      play(t);
    });
  });
  // el capítulo marcado sigue al video
  video.addEventListener('timeupdate', function () {
    var t = video.currentTime, k = -1;
    chaps.forEach(function (b, i) { if (t >= parseFloat(b.getAttribute('data-t')) - 0.5) k = i; });
    chaps.forEach(function (b, i) { b.classList.toggle('is-cur', i === k); });
  });
  if (cta) cta.addEventListener('click', function () { if (!video.paused) video.pause(); });

  // ---------- con movimiento ----------
  var g = ctx.gsap;
  function enter() {
    g.set(frame, { opacity: 0, y: 44, scale: 0.965, transformOrigin: '50% 0%' });
    g.set(poster, { scale: 1.07 });
    g.set(chaps.map(function (b) { return b.parentNode; }), { opacity: 0, y: 22 });
    g.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: frame, start: 'top 82%', once: true } })
      .to(frame, { opacity: 1, y: 0, scale: 1, duration: 0.95 }, 0)
      .to(poster, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
      .to(chaps.map(function (b) { return b.parentNode; }), { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.35);
  }
  ctx.mm.add(ctx.desktop, enter);
  ctx.mm.add(ctx.mobile, function () {
    g.set(frame, { opacity: 0, y: 28 });
    g.to(frame, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: frame, start: 'top 88%', once: true } });
  });
});
