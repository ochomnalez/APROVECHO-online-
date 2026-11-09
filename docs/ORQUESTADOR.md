# Manual del líder / orquestador

> Para quien tome el mando del proyecto: **Claude** (líder actual) o **ChatGPT/Codex** cuando el usuario se quede sin créditos de Claude. Con este archivo y el repo alcanza para retomar sin perder nada.

## 0. Traspaso a otra persona del equipo (ej. Lola con su Claude)

1. **Acceso:** Octavio agrega a Lola como colaboradora del repo `ochomnalez/APROVECHO-online-` en GitHub (Settings → Collaborators). Lola conecta GitHub en su Claude (claude.ai/code) o en su Codex y abre este repo en la rama **`claude/gallant-planck-ps6te6`**.
2. **Primer mensaje para su Claude:** alcanza con escribir **"seguí el trabajo de Octi"**. Las instrucciones completas están en `CLAUDE.md` (sección "Si te dicen seguí el trabajo de Octi").
3. **Guardado automático:** Lola no necesita pedir nada: su Claude tiene que commitear y pushear a su rama después de cada cambio (CLAUDE.md §0, y un hook lo obliga). Su rama: `claude/lola-<rol>` (solo esa). Lo de Lola entra a la integración por PR que aprueba Octavio; si algo sale mal, se descarta su rama y lo tuyo queda intacto. Recomendado: en GitHub (Settings → Branches) proteger `claude/gallant-planck-ps6te6` y `main` para que solo se cambien por PR.
4. **Firmas:** cada agente firma `<herramienta>-<persona>-<rol>` (CLAUDE.md §9.13). Así la bitácora muestra si lo hizo el Claude de Octi, el de Lola o Codex.
5. **Tablero publicado:** https://claude.ai/artifact/Bpquyus65SucbgcwkDgfqV (artifact de Octavio). Quien no tenga acceso usa `docs/tablero/visual.html` del repo y lo abre en el navegador.
6. **Antes de tomar el mando:** fijate en la bitácora quién está trabajando; si hay otro líder activo, coordiná con el usuario para no pisarse.

### Facundo (se suma al video y a lo que haga falta)
1. Octavio lo agrega como colaborador del repo en GitHub (Settings → Collaborators → Add people) y Facundo acepta la invitación.
2. Facundo abre claude.ai/code, elige el repo `ochomnalez/APROVECHO-online-` y escribe: **"Hola, soy Facundo. Octavio me pidió que me muestres la bienvenida."**
3. Su Claude sigue `docs/bienvenida/facundo.md` (explica el proyecto, el repo y cómo conectar las aplicaciones) y trabaja en su rama (firma `claude-facundo-<rol>`), con PR para que revise Octavio.
4. Mensaje listo para mandarle: `docs/bienvenida/mensaje-para-facundo.md`.

### Traspaso a alguien que usa Gemini
Instructivo completo en `docs/INSTRUCTIVO-GEMINI.md`; reglas para el agente en `GEMINI.md`. Rama propia `gemini/<persona>-<rol>`, firma `gemini-<persona>-<rol>`, mensaje inicial "seguí el trabajo de Octi". Gemini no tiene los controles automáticos de Claude Code (no hay hook que obligue a guardar): la regla está escrita y hay que recordársela. El hook `pre-push` sí se activa con `git config core.hooksPath scripts/hooks`.

### Estado al 4/11 (último traspaso)

- **Video de onboarding:** primer corte montado en Remotion (`video/src/Onboarding.jsx`, 85 s, 16:9, sin voz: la voz va como subtítulo). Render en `video/salidas/onboarding.mp4`. Falta: OK de Octavio, voz (ElevenLabs) y música.

- **App:** prototipo hecho por Codex en `codex/aprovecho-app` (falta revisión e integración). Bug de texto: en "Elegí tu plan" dice "La comisión por pack todavía no está definida" (ya es 25%, D-007).
- **Video:** rama `claude/aprovecho-video` (incluye el trabajo de Codex). Guion del **onboarding** en `video/01-onboarding/guion.md` (prioridad del usuario, falta su OK). Base Remotion en `video/` y primer corte de «Una foto». Para las capturas del onboarding: el recorrido "Entrar como local → plan → carta de ejemplo" funciona; la carta queda trabada en "Falta 1 precio" (hay que cargarle precio a "Tarta de ricota" en su hoja y tocar Guardar). Servir la app con `python -m http.server 8765` desde la raíz del repo de la rama de la app.
- **Landing:** no empezada (brief 05).
- **Pedido para Codex-app:** aplicar D-036 (checklist como confirmación en "Publicar") y corregir el texto "La comisión por pack todavía no está definida".
- **Tablero:** `docs/tablero/visual.html` (regla §9.12: todos lo actualizan).

