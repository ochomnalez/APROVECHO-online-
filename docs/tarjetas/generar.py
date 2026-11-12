#!/usr/bin/env python3
"""Genera docs/tarjetas/propuestas.html (5 propuestas, blanco y negro, 90x50 mm).
Uso: python3 docs/tarjetas/generar.py [URL]   (sin URL usa la provisoria)
"""
import sys, segno
URL = sys.argv[1] if len(sys.argv) > 1 else "https://ochomnalez.github.io/aprovecho-app/"
def qr(color="#000"):
    import re
    q = segno.make(URL, error="q"); n = q.symbol_size(scale=1, border=0)[0]
    svg = q.svg_inline(scale=1, border=0, dark=color, light=None)
    return re.sub(r'\s(width|height)="[^"]*"', '', svg, count=2).replace('<svg', f'<svg viewBox="0 0 {n} {n}" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet"', 1)
def ring(cx, cy, r, txt, size, uid):
    return f'''<svg viewBox="0 0 {cx*2} {cy*2}" class="ring"><defs><path id="{uid}" d="M {cx-r},{cy} a {r},{r} 0 1,1 {2*r},0 a {r},{r} 0 1,1 {-2*r},0"/></defs>
<circle cx="{cx}" cy="{cy}" r="{r+size*1.1}" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="{cx}" cy="{cy}" r="{r-size*1.5}" fill="none" stroke="currentColor" stroke-width="1"/>
<text font-size="{size}" letter-spacing="1.2" font-weight="700" textLength="610" fill="currentColor"><textPath href="#{uid}">{txt}</textPath></text>
<text x="{cx}" y="{cy+16}" text-anchor="middle" font-family="Fraunces,serif" font-weight="900" font-size="{r*0.85}" fill="currentColor">50%</text></svg>'''
who = '''<div class="who"><b>Nombre Apellido</b><span>Cargo · Cofundador/a</span><span>nombre@aprovecho.app</span><span>+54 9 11 0000 0000</span></div>'''
cards = []
# 1 SELLO
cards.append(("1 · El Sello", "Un sello de goma gigante: el círculo del logo vuelve a ser sello, con el 50 % en el centro. Dorso en negro sólido con el QR en blanco. Es el más fiel a la marca actual.",
 f'<div class="c c1f">{who}{ring(150,150,100,"APROVECHO ✦ MENOS DESPERDICIO, MÁS APROVECHO ✦",15,"r1")}</div>',
 f'<div class="c c1b"><div class="qrbox">{qr("#000")}</div><div class="txt"><h3>Escaneá y<br>sumá tu<br>comercio.</h3><small>aprovecho.app</small></div></div>'))
# 2 TICKET
cards.append(("2 · El Ticket", "Parece un ticket de caja: la marca vive en el comercio, así que la tarjeta imita su papel. Humor B2B y tipografía de máquina. El QR es el \"código de barras\".",
 f'''<div class="c c2f"><pre>APROVECHO
------------------------------
1 x PACK SORPRESA    -50,00 %
1 x EXCEDENTE APTO   RESCATADO
------------------------------
ATENDIÓ:  Nombre Apellido
CARGO:    Cofundador/a
MAIL:     nombre@aprovecho.app
TEL:      +54 9 11 0000 0000
------------------------------
MENOS DESPERDICIO,
MÁS APROVECHO.</pre><div class="perf"></div></div>''',
 f'<div class="c c2b"><div class="qrbox">{qr("#000")}</div><pre>ESCANEÁ PARA\nRETIRAR TU TARJETA\nDIGITAL\n\n* GRACIAS POR\n  APROVECHAR *</pre></div>'))
# 3 TIPOGRAFICA
cards.append(("3 · La Frase", "Solo tipografía. Frente negro con el eslogan enorme en serif; dorso blanco, sobrio y profesional, con los datos y el QR. Para imprimir en negro pleno si la impresora rinde.",
 '<div class="c c3f"><p>Menos<br>desperdicio,<br><i>más</i> aprovecho.</p></div>',
 f'<div class="c c3b">{who}<div class="qrbox">{qr("#000")}</div></div>'))
# 4 TRAMA
cards.append(("4 · La Trama", "Trama de puntos tipo imprenta (el gris se logra con puntos, no con tinta gris) y un sello \"Apto · Consumir hoy\" torcido. Mezcla lo industrial con lo cercano.",
 f'<div class="c c4f"><div class="dots"></div><div class="stamp">APTO<br><small>CONSUMIR HOY</small></div>{who}</div>',
 f'<div class="c c4b"><div class="dots2"></div><div class="qrbox">{qr("#000")}</div><h3>Salvá esta<br>comida hoy.</h3></div>'))
# 5 ETIQUETA
cards.append(("5 · La Etiqueta de Precio", "Etiqueta de precio con agujero y cordel: $100 tachado, $50. Cuenta el modelo en un segundo y se lleva a todos lados. Troquel opcional.",
 f'<div class="c c5f"><div class="hole"></div><div class="tag"><s>$ 100</s><b>$ 50</b><small>PACK SORPRESA · APROVECHO</small></div>{who}</div>',
 f'<div class="c c5b"><div class="qrbox">{qr("#000")}</div><h3>Convertí<br>excedentes<br>en ingresos.</h3></div>'))
