/* La navegación queda expuesta, sin botón de menú. */
(function () {
  'use strict';
  // «Sumá tu comercio» de la barra se oculta mientras se ve el de la portada
  var cta = document.querySelector('.nav__cta');
  var heroBtns = document.querySelector('.hr .hero__actions');
  if (cta && heroBtns && 'IntersectionObserver' in window) {
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
    new IntersectionObserver(function (es) {
      cta.classList.toggle('is-covered', es[0].isIntersecting);
    }, { rootMargin: '-' + navH + 'px 0px 0px 0px' }).observe(heroBtns);
  }

})();
