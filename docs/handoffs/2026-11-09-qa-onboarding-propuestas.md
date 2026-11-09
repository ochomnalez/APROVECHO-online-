# Handoff · QA y Diseño · Fase 1 · Propuestas de onboarding

- **Firma:** `claude-octi-qa` · **Rama:** `claude/aprovecho-qa` · **Fecha:** 2026-11-09

## Qué se hizo
- `docs/ux/landing-onboarding-propuestas.md`: 3 conceptos (A mostrador que se arma, B ruta de 7 paradas, C video que avanza) con storyboard, mobile, recursos, esfuerzo, riesgos y recomendación.
- 3 prototipos funcionales scroll-driven en `docs/ux/onboarding-prototipos/` (`A-mostrador.html`, `B-ruta.html`, `C-video.html`) + clips comprimidos en `media/`.
- Verificados con Playwright a 390×844 y 1440×900: sin errores de consola ni scroll horizontal. Capturas en `docs/qa/capturas/onboarding/`.

## Recomendación
Híbrido A + C (A como base, recuadro de video de C en pasos 6 y 7); respaldo: B.

## Pedidos / decisiones para Octavio
1. Elegir concepto. 2. ¿Se pueden usar en la landing las tomas generadas con IA? ¿Con rótulo "ilustrativo"? 3. ¿Mostrar Intelligence en el paso 6?

## Para la sesión Landing
Tomá lo elegido de `docs/ux/onboarding-prototipos/`; el código es un punto de partida, no producción. Los clips de `media/` ya están livianos.

## Sigue
Fase 2: auditoría de app y landing cuando existan `origin/claude/aprovecho-app` y `origin/claude/aprovecho-landing` con avances.