## 1. Si sos el nuevo líder: arrancá así (15 minutos)

1. `AGENTS.md`, después `CLAUDE.md`: reglas y **preferencias permanentes del usuario** (sección 9). Cumplilas siempre.
2. `docs/BITACORA.md`: **qué hizo cada agente, en orden**. Leé las últimas 20 líneas.
3. `docs/ESTADO.md`: tablero de etapas, sesiones y pendientes.
4. `docs/decisiones.md`: lo ✅ validado no se discute; lo 🟡/🟠 está pendiente.
5. `docs/fuente/01-resumen-ejecutivo.md` (el negocio) y `docs/fuente/09-inconsistencias-y-preguntas.md` (problemas conocidos).
6. Las secciones 6 y 7 de este archivo: **cola de trabajo** y **preguntas pendientes al usuario**.
7. Escribí tu primera línea en la bitácora: `scripts/bitacora.sh "chatgpt-lider" "Tomé el mando" "…"`.

## 2. Qué hace el líder (y qué no)

- **Hace:** escribe briefs, reparte tareas, revisa lo entregado (con capturas), integra en la rama de integración, valida con el usuario y mantiene al día `ESTADO`, `decisiones` y la bitácora.
- **No hace:** producir las piezas grandes (eso lo hacen los agentes), publicar ni gastar plata sin OK, ni rediscutir decisiones validadas.
- **Con el usuario:** mensajes **cortos**, una recomendación clara por pregunta y validación **antes** de cualquier tarea cara o larga. Pensamiento crítico: si algo del plan no cierra, decilo.

## 3. Circuito de trabajo

```
brief (docs/briefs/NN-rol.md)
 → el agente trabaja en SU rama (claude/aprovecho-<rol> o codex/aprovecho-<rol>)
 → handoff (docs/handoffs/) + fila en ESTADO + línea en BITACORA + push / PR
 → el líder revisa (lee y saca capturas) → merge a la rama de integración
 → el líder le muestra al usuario lo que hay que validar (corto, con recomendación)
 → registra la decisión (D-NNN) → sigue con la próxima tarea de la cola
```

## 4. Agentes disponibles

| Agente | Cómo se usa | Notas |
|---|---|---|
| **Codex** (ChatGPT del usuario) | Una tarea por brief. Prompt: *"Leé AGENTS.md y ejecutá docs/briefs/NN-xxx.md. Trabajá en la rama codex/aprovecho-<rol> y abrí un PR contra claude/gallant-planck-ps6te6."* | No gasta créditos de Claude. Puede trabajar en paralelo con otros agentes |
| Sesión Claude **Marca** | `session_01YPepJHdCqz7XdEnK5xUA9t` | En espera |
| Sesión Claude **UX** | `session_01YPepJKgdnbFvSwNNSb7n4e` | En espera |
| Sesión Claude **Identidad** | `session_01YPepJKRPFvh2fx4pRYrdnC` | En espera |

- Las sesiones de Claude se ven en claude.ai/code; el usuario puede escribirles directo.
- **Si sos ChatGPT**, no podés mandarles mensajes a las sesiones de Claude: coordiná solo por el repo (briefs, bitácora y ESTADO) y con tareas de Codex.
- **Dos agentes no deben editar el mismo archivo a la vez.** Los únicos compartidos son `docs/ESTADO.md` (cada uno toca solo su fila) y `docs/BITACORA.md` (cada uno agrega líneas al final).

## 5. Integración (git)

- **Rama de integración:** `claude/gallant-planck-ps6te6`. `main` solo con OK del usuario.
- **Integrar una rama:**
  ```bash
  git fetch origin <rama>
  git merge --no-ff origin/<rama>
  ```
  O mergear el PR en GitHub.
