/* APROVECHO · landing v5 · núcleo de movimiento.
   Cada escena se registra con APV5.scene(nombre, fn). Si la persona pidió «movimiento reducido»
   o GSAP no cargó, no se inicia nada y la página queda como secciones normales (CSS sin .motion). */
window.APV5 = (function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scenes = [];
  var active = false, planContexts = {}, completedPlans = {};
  var planIds = { recupera: 'plan-base', medi: 'plan-smart', anticipa: 'plan-intelligence' };
  function context(mm) { return { gsap: gsap, ScrollTrigger: ScrollTrigger, mm: mm, desktop: '(min-width: 900px)', mobile: '(max-width: 899px)', planTrigger: planTrigger, readPlanOnce: readPlanOnce }; }
  // Al terminar, conservar la imagen final y retirar el espacio artificial del pin.
  // El estado vive por plan durante esta visita, también al cambiar pestaña o ancho.
  function planTrigger(root, timeline, options) {
    if (completedPlans[root.id]) {
      root.dataset.completed = 'true';
      timeline.progress(1).pause();
      return null;
    }
    var entered = false, pending = false;
    options.animation = timeline;
    options.trigger = root;
    options.onEnter = options.onEnterBack = function () { entered = true; };
    options.onLeave = function (self) {
      if (!entered || self.direction !== 1 || pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        if (self.progress < 1 || root.hidden || root.closest('[data-view][hidden]') || !self.enabled) return;
        var top = root.getBoundingClientRect().top;
        completedPlans[root.id] = true;
        root.dataset.completed = 'true';
        self.kill(true, true);
        timeline.progress(1).pause();
        ScrollTrigger.refresh();
        var delta = root.getBoundingClientRect().top - top;
        window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: 'instant' });
        ScrollTrigger.update();
      });
    };
    return ScrollTrigger.create(options);
  }
  // En celular ya hay scroll normal: al leer el último paso se libera también el teléfono sticky.
  function readPlanOnce(root) {
    var last = root.querySelector('.ch__steps li:last-child');
    if (!last || completedPlans[root.id]) return;
    ScrollTrigger.create({ trigger: last, start: 'bottom bottom',
      onEnter: function (self) {
        requestAnimationFrame(function () {
          if (root.hidden || root.closest('[data-view][hidden]')) return;
          var rect = last.getBoundingClientRect();
          var nav = document.querySelector('.nv');
          // Al mostrar una pestaña, el refresh puede notificar un cruce transitorio.
          // Completar solo cuando el último paso se ve realmente en la pantalla.
          if (!rect.height || rect.top < (nav ? nav.offsetHeight : 0) || rect.bottom > innerHeight + 2) return;
          completedPlans[root.id] = true;
          root.dataset.completed = 'true';
          self.kill();
          refreshPlans();
        });
      }
    });
  }
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
