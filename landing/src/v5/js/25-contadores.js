/* v5 · contadores en tiempo real. Cuentan desde 0 solo mientras la franja se ve y la pestaña está visible.
   Con «movimiento reducido» no cuentan: queda el HTML con los valores de un minuto. */
(function () {
  'use strict';
  var sec = document.querySelector('[data-ct-sec]');
  if (!sec) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = {};
  [].forEach.call(sec.querySelectorAll('[data-ct]'), function (e) { els[e.getAttribute('data-ct')] = e; });
  var SEC_YEAR = 365 * 86400;
  var KG_S = 16e9 / SEC_YEAR;                     // 16 millones de t por año (MAGyP 2022)
  var RATES = { kg: KG_S, co2: KG_S * 2.53, agua: KG_S * 192 }; // × 2,53 kg CO2e/kg · × 192 L/kg (FAO)
  var fmt = function (n) { return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };

  // cada carácter va en su casillero de ancho fijo; solo se reescriben los que cambian
  function paint(el, str) {
    if (el.getAttribute('data-len') !== String(str.length)) {
      var html = '';
      for (var i = 0; i < str.length; i++) html += '<span class="' + (str.charAt(i) === '.' ? 'ct__p' : 'ct__d') + '">' + str.charAt(i) + '</span>';
      el.innerHTML = html;
      el.setAttribute('data-len', String(str.length));
    }
    var kids = el.children;
    for (var j = 0; j < kids.length; j++) if (kids[j].textContent !== str.charAt(j)) kids[j].textContent = str.charAt(j);
  }
  function show(sec_) { for (var k in els) paint(els[k], fmt(RATES[k] * sec_)); }

  if (reduce || !('IntersectionObserver' in window)) { show(60); return; } // un minuto, fijo

  sec.classList.add('ct--live');
  show(0);
  var acc = 0, last = 0, timer = null, inView = false;
  function tick() {
    var now = performance.now();
    acc += now - last; last = now;
    show(acc / 1000);
  }
  function sync() {
    var run = inView && !document.hidden;
    if (run && !timer) { last = performance.now(); timer = setInterval(tick, 100); }
    else if (!run && timer) { clearInterval(timer); timer = null; }
  }
  new IntersectionObserver(function (es) { inView = es[es.length - 1].isIntersecting; sync(); }, { threshold: 0.25 }).observe(sec);
  document.addEventListener('visibilitychange', sync);

  if (window.APV5) APV5.scene('contadores', function (ctx) {
    var items = sec.querySelectorAll('.ct__item, .ct__close');
    ctx.gsap.from(items, { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: sec, start: 'top 85%', once: true } });
  });
})();
