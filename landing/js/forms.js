/* APROVECHO · formularios simulados.
 *
 * Nada sale del navegador: los envíos se guardan en localStorage (clave aprovecho.leads.v1).
 * PARA CONECTAR SUPABASE DESPUÉS (D-006): reemplazá SOLO la función `enviarLead` de abajo.
 * Recibe (tipo, datos) y tiene que devolver una Promise; los formularios no cambian.
 *   tipo: 'alta-comercio' | 'demo' | 'inversores' | 'lista-espera'
 */
(function () {
  'use strict';

  var CLAVE = 'aprovecho.leads.v1';

  // ===== ÚNICO PUNTO DE CONEXIÓN =====
  function enviarLead(tipo, datos) {
    var registro = { tipo: tipo, fecha: new Date().toISOString(), datos: datos };
    try {
      var lista = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      lista.push(registro);
      localStorage.setItem(CLAVE, JSON.stringify(lista));
    } catch (e) { /* sin localStorage: igual mostramos el éxito (es una simulación) */ }
    // Ejemplo futuro: return supabase.from('leads').insert(registro)
    return Promise.resolve(registro);
  }
  window.APROVECHO_enviarLead = enviarLead;
  // ====================================

  var MSG = {
    nombre: 'Falta el nombre del comercio.',
    rubro: 'Elegí un rubro.',
    whatsapp: 'Revisá el WhatsApp: tiene que tener código de área.',
    zona: 'Elegí tu zona.',
    direccion: 'Falta la dirección.',
    persona: 'Falta tu nombre.',
    email: 'Ese email no parece válido.',
    perfil: 'Elegí un perfil.',
    consent: 'Tenés que aceptar para seguir.',
    _: 'Falta completar este campo.'
  };
  var MSG_INV = { nombre: 'Falta tu nombre y apellido.' };
  var MSG_ESP = { zona: 'Contanos tu barrio o zona.' };

  function mensaje(form, name) {
    var tipo = form.getAttribute('data-form');
    if (tipo === 'inversores' && MSG_INV[name]) return MSG_INV[name];
    if (tipo === 'lista-espera' && MSG_ESP[name]) return MSG_ESP[name];
    return MSG[name] || MSG._;
  }

  function valido(el) {
    var v = (el.value || '').trim();
    if (el.type === 'checkbox') return el.checked;
    if (!v) return false;
    if (el.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (el.type === 'tel') { var d = v.replace(/\D/g, ''); return d.length >= 10 && d.length <= 13; }
    return true;
  }

  function errorDe(el) {
    if (el.type === 'checkbox') return el.closest('form').querySelector('.err[data-for="consent"]');
    var f = el.closest('.field');
    return f && f.querySelector('.err');
  }

  function marcar(form, el, ok) {
    var f = el.closest('.field'), e = errorDe(el);
    if (f) f.classList.toggle('has-err', !ok);
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (e) { e.textContent = ok ? '' : mensaje(form, el.name); }
  }

  function validar(form, contenedor) {
    var primero = null, todo = true;
    contenedor.querySelectorAll('[required]').forEach(function (el) {
      var ok = valido(el);
      marcar(form, el, ok);
      if (!ok) { todo = false; if (!primero) primero = el; }
    });
    if (primero) primero.focus();
    return todo;
  }

  function datos(form) {
    var o = {}, fd = new FormData(form);
    fd.forEach(function (v, k) {
      if (o[k] !== undefined) o[k] = [].concat(o[k], v); else o[k] = v;
    });
    return o;
  }

  function exito(form, tipoOk) {
    form.querySelectorAll('fieldset, .form__steps, h3, p:not(.form__ok-t), .form__grid, .field, .check, .btn, .err').forEach(function (n) {
      if (!n.closest('[data-ok]')) n.hidden = true;
    });
    var ok = form.querySelector('[data-ok]');
    ok.hidden = false;
    ok.focus();
  }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var tipo = form.getAttribute('data-form');
    form.addEventListener('input', function (e) {
      var el = e.target;
      if (el.closest('.field') && el.hasAttribute('required') && el.closest('.field').classList.contains('has-err') && valido(el)) marcar(form, el, true);
    });
    form.addEventListener('change', function (e) {
      if (e.target.type === 'checkbox' && e.target.hasAttribute('required') && e.target.checked) marcar(form, e.target, true);
    });

    if (tipo === 'alta') initAlta(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var panel = form;
      if (tipo === 'alta') panel = form.querySelector('[data-pane="2"]');
      if (!validar(form, panel)) return;
      var d = datos(form);
      var demo = tipo === 'alta' && (d.plan === 'smart' || d.plan === 'intelligence');
      enviarLead(demo ? 'demo' : (tipo === 'alta' ? 'alta-comercio' : tipo), d).then(function () {
        if (tipo === 'alta') {
          var ok = form.querySelector('[data-ok]');
          if (demo) {
            ok.querySelector('[data-ok-t]').textContent = 'Gracias.';
            ok.querySelector('[data-ok-p]').textContent = 'Te contactamos para coordinar una demo de 30 minutos.';
          }
        }
        exito(form);
      });
    });
  });

  function initAlta(form) {
    var p1 = form.querySelector('[data-pane="1"]'),
        p2 = form.querySelector('[data-pane="2"]'),
        pasos = form.querySelectorAll('.form__steps li'),
        mas = form.querySelector('.mas'),
        demo = form.querySelector('[data-demo]'),
        btn = form.querySelector('[data-submit]'),
        intel = form.querySelector('[data-intel]'),
        locales = form.querySelector('[name="locales"]');

    function ir(n) {
      p1.hidden = n !== 1; p2.hidden = n !== 2;
      pasos.forEach(function (li, i) { li.classList.toggle('is-on', i < n); });
      var foco = (n === 1 ? p1 : p2).querySelector('input,select');
      if (foco) foco.focus({ preventScroll: true });
      form.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    form.querySelector('[data-next]').addEventListener('click', function () { if (validar(form, p1)) ir(2); });
    form.querySelector('[data-back]').addEventListener('click', function () { ir(1); });

    function plan(valor) {
      var r = form.querySelector('input[name="plan"][value="' + valor + '"]');
      if (!r) return;
      r.checked = true;
      var esDemo = valor === 'smart' || valor === 'intelligence';
      demo.hidden = !esDemo;
      btn.textContent = valor === 'smart' ? 'Pedí una demo' : (valor === 'intelligence' ? 'Hablá con ventas' : 'Sumá tu comercio');
      if (esDemo) mas.open = true;
    }
    form.querySelectorAll('input[name="plan"]').forEach(function (r) { r.addEventListener('change', function () { plan(r.value); }); });
    locales.addEventListener('input', function () { intel.hidden = !(parseInt(locales.value, 10) > 1); });

    // Botones de planes (Base / Smart / Intelligence) preseleccionan el plan
    document.querySelectorAll('[data-plan]').forEach(function (a) {
      a.addEventListener('click', function () { plan(a.getAttribute('data-plan')); });
    });
  }
})();
