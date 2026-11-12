#!/usr/bin/env python3
"""Tarjetas vectoriales 90 × 50 mm, con QR real y un pliego A4 doble faz.

Requiere qrcode y reportlab. El QR no usa acortadores ni servicios externos.
La referencia del usuario se reconstruye como documento vectorial para imprimir;
no se modifica ni se usa como fondo la captura de pantalla.
"""
from pathlib import Path
import json

import qrcode
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

OUT = Path(__file__).resolve().parent
URL = 'https://aprovecho-landing-videos.vercel.app/'
SLOGAN = 'Menos desperdicio, más aprovecho.'
WIDTH, HEIGHT, BLEED = 90 * mm, 50 * mm, 3 * mm

# Métricas compatibles con Arial; se incrustan en los PDF para conservar la impresión.
font_dir = Path('/usr/share/fonts/truetype/liberation')
if not font_dir.exists():
    font_dir = Path('/usr/share/fonts/truetype/liberation2')
for name, file in [('CardSans', 'LiberationSans-Regular.ttf'), ('CardBold', 'LiberationSans-Bold.ttf')]:
    if not (font_dir / file).exists():
        raise FileNotFoundError('Instalar las fuentes Liberation Sans antes de regenerar')
    pdfmetrics.registerFont(TTFont(name, str(font_dir / file)))

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, border=4, box_size=24)
qr.add_data(URL)
qr.make(fit=True)
matrix = qr.get_matrix()  # Incluye el margen blanco de cuatro módulos.
qr.make_image(fill_color='black', back_color='white').save(OUT / 'qr-landing.png')


def runs():
    for row, values in enumerate(matrix):
        col = 0
        while col < len(values):
            if not values[col]:
                col += 1
                continue
            start = col
            while col < len(values) and values[col]:
                col += 1
            yield row, start, col - start


n = len(matrix)
path = ''.join(f'M{x} {y}h{length}v1h-{length}z' for y, x, length in runs())
(OUT / 'qr-landing.svg').write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg" width="25mm" height="25mm" viewBox="0 0 {n} {n}">'
    f'<title>QR de la landing APROVECHO</title><desc>{URL}</desc>'
    f'<rect width="{n}" height="{n}" fill="white"/>'
    f'<path d="{path}" fill="black" shape-rendering="crispEdges"/></svg>\n'
)


def white(c):
    c.setFillColorCMYK(0, 0, 0, 0)


def black(c):
    c.setFillColorCMYK(0, 0, 0, 1)


def draw_qr(c, x, y, size):
    white(c)
    c.rect(x, y, size, size, fill=1, stroke=0)
    black(c)
    unit = size / n
    for row, col, length in runs():
        c.rect(x + col * unit, y + (n - 1 - row) * unit, length * unit, unit, fill=1, stroke=0)


def draw_card(c, x, y, back=False, bleed=BLEED):
    c.saveState()
    c.translate(x, y)
    white(c) if back else black(c)
    c.rect(-bleed, -bleed, WIDTH + 2 * bleed, HEIGHT + 2 * bleed, fill=1, stroke=0)
    if not back:
        white(c)
        c.setFont('CardBold', 26)
        c.drawCentredString(WIDTH / 2, 27 * mm, 'aprovecho.')
        c.setFont('CardSans', 11)
        c.drawCentredString(WIDTH / 2, 15 * mm, SLOGAN)
    else:
        # QR de 25 mm, margen blanco incluido. Sin logos ni redondeo de módulos.
        draw_qr(c, (WIDTH - 25 * mm) / 2, 21 * mm, 25 * mm)
        black(c)
        c.setFont('CardSans', 11)
        c.drawCentredString(WIDTH / 2, 13.5 * mm, 'ESCANEÁ Y DESCUBRÍ')
        c.setFont('CardSans', 12)
        c.drawCentredString(WIDTH / 2, 6.5 * mm, 'aprovecho.')
    c.restoreState()


