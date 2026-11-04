# Brief · Desarrollo de la landing

- **Rol:** desarrollador/a front-end senior con buen ojo de diseño.
- **Rama:** `codex/aprovecho-landing` o `claude/aprovecho-landing` · PR contra `claude/gallant-planck-ps6te6`.
- **Carpeta:** `landing/`.
- **Entrega:** martes 10/11, 18:00 (hora de Argentina).
- **Requisito previo:** Identidad cerró el logo oficial y la tipografía (brief 03b). Si no, usar variables y cambiarlas después.

## Objetivo

Una landing **muy profesional** cuyo objetivo principal es que **se sumen comercios** (alta del plan Base sin reunión), con una **página para inversores** y una **lista de espera para consumidores** (D-005, D-024).

## Leer primero

`AGENTS.md` / `CLAUDE.md` (sección 9, **cero "AI slop"**) · `docs/decisiones.md` · **`docs/marketing/landing-contenido.md` (copy final: usalo tal cual)** · `docs/ux/landing-wireframe.md` y `.html` (estructura) · `docs/marca/plataforma-de-marca.md` · `docs/marca/tokens.css` · `docs/fuente/09` (qué números no se publican).

## Contenido

- **Home (comercios):** las secciones C-1 a C-9 del copy, con un solo CTA principal, "Sumá tu comercio".
  - Si el usuario aprobó PROPUESTA-ux-2, incluir **"Mirá cuánto te queda"**: $12.200 → $6.100 → $4.575 para el comercio.
- **Alta de comercio:** el formulario en 2 pasos (F-1). Al enviarlo se muestra la **sección de onboarding** (D-030, si está aprobada; ver abajo).
- **/inversores:** las secciones I-1 a I-8. Números según D-019 y D-025, con el aviso "proyecciones preliminares".
- **Lista de espera de consumidores:** "Avisame cuando llegue a mi barrio" (zona + email).
- **Footer:** si el usuario lo aprueba, "Proyecto académico · Universidad Austral".

## Onboarding con scroll (D-030, pendiente de aprobación)

- Sección que se arma mientras el usuario scrollea: aparece la balanza, después la tablet en su soporte, después la cámara apuntando a una bandeja.
- Cada paso del onboarding del plan aparece con texto corto (`docs/fuente/07`, "Onboarding", pasos 1 a 7).
- **Hecho con código** (SVG/CSS/JS, scroll-driven), sin video generado por IA. Se puede apoyar en `docs/marca/imagenes-aprobadas/estacion-balanza-tablet.jpg`.
- Si no se aprueba: un bloque estático de 3 pasos con un video corto de onboarding (lo hace el agente de video).

## Técnica

- Sitio estático (HTML, CSS y JS; Astro solo si aporta). Rápido: Lighthouse de 90 o más en mobile.
- Formularios **simulados** (guardan en `localStorage` y muestran éxito) con un único punto para conectar Supabase después (D-006). **No** conectar servicios externos sin OK.
- **Fotos:** reales y variadas (`docs/marca/imagenes-aprobadas/` + Unsplash o Pexels con `landing/img/CREDITOS.md`).
- SEO y Open Graph según el copy; favicon del logo oficial.

## Criterios de aceptación

- Responsive impecable (390, 768 y 1440 px). Accesibilidad AA.
- Cero "AI slop" (CLAUDE.md §9.10).
- Copy idéntico al aprobado; sin números prohibidos por el archivo 09.
- Capturas en `landing/capturas/`, handoff y línea en `docs/BITACORA.md`.
- **No publicar** (Vercel, GitHub Pages, dominio) sin OK del usuario.
