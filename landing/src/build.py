#!/usr/bin/env python3
"""Arma landing/index.html desde src/index.tpl.html + src/partials/*.html.

Uso (desde landing/):  python3 src/build.py
- Editá el texto en src/index.tpl.html o en src/partials/.
- Los gráficos de Inversores se generan acá con los datos de docs/fuente/08-economics.md.
"""
import html
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
LANDING = os.path.dirname(HERE)
P = lambda *a: os.path.join(HERE, *a)


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


# ---------------------------------------------------------------- FAQ
FAQ = [
    ('¿Cuánto cuesta?', 'Base no tiene costo fijo ni de alta: APROVECHO cobra una comisión solo por cada pack que vendés. Smart cuesta USD 300 por mes e Intelligence USD 800 por mes por sucursal, más la comisión por pack.'),
    ('¿Cuánto me queda de cada pack?', 'Ejemplo: si lo que te sobró vale $12.200 en tu mostrador, el pack sale $6.100 (tu precio habitual con 50% de descuento) y a vos te quedan $4.575. Hoy, eso lo estás tirando.'),
    ('¿Mis clientes van a dejar de comprar a precio normal?', 'El pack es sorpresa: el cliente no elige qué lleva y solo se publica al cierre, con lo que ya sabés que sobró. Durante el día tu mostrador sigue igual. Y el pack te trae gente nueva del barrio.'),
    ('No tengo tiempo al cierre.', 'Por eso es una foto. La app propone los packs, el precio y el horario; vos solo revisás y confirmás. La reserva, el cobro y el QR los resolvemos nosotros.'),
    ('¿Y si los packs no se venden?', 'No pagás nada. Activamos compradores en tu zona antes de sumarte y te avisamos cuando alguien reserva. Lo que no se vende lo podés seguir donando como hasta ahora.'),
    ('¿Y si la app se equivoca?', 'Todo se corrige antes de publicar. El precio sale de tu lista, nunca de la foto. Cada corrección ayuda a que la app aprenda.'),
    ('¿Quién es responsable por la comida?', 'El comercio, igual que con lo que vende en el mostrador. Antes de publicar confirmás tres cosas: producto del día, cadena de frío y alérgenos y sin TACC. Los alérgenos los informás vos, nunca la IA. APROVECHO verifica tu habilitación y el carnet de manipulador antes de activar tu cuenta.'),
    ('¿Cómo cobro?', 'El cliente paga en la app con Mercado Pago o tarjeta. Mercado Pago reparte en el momento: tu parte va directo a tu cuenta y la comisión, a APROVECHO.'),
    ('¿Hay envío?', 'No. El cliente retira en tu local, en la franja que vos definís.'),
    ('¿Qué necesito para empezar?', 'El celular del local, tu habilitación municipal y el carnet de manipulador. Te mandamos el primer lote de bolsas biodegradables sin costo.'),
    ('¿Dónde funciona?', 'Arrancamos en CABA, Vicente López, San Isidro y Pilar.'),
    ('¿Puedo pasar de plan?', 'Sí, cuando quieras, y conservás todo tu historial.'),
]

faq_html = '\n'.join(
    '      <details%s><summary>%s</summary><p>%s</p></details>' % (' open' if i == 0 else '', html.escape(q, quote=False), html.escape(a, quote=False))
    for i, (q, a) in enumerate(FAQ))