def new_pdf(path, pagesize, title):
    c = canvas.Canvas(str(OUT / path), pagesize=pagesize, pageCompression=1)
    c.setTitle(title)
    c.setAuthor('APROVECHO · codex-octi-landing')
    c.setSubject('Tarjetas con QR a la landing y el lema aprobado por Octavio')
    return c


# Archivo de imprenta: un frente y un dorso, con 3 mm de sangrado y TrimBox explícito.
c = new_pdf('tarjeta-frente-dorso-imprenta.pdf', (WIDTH + 2 * BLEED, HEIGHT + 2 * BLEED), 'APROVECHO · frente y dorso · 90 × 50 mm')
for back in (False, True):
    c.setTrimBox((BLEED, BLEED, WIDTH + BLEED, HEIGHT + BLEED))
    c.setBleedBox((0, 0, WIDTH + 2 * BLEED, HEIGHT + 2 * BLEED))
    draw_card(c, BLEED, BLEED, back)
    c.showPage()
c.save()

# Diez tarjetas por A4; las posiciones simétricas coinciden al imprimir doble faz.
page_w, page_h = 210 * mm, 297 * mm
left, bottom, pitch_x, pitch_y = 12 * mm, 11.5 * mm, 96 * mm, 56 * mm
xs = [left, left + pitch_x]
ys = [bottom + i * pitch_y for i in range(5)]


def cut_marks(c):
    c.saveState()
    c.setStrokeColorCMYK(0, 0, 0, 1)
    c.setLineWidth(.3)
    for x in [edge for start in xs for edge in (start, start + WIDTH)]:
        c.line(x, 5 * mm, x, 8 * mm)
        c.line(x, 289 * mm, x, 292 * mm)
    for y in [edge for start in ys for edge in (start, start + HEIGHT)]:
        c.line(5 * mm, y, 8 * mm, y)
        c.line(202 * mm, y, 205 * mm, y)
    c.restoreState()


c = new_pdf('tarjetas-a4-doble-faz.pdf', (page_w, page_h), 'APROVECHO · 10 tarjetas A4 · doble faz')
for back in (False, True):
    for y in ys:
        for x in xs:
            draw_card(c, x, y, back)
    cut_marks(c)
    c.showPage()
c.save()

# Vista de revisión: etiquetas fuera de las tarjetas, nunca dentro del arte de impresión.
c = new_pdf('vista-previa.pdf', (208 * mm, 78 * mm), 'APROVECHO · vista previa de frente y dorso')
for x, back, label in [(9 * mm, False, 'Frente'), (109 * mm, True, 'Dorso')]:
    y = 19 * mm
    c.saveState()
    clip = c.beginPath()
    clip.roundRect(x, y, WIDTH, HEIGHT, 3 * mm)
    c.clipPath(clip, stroke=0, fill=0)
    draw_card(c, x, y, back, bleed=0)
    c.restoreState()
    if back:
        c.setStrokeColorCMYK(0, 0, 0, .18)
        c.setLineWidth(.5)
        c.roundRect(x, y, WIDTH, HEIGHT, 3 * mm, fill=0, stroke=1)
    black(c)
    c.setFont('CardSans', 10)
    c.drawString(x, 10 * mm, label)
c.showPage()
c.save()

(OUT / 'datos-impresion.json').write_text(json.dumps({
    'url_qr': URL,
    'frente': ['aprovecho.', SLOGAN],
    'dorso': ['QR real', 'ESCANEÁ Y DESCUBRÍ', 'aprovecho.'],
    'tamano_final_mm': [90, 50],
    'sangrado_mm': 3,
    'tamano_qr_mm_con_margen': 25,
    'margen_qr_modulos': 4,
    'correccion_qr': 'Q',
    'modulos_con_margen': n,
    'tarjetas_por_a4': 10,
    'doble_faz': 'Giro por borde largo; escala 100%; sin ajustar a página',
    'firma': 'codex-octi-landing'
}, ensure_ascii=False, indent=2) + '\n')
print('Generados: PDF de imprenta, A4 doble faz, vista previa y QR PNG/SVG.')
print('QR:', URL, '· matriz', n, '×', n, 'con margen blanco incluido.')
