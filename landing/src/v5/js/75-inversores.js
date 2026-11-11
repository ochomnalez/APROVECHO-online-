/* Inversores adentro de «Quiénes somos»: un botón abre y cierra el panel; los enlaces #inversores, #equipo
   e #inv-* también lo abren (aunque lleguen por la barra de direcciones). Sin JS, el panel se ve siempre. */
(function () {
  'use strict';
  var hub = document.getElementById('inversores');
  var btn = document.querySelector('[data-inv-toggle]');
  if (!hub || !btn) return;
  var label = btn.querySelector('[data-inv-label]');
  var CERRADO = 'Ver información para inversores', ABIERTO = 'Ocultar información para inversores';
  function set(open) {
    hub.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (label) label.textContent = open ? ABIERTO : CERRADO;
    if (open && window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 60);
  }
  function esInv(id) { return id === 'inversores' || id === 'equipo' || id.indexOf('inv-') === 0; }
  btn.addEventListener('click', function () { set(hub.hidden); });
  // captura: abrir el panel antes de que main.js mueva el scroll o seleccione la pestaña
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a && esInv(a.getAttribute('href').slice(1)) && hub.hidden) set(true);
  }, true);
  function porHash() { var id = location.hash.slice(1); if (id && esInv(id) && hub.hidden) set(true); }
  window.addEventListener('hashchange', porHash);
  porHash();
  if (!hub.hidden) set(true);
  else btn.hidden = false;
})();