JSONLD = {
    '@context': 'https://schema.org',
    '@graph': [
        {'@type': 'Organization', 'name': 'APROVECHO', 'slogan': 'Menos desperdicio, más aprovecho.',
         'description': 'Plataforma que le permite al comercio vender lo que le sobra con una foto y usar esos datos para que le sobre menos.',
         'logo': 'img/logo/sello.webp'},
        {'@type': 'WebSite', 'name': 'APROVECHO', 'inLanguage': 'es-AR'},
        {'@type': 'VideoObject', 'name': 'Así funciona APROVECHO',
         'description': 'Los cinco pasos del plan Base: foto al cierre, packs propuestos, reservas, retiro con QR y panel del día.',
         'thumbnailUrl': 'video/como-funciona-1280.webp', 'contentUrl': 'video/como-funciona-1280.mp4',
         'uploadDate': '2026-11-10', 'duration': 'PT18S', 'inLanguage': 'es-AR'},
        {'@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in FAQ]},
    ]}

# ---------------------------------------------------------------- gráficos (datos: docs/fuente/08-economics.md)
INGRESOS = [71236, 213739, 460846, 655124, 856857]
COSTOS = [73665, 231466, 366367, 439033, 541229]
YEARS = ['2027', '2028', '2029', '2030', '2031']
FCF = [-34661, -66642, -112611, -88684, 5803, 226696]
FCF_YEARS = ['2026', '2027', '2028', '2029', '2030', '2031']
C_ING, C_COS = '#1A4D3A', '#6F8F80'  # contraste con blanco: 9,7:1 y 3,6:1


def miles(v):
    s = '{:,}'.format(abs(v)).replace(',', '.')
    return ('−' if v < 0 else '') + s


def chart_bars(mobile=False):
    """Barras de ingresos y costos. mobile=True: lienzo más angosto para que el texto se lea en el celular."""
    W, Hh = (360, 300) if mobile else (640, 330)
    L, R, T = (58, 350, 34) if mobile else (70, 628, 30)
    B = Hh - 44
    H = B - T
    vmax = 900000
    y = lambda v: B - v / vmax * H
    gw = (R - L) / len(YEARS)
    bw, gap = (20, 4) if mobile else (34, 6)
    cls = 'chart__svg chart__svg--m' if mobile else 'chart__svg chart__svg--d'
    out = [f'<svg class="{cls}" viewBox="0 0 {W} {Hh}" role="img" aria-label="Ingresos y costos proyectados de 2027 a 2031. Los ingresos pasan de 71.236 a 856.857 dólares y superan a los costos desde 2029.">']
    for t in (0, 300000, 600000, 900000):
        yy = y(t)
        out.append(f'<line class="grid{" grid--base" if t == 0 else ""}" x1="{L}" y1="{yy:.1f}" x2="{R}" y2="{yy:.1f}"/>')
        lbl = '0' if t == 0 else f'{t // 1000} mil'
        out.append(f'<text class="axis" x="{L - 8}" y="{yy + 4:.1f}" text-anchor="end">{lbl}</text>')
    for i, yr in enumerate(YEARS):
        x0 = L + i * gw + (gw - (2 * bw + gap)) / 2
        for j, (v, c) in enumerate(((INGRESOS[i], C_ING), (COSTOS[i], C_COS))):
            xx = x0 + j * (bw + gap)
            out.append(f'<rect class="bar" x="{xx:.1f}" y="{y(v):.1f}" width="{bw}" height="{B - y(v):.1f}" rx="{3 if mobile else 4}" fill="{c}" style="--i:{i * 2 + j}"/>')
        out.append(f'<text class="axis axis--x" x="{L + i * gw + gw / 2:.1f}" y="{B + 24}" text-anchor="middle">{yr}</text>')
    # etiquetas de 2031
    x31 = L + 4 * gw + (gw - (2 * bw + gap)) / 2
    out.append(f'<text class="val" x="{x31 + bw / 2:.1f}" y="{y(INGRESOS[4]) - 8:.1f}" text-anchor="middle">857 mil</text>')
    out.append(f'<text class="val val--m" x="{x31 + bw + gap + bw / 2:.1f}" y="{y(COSTOS[4]) - 8:.1f}" text-anchor="middle">541 mil</text>')
    # leyenda
    out.append(f'<rect x="{L}" y="6" width="12" height="12" rx="3" fill="{C_ING}"/><text class="legend" x="{L + 18}" y="16">Ingresos</text>')
    out.append(f'<rect x="{L + 96}" y="6" width="12" height="12" rx="3" fill="{C_COS}"/><text class="legend" x="{L + 114}" y="16">Costos</text>')
    out.append('</svg>')
    return ''.join(out)


def chart_line(mobile=False):
    """Flujo de caja libre acumulado con el cruce por cero (payback)."""
    W, Hh = (360, 300) if mobile else (640, 330)
    L, R, T = (58, 340, 34) if mobile else (70, 610, 30)
    B = Hh - 44
    H = B - T
    vmin, vmax = -150000, 250000
    y = lambda v: B - (v - vmin) / (vmax - vmin) * H
    step = (R - L) / (len(FCF) - 1)
    x = lambda i: L + i * step
    ticks = (-100000, 0, 100000, 200000) if mobile else tuple(range(-150000, 250001, 50000))
    cls = 'chart__svg chart__svg--m' if mobile else 'chart__svg chart__svg--d'
    out = [f'<svg class="{cls}" viewBox="0 0 {W} {Hh}" role="img" aria-label="Flujo de caja libre acumulado proyectado: llega a menos 112.611 dólares en 2028, vuelve a positivo durante 2030 y cierra 2031 en 226.696 dólares.">']
    for t in ticks:
        yy = y(t)
        out.append(f'<line class="{"grid grid--base" if t == 0 else "grid"}" x1="{L}" y1="{yy:.1f}" x2="{R}" y2="{yy:.1f}"/>')
        lbl = '0' if t == 0 else ('−' if t < 0 else '') + f'{abs(t) // 1000} mil'
        out.append(f'<text class="axis" x="{L - 8}" y="{yy + 4:.1f}" text-anchor="end">{lbl}</text>')
    pts = ' '.join(f'{x(i):.1f},{y(v):.1f}' for i, v in enumerate(FCF))
    area = f'{x(0):.1f},{y(0):.1f} ' + pts + f' {x(len(FCF) - 1):.1f},{y(0):.1f}'
    out.append(f'<polygon class="area" points="{area}"/>')
    out.append(f'<polyline class="line" points="{pts}" pathLength="1"/>')
    # cruce por cero (payback) entre 2029 y 2030
    t0 = FCF[3] / (FCF[3] - FCF[4])
    xc = x(3) + t0 * step
    out.append(f'<line class="mark" x1="{xc:.1f}" y1="{T + 6}" x2="{xc:.1f}" y2="{B}"/>')
    out.append(f'<text class="val" x="{xc - 8:.1f}" y="{T + 14}" text-anchor="end">Payback ≈ 3,9 años</text>')
    for i, v in enumerate(FCF):
        out.append(f'<circle class="dot" cx="{x(i):.1f}" cy="{y(v):.1f}" r="{4.5 if mobile else 5}"/>')
        out.append(f'<text class="axis axis--x" x="{x(i):.1f}" y="{B + 24}" text-anchor="middle">{FCF_YEARS[i]}</text>')
    out.append(f'<text class="val" x="{x(2):.1f}" y="{y(FCF[2]) + 22:.1f}" text-anchor="middle">{miles(FCF[2])}</text>')
    out.append(f'<text class="val" x="{x(5) - 8:.1f}" y="{y(FCF[5]) - 12:.1f}" text-anchor="end">{miles(FCF[5])}</text>')
    out.append('</svg>')
    return ''.join(out)


def chart(fn):
    # versión de escritorio y versión de celular; el CSS muestra una sola
    return '            ' + fn() + '\n            ' + fn(mobile=True)


# ---------------------------------------------------------------- armado
tpl = read(P('index.tpl.html'))
parts = {
    'JSONLD': json.dumps(JSONLD, ensure_ascii=False),
    'FAQ': faq_html,
    'CHART1': chart(chart_bars),
    'CHART2': chart(chart_line),
    'ALTA': read(P('partials', 'alta.html')).rstrip(),
    'FORMINV': read(P('partials', 'form-inversores.html')).rstrip(),
    'ESPERA': read(P('partials', 'espera.html')).rstrip(),
    'TAIL': read(P('partials', 'tail.html')).rstrip(),
}
out = tpl
for k, v in parts.items():
    out = out.replace('{{%s}}' % k, v)
left = re.findall(r'\{\{[A-Z0-9]+\}\}', out)
assert not left, left
with open(os.path.join(LANDING, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(out)
print('index.html', len(out), 'bytes')
