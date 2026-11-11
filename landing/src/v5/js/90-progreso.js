/* Indicador del plan visible: sigue la animación suavizada y nunca una pestaña oculta. */
APV5.scene('progreso', function (ctx) {
  var bar = document.createElement('div');
  bar.className = 'pg';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<span class="pg__n"></span><span class="pg__track"><span class="pg__fill"></span></span><span class="pg__pct">0%</span>';
  document.body.appendChild(bar);
  var n = bar.querySelector('.pg__n'), fill = bar.querySelector('.pg__fill'), pct = bar.querySelector('.pg__pct');
  var setY = ctx.gsap.quickSetter(fill, 'scaleY');
  var ids = ['plan-base', 'plan-smart', 'plan-intelligence'];
  ctx.gsap.ticker.add(function () {
    var sec = document.querySelector('#planes [role="tabpanel"]:not([hidden])');
    if (!sec || sec.closest('[data-view][hidden]')) { bar.classList.remove('is-on'); return; }
    var pin = ctx.ScrollTrigger.getAll().find(function (t) { return t.pin === sec; });
    var r = pin ? null : sec.getBoundingClientRect();
    var on = pin ? pin.isActive : r.top < innerHeight * .3 && r.bottom > innerHeight * .7;
    bar.classList.toggle('is-on', on);
    if (!on) return;
    var p = pin ? pin.animation.progress() : Math.max(0, Math.min(1, (innerHeight * .3 - r.top) / Math.max(1, r.height - innerHeight * .4)));
    n.textContent = '0' + (ids.indexOf(sec.id) + 1);
    setY(p); pct.textContent = Math.round(p * 100) + '%';
  });
});
