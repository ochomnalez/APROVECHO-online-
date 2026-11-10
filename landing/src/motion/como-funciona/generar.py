#!/usr/bin/env python3
"""Video de 18 s "Así funciona APROVECHO" (plan Base), hecho con HyperFrames (HTML + GSAP -> MP4).

Uso (desde esta carpeta):
    python3 generar.py horizontal   # 1920x1080 -> build/horizontal/
    python3 generar.py vertical     # 1080x1350 (4:5, celulares) -> build/vertical/
Después: cd build/<modo> && npx --yes hyperframes@0.9.28 render --quality looks -o out.mp4
Ver README.md para comprimir y copiar a landing/video/.
"""
import random

# ---------- QR ilustrativo (patrón fijo, no codifica nada) ----------
N = 25
rnd = random.Random(20261110)
grid = [[0] * N for _ in range(N)]
def finder(r0, c0):
    for r in range(7):
        for c in range(7):
            edge = r in (0, 6) or c in (0, 6)
            core = 2 <= r <= 4 and 2 <= c <= 4
            grid[r0 + r][c0 + c] = 1 if (edge or core) else 0
for (r0, c0) in ((0, 0), (0, N - 7), (N - 7, 0)):
    finder(r0, c0)
reserved = set()
for (r0, c0) in ((0, 0), (0, N - 7), (N - 7, 0)):
    for r in range(-1, 8):
        for c in range(-1, 8):
            if 0 <= r0 + r < N and 0 <= c0 + c < N:
                reserved.add((r0 + r, c0 + c))
for r in range(N):
    for c in range(N):
        if (r, c) not in reserved:
            grid[r][c] = 1 if rnd.random() < 0.47 else 0
cell = 10
rows_svg = []
for r in range(N):
    rects = ''.join(f'<rect x="{c*cell}" y="{r*cell}" width="{cell}" height="{cell}"/>' for c in range(N) if grid[r][c])
    rows_svg.append(f'<g class="qr-row">{rects}</g>')
QR = f'<svg id="qr" viewBox="0 0 {N*cell} {N*cell}" width="250" height="250" aria-hidden="true">{"".join(rows_svg)}</svg>'

def words(text, cls='w'):
    return ' '.join(f'<span class="{cls}">{w}</span>' for w in text.split(' '))

TITLES = [
    ('t1', 0.30, 3.40, 'Paso 1 · Al cierre', 'Sacás una foto.', 'A lo que te sobró, con el celular del local.'),
    ('t2', 3.85, 3.60, 'Paso 2 · La app propone', 'La app arma los packs.', 'Revisás y publicás.'),
    ('t3', 7.65, 3.35, 'Paso 3 · En la app', 'Vecinos reservan y pagan.', 'Te avisamos apenas alguien reserva.'),
    ('t4', 11.15, 3.05, 'Paso 4 · En tu mostrador', 'Retiran con un QR.', 'Lo validás en el mostrador.'),
    ('t5', 14.35, 1.90, 'Paso 5 · Tu panel', 'Sabés cuánto rescatás.', 'Lo medido y lo estimado, siempre separados.'),
]
titles_html = '\n'.join(
    f'''    <div id="{i}" class="clip title-block" data-start="{s}" data-duration="{d}" data-track-index="2" data-layout-allow-overlap>
      <div class="tb-in" id="{i}-in">
        <p class="eyebrow" id="{i}-eb">{eb}</p>
        <h2 class="title" id="{i}-h">{words(t)}</h2>
        <p class="sub" id="{i}-sub">{sub}</p>
      </div>
    </div>''' for (i, s, d, eb, t, sub) in TITLES)

