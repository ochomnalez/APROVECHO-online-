/* Barra de progreso a la izquierda: aparece mientras estás dentro de una escena con scroll (Recuperá, Medí, Anticipá)
   y muestra cuánto avanzaste de esa escena. Es decorativa (aria-hidden): los pasos ya se leen en el texto. */
APV5.scene('progreso', function (ctx) {
  var ScrollTrigger = ctx.ScrollTrigger, gsap = ctx.gsap;
  var ESCENAS = [['plan-base', '01'], ['plan-smart', '02'], ['plan-intelligence', '03']];
  var bar = document.createElement('div');
  bar.className = 'pg';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<span class="pg__n"></span><span class="pg__track"><span class="pg__fill"></span></span><span class="pg__pct">0%</span>';
  document.body.appendChild(bar);
  var n = bar.querySelector('.pg__n'), fill = bar.querySelector('.pg__fill'), pct = bar.querySelector('.pg__pct');
  var setY = gsap.quickSetter(fill, 'scaleY');
  var activo = null;

  function pinDe(sec) {
    var all = ScrollTrigger.getAll();
    for (var i = 0; i < all.length; i++) if (all[i].pin === sec) return all[i];
    return null;
  }
  ESCENAS.forEach(function (e) {
    var sec = document.getElementById(e[0]);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      invalidateOnRefresh: true,
      // en escritorio sigue al pin real de la escena; sin pin (celular), a la sección entera
      start: function () { var p = pinDe(sec); return p ? p.start : 'top 30%'; },
      end: function () { var p = pinDe(sec); return p ? p.end : 'bottom 70%'; },
      onToggle: function (self) {
        if (self.isActive) { activo = e[0]; n.textContent = e[1]; bar.classList.add('is-on'); }
        else if (activo === e[0]) { activo = null; bar.classList.remove('is-on'); }
      },
      onUpdate: function (self) { if (activo === e[0]) { setY(self.progress); pct.textContent = Math.round(self.progress * 100) + '%'; } }
    });
  });
});
