#!/usr/bin/env python3
"""Genera css/styles.min.css a partir de css/styles.css (editar siempre styles.css). Uso: python3 build-css.py"""
import re
s = open('css/styles.css').read()
s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
s = re.sub(r'\s*\n\s*', '\n', s)
s = re.sub(r'\s*([{};,])\s*', r'\1', s)
open('css/styles.min.css', 'w').write(s)
print(len(s), 'bytes')