HTML = r'''<!doctype html>
<html lang="es-AR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      @font-face { font-family: 'Bricolage Grotesque'; src: url('assets/fonts/bricolage.woff2') format('woff2'); font-weight: 200 800; font-display: block; }
      @font-face { font-family: 'DM Sans'; src: url('assets/fonts/dmsans.woff2') format('woff2'); font-weight: 100 1000; font-display: block; }
      :root {
        --ground: #ffffff; --ink: #0b0b0b; --forest: #1A4D3A; --forest-d: #0F3326; --mint: #DFFFD6; --soft: #F3F6F4; --muted: #4a4a4a;
        --font-display: 'Bricolage Grotesque', sans-serif; --font-body: 'DM Sans', sans-serif;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: var(--ground); }
      #root { position: relative; width: 1920px; height: 1080px; background: var(--ground); font-family: var(--font-body); color: var(--ink); }

      /* títulos (columna izquierda) */
      .title-block { position: absolute; left: 150px; top: 330px; width: 820px; }
      .eyebrow { font: 700 24px/1 var(--font-body); letter-spacing: .14em; text-transform: uppercase; color: var(--forest); margin-bottom: 30px; }
      .title { font: 700 100px/0.98 var(--font-display); letter-spacing: -0.04em; color: var(--ink); }
      .title .w { display: inline-block; }
      .sub { font: 400 34px/1.35 var(--font-body); color: var(--muted); margin-top: 34px; max-width: 660px; }

      /* escenario del teléfono */
      #stage { position: absolute; inset: 0; }
      #circle { position: absolute; left: 910px; top: 160px; width: 760px; height: 760px; border-radius: 50%; background: var(--soft); }
      #phonewrap { position: absolute; left: 1090px; top: 130px; width: 400px; height: 820px; }
      #phone { position: absolute; inset: 0; border-radius: 60px; background: #0b0b0b; box-shadow: 0 60px 90px rgba(0,0,0,.18), inset 0 0 0 2px #2c2c2c; }
      #screen { position: absolute; left: 14px; top: 14px; width: 372px; height: 792px; border-radius: 46px; overflow: hidden; background: #fff; }
      .island { position: absolute; left: 131px; top: 14px; width: 110px; height: 32px; border-radius: 20px; background: #0b0b0b; z-index: 30; }
      .scr { position: absolute; inset: 0; }

      /* S1 · foto y detección */
      #s1 img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%; }
      #s1-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,.55) 100%); }
      #scan { position: absolute; left: 0; right: 0; top: 0; height: 170px; background: linear-gradient(180deg, rgba(223,255,214,0) 0%, rgba(223,255,214,.55) 100%); border-bottom: 4px solid var(--mint); }
      .det { position: absolute; border: 4px solid var(--mint); border-radius: 16px; }
      .det em { position: absolute; left: -4px; top: -40px; background: var(--mint); color: var(--forest-d); font: 700 20px/1 var(--font-body); font-style: normal; padding: 8px 12px; border-radius: 10px; white-space: nowrap; }
      #s1-bar { position: absolute; left: 18px; right: 18px; bottom: 22px; height: 92px; border-radius: 24px; background: rgba(15,51,38,.94); color: #fff; }
      #s1-bar span { position: absolute; left: 24px; top: 0; height: 92px; display: flex; align-items: center; font: 700 24px/1.2 var(--font-body); }

      /* S2 · propuesta */
      #s2 { background: #fff; padding: 70px 24px 24px; }
      .s2-top { font: 700 20px/1 var(--font-body); color: var(--forest); letter-spacing: .1em; text-transform: uppercase; }
      .s2-h { font: 700 44px/1 var(--font-display); letter-spacing: -0.03em; margin-top: 14px; }
      .s2-p { font: 400 22px/1.3 var(--font-body); color: var(--muted); margin-top: 10px; }
      .pack { position: relative; display: flex; gap: 16px; align-items: center; margin-top: 18px; padding: 14px; border: 2px solid #E3E8E5; border-radius: 22px; background: #fff; }
      .pack img { width: 84px; height: 84px; border-radius: 16px; object-fit: cover; }
      .pack b { display: block; font: 700 24px/1.1 var(--font-body); }
      .pack s { display: block; font: 400 20px/1.3 var(--font-body); color: #767676; margin-top: 6px; }
      .pack i { display: block; font: 700 30px/1 var(--font-display); font-style: normal; color: var(--forest); margin-top: 4px; letter-spacing: -0.02em; }
      .chips { display: flex; gap: 10px; margin-top: 18px; }
      .chip { font: 700 20px/1 var(--font-body); padding: 12px 16px; border-radius: 99px; background: var(--soft); color: var(--forest-d); }
      #publish { position: absolute; left: 24px; right: 24px; bottom: 28px; height: 74px; border-radius: 22px; background: var(--ink); color: #fff; font: 700 28px/74px var(--font-body); text-align: center; }
      #publish span { position: absolute; inset: 0; }
      #pub-b { color: var(--forest-d); opacity: 0; }

      /* S3 · reservas */
      #s3 { background: var(--forest-d); }
      #s3-time { position: absolute; left: 0; right: 0; top: 96px; text-align: center; color: #fff; font: 700 96px/1 var(--font-display); letter-spacing: -0.04em; }
      #s3-date { position: absolute; left: 0; right: 0; top: 206px; text-align: center; color: rgba(255,255,255,.75); font: 500 22px/1 var(--font-body); }
      .note { position: absolute; left: 16px; right: 16px; height: 124px; border-radius: 26px; background: #fff; padding: 18px 20px; }
      .note small { display: block; font: 700 17px/1 var(--font-body); color: var(--forest); letter-spacing: .08em; text-transform: uppercase; }
      .note b { display: block; font: 700 25px/1.2 var(--font-body); margin-top: 12px; }
      .note span { display: block; font: 400 20px/1.2 var(--font-body); color: var(--muted); margin-top: 6px; }
      #n1 { top: 268px; } #n2 { top: 408px; }
      #s3-count { position: absolute; left: 50%; top: 574px; width: 290px; margin-left: -145px; height: 58px; border-radius: 99px; background: var(--mint); color: var(--forest-d); font: 700 22px/58px var(--font-body); text-align: center; }

      /* S4 · QR */
      #s4 { background: #fff; text-align: center; }
      #s4-h { position: absolute; left: 0; right: 0; top: 96px; font: 700 44px/1 var(--font-display); letter-spacing: -0.03em; }
      #s4-p { position: absolute; left: 0; right: 0; top: 154px; font: 500 22px/1.3 var(--font-body); color: var(--muted); }
      #qrbox { position: absolute; left: 50%; top: 220px; width: 300px; height: 300px; margin-left: -150px; border-radius: 28px; border: 2px solid #E3E8E5; padding: 25px; }
      #qr { display: block; fill: var(--ink); }
      #s4-c { position: absolute; left: 30px; right: 30px; top: 556px; font: 500 22px/1.35 var(--font-body); color: var(--muted); }
      #s4ok { position: absolute; inset: 0; background: var(--mint); }
      #okcheck { position: absolute; left: 106px; top: 220px; width: 160px; height: 160px; }
      #s4ok b { position: absolute; left: 0; right: 0; top: 410px; text-align: center; font: 700 44px/1.05 var(--font-display); letter-spacing: -0.03em; color: var(--forest-d); }
      #s4ok span { position: absolute; left: 0; right: 0; top: 520px; text-align: center; font: 500 22px/1 var(--font-body); color: var(--forest-d); }

      /* S5 · panel */
      #s5 { background: #fff; padding: 74px 24px 24px; }
      .s5-h { font: 700 48px/1 var(--font-display); letter-spacing: -0.03em; }
      .s5-p { font: 400 21px/1.3 var(--font-body); color: var(--muted); margin-top: 10px; }
      .stat { position: relative; margin-top: 18px; padding: 18px 20px; border-radius: 22px; background: var(--soft); }
      .stat small { display: block; font: 700 18px/1 var(--font-body); color: var(--muted); }
      .stat b { display: block; font: 700 54px/1 var(--font-display); letter-spacing: -0.03em; margin-top: 10px; color: var(--ink); }
      .tag { position: absolute; right: 18px; top: 16px; font: 700 15px/1 var(--font-body); letter-spacing: .08em; text-transform: uppercase; padding: 8px 10px; border-radius: 99px; }
      .tag--m { background: var(--forest); color: #fff; }
      .tag--e { background: #fff; color: var(--forest-d); border: 2px dashed var(--forest); }
      .s5-foot { margin-top: 16px; font: 500 18px/1 var(--font-body); color: #767676; }

      /* cierre */
      #end { position: absolute; inset: 0; }
      #endwrap { position: absolute; inset: 0; }
      #ring { position: absolute; left: 780px; top: 170px; width: 360px; height: 360px; }
      #core { position: absolute; left: 873px; top: 263px; width: 174px; height: 174px; border-radius: 50%; background: #fff; box-shadow: 0 18px 40px rgba(0,0,0,.18); }
      #core img { position: absolute; left: 10px; top: 10px; width: 154px; height: 154px; }
      #tag { position: absolute; left: 0; right: 0; top: 640px; text-align: center; font: 700 84px/1 var(--font-display); letter-spacing: -0.04em; }
      #tag .w2 { display: inline-block; }
      #tag .hl { color: var(--forest); }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="18" data-width="1920" data-height="1080">

    <div id="stage" class="clip" data-start="0" data-duration="16.62" data-track-index="1" data-layout-allow-overlap>
      <div id="circle"></div>
      <div id="phonewrap">
        <div id="phone">
          <div id="screen">
            <div class="island"></div>
            <div id="s1" class="scr">
              <img src="assets/img/medialunas.jpg" alt="" />
              <div id="s1-shade"></div>
              <div id="scan"></div>
              <div class="det" id="d1" style="left:26px;top:150px;width:146px;height:150px"><em>Medialuna</em></div>
              <div class="det" id="d2" style="left:178px;top:262px;width:168px;height:176px"><em>Medialuna</em></div>
              <div class="det" id="d3" style="left:52px;top:448px;width:172px;height:170px"><em>Medialuna</em></div>
              <div id="s1-bar"><span id="bar-a">Leyendo tu foto…</span><span id="bar-b">12 medialunas detectadas</span></div>
            </div>
            <div id="s2" class="scr">
              <p class="s2-top">Propuesta de hoy</p>
              <p class="s2-h">2 packs sorpresa</p>
              <p class="s2-p">Con lo que detectamos en tu foto.</p>
              <div class="pack" id="p1"><img src="assets/img/medialunas.jpg" alt="" /><div><b>Pack sorpresa</b><s>$12.200</s><i>$6.100</i></div></div>
              <div class="pack" id="p2"><img src="assets/img/medialunas.jpg" alt="" style="object-position:80% 40%" /><div><b>Pack sorpresa</b><s>$12.200</s><i>$6.100</i></div></div>
              <div class="chips" id="chips"><span class="chip">Retiro 19 a 20 h</span><span class="chip">50% off</span></div>
              <div id="publish"><span id="pub-a">Publicar</span><span id="pub-b">Publicado ✓</span></div>
            </div>
            <div id="s3" class="scr">
              <p id="s3-time">18:42</p>
              <p id="s3-date">Hoy</p>
              <div class="note" id="n1"><small>APROVECHO · ahora</small><b>Nueva reserva</b><span>Pack sorpresa · Retiro 19 a 20 h</span></div>
              <div class="note" id="n2"><small>APROVECHO · ahora</small><b>Nueva reserva</b><span>Pack sorpresa · Retiro 19 a 20 h</span></div>
              <div id="s3-count">2 de 2 packs reservados</div>
            </div>
            <div id="s4" class="scr">
              <p id="s4-h">Retiro</p>
              <p id="s4-p">Pack sorpresa · 19 a 20 h</p>
              <div id="qrbox">__QR__</div>
              <p id="s4-c">Mostrá este código en el mostrador.</p>
              <div id="s4ok">
                <svg id="okcheck" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="74" fill="#1A4D3A"/><path id="okpath" d="M46 82 L70 106 L116 56" fill="none" stroke="#DFFFD6" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="110" stroke-dashoffset="110"/></svg>
                <b>Retiro validado</b>
                <span>Pack sorpresa #1</span>
              </div>
            </div>
            <div id="s5" class="scr">
              <p class="s5-h">Tu día</p>
              <p class="s5-p">Lo que rescataste hoy.</p>
              <div class="stat" id="st1"><small>Packs vendidos</small><b id="v1">2</b><span class="tag tag--m">Medido</span></div>
              <div class="stat" id="st2"><small>Kilos rescatados</small><b>≈ <span id="v2">0,00</span> kg</b><span class="tag tag--e">Estimado</span></div>
              <div class="stat" id="st3"><small>CO₂e asociado</small><b>≈ <span id="v3">0,0</span> kg</b><span class="tag tag--e">Estimado</span></div>
              <p class="s5-foot">Datos de ejemplo.</p>
            </div>
          </div>
        </div>
      </div><!--END-PHONE-->
    </div>

__TITLES__

    <div id="end" class="clip" data-start="16.3" data-duration="1.7" data-track-index="3">
      <div id="endwrap">
        <img id="ring" src="assets/img/ring3.svg" alt="" />
        <div id="core"><img src="assets/img/sello.webp" alt="" /></div>
        <p id="tag"><span class="w2">Menos</span> <span class="w2">desperdicio,</span> <span class="w2 hl">más</span> <span class="w2 hl">aprovecho.</span></p>
      </div>
    </div>

    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      const OUT = { immediateRender: false };

      // ---------- escenario ----------
      tl.fromTo('#circle', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' }, 0);
      tl.fromTo('#phonewrap', { opacity: 0, y: 70, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'expo.out' }, 0.05);

      // ---------- títulos: entradas variadas, salida con blur ----------
      function titleIn(id, t, mode) {
        tl.fromTo('#' + id + '-eb', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, t);
        if (mode === 'blurwords') {
          tl.fromTo('#' + id + '-h .w', { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power4.out', stagger: 0.075 }, t + 0.08);
        } else if (mode === 'inkwords') {
          tl.fromTo('#' + id + '-h .w', { opacity: 0.12 }, { opacity: 1, duration: 0.2, ease: 'power2.out', stagger: 0.09 }, t + 0.08);
        } else {
          tl.fromTo('#' + id + '-h', { opacity: 0, filter: 'blur(10px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.22, ease: 'power3.out' }, t + 0.08);
        }
        tl.fromTo('#' + id + '-sub', { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.25, ease: 'power3.out' }, t + 0.45);
      }
      function titleOut(id, t) {
        tl.fromTo('#' + id + '-in', { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(8px)', duration: 0.2, ease: 'power2.in', immediateRender: false }, t);
      }
      titleIn('t1', 0.35, 'blurwords');  titleOut('t1', 3.42);
      titleIn('t2', 3.9, 'inkwords');    titleOut('t2', 7.2);
      titleIn('t3', 7.7, 'line');        titleOut('t3', 10.75);
      titleIn('t4', 11.2, 'blurwords');  titleOut('t4', 13.95);
      titleIn('t5', 14.4, 'inkwords');   titleOut('t5', 16.0);

      // ---------- S1 · foto, escaneo y detección ----------
      tl.fromTo('#scan', { y: -170 }, { y: 792, duration: 1.5, ease: 'power2.inOut' }, 0.7);
      ['#d1', '#d2', '#d3'].forEach((d, i) => {
        tl.fromTo(d, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out' }, 1.25 + i * 0.28);
      });
      tl.fromTo('#bar-a', { opacity: 1 }, { opacity: 0, duration: 0.15, immediateRender: false }, 2.35);
      tl.fromTo('#bar-b', { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.2, ease: 'power3.out' }, 2.45);

      // S1 -> S2: cambio con blur sobre el mismo escenario
      tl.fromTo('#s1', { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(8px)', duration: 0.18, ease: 'power2.in', immediateRender: false }, 3.75);
      tl.fromTo('#s2', { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.22, ease: 'power3.out' }, 3.88);
      tl.fromTo(['#p1', '#p2', '#chips'], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.07 }, 4.05);
      tl.fromTo('#publish', { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 4.4);
      tl.fromTo('#publish', { scale: 1 }, { scale: 0.95, duration: 0.1, ease: 'power2.out', immediateRender: false }, 6.2);
      tl.fromTo('#publish', { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'expo.out', immediateRender: false }, 6.3);
      tl.fromTo('#publish', { backgroundColor: '#0b0b0b' }, { backgroundColor: '#DFFFD6', duration: 0.3, ease: 'power2.inOut', immediateRender: false }, 6.32);
      tl.fromTo('#pub-a', { opacity: 1 }, { opacity: 0, duration: 0.12, ease: 'power2.in', immediateRender: false }, 6.3);
      tl.fromTo('#pub-b', { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.2, ease: 'power3.out' }, 6.42);

      // S2 -> S3: el fondo se tiñe de verde (colour flood) y llegan las reservas
      tl.fromTo('#s3', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 7.5);
      tl.fromTo(['#s3-time', '#s3-date'], { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 7.75);
      tl.fromTo('#n1', { opacity: 0, y: -46 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 8.1);
      tl.fromTo('#n2', { opacity: 0, y: -46 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 9.05);
      tl.fromTo('#s3-count', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' }, 9.85);

      // S3 -> S4: barrido lateral (whip)
      tl.fromTo('#s3', { x: 0 }, { x: -372, duration: 0.3, ease: 'power3.in', immediateRender: false }, 11.0);
      tl.fromTo('#s4', { x: 372 }, { x: 0, duration: 0.38, ease: 'power3.out' }, 11.18);
      tl.fromTo('.qr-row', { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none', stagger: 0.025 }, 11.5);
      tl.fromTo(['#s4-c'], { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 12.1);
      // QR validado: se abre en círculo desde el código (iris)
      tl.fromTo('#s4ok', { clipPath: 'circle(0% at 50% 47%)' }, { clipPath: 'circle(150% at 50% 47%)', duration: 0.5, ease: 'power2.inOut' }, 13.05);
      tl.fromTo('#okpath', { strokeDashoffset: 110 }, { strokeDashoffset: 0, duration: 0.35, ease: 'power3.out' }, 13.4);

      // S4 -> S5: panel con números (blur swap)
      tl.fromTo('#s4', { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(8px)', duration: 0.18, ease: 'power2.in', immediateRender: false }, 14.2);
      tl.fromTo('#s5', { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.22, ease: 'power3.out' }, 14.32);
      tl.fromTo(['#st1', '#st2', '#st3'], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.07 }, 14.45);
      const c2 = { v: 0 }, c3 = { v: 0 };
      const fmt = (n, d) => n.toFixed(d).replace('.', ',');
      tl.fromTo(c2, { v: 0 }, { v: 0.54, duration: 0.8, ease: 'power2.out', onUpdate: () => { document.getElementById('v2').textContent = fmt(c2.v, 2); } }, 14.7);
      tl.fromTo(c3, { v: 0 }, { v: 1.37, duration: 0.8, ease: 'power2.out', onUpdate: () => { document.getElementById('v3').textContent = fmt(c3.v, 1); } }, 14.8);

      // salida del escenario
      tl.fromTo('#phonewrap', { opacity: 1, scale: 1, filter: 'blur(0px)' }, { opacity: 0, scale: 0.92, filter: 'blur(8px)', duration: 0.35, ease: 'power3.in', immediateRender: false }, 16.2);
      tl.fromTo('#circle', { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power2.in', immediateRender: false }, 16.25);

      // cierre: anillo + sello + lema; termina en blanco para que el loop sea limpio
      tl.fromTo('#ring', { opacity: 0, rotation: -140, scale: 0.86 }, { opacity: 1, rotation: 0, scale: 1, duration: 1.0, ease: 'expo.out' }, 16.35);
      tl.fromTo('#core', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, 16.5);
      tl.fromTo('#tag .w2', { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power4.out', stagger: 0.08 }, 16.7);
      tl.fromTo('#endwrap', { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power2.in', immediateRender: false }, 17.62);

      window.__timelines['main'] = tl;
    </script>
  </body>
</html>
'''

