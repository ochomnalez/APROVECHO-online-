# Handoff · QA y Diseño · Fase 2 · Auditoría ronda 1

- **Firma:** `claude-octi-qa` · **Rama:** `claude/aprovecho-qa` · **Fecha:** 2026-11-09
- Auditadas: `claude/aprovecho-landing` @ `39502cb` y `claude/aprovecho-app` @ `75572e7`.

## Entregables
- `docs/qa/informe-landing.md` · `docs/qa/informe-app.md` · capturas en `docs/qa/capturas/{landing,app}/`.

## Resumen
- **Landing:** Lighthouse mobile 94 / A11y 100 / BP 100 / SEO 100; 0 errores. 0 bloqueantes, 5 importantes (75% vs D-031, roadmap recortado, contraste de pasos inactivos, regiones con scroll sin teclado, onboarding más pobre que el prototipo A).
- **App:** 0 errores, contraste AA limpio. 0 bloqueantes, 3 importantes (demo publica $1.000 pero el cliente reserva $2.500, mapa con interactivos anidados, dependencia de CDN).
- Los skills `design:*` y `marketing:brand-review` no están instalados en esta sesión: la revisión de diseño, accesibilidad y marca se hizo a mano con axe-core, Lighthouse y capturas.

## Preguntas para Octavio (aparte)
1. ¿75% en el hero/meta de la landing (copy aprobado) o seguir D-031 y sacarlo?
2. El bloque Economics publica financiamiento USD 112.611, payback 3,9 años, VAN y TIR: ¿se mantienen (D-025) o se quitan (D-019)?
3. Tomas generadas con IA en el onboarding: ¿se usan y con rótulo «Ilustrativo»? ¿Se muestra Intelligence en el paso 6?
4. ¿Packs de ejemplo de la app a ~ARS 6.100 (D-015)? ¿Vista «kiosco» en tablet?
5. «Proyecto académico · Universidad Austral» en el pie y «2 minutos / 48 h» (SUPUESTO): ¿se aprueban?

## Sigue
Ronda 2 (máx. 2) cuando App y Landing avisen cambios; repasar el último commit de landing antes de cerrar.
