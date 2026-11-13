# Estado del proyecto · tablero

> Lo mantiene el **líder**. Cada agente actualiza su fila al terminar un bloque.
> **Entrega prevista: jueves 12/11/2026 (D-010).** Última actualización: 2026-11-03 (Codex).

## Tablero visual y orden de trabajo

Abrí [el tablero](tablero/index.html) en el navegador desde la copia local. Ahí están los hitos, su avance, los pendientes y la autoría de cada cambio.

| Prioridad | Frente | Estado y próximo paso |
|---|---|---|
| 1 | **Aplicación** | UX v2 integrada. Cerrar alcance y brief para consumidor, Base, Smart e Intelligence. |
| 2 | **Videos** | Tres conceptos aprobados. Elegir la primera pieza cuando toque este frente. |
| 3 | **Landing** | Textos y boceto integrados. Cerrar contenidos y brief antes de construir. |

**Un frente a la vez**, por indicación del usuario. Cada bloque se registra en [los datos del tablero](tablero/datos.js) con el estado del hito, el agente o responsable, un comentario corto y un enlace al handoff, PR o entregable. Al actualizar, cambiá también la fecha, el autor y el registro de la última actualización. La barra cuenta hitos listos sobre el total de cada frente.

## Calendario original

Las fechas intermedias eran para trabajo en paralelo. Quedan por revisar según el nuevo orden.

| Fecha | Qué |
|---|---|
| Mar 3 – Mié 4 | **Etapa 1:** Marca y marketing (estrategia, mensajes, copy de la landing, conceptos de video, brief visual) · **UX** del prototipo de app (en paralelo) |
| Jue 5 – Vie 6 | **Etapa 2:** Identidad visual / UI (logo vectorial, sistema y componentes) · UX: wireframe de la landing · Video: guiones, storyboard y elección de herramientas |
| Sáb 7 – Mar 10 | **Etapa 3:** desarrollo de la landing, desarrollo del prototipo de app y producción de los 3 videos |
| Mié 11 | Integración, QA, ajustes finales y publicación |
| **Jue 12** | **Entrega** |

## Entregables finales

1. **Landing:** alta de comercios + sección para inversores (D-005)
2. **Prototipo de app** (D-006)
3. **3 videos:** presentación (60–90 s) + publicidad para comercios + publicidad para consumidores (D-009)
4. **Identidad visual** profesionalizada (D-011)

## Sesiones

| Rol | Rama | Estado | Entrega | Último handoff |
|---|---|---|---|---|
| **Líder / orquestador** | `claude/gallant-planck-ps6te6` (integración) | Activo | — | `handoffs/2026-11-03-lider-lectura-fuente.md` |
| Tablero compartido | `codex/aprovecho-tablero` · Codex | Tablero inicial listo para revisión. Aplicación primero | — | [2026-11-03-tablero-prioridades-y-trazabilidad](handoffs/2026-11-03-tablero-prioridades-y-trazabilidad.md) |
| Marca y marketing | `claude/aprovecho-marca` · sesión `session_01YPepJHdCqz7XdEnK5xUA9t` (Opus) | ✅ Entregado e integrado (falta validar D-016 a D-020) | Mié 4/11 | `handoffs/2026-11-04-marca-plataforma-y-contenidos.md` |
| UX | `claude/aprovecho-ux` · sesión `session_01YPepJKgdnbFvSwNNSb7n4e` (Sonnet) | ✅ App v2 (10 pantallas, flujo simplificado y Vision Recognition) + ✅ estructura de la landing. Integradas; falta validación del usuario | Jue 5/11 | `handoffs/2026-11-05-ux-flujo-v2.md` · `handoffs/2026-11-05-ux-landing.md` |
| Identidad visual / UI | `claude/aprovecho-identidad` · sesión `session_01YPepJKRPFvh2fx4pRYrdnC` (Sonnet) | ✅ Entregado e integrado (falta validar PROPUESTA-identidad-1 a 5) | Vie 6/11 18:00 | `handoffs/2026-11-05-identidad-sistema-visual.md` |
| Guion y video | `codex/aprovecho-video` · Codex | Cuatro guiones y storyboard. Primer corte de «Una foto» listo para revisión | Guiones: vie 6/11 · Videos: mar 10/11 | [Video y plan de producción](handoffs/2026-11-04-video-una-foto.md) |
| Desarrollo de la landing | `claude/aprovecho-landing` | Sin abrir (espera a Identidad y UX) | Mar 10/11 | — |
| Desarrollo de la app | `claude/aprovecho-app` | Sin abrir (espera a Identidad y UX) | Mar 10/11 | — |

## Próximos pasos

Cola de trabajo y preguntas al usuario: **`docs/ORQUESTADOR.md` §6 y §7**. Historial: `docs/BITACORA.md`. Briefs listos: 03b (identidad), 04 (app), 05 (landing) y 06 (video).

## Pendientes del usuario

- **Mandar las pantallas de ejemplo de su prototipo anterior** (referencia para el prototipo final).
- Confirmar: ¿redibujamos el logo original en vector, idéntico? ¿Formato del onboarding (D-030)?

- Validar las decisiones provisorias D-012 a D-015 (se juntan en la próxima validación).
- Más adelante: dominio propio, Vercel y Supabase (después de tener la landing y el prototipo).