import json
import os
import shutil
import sys
HERE = os.path.dirname(os.path.abspath(__file__))
mode = {'landscape': 'horizontal', 'portrait': 'vertical'}.get(sys.argv[1], sys.argv[1]) if len(sys.argv) > 1 else 'horizontal'
assert mode in ('horizontal', 'vertical'), 'modo: horizontal o vertical'
out = HTML.replace('__QR__', QR).replace('__TITLES__', titles_html)

PORTRAIT_CSS = """
      /* ---- vertical 4:5 para celulares ---- */
      .title-block { left: 90px; top: 92px; width: 900px; }
      .eyebrow { font-size: 22px; margin-bottom: 22px; }
      .title { font-size: 80px; }
      .sub { font-size: 32px; margin-top: 22px; max-width: 900px; }
      #circle { left: 190px; top: 560px; width: 700px; height: 700px; }
      #phonescale { position: absolute; left: 340px; top: 470px; width: 400px; height: 820px; transform: scale(0.92); transform-origin: 50% 0; }
      #phonewrap { left: 0; top: 0; }
      #ring { left: 360px; top: 300px; }
      #core { left: 453px; top: 393px; }
      #tag { top: 760px; left: 90px; right: 90px; font-size: 80px; line-height: 1.02; }
    </style>"""

