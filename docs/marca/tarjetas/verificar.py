#!/usr/bin/env python3
"""Comprueba la lectura del arte final, incluido el pliego con diez QR.

Requiere zxing-cpp, Pillow y pdftoppm. No realiza solicitudes a la URL.
"""
from pathlib import Path
import subprocess
import tempfile

from PIL import Image
import zxingcpp

HERE = Path(__file__).resolve().parent
EXPECTED = 'https://aprovecho-landing-videos.vercel.app/'


def read(path, expected_count):
    results = zxingcpp.read_barcodes(Image.open(path))
    assert len(results) == expected_count, (str(path), len(results), expected_count)
    assert all(result.text == EXPECTED for result in results), str(path)
    print(f'OK {Path(path).name}: {len(results)} QR con el destino exacto.')


read(HERE / 'qr-landing.png', 1)
read(HERE / 'vista-previa.png', 1)
with tempfile.TemporaryDirectory(prefix='aprovecho-qr-') as directory:
    for pdf, dpi, count, label in [('tarjeta-frente-dorso-imprenta.pdf', 300, 1, 'imprenta-300ppp'),
                                   ('tarjetas-a4-doble-faz.pdf', 150, 10, 'a4-150ppp')]:
        target = Path(directory) / label
        subprocess.run(['pdftoppm', '-r', str(dpi), '-f', '2', '-l', '2', '-png', '-singlefile',
                        str(HERE / pdf), str(target)], check=True,
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        read(target.with_suffix('.png'), count)
