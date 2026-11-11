/* APROVECHO · landing v4 · interacciones (IIFE, sin módulos, sin dependencias) */
(function () {
  'use strict';

  // ===== CONFIGURACIÓN (completar cuando Octavio confirme) =====
  // Si una variable está vacía, el botón no se rompe: muestra un aviso y lleva al formulario o a la lista de espera.
  var WHATSAPP_URL = ''; // ej. 'https://wa.me/54911XXXXXXXX'
  var INSTAGRAM_URL = ''; // ej. 'https://www.instagram.com/aprovecho...'
  var APP_URL = 'https://aprovecho-app-demo.vercel.app/'; // PWA publicada de APROVECHO
  // =============================================================

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function safe(fn, name) { try { fn(); } catch (e) { if (window.console) console.warn('init ' + name, e); } }

  // ---------- Menú mobile ----------
  safe(function () {
    var burger = $('.nav__burger'), menu = $('#menu');
    if (!burger || !menu) return;
    function cerrar() { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('#menu a').forEach(function (a) { a.addEventListener('click', cerrar); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  }, 'menu');

  // ---------- Menú: marca la sección que se está viendo ----------
  safe(function () {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('#menu a[href^="#"]').filter(function (a) { return !a.hasAttribute('data-app'); });
    var map = {};
    links.forEach(function (a) { var s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map[s.id] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = map[e.target.id]; if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }, 'nav-activa');

  // ---------- Barra fija mobile: se oculta mientras se ven los botones de la portada o el formulario de alta ----------
  safe(function () {
    var sticky = $('[data-sticky]'), objetivos = $$('.hero__actions, #alta');
    if (!sticky || !objetivos.length || !('IntersectionObserver' in window)) return;
    var vistos = objetivos.map(function () { return false; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vistos[objetivos.indexOf(e.target)] = e.isIntersecting; });
      sticky.classList.toggle('is-hidden', vistos.some(Boolean));
    }, { threshold: 0.05 });
    objetivos.forEach(function (o) { io.observe(o); });
  }, 'sticky');

  // ---------- Mirá cuánto te queda ----------
  safe(function () {
    var slider = $('#valor'); if (!slider) return;
    var fmt = function (n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    var out = $('#valor-out');
    var pintar = function () {
      var v = +slider.value, pack = v / 2, com = pack * 0.75;
      slider.style.setProperty('--fill', ((v - slider.min) / (slider.max - slider.min) * 100).toFixed(1) + '%');
      out.textContent = fmt(v);
      $$('[data-out="valor"]').forEach(function (n) { n.textContent = fmt(v); });
      $$('[data-out="pack"]').forEach(function (n) { n.textContent = fmt(pack); });
      $$('[data-out="comercio"]').forEach(function (n) { n.textContent = fmt(com); });
    };
    slider.addEventListener('input', pintar); pintar();
  }, 'cuenta');

  // ---------- Pestañas accesibles (Planes e Inversores) ----------
  var tabsets = [];
  safe(function () {
    $$('[data-tabs]').forEach(function (root) {
      var list = $('[role="tablist"]', root);
      var tabs = $$('[role="tab"]', root);
      var mide = root.classList.contains('hub');
      function marcar(t, medir) {
        // indicador: Planes usa el índice (pestañas iguales); Inversores, posición y ancho reales
        list.style.setProperty('--i', tabs.indexOf(t));
        if (!medir) return;
        list.style.setProperty('--x', t.offsetLeft);
        list.style.setProperty('--w', t.offsetWidth);
        if (list.scrollWidth > list.clientWidth + 2) {
          var left = t.offsetLeft - (list.clientWidth - t.offsetWidth) / 2;
          list.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
        }
      }
      var api = {
        root: root,
        has: function (id) { return tabs.some(function (t) { return t.getAttribute('aria-controls') === id; }); },
        actual: function () { return tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]; },
        select: function (id, focus) {
          tabs.forEach(function (t) {
            var on = t.getAttribute('aria-controls') === id;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
            var p = document.getElementById(t.getAttribute('aria-controls'));
            if (p) {
              p.hidden = !on;
              if (on && !reduce) { p.classList.remove('is-in'); void p.offsetWidth; p.classList.add('is-in'); }
            }
            if (on) { marcar(t, mide); if (focus) t.focus(); }
          });
        },
        medir: function () { marcar(api.actual(), mide); }
      };
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { api.select(t.getAttribute('aria-controls'), false); });
        t.addEventListener('keydown', function (e) {
          var k = e.key, n = null;
          if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % tabs.length;
          else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
          else if (k === 'Home') n = 0;
          else if (k === 'End') n = tabs.length - 1;
          if (n === null) return;
          e.preventDefault();
          api.select(tabs[n].getAttribute('aria-controls'), true);
        });
      });
      marcar(api.actual(), false); // sin medir al cargar: no fuerza un cálculo de diseño
      tabsets.push(api);
    });
    // el ancho de las pestañas cambia cuando cargan las tipografías o se rota el celular
    var remedir = function () { tabsets.forEach(function (t) { t.medir(); }); };
    window.addEventListener('load', function () {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(remedir); });
      else requestAnimationFrame(remedir);
    });
    var rt = null;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(remedir, 120); });

    // Enlaces directos a una pestaña (#plan-smart, #equipo, anillo Recuperá · Medí · Anticipá)
    function abrir(id, scroll) {
      for (var k = 0; k < tabsets.length; k++) {
        if (tabsets[k].has(id)) {
          tabsets[k].select(id, false);
          if (scroll) tabsets[k].root.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          return true;
        }
      }
      return false;
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (id && abrir(id, true)) { e.preventDefault(); history.replaceState(null, '', '#' + id); }
    });
    if (location.hash) abrir(location.hash.slice(1), true);
    window.addEventListener('hashchange', function () { abrir(location.hash.slice(1), true); });
  }, 'tabs');

  // ---------- Video "Cómo funciona" (hecho con HyperFrames) ----------
  safe(function () {
    var film = $('[data-film]'); if (!film) return;
    var v = $('video', film), btn = $('[data-film-toggle]', film);
    var chapters = $$('.chapter', film);
    var marks = chapters.map(function (c) { return parseFloat(c.getAttribute('data-t')) || 0; });
    var DUR = 18;
    var portrait = window.matchMedia('(max-width: 699px)').matches;
    v.poster = v.getAttribute(portrait ? 'data-poster-p' : 'data-poster-l');
    if (portrait) { v.width = 720; v.height = 900; }
    var ahorro = !!(navigator.connection && navigator.connection.saveData);
    var cargado = false, quiere = !reduce && !ahorro, visible = false;

    function cargar() {
      if (cargado) return;
      cargado = true;
      v.src = v.getAttribute(portrait ? 'data-src-p' : 'data-src-l');
      v.preload = 'auto';
    }
    function estado() {
      var playing = !v.paused && !v.ended;
      film.classList.toggle('is-playing', playing);
      btn.setAttribute('aria-label', playing ? 'Pausar el video' : 'Reproducir el video');
    }
    function play() { cargar(); var p = v.play(); if (p && p.catch) p.catch(function () {}); }

    btn.addEventListener('click', function () {
      if (v.paused) { quiere = true; play(); } else { quiere = false; v.pause(); }
    });
    v.addEventListener('play', estado);
    v.addEventListener('pause', estado);

    // Saltar a un capítulo. Si el servidor no permite saltar (sin "Range"), se baja el video entero
    // (pesa menos de 500 KB) y se reproduce desde la memoria, donde siempre se puede saltar.
    var enMemoria = false;
    function saltable(t) {
      var s = v.seekable;
      return s && s.length && s.start(0) <= t && s.end(s.length - 1) >= t;
    }
    function irA(t) {
      if (v.readyState < 1) { v.addEventListener('loadedmetadata', function () { irA(t); }, { once: true }); return; }
      if (saltable(t) || enMemoria || !window.fetch) { try { v.currentTime = t; } catch (e) {} return; }
      enMemoria = true;
      fetch(v.currentSrc || v.src).then(function (r) { return r.blob(); }).then(function (b) {
        v.src = URL.createObjectURL(b);
        v.addEventListener('loadedmetadata', function () { try { v.currentTime = t; } catch (e) {} if (quiere) play(); }, { once: true });
      }).catch(function () {});
    }
    chapters.forEach(function (c, i) {
      c.addEventListener('click', function () {
        cargar();
        irA(marks[i] + 0.05);
        quiere = true; play(); pintar(marks[i]);
      });
    });

    function pintar(t) {
      var idx = 0;
      for (var i = 0; i < marks.length; i++) if (t >= marks[i] - 0.01) idx = i;
      chapters.forEach(function (c, k) {
        c.classList.toggle('is-on', k === idx);
        if (k === idx) {
          var fin = k + 1 < marks.length ? marks[k + 1] : DUR;
          c.style.setProperty('--p', clamp((t - marks[k]) / (fin - marks[k])).toFixed(3));
        } else c.style.setProperty('--p', 0);
      });
    }
    v.addEventListener('timeupdate', function () { pintar(v.currentTime); });

    // Solo se reproduce cuando está a la vista (ahorra batería y datos)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && quiere) play();
        else if (!visible && !v.paused) v.pause();
      }, { threshold: 0.35 }).observe(v);
    } else if (quiere) play();
    estado();
  }, 'film');

  // ---------- Balanza y tablet: se mueven con el mouse, el dedo o el teclado ----------
  safe(function () {
    $$('[data-tilt]').forEach(function (el) {
      var drag = false, ry = 0, rx = 0;
      function set(y, x) { ry = Math.max(-18, Math.min(18, y)); rx = Math.max(-10, Math.min(10, x)); el.style.setProperty('--ry', ry.toFixed(1) + 'deg'); el.style.setProperty('--rx', rx.toFixed(1) + 'deg'); }
      function mover(e) {
        var r = el.getBoundingClientRect();
        set((clamp((e.clientX - r.left) / r.width) - 0.5) * 36, (0.5 - clamp((e.clientY - r.top) / r.height)) * 20);
      }
      el.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || drag) mover(e); });
      el.addEventListener('pointerdown', function (e) { drag = true; el.classList.add('is-drag'); try { el.setPointerCapture(e.pointerId); } catch (x) {} mover(e); });
      function fin() { drag = false; el.classList.remove('is-drag'); }
      el.addEventListener('pointerup', fin);
      el.addEventListener('pointercancel', fin);
      el.addEventListener('pointerleave', function () { if (!drag) set(0, 0); });
      el.addEventListener('keydown', function (e) {
        var k = e.key, h = true;
        if (k === 'ArrowLeft') set(ry - 8, rx); else if (k === 'ArrowRight') set(ry + 8, rx);
        else if (k === 'ArrowUp') set(ry, rx + 6); else if (k === 'ArrowDown') set(ry, rx - 6);
        else if (k === 'Escape' || k === '0') set(0, 0); else h = false;
        if (h) e.preventDefault();
      });
    });
  }, 'tilt');

  // ---------- Botones flotantes y Descargar app ----------
  safe(function () {
    var toast = $('[data-toast]'), tt = null;
    function aviso(msg) {
      if (!toast) return;
      toast.textContent = msg; toast.hidden = false;
      clearTimeout(tt); tt = setTimeout(function () { toast.hidden = true; }, 4200);
    }
    function ext(a, url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    if (WHATSAPP_URL) $$('[data-whatsapp]').forEach(function (a) { ext(a, WHATSAPP_URL); });
    $$('[data-social="whatsapp"]').forEach(function (a) { if (WHATSAPP_URL) ext(a, WHATSAPP_URL); else a.addEventListener('click', function () { aviso('Muy pronto: por ahora dejanos tus datos y te escribimos.'); }); });
    $$('[data-social="instagram"]').forEach(function (a) { if (INSTAGRAM_URL) ext(a, INSTAGRAM_URL); else a.addEventListener('click', function () { aviso('Muy pronto: por ahora dejanos tus datos y te escribimos.'); }); });
    $$('[data-app]').forEach(function (a) { if (APP_URL) { a.href = APP_URL; a.removeAttribute('target'); } else a.addEventListener('click', function () { aviso('La app llega pronto. Dejá tu zona y tu email y te avisamos.'); }); });
  }, 'botones');

  // ---------- Pausa el anillo de la portada cuando no se ve ----------
  safe(function () {
    var hero = $('.hero'); if (!hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) { hero.classList.toggle('is-offscreen', !es[0].isIntersecting); }).observe(hero);
  }, 'hero-pausa');

  // ---------- Entradas suaves al aparecer (contenido visible sin JS ni con movimiento reducido) ----------
  safe(function () {
    if (reduce || !('IntersectionObserver' in window)) return;
    var els = $$('.sec__head, .stats li, .film__frame, .chapters li, .pt, .cuenta-grid > *, .senales > *, .faq__list, .alta > *, .aviso, .hub, .espera > *');
    els.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-vis'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });
    // red de seguridad: si algo no apareció en 6 s, se muestra igual
    setTimeout(function () { els.forEach(function (el) { el.classList.add('is-vis'); }); }, 6000);
  }, 'reveal');

  // ---------- Regiones con scroll horizontal: accesibles con teclado ----------
  safe(function () {
    $$('.tablewrap, .road').forEach(function (n) { n.setAttribute('tabindex', '0'); });
  }, 'a11y');
})();