if mode == 'vertical':
    W, H = 1080, 1350
    out = out.replace('width=1920, height=1080', 'width=%d, height=%d' % (W, H))
    out = out.replace('html, body { width: 1920px; height: 1080px;', 'html, body { width: %dpx; height: %dpx;' % (W, H))
    out = out.replace('#root { position: relative; width: 1920px; height: 1080px;', '#root { position: relative; width: %dpx; height: %dpx;' % (W, H))
    out = out.replace('data-width="1920" data-height="1080"', 'data-width="%d" data-height="%d"' % (W, H))
    out = out.replace('</style>', PORTRAIT_CSS, 1)
    # envoltorio con escala fija (GSAP no lo toca) alrededor del teléfono
    out = out.replace('<div id="phonewrap">', '<div id="phonescale"><div id="phonewrap">', 1)
    out = out.replace('<!--END-PHONE-->', '</div>', 1)
else:
    out = out.replace('<!--END-PHONE-->', '', 1)

# proyecto HyperFrames listo para renderizar en build/<modo>/
dest = os.path.join(HERE, 'build', mode)
os.makedirs(dest, exist_ok=True)
shutil.copytree(os.path.join(HERE, 'assets'), os.path.join(dest, 'assets'), dirs_exist_ok=True)
with open(os.path.join(dest, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(out)
with open(os.path.join(dest, 'hyperframes.json'), 'w', encoding='utf-8') as f:
    json.dump({'$schema': 'https://hyperframes.heygen.com/schema/hyperframes.json',
               'paths': {'blocks': 'compositions', 'components': 'compositions/components', 'assets': 'assets'},
               'media': {'autoProxy': True}}, f, indent=2)
with open(os.path.join(dest, 'package.json'), 'w', encoding='utf-8') as f:
    json.dump({'name': 'aprovecho-como-funciona-' + mode, 'private': True, 'type': 'module',
               'scripts': {'check': 'npx --yes hyperframes@0.9.28 check',
                           'render': 'npx --yes hyperframes@0.9.28 render --quality looks -o out.mp4'}}, f, indent=2)
print('listo:', os.path.join(dest, 'index.html'))
print('ok', mode, len(out))
