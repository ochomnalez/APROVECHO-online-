#!/usr/bin/env python3
"""Tarjetas vectoriales 90 × 50 mm, con QR real y un pliego A4 doble faz.

Requiere qrcode y reportlab. El QR no usa acortadores ni servicios externos.
La referencia del usuario se reconstruye como documento vectorial para imprimir;
no se modifica ni se usa como fondo la captura de pantalla.
"""
from pathlib import Path
import json
import subprocess

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
n = len(matrix)
EYES = [(4, 4), (n - 11, 4), (4, n - 11)]


def inside_eye(x, y):
    return any(ex <= x < ex + 7 and ey <= y < ey + 7 for ex, ey in EYES)


def module_path(x, y):
    """Redondear solo esquinas exteriores: puntos aislados y trazos conectados.

    No mueve, agrega ni elimina centros de módulos del QR codificado.
    Las coordenadas usan el origen arriba a la izquierda, como el SVG.
    """
    dark = lambda xx, yy: 0 <= xx < n and 0 <= yy < n and matrix[yy][xx]
    top, right, bottom, left = dark(x, y - 1), dark(x + 1, y), dark(x, y + 1), dark(x - 1, y)
    tl = .5 if not top and not left else 0
    tr = .5 if not top and not right else 0
    br = .5 if not bottom and not right else 0
    bl = .5 if not bottom and not left else 0
    k = .5522847498
    commands = [('M', x + tl, y), ('L', x + 1 - tr, y)]
    if tr:
        commands.append(('C', x + 1 - tr + k * tr, y, x + 1, y + tr - k * tr, x + 1, y + tr))
    commands.append(('L', x + 1, y + 1 - br))
    if br:
        commands.append(('C', x + 1, y + 1 - br + k * br, x + 1 - br + k * br, y + 1, x + 1 - br, y + 1))
    commands.append(('L', x + bl, y + 1))
    if bl:
        commands.append(('C', x + bl - k * bl, y + 1, x, y + 1 - bl + k * bl, x, y + 1 - bl))
    commands.append(('L', x, y + tl))
    if tl:
        commands.append(('C', x, y + tl - k * tl, x + tl - k * tl, y, x + tl, y))
    commands.append(('Z',))
    return commands


MODULE_PATHS = [module_path(x, y) for y, row in enumerate(matrix)
                for x, dark in enumerate(row) if dark and not inside_eye(x, y)]
path = ''.join(command[0] + ' '.join(f'{value:.5f}'.rstrip('0').rstrip('.') for value in command[1:])
               for commands in MODULE_PATHS for command in commands)
eyes_svg = ''.join(
    f'<rect x="{x}" y="{y}" width="7" height="7" rx="1.3" fill="black"/>'
    f'<rect x="{x + 1}" y="{y + 1}" width="5" height="5" rx=".8" fill="white"/>'
    f'<rect x="{x + 2}" y="{y + 2}" width="3" height="3" rx=".6" fill="black"/>'
    for x, y in EYES
)
(OUT / 'qr-landing.svg').write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg" width="25mm" height="25mm" viewBox="0 0 {n} {n}">'
    f'<title>QR de la landing APROVECHO</title><desc>{URL}</desc>'
    f'<rect width="{n}" height="{n}" fill="white"/>'
    f'<path d="{path}" fill="black"/>{eyes_svg}</svg>\n'
)


def white(c):
    c.setFillColorCMYK(0, 0, 0, 0)


def black(c):
    c.setFillColorCMYK(0, 0, 0, 1)


def draw_qr(c, x, y, size):
    white(c)
    c.rect(x, y, size, size, fill=1, stroke=0)
    unit = size / n
    c.saveState()
    c.translate(x, y + size)
    c.scale(unit, -unit)
    black(c)
    for commands in MODULE_PATHS:
        p = c.beginPath()
        for command in commands:
            if command[0] == 'M': p.moveTo(*command[1:])
            elif command[0] == 'L': p.lineTo(*command[1:])
            elif command[0] == 'C': p.curveTo(*command[1:])
            else: p.close()
        c.drawPath(p, fill=1, stroke=0)
    # Los tres ojos conservan sus proporciones 7:5:3, con las esquinas suaves.
    for ex, ey in EYES:
        black(c)
        c.roundRect(ex, ey, 7, 7, 1.3, fill=1, stroke=0)
        white(c)
        c.roundRect(ex + 1, ey + 1, 5, 5, .8, fill=1, stroke=0)
        black(c)
        c.roundRect(ex + 2, ey + 2, 3, 3, .6, fill=1, stroke=0)
    c.restoreState()


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
        # QR redondeado de 25 mm, margen blanco incluido. Sin logos superpuestos.
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


# QR independiente vectorial: permite rasterizar exactamente el mismo dibujo a PNG.
c = new_pdf('qr-landing.pdf', (25 * mm, 25 * mm), 'QR APROVECHO · estilo redondeado')
draw_qr(c, 0, 0, 25 * mm)
c.showPage()
c.save()

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
    'estilo_qr': 'Módulos conectados redondeados y tres ojos con esquinas suaves; matriz sin cambios',
    'modulos_con_margen': n,
    'tarjetas_por_a4': 10,
    'doble_faz': 'Giro por borde largo; escala 100%; sin ajustar a página',
    'firma': 'codex-octi-landing'
}, ensure_ascii=False, indent=2) + '\n')
for source, target, pixels in [('qr-landing.pdf', 'qr-landing', 1200),
                               ('vista-previa.pdf', 'vista-previa', 1600)]:
    subprocess.run(['pdftoppm', '-scale-to', str(pixels), '-png', '-singlefile',
                    str(OUT / source), str(OUT / target)], check=True,
                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print('Generados: PDF de imprenta, A4 doble faz, vista previa y QR PNG/SVG.')
print('QR:', URL, '· matriz', n, '×', n, 'con margen blanco incluido.')
