/* Medir solo al cambiar vista o al hacer scroll; actualizar solo valores que cambian. */
APV5.scene('progreso', function (ctx) {
  var root = document.getElementById('planes');
  var bar = document.createElement('div');
  bar.className = 'pg';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<span class="pg__n"></span><span class="pg__track"><span class="pg__fill"></span></span><span class="pg__pct">0%</span>';
  document.body.appendChild(bar);
  var n = bar.querySelector('.pg__n'), fill = bar.querySelector('.pg__fill'), pct = bar.querySelector('.pg__pct');
  var setY = ctx.gsap.quickSetter(fill, 'scaleY');
  var ids = ['plan-base', 'plan-smart', 'plan-intelligence'];
  var sec = null, pin = null, visible = false, frame = 0, last = -1, lastPct = -1;
  function show(on) {
    if (on === visible) return;
    visible = on;
    bar.classList.toggle('is-on', on);
  }
  function paint(progress) {
    var p = Math.max(0, Math.min(1, progress)), percent = Math.round(p * 100);
    if (p !== last) { setY(p); last = p; }
    if (percent !== lastPct) { pct.textContent = percent + '%'; lastPct = percent; }
  }
  function update() {
    frame = 0;
    if (!sec) { show(false); return; }
    if (pin) {
      show(pin.isActive);
      if (pin.isActive) paint(pin.animation.progress());
      return;
    }
    var r = sec.getBoundingClientRect();
    var on = r.top < innerHeight * .3 && r.bottom > innerHeight * .7;
    show(on);
    if (on) paint((innerHeight * .3 - r.top) / Math.max(1, r.height - innerHeight * .4));
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  function resolve() {
    sec = root.querySelector('[role="tabpanel"]:not([hidden])');
    if (sec && (sec.dataset.completed === 'true' || sec.closest('[data-view][hidden]'))) sec = null;
    pin = sec && ctx.ScrollTrigger.getAll().find(function (t) { return t.pin === sec; });
    if (sec) n.textContent = '0' + (ids.indexOf(sec.id) + 1);
    queue();
  }
  // El ticker sigue el scrub sin leer layout, buscar nodos ni escribir texto repetido.
  ctx.gsap.ticker.add(function () {
    if (!pin || document.hidden) return;
    show(pin.isActive);
    if (pin.isActive) paint(pin.animation.progress());
  });
  ctx.ScrollTrigger.addEventListener('refresh', resolve);
  new MutationObserver(resolve).observe(document.getElementById('vista-home'), {
    subtree: true, attributes: true, attributeFilter: ['hidden', 'data-completed']
  });
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  resolve();
});
