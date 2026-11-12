/* El producto se puede explorar sin depender del scroll ni de GSAP en teléfono. */
(function () {
  'use strict';
  var mobile = window.matchMedia('(max-width:899px)');
  var stages = Array.prototype.slice.call(document.querySelectorAll('[data-st-stage]'));
  var ST = APV5.st;

  function choose(stage, mode) {
    stage.setAttribute('data-mobile-view', mode);
    stage.classList.toggle('is-armed', mode === 'assembled');
    stage.querySelectorAll('[data-st-mode]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-st-mode') === mode));
    });
    stage.querySelectorAll('.st-p').forEach(function (piece) { piece.tabIndex = -1; });
  }
  ST.mobile = function (stage) {
    ST.bind(stage);
    stage.classList.add('st-mobile');
    choose(stage, stage.getAttribute('data-mobile-view') || 'assembled');
  };
  stages.forEach(function (stage) {
    stage.querySelectorAll('[data-st-mode]').forEach(function (button) {
      button.addEventListener('click', function () {
        choose(stage, button.getAttribute('data-st-mode'));
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });
  });
  function resize() {
    stages.forEach(function (stage) {
      if (mobile.matches) ST.mobile(stage);
      else {
        stage.classList.remove('st-mobile');
        stage.querySelectorAll('.st-p').forEach(function (piece) { piece.tabIndex = 0; });
      }
    });
  }
  resize();
  if (mobile.addEventListener) mobile.addEventListener('change', resize);
  else mobile.addListener(resize);

  // El visor usa las imágenes originales y admite zoom y desplazamiento en ambos ejes.
  var dialog = document.createElement('dialog');
  dialog.className = 'pv';
  dialog.setAttribute('aria-labelledby', 'pv-title');
  dialog.innerHTML = '<div class="pv__head"><h2 class="pv__title" id="pv-title"></h2><button type="button" data-pv-close>Cerrar</button></div><div class="pv__tools" aria-label="Zoom de la imagen"><button type="button" data-pv-out aria-label="Alejar imagen">−</button><output aria-live="polite">100%</output><button type="button" data-pv-in aria-label="Acercar imagen">+</button></div><p class="pv__hint">Usá + para ampliar y deslizá para recorrer la imagen.</p><div class="pv__viewport"><img class="pv__img" alt=""></div>';
  document.body.appendChild(dialog);
  var image = dialog.querySelector('img'), viewport = dialog.querySelector('.pv__viewport');
  var zoom = 1, origin = null;
  function paint() {
    image.style.width = Math.round(viewport.clientWidth * zoom) + 'px';
    dialog.querySelector('output').textContent = Math.round(zoom * 100) + '%';
    dialog.querySelector('[data-pv-out]').disabled = zoom <= 1;
    dialog.querySelector('[data-pv-in]').disabled = zoom >= 4;
  }
  function open(button, source, title) {
    origin = button; zoom = 1;
    dialog.querySelector('h2').textContent = title;
    image.alt = title;
    image.src = source;
    if (typeof dialog.showModal !== 'function') { window.open(source, '_blank', 'noopener'); return; }
    dialog.showModal();
    document.documentElement.classList.add('preview-open');
    viewport.scrollTop = viewport.scrollLeft = 0;
    paint();
    dialog.querySelector('[data-pv-close]').focus({ preventScroll: true });
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-preview], [data-preview-current]');
    if (!button) return;
    var source = button.getAttribute('data-preview');
    if (button.hasAttribute('data-preview-current')) {
      var current = document.querySelector('#plan-base .rc-scr.is-cur img') || document.querySelector('#plan-base .rc-scr img');
      source = current && current.getAttribute('src');
      if (current && current.getAttribute('srcset')) source = current.getAttribute('srcset').split(',').pop().trim().split(/\s+/)[0];
    }
    if (source) open(button, source, button.getAttribute('data-preview-label') || 'Vista del producto');
  });
  dialog.querySelector('[data-pv-close]').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('[data-pv-in]').addEventListener('click', function () { zoom = Math.min(4, zoom + .5); paint(); });
  dialog.querySelector('[data-pv-out]').addEventListener('click', function () { zoom = Math.max(1, zoom - .5); paint(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('preview-open');
    if (origin) origin.focus({ preventScroll: true });
  });
  window.addEventListener('resize', function () { if (dialog.open) paint(); });

  // Evitar que el contacto flotante tape el video, un formulario o las tablas de inversores.
  if ('IntersectionObserver' in window) {
    var watched = Array.prototype.slice.call(document.querySelectorAll('#planes,#recorrido,#alta,#inversores,#consumidores'));
    var visible = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
      document.documentElement.classList.toggle('mobile-reading', visible.size > 0);
    });
    watched.forEach(function (element) { observer.observe(element); });
  }
})();
