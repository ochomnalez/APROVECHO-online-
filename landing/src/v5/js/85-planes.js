/* main.js actualiza las pestañas; observar el estado final también cubre teclado y enlaces directos. */
(function () {
  'use strict';
  var root = document.getElementById('planes');
  if (!root) return;
  var panels = [].slice.call(root.querySelectorAll('[role="tabpanel"]'));
  var selected = panels.find(function (p) { return !p.hidden; });
  var clicked = false;
  root.querySelector('[role="tablist"]').addEventListener('click', function () { clicked = true; });
  root.querySelector('[role="tablist"]').addEventListener('keydown', function (e) { if (/^(Arrow|Home|End)/.test(e.key)) clicked = true; });
  new MutationObserver(function () {
    var next = panels.find(function (p) { return !p.hidden; });
    if (next === selected) { clicked = false; return; }
    selected = next;
    APV5.refreshPlans();
    if (clicked) {
      var head = root.querySelector('.pl__tabs');
      window.scrollTo({ top: Math.max(0, head.getBoundingClientRect().top + window.scrollY - 84), behavior: 'instant' });
    }
    clicked = false;
  }).observe(root.querySelector('.pl__panels'), { subtree: true, attributes: true, attributeFilter: ['hidden'] });
})();
