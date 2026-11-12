"""Gráficos exclusivos de Inversores v5, con la actualización de Economics.

Mantiene el diseño existente. Los datos y su trazabilidad están en el JSON
adyacente; no modifica los gráficos históricos de la v4 ni requiere openpyxl.
"""
import json
from pathlib import Path

DATA = json.loads(Path(__file__).with_name('investor-economics.json').read_text())


def number(value):
    return ('−' if value < 0 else '') + f'{round(abs(value)):,}'.replace(',', '.')


def chart_bars(mobile=False):
    width, height = (360, 300) if mobile else (640, 330)
    left, right, top = (58, 350, 34) if mobile else (70, 628, 30)
    bottom = height - 44
    y = lambda value: bottom - value / 900000 * (bottom - top)
    group = (right - left) / 5
    bar, gap = (20, 4) if mobile else (34, 6)
    suffix = 'm' if mobile else 'd'
    out = [f'<svg class="chart__svg chart__svg--{suffix}" viewBox="0 0 {width} {height}" role="img" aria-label="Ingresos y costos operativos proyectados de 2027 a 2031, en USD. Los ingresos superan a los costos desde 2029. Costos de 2027: {number(DATA["costs"][0])}; de 2031: {number(DATA["costs"][-1])}.">']
    for value in (0, 300000, 600000, 900000):
        yy = y(value)
        cls = 'grid grid--base' if value == 0 else 'grid'
        label = '0' if value == 0 else f'{value // 1000} mil'
        out.append(f'<line class="{cls}" x1="{left}" y1="{yy:.1f}" x2="{right}" y2="{yy:.1f}"/><text class="axis" x="{left - 8}" y="{yy + 4:.1f}" text-anchor="end">{label}</text>')
    for i, year in enumerate(DATA['years']):
        start = left + i * group + (group - (2 * bar + gap)) / 2
        for j, (value, color) in enumerate(((DATA['revenue'][i], '#1A4D3A'), (DATA['costs'][i], '#6F8F80'))):
            xx = start + j * (bar + gap)
            out.append(f'<rect class="bar" x="{xx:.1f}" y="{y(value):.1f}" width="{bar}" height="{bottom - y(value):.1f}" rx="{3 if mobile else 4}" fill="{color}" style="--i:{i * 2 + j}"/>')
        out.append(f'<text class="axis axis--x" x="{left + i * group + group / 2:.1f}" y="{bottom + 24}" text-anchor="middle">{year}</text>')
    start = left + 4 * group + (group - (2 * bar + gap)) / 2
    for j, key in enumerate(('revenue', 'costs')):
        value = DATA[key][-1]
        cls = 'val' if j == 0 else 'val val--m'
        out.append(f'<text class="{cls}" x="{start + j * (bar + gap) + bar / 2:.1f}" y="{y(value) - 8:.1f}" text-anchor="middle">{round(value / 1000)} mil</text>')
    out.append(f'<rect x="{left}" y="6" width="12" height="12" rx="3" fill="#1A4D3A"/><text class="legend" x="{left + 18}" y="16">Ingresos</text>')
    out.append(f'<rect x="{left + 96}" y="6" width="12" height="12" rx="3" fill="#6F8F80"/><text class="legend" x="{left + 114}" y="16">Costos</text></svg>')
    return ''.join(out)


def chart_line(mobile=False):
    width, height = (360, 300) if mobile else (640, 330)
    left, right, top = (58, 340, 34) if mobile else (70, 610, 30)
    bottom = height - 44
    values = DATA['cumulative_fcf']
    y = lambda value: bottom - (value + 200000) / 500000 * (bottom - top)
    step = (right - left) / (len(values) - 1)
    x = lambda i: left + i * step
    suffix = 'm' if mobile else 'd'
    out = [f'<svg class="chart__svg chart__svg--{suffix}" viewBox="0 0 {width} {height}" role="img" aria-label="Flujo de caja libre acumulado proyectado, en USD. Mínimo: menos {number(abs(min(values)))} en 2028. Se recupera durante 2031 y cierra en {number(values[-1])}.">']
    ticks = range(-200000, 300001, 100000 if mobile else 50000)
    for value in ticks:
        yy = y(value)
        cls = 'grid grid--base' if value == 0 else 'grid'
        label = '0' if value == 0 else ('−' if value < 0 else '') + f'{abs(value) // 1000} mil'
        out.append(f'<line class="{cls}" x1="{left}" y1="{yy:.1f}" x2="{right}" y2="{yy:.1f}"/><text class="axis" x="{left - 8}" y="{yy + 4:.1f}" text-anchor="end">{label}</text>')
    points = ' '.join(f'{x(i):.1f},{y(value):.1f}' for i, value in enumerate(values))
    area = f'{x(0):.1f},{y(0):.1f} ' + points + f' {x(5):.1f},{y(0):.1f}'
    out.append(f'<polygon class="area" points="{area}"/><polyline class="line" points="{points}" pathLength="1"/>')
    crossing = next(i for i in range(1, len(values)) if values[i] >= 0 and values[i - 1] < 0)
    fraction = -values[crossing - 1] / (values[crossing] - values[crossing - 1])
    xc = x(crossing - 1) + fraction * step
    payback = f'{DATA["payback"]:.1f}'.replace('.', ',')
    out.append(f'<line class="mark" x1="{xc:.1f}" y1="{top + 6}" x2="{xc:.1f}" y2="{bottom}"/><text class="val" x="{xc - 8:.1f}" y="{top + 14}" text-anchor="end">Payback ≈ {payback} años</text>')
    for i, value in enumerate(values):
        out.append(f'<circle class="dot" cx="{x(i):.1f}" cy="{y(value):.1f}" r="{4.5 if mobile else 5}"/><text class="axis axis--x" x="{x(i):.1f}" y="{bottom + 24}" text-anchor="middle">{DATA["fcf_years"][i]}</text>')
    low = values.index(min(values))
    out.append(f'<text class="val" x="{x(low):.1f}" y="{y(values[low]) + 22:.1f}" text-anchor="middle">{number(values[low])}</text>')
    out.append(f'<text class="val" x="{x(5) - 8:.1f}" y="{y(values[5]) - 12:.1f}" text-anchor="end">{number(values[5])}</text></svg>')
    return ''.join(out)


parts = {key: '            ' + fn() + '\n            ' + fn(True)
         for key, fn in [('CHART1', chart_bars), ('CHART2', chart_line)]}
