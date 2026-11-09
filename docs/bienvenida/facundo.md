# Bienvenida para Facundo (guion para el chat con Gemini)

> **Para el agente que lee esto (Gemini):** Octavio le pidió a Facundo que arranque mostrándote este archivo. Facundo **no sabe nada de GitHub, repositorios, ramas ni conectores**: guialo vos, en español rioplatense, con mensajes cortos, **un paso por vez**, sin jerga (si usás una palabra técnica, explicala en una frase). Esperá que él confirme cada paso antes del siguiente. Firmás como **`gemini-facundo-<rol>`** (rol más probable: `video`). Tu rama propia: **`gemini/facundo-<rol>`** (ver `GEMINI.md`). El git lo hacés vos: no le pidas comandos.

## 1. Presentate (breve)
"Hola Facundo, soy el asistente de IA conectado al proyecto de Octavio. Él me pidió que te muestre esto cuando arrancaras. Te voy a explicar de qué se trata, cómo trabajamos y cómo usar las aplicaciones de video. Voy de a poco y no necesitás saber nada técnico: lo técnico lo hago yo."

## 2. De qué se trata el proyecto
**APROVECHO** es un emprendimiento de Octavio y su equipo (Universidad Austral, materia Emprendimientos 2026). Conecta comercios de comida que les sobra mercadería apta para consumo con vecinos que la compran en **packs a mitad de precio** y la retiran en el local. Además les mide el desperdicio con tres planes: **Base** (celular), **Smart** (balanza + tablet con cámara) e **Intelligence** (panel de cadena).
Se está haciendo la parte digital: **landing**, **prototipo de la app** y **4 videos**. **Entrega: jueves 12/11/2026.**
La información del negocio está en `docs/fuente/` (leela vos; a él mostrale solo un resumen).

## 3. Cómo funciona el "repositorio" (explicalo así)
- **Repositorio (repo)** = una carpeta compartida en la nube donde está todo el trabajo (textos, videos, código, decisiones).
- **Rama** = tu copia propia de esa carpeta. Todo lo que hagas va ahí, así nunca rompés lo de Octavio ni lo de otros.
- **Guardar y subir** = lo hacés vos después de cada cambio, sin que te lo pida.
- **Pull Request** = el pedido de "revisá lo mío y sumalo". Lo revisa Octavio.
- Facundo no tiene que tocar nada de esto. Solo pedirte cosas.

## 4. Qué le toca a Facundo
Principalmente los **videos**:
1. **Onboarding para comercios** (el primero; ya hay un corte armado en `video/`, falta pulirlo: tomas reales con personas, voz más seria y música).
2. **Presentación de APROVECHO** (60–90 s).
3. **«Una foto»** (publicidad para comercios, vertical).
4. **«¿Qué me tocó hoy?»** (publicidad para consumidores, vertical).
**Antes de empezar, leé** `docs/BITACORA.md` (últimas 20 líneas), `docs/ORQUESTADOR.md` §0 y §6, `docs/decisiones.md` y el bloque `DATOS` de `docs/tablero/visual.html`, y contale a Facundo en 5 líneas dónde está el trabajo hoy. El video de Octavio está en la rama `claude/aprovecho-video` (la integración ya lo incluye): `video/src/Onboarding.jsx`.

## 5. Las aplicaciones que usamos
| Aplicación | Para qué | Costo / estado |
|---|---|---|
| **Remotion** | Monta los videos con código (transiciones, pantallas, subtítulos) | Gratis. Está en `video/`. Se instala con `npm install` y se renderiza con `npm run render:onboarding` (lo corrés vos) |
| **ElevenLabs** | Voz en off y música | El plan gratis de Octavio se quedó sin créditos; una voz sale ~1.000 créditos |
| **Higgsfield** | Genera clips de video a partir de fotos (Kling, Gemini Omni, Seedance) | Pago por créditos. Hay prueba gratis de 3 días con 100 créditos (**pide tarjeta; se cobra USD 49 si no se cancela**) |
| **Google AI Studio / Flow (Gemini Omni)** | Alternativa para generar clips | Pago por segundo (~USD 0,10–0,15/s según calidad) |
| **HeyGen** | Presentadores con avatar | No sirve para tomas de ambiente; solo la voz, quizás |
Las **fotos base** para las tomas con personas están en `video/01-onboarding/fotos-base/` y los pedidos de movimiento en `prompts-veo.md` (Octavio ya validó las fotos).

## 6. Cómo usar las aplicaciones (de lo más simple a lo avanzado)
**Camino simple, sin conectar nada (recomendado para empezar):** Facundo entra a la página web de cada aplicación (con la cuenta que Octavio le indique), sube la foto, pega el pedido de `prompts-veo.md`, genera el clip, lo descarga y se lo pasa a **vos**. Vos lo guardás en `video/public/tomas/` y lo montás. Así no hace falta ningún "conector".

**Camino avanzado, con conectores:** un **conector (MCP)** deja que vos uses la aplicación directamente. En Gemini CLI se configura en su archivo de ajustes (`settings.json`, sección `mcpServers`); buscá en la documentación oficial de Gemini CLI y de cada aplicación los pasos vigentes, porque cambian. Hacelo con Facundo paso a paso, solo si Octavio lo aprueba.

**Claves (API keys):** **nunca** pegarlas en el chat ni guardarlas en archivos del repo. Si hay que usar una, se carga como secreto del entorno (en GitHub Codespaces: Settings → Codespaces → Secrets). Si no sabés cómo, preguntale a Octavio.

Antes de usar cualquier aplicación: **preguntale a Octavio con qué cuenta y créditos** se va a generar (los créditos de Octavio son de Octavio).

## 7. Reglas de plata y permisos (innegociables)
- **No generes nada que cueste** (voz, imágenes, video) ni crees cuentas o proyectos externos sin **OK explícito de Octavio**. Pedile validación con alcance y costo estimado.
- **Nada se publica** hacia afuera sin su OK.
- Usá el **logo oficial** (`docs/marca/logo-oficial/`), no el de la propuesta v1 (D-026). No menciones el 75% (D-031). Evitá el "AI slop" (CLAUDE.md §9.10).
- Después de **cada cambio**: tablero + bitácora + commit + push a tu rama (`GEMINI.md`). Contale a Facundo en una línea qué subiste.

## 8. Primer paso
Preguntale a Facundo: **"¿Con cuál de los 4 videos querés arrancar?"** y, mientras tanto, ofrecele mirar juntos el corte actual del onboarding (`video/salidas/onboarding.mp4`).
