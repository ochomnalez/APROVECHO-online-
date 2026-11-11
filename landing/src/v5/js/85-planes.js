/* Planes en pestañas: al cambiar de plan hay que recalcular los puntos de scroll (cada escena fija se calcula
   con su propia altura) y volver al inicio del bloque. main.js maneja el estado accesible de las pestañas. */
(function () {
  'use strict';
  var root = document.getElementById('planes');
  if (!root) return;
  var tabs = root.querySelectorAll('[role="tab"]');
  function refrescar(volver) {
    var tl = root.querySelector('[role="tablist"]');
    setTimeout(function () {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh(true);
      if (volver && tl) {
        var y = tl.getBoundingClientRect().top + window.scrollY - 84;
        if (Math.abs(window.scrollY - y) > 4) window.scrollTo({ top: Math.max(0, y), behavior: 'auto' });
      }
    }, 90);
  }
  Array.prototype.forEach.call(tabs, function (t) {
    t.addEventListener('click', function () { refrescar(true); });
    t.addEventListener('keydown', function (e) { if (/^(Arrow|Home|End)/.test(e.key)) refrescar(false); });
  });
  // al llegar por un enlace directo (#plan-smart, anillo de la portada), también recalcular
  window.addEventListener('hashchange', function () { refrescar(false); });
  window.addEventListener('load', function () { refrescar(false); });
})();
