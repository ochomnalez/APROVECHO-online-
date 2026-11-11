/* v5 · nav: capítulo actual en el mini anillo (siempre) + giro con el scroll (solo con movimiento) */
(function () {
  'use strict';
  var btn = document.querySelector('.nv-ring');
  if (!btn) return;
  var label = btn.querySelector('[data-nv-label]');
  var menu = document.getElementById('menu');
  var ids = ['plan-base', 'plan-smart', 'plan-intelligence'];
  var info = [
    { l: 'Menú', a: 0 }, { l: '01 · Recuperá', a: 1 }, { l: '02 · Medí', a: 2 }, { l: '03 · Anticipá', a: 3 }
  ];
  var last = -1, raf = 0;

  function calc() {
    raf = 0;
    var mid = window.innerHeight * 0.5, idx = 0, i, el;
    for (i = 0; i < ids.length; i++) {
      el = document.getElementById(ids[i]);
      if (el && el.getBoundingClientRect().top <= mid) idx = i + 1;
    }
    var st = info[idx];
    if (idx === 3) {
      var r = document.getElementById(ids[2]).getBoundingClientRect();
      if (r.bottom < mid) { idx = 4; st = { l: 'Menú', a: 3 }; }
    }
    if (idx === last) return;
    last = idx;
    btn.setAttribute('data-ch', st.a);
    label.textContent = st.l;
    btn.setAttribute('aria-label', st.l === 'Menú' ? 'Menú' : 'Menú, capítulo actual: ' + st.l);
  }
  function ask() { if (!raf) raf = requestAnimationFrame(calc); }
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
  window.addEventListener('load', function () { ask(); setTimeout(ask, 400); });
  calc();

  // «Sumá tu comercio» de la barra se oculta mientras se ve el de la portada
  var cta = document.querySelector('.nav__cta');
  var heroBtns = document.querySelector('.hr .hero__actions');
  if (cta && heroBtns && 'IntersectionObserver' in window) {
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
    new IntersectionObserver(function (es) {
      cta.classList.toggle('is-covered', es[0].isIntersecting);
    }, { rootMargin: '-' + navH + 'px 0px 0px 0px' }).observe(heroBtns);
  }

  // tocar fuera del panel lo cierra (main.js alterna el menú al hacer clic en el botón)
  document.addEventListener('click', function (e) {
    if (!menu || !menu.classList.contains('is-open')) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    btn.click();
  });

  APV5.scene('nav-giro', function (ctx) {
    var svg = btn.querySelector('.nv-ring__svg');
    ctx.gsap.to(svg, {
      rotation: 720, ease: 'none', transformOrigin: '50% 50%',
      scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.6 }
    });
  });
})();
