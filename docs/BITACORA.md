# Bitácora del proyecto

> **Quién hizo qué, cuándo y dónde.** Cada agente agrega una línea al final **en cada push, merge o traspaso de mando**:
> `scripts/bitacora.sh "<agente>" "<qué hice>" "<próximo paso>"`. No se borra ni se reescribe nada: solo se agrega.
> Hora de Argentina. Las líneas anteriores al 04/11 se reconstruyeron desde el historial de git.

| Fecha y hora | Agente | Rama | Commit | Qué hizo | Próximo paso |
|---|---|---|---|---|---|
| 2026-11-03 18:50 | claude-lider | — | `0dd1c42` | fuente: extracto del plan de negocios (parte 1), originales e imágenes | — |
| 2026-11-03 18:55 | claude-lider | — | `f0de36d` | fuente: economics, revisión crítica, marca actual y tablero de estado | — |
| 2026-11-03 19:17 | claude-lider | — | `4438b9c` | lider: preferencias permanentes, decisiones del usuario, calendario y briefs de Marca y UX | — |
| 2026-11-03 19:19 | claude-lider | — | `a1b1f0a` | lider: evaluación de herramientas de generación y sesiones abiertas | — |
| 2026-11-03 19:21 | claude-ux | — | `3d5bb76` | ux: alcance, flujos, wireframes, score y niveles del prototipo de app | — |
| 2026-11-03 19:22 | claude-lider | — | `ce544ec` | integración: UX (prototipo de app: alcance, flujos, wireframes, Score) | — |
| 2026-11-03 19:26 | claude-marca | — | `792e9e2` | marca: plataforma, mensajes, copy de landing, conceptos de video, brief visual y chequeo de nombre | — |
| 2026-11-03 19:28 | claude-lider | — | `ad64148` | lider: AGENTS.md para Codex, presupuesto de herramientas y devolución sobre la UX | — |
| 2026-11-03 19:30 | claude-lider | — | `3bee3d2` | integración: Marca y marketing (plataforma, mensajes, landing, videos, brief visual, nombre) | — |
| 2026-11-03 19:31 | claude-ux | — | `37a23a6` | ux: flujo v2 simplificado con Vision Recognition (10 pantallas con skin provisoria) | — |
| 2026-11-03 19:32 | claude-ux | — | `d67c395` | ux: estado actualizado con flujo v2 | — |
| 2026-11-03 19:32 | claude-ux | — | `3b65c98` | Merge remote-tracking branch 'origin/claude/gallant-planck-ps6te6' into claude/aprovecho-ux | — |
| 2026-11-03 19:33 | claude-ux | — | `0678515` | ux: wireframe y estructura de la landing | — |
| 2026-11-03 19:37 | claude-lider | — | `251658a` | lider: decisiones validadas (logo, acento, videos, lista de espera, C6) y brief de Identidad | — |
| 2026-11-03 19:39 | claude-lider | — | `4d3611c` | integración: UX v2 (flujo simplificado con Vision Recognition) y estructura de la landing | — |
| 2026-11-03 19:44 | claude-identidad | — | `9d2199c` | identidad: sistema visual v1 (logo vectorial, tokens, componentes, guía, aplicaciones) | — |
| 2026-11-03 19:45 | claude-lider | — | `5ebbe32` | integración: Identidad visual v1 (logo vectorial, tokens, componentes, guía, aplicaciones) | — |
| 2026-11-03 19:54 | claude-lider | — | `776a1cf` | lider: logo original se mantiene, regla anti AI slop, prototipo con Base, Smart e Intelligence | — |
| 2026-11-03 23:22 | claude-lider | `claude/gallant-planck-ps6te6` | `5ea19f3` | Traspaso listo: ORQUESTADOR.md, bitácora, briefs 03b a 06, referencias v3, logo oficial | Usuario: responder ORQUESTADOR §7; asignar briefs 03b, 04 y 06 (Codex o Claude) |
| 2026-11-04 18:57 | claude-video | `claude/aprovecho-video` | `9ad0e33` | Fase 1: guion del video de onboarding y plan de producción de los 4 videos | Usuario aprueba el guion; Codex entrega capturas limpias |
| 2026-11-04 22:00 | codex-video | `codex/aprovecho-video` | `612b601` | Cuatro guiones y primer corte vertical de Una foto, verificado en 1080x1920 | Revisar el corte y pasar a la landing |
| 2026-11-04 19:15 | claude-video | `integ` | `9ad0e33` | Regla fija: todos los agentes actualizan el tablero; tablero integrado en la rama principal | — |
| 2026-11-04 19:20 | claude-octi-video | `integ` | `e441c00` | Repo listo para traspaso a Lola (firmas persona+herramienta, estado al 4/11); tablero publicado | Lola: seguir ORQUESTADOR §0 |
| 2026-11-04 19:26 | claude-octi-video | `integ` | `00677ff` | Tablero rediseñado: prioridades, pedidos, avance por video y por frente, avance diario | Actualizar DATOS al cerrar cada bloque |
| 2026-11-04 19:36 | claude-octi-video | `integ` | `f134ece` | Decisiones D-031 a D-035 (sin 75%, inversores como sección, cálculo en Sumá tu comercio, alérgenos, carta por foto); guion ajustado | Montar el onboarding |
| 2026-11-04 19:40 | claude-octi-video | `integ` | `ff1f785` | Guardado obligatorio (hook Stop), ramas separadas por persona con PR y bloqueo de push a integración; D-036 checklist opción B | Montar video de onboarding en Remotion |
| 2026-11-04 19:47 | claude-octi-video | `integ` | `b03a807` | Primer corte del video de onboarding (Remotion, 85 s, sin voz) integrado; Lola arranca con «seguí el trabajo de Octi» | OK de Octavio al corte; después voz (ElevenLabs) y música |
| 2026-11-04 19:56 | claude-octi-video | `integ` | `b872605` | Onboarding v2: transiciones, motion graphics, apertura animada, carta sin menú falso; voz en off escrita | OK de Octavio; voz y música |
| 2026-11-04 20:04 | claude-octi-video | `integ` | `64cd21e` | Onboarding v3: pantalla de descarga de informes, dispositivos más grandes, subtítulos dinámicos; voz bloqueada por ElevenLabs (free tier) | Conseguir la voz (navegador de Octavio o Starter) y sincronizar |
| 2026-11-04 20:09 | claude-octi-video | `integ` | `2ed504c` | Voz en off del onboarding (ElevenLabs, Chelo, ~1.000 créditos) cortada por escena y sincronizada con subtítulos | OK de Octavio; música de fondo |
