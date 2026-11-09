# Instructivo para trabajar en APROVECHO con Gemini

> Para quien use Gemini en vez de Claude. Octavio te agrega como colaborador del repo `ochomnalez/APROVECHO-online-` en GitHub (Settings → Collaborators) y aceptás la invitación por mail.
> Las herramientas de Google cambian seguido: si algún paso no se parece a lo que ves, avisale a Octavio.

## ¿Qué Gemini usar?
| Herramienta | Sirve para este proyecto | Cómo se conecta al repo | Puede guardar cambios sola |
|---|---|---|---|
| **Gemini CLI** (en la terminal) — recomendada | Sí: lee el repo, edita archivos y hace commit/push | Se abre dentro de la carpeta del repo | Sí |
| **Jules** (jules.google, agente de Google para GitHub) | Sí: trabaja por tareas y abre Pull Requests | Se conecta a tu cuenta de GitHub y elegís el repo | Sí, en una rama propia y con PR |
| **Gemini Code Assist** (VS Code) | Sí, en modo agente | Abrís la carpeta del repo en VS Code | Depende de la configuración |
| App o web de Gemini (chat) | Solo para **leer** o redactar; no guarda cambios en el repo | Importando el repo o pegando archivos | No |

## Pasos con Gemini CLI (recomendado)
1. Instalá Node.js y después, en la terminal: `npm install -g @google/gemini-cli`.
2. Clonar el repo: `git clone https://github.com/ochomnalez/APROVECHO-online-.git` y `cd APROVECHO-online-`.
3. Escribí `gemini`, entrá con tu cuenta de Google y escribí el primer mensaje:
   > **Seguí el trabajo de Octi. Soy <tu nombre> y trabajo en <rol: video / landing / app>.**
4. Gemini lee `GEMINI.md` (que apunta a `CLAUDE.md`), arma su propia rama `gemini/<tu nombre>-<rol>` y sigue desde la cola de trabajo. Cada cambio queda guardado en esa rama y registrado en la bitácora y el tablero.
5. Para que Octavio integre lo tuyo, Gemini abre un **Pull Request** contra `claude/gallant-planck-ps6te6`.

Si querés que lea `AGENTS.md` o `CLAUDE.md` además de `GEMINI.md`, en su configuración de Gemini CLI se puede indicar que use esos nombres como archivos de contexto; si no lo encontrás, no pasa nada: `GEMINI.md` ya lo manda a leer `CLAUDE.md`.

## Pasos con Jules
1. Entrá a jules.google con tu cuenta de Google y conectá GitHub.
2. Elegí el repo `APROVECHO-online-` y la rama base `claude/gallant-planck-ps6te6`.
3. Primera tarea: "Seguí el trabajo de Octi como `gemini-<tu nombre>-<rol>`. Leé GEMINI.md y trabajá en tu propia rama."
4. Jules te devuelve un Pull Request. Octavio lo revisa.

## Reglas que no se negocian
- Una rama propia por persona (`gemini/<nombre>-<rol>`). **Nunca** `main` ni la rama de integración.
- Firma `gemini-<nombre>-<rol>` en bitácora, commits y avisos.
- Subir todo después de cada cambio, sin esperar que alguien lo pida (Gemini no tiene el control automático de Claude, así que hay que recordárselo si se olvida: "actualizá el repo").
- Lo caro (generar video, imágenes, voz) se consulta antes con Octavio.