sections = "".join(f'<section><h2>{t}</h2><p class="d">{d}</p><div class="pair"><figure>{f}<figcaption>Frente</figcaption></figure><figure>{b}<figcaption>Dorso</figcaption></figure></div></section>' for t,d,f,b in cards)
css = '''
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=IBM+Plex+Mono:wght@400;600&family=Instrument+Sans:wght@400;600&display=swap');
*{box-sizing:border-box;margin:0}
body{background:#fff;color:#000;font-family:'Instrument Sans',sans-serif;padding:32px 16px;max-width:1240px;margin:auto}
h1{font:900 34px Fraunces,serif;margin-bottom:6px}.lead{max-width:70ch;margin-bottom:28px;line-height:1.45}
section{margin:0 0 44px;border-top:2px solid #000;padding-top:12px}h2{font:700 22px Fraunces,serif}.d{max-width:70ch;margin:4px 0 14px;font-size:14px;line-height:1.4}
.pair{display:flex;gap:24px;flex-wrap:wrap}figure{width:540px;max-width:100%}figcaption{font:12px 'IBM Plex Mono',monospace;margin-top:6px}
.c{position:relative;width:540px;max-width:100%;aspect-ratio:9/5;border:1.5px solid #000;overflow:hidden;background:#fff;color:#000}
.who{display:flex;flex-direction:column;gap:3px;font-size:13px;line-height:1.25}.who b{font:700 20px Fraunces,serif;margin-bottom:4px}
.qrbox svg{width:100%;height:100%;display:block}.qrbox{width:150px;height:150px}
h3{font:900 30px/1 Fraunces,serif}small{font:600 11px 'IBM Plex Mono',monospace;letter-spacing:.1em}
.ring{position:absolute;right:-6px;top:-6px;width:290px}
.c1f .who{position:absolute;left:28px;bottom:26px}
.c1b,.c3f{background:#000;color:#fff}.c1b{display:flex;align-items:center;gap:30px;padding:0 36px}.c1b .qrbox{background:#fff;padding:10px;width:170px;height:170px}.c1b .qrbox svg path{fill:#000}.c1b h3{margin-bottom:10px}
.c2f,.c2b{font-family:'IBM Plex Mono',monospace;font-size:12.5px;line-height:1.45;padding:22px 30px}.c2f pre,.c2b pre{font:inherit;white-space:pre}.c2f pre:first-line{font-weight:600;font-size:18px}.c2b{display:flex;align-items:center;gap:26px;padding-left:40px}.c2b .qrbox{width:140px;height:140px}
.c2f .perf{position:absolute;right:0;top:0;bottom:0;width:14px;background:radial-gradient(circle at 100% 50%,#fff 5px,transparent 5.5px) 0 0/14px 20px,#fff;border-left:2px dashed #000}
.c3f p{position:absolute;left:34px;bottom:26px;font:900 52px/.98 Fraunces,serif;letter-spacing:-.02em}.c3f i{font-weight:400}
.c3b{display:flex;justify-content:space-between;align-items:flex-end;padding:30px 32px}.c3b .qrbox{width:130px;height:130px}
.dots,.dots2{position:absolute;inset:0;background:radial-gradient(circle,#000 1.6px,transparent 2px) 0 0/9px 9px;-webkit-mask-image:linear-gradient(115deg,#000 0%,transparent 62%);mask-image:linear-gradient(115deg,#000 0%,transparent 62%)}
.c4f .who{position:absolute;right:28px;bottom:26px;text-align:right;background:#fff;padding:8px 10px;border:1.5px solid #000}
.stamp{position:absolute;left:36px;top:40px;transform:rotate(-8deg);border:4px solid #000;padding:6px 18px;font:900 54px/1 Fraunces,serif;background:#fff;text-align:center}.stamp small{display:block;font-size:13px;margin-top:2px}
.c4b{display:flex;align-items:center;justify-content:flex-end;gap:26px;padding:0 34px}.c4b .qrbox{background:#fff;padding:8px;border:1.5px solid #000;width:158px;height:158px;position:relative}.c4b h3{position:relative;background:#fff;padding:6px 10px;order:-1;border:1.5px solid #000}
.c5f{background:#fff}.hole{position:absolute;left:24px;top:24px;width:22px;height:22px;border:2px solid #000;border-radius:50%}
.tag{position:absolute;left:30px;top:66px;display:flex;flex-direction:column;gap:2px}.tag s{font:400 26px Fraunces,serif;text-decoration-thickness:3px}.tag b{font:900 92px/.9 Fraunces,serif;letter-spacing:-.04em}
.c5f .who{position:absolute;right:28px;bottom:26px;text-align:right}.c5f::after{content:"";position:absolute;left:34px;top:34px;width:150px;height:2px;background:#000;transform:rotate(-24deg);transform-origin:left;display:none}
.c5b{display:flex;align-items:center;gap:30px;padding:0 36px;background:#000;color:#fff}.c5b .qrbox{background:#fff;padding:10px;width:170px;height:170px}
.note{font-size:13px;border:1.5px dashed #000;padding:10px 14px;margin-bottom:28px;max-width:70ch}
@media print{section{break-inside:avoid}}
'''
html = f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tarjetas APROVECHO — 5 propuestas</title><style>{css}</style></head><body>
<h1>Tarjetas APROVECHO — 5 propuestas</h1>
<p class="lead">Formato 90 × 50 mm, <b>solo blanco y negro puro</b> (sin grises: los tonos se resuelven con tramas de puntos y negro pleno). Tipografía serif de la portada del plan + mono de ticket; sin degradés ni íconos genéricos.</p>
<p class="note"><b>QR provisorio:</b> hoy apunta a la app de demostración ({URL}). Cuando esté la landing se regenera con <code>python3 docs/tarjetas/generar.py &lt;URL-de-la-landing&gt;</code>. Los datos de contacto (Nombre, cargo, mail, teléfono) son de relleno.</p>
{sections}</body></html>'''
open("docs/tarjetas/propuestas.html","w",encoding="utf-8").write(html)
print("ok")
