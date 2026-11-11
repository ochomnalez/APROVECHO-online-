#!/usr/bin/env python3
"""Reconstruye y empaqueta la v5 como sitio estático para Vercel.

Desde la raíz: python3 landing/src/v5/deploy.py
Salida: landing-dist/ (solo archivos públicos, sin fuentes ni documentos).
"""
from pathlib import Path
import runpy
import shutil

LANDING = Path(__file__).resolve().parents[2]
ROOT = LANDING.parent
OUTPUT = ROOT / 'landing-dist'

runpy.run_path(str(LANDING / 'src' / 'build_v5.py'))
OUTPUT.mkdir(exist_ok=True)
for child in OUTPUT.iterdir():
    if child.is_dir():
        shutil.rmtree(child)
    else:
        child.unlink()

# La dirección principal muestra la v5, no el index.html de respaldo de la v4.
for name in ('index.html', 'v5.html'):
    shutil.copy2(LANDING / 'v5.html', OUTPUT / name)
for name in ('img', 'fonts', 'video'):
    shutil.copytree(LANDING / name, OUTPUT / name,
                    ignore=shutil.ignore_patterns('src'))
(OUTPUT / 'css').mkdir()
shutil.copy2(LANDING / 'css' / 'v5.min.css', OUTPUT / 'css' / 'v5.min.css')
(OUTPUT / 'js').mkdir()
for name in ('main.js', 'forms.js', 'v5.js'):
    shutil.copy2(LANDING / 'js' / name, OUTPUT / 'js' / name)
shutil.copytree(LANDING / 'js' / 'vendor', OUTPUT / 'js' / 'vendor')

files = [p for p in OUTPUT.rglob('*') if p.is_file()]
print(f'Publicación preparada: {len(files)} archivos, '
      f'{sum(p.stat().st_size for p in files) / 1024 ** 2:.1f} MiB en {OUTPUT}')
