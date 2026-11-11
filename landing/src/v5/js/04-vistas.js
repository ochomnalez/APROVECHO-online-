/* La landing se recorre completa; comprar packs conserva su vista secundaria. */
(function () {
  'use strict';
  var vistas = Array.prototype.slice.call(document.querySelectorAll('[data-view]'));
  if (!vistas.length) return;
  var actual = 'home';

  function de(id) {
    var el = id ? document.getElementById(id) : null;
    var v = el && el.closest ? el.closest('[data-view]') : null;
    return v ? v.getAttribute('data-view') : null;
  }
  // subraya en la barra superior la sección que se está viendo
  var PRINCIPAL = { home: 'inicio', packs: 'consumidores' };
  function marcar(nombre, id) {
    var meta = (id === 'inversores' || id === 'equipo') ? 'inversores' : PRINCIPAL[nombre];
    Array.prototype.forEach.call(document.querySelectorAll('.nv-bar a, #menu a'), function (a) {
      if (a.getAttribute('href') === '#' + meta && !a.hasAttribute('data-app')) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  function mostrar(nombre) {
    if (!nombre || nombre === actual) return false;
    vistas.forEach(function (v) { v.hidden = v.getAttribute('data-view') !== nombre; });
    actual = nombre;
    document.documentElement.setAttribute('data-vista', nombre);
    marcar(nombre);
    window.scrollTo(0, 0);
    if (window.APV5) APV5.refreshPlans();
    return true;
  }
  // antes que los demás manejadores: al tocar un enlace de otra vista, se abre esa vista y el navegador baja hasta el ancla
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1) || 'top';
    var v = id === 'top' ? 'home' : de(id);
    if (v && v !== actual) mostrar(v);
  }, true);
  function porHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var v = id ? de(id) : 'home';
    if (v && v !== actual) {
      mostrar(v);
      var t = document.getElementById(id);
      if (t) setTimeout(function () { t.scrollIntoView({ behavior: 'auto', block: 'start' }); }, 40);
    }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a) { var id = a.getAttribute('href').slice(1); if (id === 'inversores' || id === 'equipo') setTimeout(function () { marcar(actual, id); }, 0); }
  });
  window.addEventListener('hashchange', porHash);
  porHash();
  marcar(actual);
})();
