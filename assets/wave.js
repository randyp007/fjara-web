/* Fjara — dezente Canvas-Gezeitenwelle im Hero.
   Rein dekorativ (Canvas trägt aria-hidden). Respektiert prefers-reduced-motion:
   bei reduzierter Bewegung wird die Welle einmal statisch gezeichnet. */
(function () {
  'use strict';
  var canvas = document.getElementById('tide');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var w = 0, h = 0, raf = null, start = null;

  var waves = [
    { amp: 16, k: 0.006, speed: 0.30, base: 0.66, color: 'rgba(62,139,152,0.16)' },
    { amp: 11, k: 0.010, speed: -0.20, base: 0.76, color: 'rgba(87,170,183,0.11)' },
    { amp: 7,  k: 0.016, speed: 0.14, base: 0.86, color: 'rgba(62,139,152,0.09)' }
  ];

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < waves.length; i++) {
      var v = waves[i];
      var base = h * v.base;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (var x = 0; x <= w; x += 4) {
        ctx.lineTo(x, base + Math.sin(x * v.k + t * v.speed + i * 2.1) * v.amp);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = v.color;
      ctx.fill();
    }
  }

  function frame(ts) {
    if (start === null) start = ts;
    draw((ts - start) / 1000);
    raf = window.requestAnimationFrame(frame);
  }

  function run() {
    resize();
    var reduced = media && media.matches;
    if (reduced) {
      if (raf) { window.cancelAnimationFrame(raf); raf = null; }
      draw(0);
    } else if (!raf && window.requestAnimationFrame) {
      raf = window.requestAnimationFrame(frame);
    } else if (!window.requestAnimationFrame) {
      draw(0);
    }
  }

  window.addEventListener('resize', run);
  if (media) {
    if (media.addEventListener) media.addEventListener('change', run);
    else if (media.addListener) media.addListener(run);
  }
  run();
})();
