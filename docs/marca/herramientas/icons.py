# Set de íconos de línea (24x24, trazo 2, puntas redondeadas). Dibujados a mano en el estilo de Lucide/Phosphor.
ICONS={
 "camara":'<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
 "pack":'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
 "qr":'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h3M21 17v4"/>',
 "balanza":'<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
 "reloj":'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "mapa":'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 "panel":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 17v-5M12 17V8M16 17v-3"/>',
 "tienda":'<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9"/><path d="M5 12v8h14v-8M10 20v-4h4v4"/>',
 "alergenos":'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
 "sin-tacc":'<path d="M12 21V8M12 8c0-2 1-4 3-5 0 2-1 4-3 5zM12 8c0-2-1-4-3-5 0 2 1 4 3 5zM12 13c0-2 1-3 3-4 0 2-1 3-3 4zM12 13c0-2-1-3-3-4 0 2 1 3 3 4z"/><path d="M4 4l16 16"/>',
 "frio":'<path d="M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7M9 4l3 2 3-2M9 20l3-2 3 2"/>',
 "check":'<path d="M4 12.5l5 5L20 6.5"/>',
 "medido":'<path d="M12 2l2.4 2 3.1-.3.8 3 2.7 1.6-1 3 1 3-2.7 1.6-.8 3-3.1-.3L12 22l-2.4-2-3.1.3-.8-3-2.7-1.6 1-3-1-3L5.7 7l.8-3 3.1.3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
 "estimado":'<circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/><path d="M8 13c1.3-2 2.7-2 4 0s2.7 2 4 0"/>',
 "inicio":'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
 "perfil":'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 "tuimpacto":'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
}
def icon(name,size=24,cls=""):
    return (f'<svg class="{cls}" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')
