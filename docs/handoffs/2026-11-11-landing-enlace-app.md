# Handoff · landing · acceso directo a la app

- **Fecha:** 2026-11-11
- **Agente:** codex-octi-landing
- **Rama:** `codex/octi-landing-enlace-app`, basada en la última landing `bfd8c3f`.

## Qué hice

Los botones `data-app` ahora abren https://aprovecho-app-demo.vercel.app/ en la misma pestaña. Se actualizaron las plantillas v5, su HTML generado y los enlaces de respaldo v4. El enlace funciona incluso sin JavaScript; el aviso de disponibilidad ya no se activa.

## Entregables

- `landing/js/main.js`, plantillas y HTML v4/v5; `landing/src/v5/CONTRATO.md`.
- Build estático con `python3 landing/src/v5/deploy.py`; sintaxis JS y diff correctos.
- Navegación probada con Playwright a 390 y 1440 px; tres enlaces correctos también sin JS. Se interceptó únicamente el destino externo para verificar la navegación, sin probar el contenido de la app.

## Decisiones y supuestos

Enlace indicado por el usuario; sin cambios de diseño ni contenido. Se usa la misma pestaña para acceso directo.

## Pendientes y próximo agente

Publicado en https://aprovecho-landing.vercel.app/. Vercel confirmó READY y alias para `dpl_o26rnqrqktjuQhoZ8fCewgKqrLJJ`, fuente `54863e6ceef64d32467d671729f7d88e4cb7bd51`. No requiere cambios en la app ni en Supabase.

PR borrador: https://github.com/ochomnalez/APROVECHO-online-/pull/9 hacia la integración. Hereda la historia de la última landing (45 commits respecto de integración); GitHub informa conflictos heredados que debe revisar el líder al integrar. No se modificaron ramas ajenas.

## Costo

Sin generaciones ni servicios nuevos.
