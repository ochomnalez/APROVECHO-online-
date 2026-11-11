#!/usr/bin/env python3
"""Genera el HTML del componente ESTACIÓN (prefijo st-) y lo inyecta en los partials de Medí y Anticipá.

Uso (desde landing/):  python3 src/v5/estacion-gen.py   y después   python3 src/build_v5.py

Lee img/estacion/piezas.json (cuadro de referencia y x, y, w, h de cada pieza en la composición desarmada)
y escribe, entre los marcadores  <!-- st:inicio -->  y  <!-- st:fin -->  de partials/medi.html y
partials/anticipa.html, el bloque de la estación. Para reemplazar las fotos: mismo nombre de archivo en
img/estacion/ y, si cambió la composición, actualizar piezas.json y volver a correr este script.

Datos extra por pieza (se ajustan acá):
  u, v   centro de la pieza DENTRO de la foto armada (0-1): desde ahí arranca el despiece
  ss     tamaño de la pieza en la foto armada respecto de su tamaño final
  sr     rotación inicial (grados)
  sd     retraso del arranque (0-1 de la duración del despiece)
  tag    dónde aparece la etiqueta: b (abajo, centrada) · bl (abajo, alineada a la izquierda) ·
         br (abajo, alineada a la derecha) · tl (arriba, a la izquierda) · b2 (abajo, segunda fila)
Foto armada: ARM = posición/tamaño de armada.webp dentro del cuadro (unidades del cuadro) y escala inicial `s`.
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
LANDING = os.path.dirname(os.path.dirname(HERE))
P = json.load(open(os.path.join(LANDING, 'img', 'estacion', 'piezas.json'), encoding='utf-8'))
FW, FH = P['frame']

# armada.webp (1296×1055) dentro del cuadro: escala .78 y centrada sobre la base de la balanza
ARM = dict(file='img/estacion/armada.webp', iw=1296, ih=1055, x=315, y=43, scale=.78, s=1.15)

# clave del json -> (nombre visible, frase corta, datos de animación)
PIEZAS = [
    ('balanza', 'Balanza', 'Peso real, no estimado.', dict(u=.569, v=.478, ss=1.0, sr=0, sd=0, tag='b')),
    ('tablet', 'Tablet', 'Qué sobró, cuánto y cuándo.', dict(u=.680, v=.286, ss=.89, sr=7, sd=.04, tag='br')),
    ('brazo', 'Brazo', 'Soporte: todo en una sola estación.', dict(u=.910, v=.417, ss=.82, sr=-9, sd=.1, tag='br')),
    ('hub', 'Hub de carga', 'Alimenta la tablet y la balanza.', dict(u=.202, v=.891, ss=.5, sr=8, sd=.14, tag='tl')),
    ('cable-usbc', 'Cable USB-C', 'Conexión de la estación.', dict(u=.202, v=.891, ss=.45, sr=-24, sd=.26, tag='bl')),
    ('cable-corriente', 'Cable de corriente', 'Alimentación de la estación.', dict(u=.202, v=.891, ss=.45, sr=22, sd=.3, tag='b2')),
]


def pct(v, tot):
    return ('%.3f' % (v * 100.0 / tot)).rstrip('0').rstrip('.') + '%'


def num(v):
    return ('%.3f' % v).rstrip('0').rstrip('.')


def stage_html(label, indent='      '):
    aw, ah = ARM['iw'] * ARM['scale'], ARM['ih'] * ARM['scale']
    out = []
    out.append('<div class="st-stage" data-st-stage data-giro-frames="0" data-seq-frames="0" role="group" aria-label="%s">' % label)
    out.append('  <div class="st-frame" data-fw="%d" data-fh="%d" style="--fr:%s">' % (FW, FH, num(FW / FH)))
    out.append('    <div class="st-armada" data-x="%s" data-y="%s" data-w="%s" data-h="%s" data-s="%s" style="--x:%s;--y:%s;--w:%s">' % (
        num(ARM['x']), num(ARM['y']), num(aw), num(ah), num(ARM['s']), pct(ARM['x'], FW), pct(ARM['y'], FH), pct(aw, FW)))
    out.append('      <img class="st-armada__img" src="%s" width="%d" height="%d" alt="Estación armada: balanza con la tablet en su brazo, hub de carga y cables" loading="lazy" decoding="async">' % (ARM['file'], ARM['iw'], ARM['ih']))
    out.append('      <img class="st-giro" src="" width="%d" height="%d" alt="" hidden decoding="async">' % (ARM['iw'], ARM['ih']))
    out.append('    </div>')
    out.append('    <img class="st-seq" src="" width="%d" height="%d" alt="" hidden decoding="async">' % (FW, FH))
    for key, name, frase, d in PIEZAS:
        p = P['piezas'][key]
        out.append('    <div class="st-p" data-st="%s" data-tag="%s" tabindex="0" role="img" aria-label="%s. %s" data-x="%d" data-y="%d" data-w="%d" data-h="%d" data-u="%s" data-v="%s" data-ss="%s" data-sr="%s" data-sd="%s" style="--x:%s;--y:%s;--w:%s">' % (
            key, d['tag'], name, frase, p['x'], p['y'], p['w'], p['h'],
            num(d['u']), num(d['v']), num(d['ss']), num(d['sr']), num(d['sd']),
            pct(p['x'], FW), pct(p['y'], FH), pct(p['w'], FW)))
        out.append('      <img class="st-p__img" src="%s" width="%d" height="%d" alt="" loading="lazy" decoding="async" draggable="false">' % (p['file'], p['w'], p['h']))
        out.append('      <span class="st-tag" aria-hidden="true"><b>%s</b><small>%s</small></span>' % (name, frase))
        out.append('    </div>')
    out.append('  </div>')
    out.append('</div>')
    out.append('<ul class="st-leg">')
    for key, name, frase, d in PIEZAS:
        out.append('  <li><b>%s</b>%s</li>' % (name, frase))
    out.append('</ul>')
    return ('\n' + indent).join(out)


ESCENAS = {
    'medi.html': ('Estación Smart: balanza, tablet, brazo, hub de carga y cables', '    '),
    'anticipa.html': ('Estación de una sucursal: balanza, tablet, brazo, hub de carga y cables', '        '),
}
for fn, (label, ind) in ESCENAS.items():
    path = os.path.join(HERE, 'partials', fn)
    s = open(path, encoding='utf-8').read()
    html = ind + '<!-- st:inicio (generado por src/v5/estacion-gen.py: no editar a mano) -->\n' + ind + stage_html(label, ind) + '\n' + ind + '<!-- st:fin -->'
    s2, n = re.subn(r'[ \t]*<!-- st:inicio.*?<!-- st:fin -->', lambda m: html, s, flags=re.S)
    assert n == 1, fn
    open(path, 'w', encoding='utf-8').write(s2)
    print(fn, 'ok')
