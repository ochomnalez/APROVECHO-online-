# Video "Así funciona APROVECHO" (sección Cómo funciona)

Video de 18 segundos, sin sonido, que muestra los 5 pasos del plan Base. Está hecho con
[HyperFrames](https://github.com/heygen-com/hyperframes) (HTML + GSAP que se renderiza a MP4):
no usa IA generativa ni gasta créditos. Todo sale de este código.

## Archivos

- `generar.py` — arma la composición (textos, teléfono, QR ilustrativo, anillo y sello).
- `assets/` — tipografías variables completas (Bricolage Grotesque y DM Sans, licencia OFL),
  foto de medialunas (Richard Bell, Unsplash License), sello de APROVECHO y anillo de flechas.
  La landing usa versiones recortadas de las mismas tipografías (`landing/fonts/`, solo los grosores que usa).
- `build/` — se genera solo; no se sube al repo.

## Volver a generar el video

```bash
cd landing/src/motion/como-funciona
python3 generar.py horizontal          # 1920 x 1080, para tablet y escritorio
python3 generar.py vertical            # 1080 x 1350 (4:5), para celulares
cd build/horizontal && npx --yes hyperframes@0.9.28 lint && npx --yes hyperframes@0.9.28 render --quality looks -o out.mp4
cd ../vertical && npx --yes hyperframes@0.9.28 render --quality looks -o out.mp4
```

Comprimir para la web (desde `build/`) y copiar a `landing/video/`:

```bash
ffmpeg -i horizontal/out.mp4 -an -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart ../../../../video/como-funciona-1280.mp4
ffmpeg -i vertical/out.mp4 -an -vf "scale=720:900:flags=lanczos" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart ../../../../video/como-funciona-720x900.mp4
ffmpeg -ss 5.4 -i horizontal/out.mp4 -frames:v 1 -vf "scale=1280:720" -quality 80 ../../../../video/como-funciona-1280.webp
ffmpeg -ss 5.4 -i vertical/out.mp4 -frames:v 1 -vf "scale=720:900" -quality 80 ../../../../video/como-funciona-720x900.webp
```

## Si cambiás los tiempos

Los capítulos de la página saltan a los segundos de cada paso. Si cambiás `TITLES` en
`generar.py`, actualizá también los `data-t` de los botones `.chapter` en
`landing/src/index.tpl.html` (hoy: 0 · 3,85 · 7,65 · 11,15 · 14,35) y volvé a correr
`python3 src/build.py` desde `landing/`.