- **Conflictos típicos:**
  - `docs/ESTADO.md`: combinar las filas.
  - `docs/BITACORA.md`: conservar todas las líneas y ordenarlas por fecha.
  - `docs/decisiones.md`: los agentes proponen `PROPUESTA-<rol>-N` y **el líder asigna el número D-NNN**.
- **Revisión visual:** antes de mostrarle algo al usuario, sacá capturas (por ejemplo con Playwright a 390 × 844 para la app) y miralas vos primero.

## 6. Cola de trabajo (en orden de prioridad)

| # | Tarea | Brief | Depende de | Estado |
|---|---|---|---|---|
| 1 | Ajustes de identidad: logo oficial (sello) y tipografía sin "AI slop" | `03b-identidad-ajustes.md` | — | Listo para asignar |
| 2 | **Prototipo final de la app** (consumidor + Base + Smart + Intelligence) | `04-app-prototipo.md` | OK del usuario para continuar la v3.2.1 · tarea 1 | Listo para asignar |
| 3 | **Landing** (comercios + inversores + lista de espera + onboarding) | `05-landing.md` | Tarea 1 · decisiones UX pendientes | Listo para asignar |
| 4 | Video, fase 1: guiones, storyboard y costos de los 4 videos | `06-video.md` | — | Listo para asignar |
| 5 | Video, fase 2: producción | `06-video.md` | OK del usuario a la fase 1 · capturas del prototipo | Bloqueado |
| 6 | Integración final, QA y (con OK) publicación | líder | 2 a 5 | Miércoles 11/11 |
| — | **Entrega final** | — | — | **Jueves 12/11/2026** |

## 7. Preguntas pendientes al usuario (pedirlas juntas, cortas)

1. **App:** ¿continuamos el código de la v3.2.1 (`ochomnalez/aprovecho-app`)? Recomendación: sí. ¿Qué cosas de la v3 "no tienen que estar"?
2. **UX** (PROPUESTA-ux-1 a 4): inversores en una página aparte; "Mirá cuánto te queda"; checklist dentro del botón "Publicar"; alérgenos precargados. Recomendación: aprobar todas.
3. **Identidad:** tipografía (3 opciones, después de la tarea 1); CTA en corteza con texto oscuro; crema #FBF3E4; etiquetas Medido/Estimado; ícono derivado del sello.
4. **Onboarding (D-030):** ¿sección con scroll hecha en código + video corto?
5. **Marca:** precios con o sin IVA y en qué moneda; footer "Proyecto académico · Universidad Austral"; una línea de background y una foto de cada fundador; reservar dominios y redes; consultar al INPI por el parecido con Buen Provecho.
6. **Herramientas:** ¿pagar ElevenLabs Starter (~USD 6) el mes de los videos? (`docs/herramientas.md`).

## 8. Recursos

- **Repos del usuario** (además de este):
  - `aprovecho-app`: código de la app v3.2.1 (PWA, JS sin framework).
  - `aprovecho-imagenes`: logo oficial, imágenes aprobadas, contexto del equipo y prompts. **Material del equipo; ante un conflicto, manda el plan (`docs/fuente/`).**
  - `aprovecho-web`: landing anterior.
  - `aprovecho-app-v2`: app anterior.
  - `aprovecho` (privado): contexto inicial de agosto.
- **Marca:** logo oficial en `docs/marca/logo-oficial/`; imágenes aprobadas en `docs/marca/imagenes-aprobadas/`; plataforma de marca y tokens en `docs/marca/`.
- **Referencias de la app:** `docs/ux/referencias-app-v3/` (61 pantallas + `INDICE.md`) y `docs/ux/v2/`.
- **Herramientas y presupuesto** (techo: USD 10/mes): `docs/herramientas.md`.

## 9. Registro obligatorio (bitácora)

Cada push, cada merge y cada traspaso de mando deja una línea en `docs/BITACORA.md`:

```bash
scripts/bitacora.sh "<agente>" "<qué hice>" "<próximo paso>"
```

Agentes: `claude-lider`, `chatgpt-lider`, `claude-marca`, `claude-ux`, `claude-identidad`, `codex-app`, `codex-landing`, `codex-video`, etc. Además, los commits llevan el trailer `Agente: <agente>`.
