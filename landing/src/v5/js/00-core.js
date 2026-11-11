/* APROVECHO · landing v5 · núcleo de movimiento.
   Cada escena se registra con APV5.scene(nombre, fn). Si la persona pidió «movimiento reducido»
   o GSAP no cargó, no se inicia nada y la página queda como secciones normales (CSS sin .motion). */
window.APV5 = (function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scenes = [];
  var active = false, planContexts = {};
  var planIds = { recupera: 'plan-base', medi: 'plan-smart', anticipa: 'plan-intelligence' };
  function context(mm) { return { gsap: gsap, ScrollTrigger: ScrollTrigger, mm: mm, desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }; }
  function refreshPlans() {
    if (!active) return;
    Object.keys(planContexts).forEach(function (name) { planContexts[name].revert(); });
    planContexts = {};
    scenes.forEach(function (s) {
      var id = planIds[s[0]], root = id && document.getElementById(id);
      if (!root || root.hidden || root.closest('[data-view][hidden]')) return;
      var mm = gsap.matchMedia();
      planContexts[s[0]] = mm;
      s[1](context(mm));
    });
    ScrollTrigger.refresh();
  }
  function start() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('motion');
    var mm = gsap.matchMedia();
    var ctx = context(mm);
    active = true;
    scenes.forEach(function (s) { try { if (!planIds[s[0]]) s[1](ctx); } catch (e) { if (window.console) console.warn('escena ' + s[0], e); } });
    refreshPlans();
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  // v5.js se carga con defer: las escenas se registran después de este bloque, así que se arranca
  // recién en DOMContentLoaded (o en el próximo ciclo si el documento ya terminó de cargar).
  if (document.readyState === 'complete') setTimeout(start, 0); else document.addEventListener('DOMContentLoaded', start);
  return { reduce: reduce, refreshPlans: refreshPlans, scene: function (name, fn) { scenes.push([name, fn]); } };
})();
