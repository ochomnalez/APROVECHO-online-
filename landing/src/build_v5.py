#!/usr/bin/env python3
"""Arma la landing v5 («El anillo se abre») sin tocar la v4.

Uso (desde landing/):  python3 src/build_v5.py
Genera: v5.html · css/v5.min.css · js/v5.js

Fuentes:
- src/v5/index.tpl.html        armazón (secciones heredadas de la v4 + marcadores {{V5_*}})
- src/v5/partials/<escena>.html  HTML de cada escena nueva
- src/v5/css/<nn>-<escena>.css   estilos de cada escena (se suman a css/styles.css de la v4)
- src/v5/js/<nn>-<escena>.js     movimiento de cada escena (se concatenan en js/v5.js)
"""
import glob
import os
import re
import runpy

HERE = os.path.dirname(os.path.abspath(__file__))
LANDING = os.path.dirname(HERE)
V5 = os.path.join(HERE, 'v5')


def read(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


# reutiliza FAQ, JSON-LD, gráficos y formularios de la v4 (también regenera index.html, sin cambios)
v4 = runpy.run_path(os.path.join(HERE, 'build.py'))
parts = dict(v4['parts'])
for name in ('nav', 'hero', 'problema', 'recupera', 'medi', 'anticipa'):
    parts['V5_' + name.upper()] = read(os.path.join(V5, 'partials', name + '.html')).rstrip()

out = read(os.path.join(V5, 'index.tpl.html'))
for k, v in parts.items():
    out = out.replace('{{%s}}' % k, v)
left = re.findall(r'\{\{[A-Z0-9_]+\}\}', out)
assert not left, left
with open(os.path.join(LANDING, 'v5.html'), 'w', encoding='utf-8') as f:
    f.write(out)

# CSS: base de la v4 + escenas de la v5, minificado
css = read(os.path.join(LANDING, 'css', 'styles.css'))
for p in sorted(glob.glob(os.path.join(V5, 'css', '*.css'))):
    css += '\n/* ' + os.path.basename(p) + ' */\n' + read(p)
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
css = re.sub(r'\s*\n\s*', '\n', css)
css = re.sub(r'\s*([{};,])\s*', r'\1', css)
with open(os.path.join(LANDING, 'css', 'v5.min.css'), 'w', encoding='utf-8') as f:
    f.write(css)

# JS: núcleo + escenas, en orden de nombre
js = ''
for p in sorted(glob.glob(os.path.join(V5, 'js', '*.js'))):
    js += '\n/* ' + os.path.basename(p) + ' */\n' + read(p)
with open(os.path.join(LANDING, 'js', 'v5.js'), 'w', encoding='utf-8') as f:
    f.write(js)

print('v5.html', len(out), '· v5.min.css', len(css), '· v5.js', len(js))
