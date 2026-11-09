# Bienvenida para Facundo (guion para el chat)

> **Para el agente que lee esto:** Octavio le pidió a Facundo que arranque mostrándote este archivo. Facundo **no sabe nada de GitHub, repositorios, ramas ni conectores**: guialo vos, en español rioplatense, con mensajes cortos, **un paso por vez**, sin jerga (si usás una palabra técnica, explicala en una frase). Esperá que él confirme cada paso antes del siguiente. No le pidas nunca que use la terminal ni git: eso lo hacés vos. Firmás como **`claude-facundo-<rol>`** (el rol más probable: `video`).

## 1. Presentate (breve)
"Hola Facundo, soy un asistente de IA conectado al proyecto de Octavio. Octavio me pidió que te muestre esto cuando arrancaras. Te voy a explicar de qué se trata, cómo trabajamos y cómo conectar las aplicaciones que usamos. Voy de a poco y no necesitás saber nada técnico: lo técnico lo hago yo."

## 2. De qué se trata el proyecto
**APROVECHO** es un emprendimiento de Octavio y su equipo (Universidad Austral, materia Emprendimientos 2026). Conecta comercios de comida que les sobra mercadería apta para consumo con vecinos que la compran en **packs a mitad de precio** y la retiran en el local. Además les mide el desperdicio con tres planes: **Base** (celular), **Smart** (balanza + tablet con cámara) e **Intelligence** (panel de cadena).
Se está haciendo la parte digital: **landing**, **prototipo de la app** y **4 videos**. **Entrega: jueves 12/11/2026.**
La información del negocio está en `docs/fuente/` (leelo vos; a él mostrale solo un resumen).

## 3. Cómo funciona el "repositorio" (explicalo así)
- **Repositorio (repo)** = una carpeta compartida en la nube donde está todo el trabajo (textos, videos, código, decisiones).
- **Rama** = tu copia propia de esa carpeta. Todo lo que hagas va ahí, así nunca rompés lo de Octavio ni lo de otros.
- **Guardar y subir** = lo hago yo después de cada cambio, sin que me lo pidas.
- **Pull Request** = el pedido de "revisá lo mío y sumalo". Lo revisa Octavio.
- No tenés que tocar nada de esto. Solo pedirme cosas.

## 4. Qué le toca a Facundo
Principalmente los **videos**:
1. **Onboarding para comercios** (el primero, ya hay un corte armado en `video/`, falta pulirlo).
2. **Presentación de APROVECHO** (60–90 s).
3. **«Una foto»** (publicidad para comercios, vertical).
4. **«¿Qué me tocó hoy?»** (publicidad para consumidores, vertical).
Y lo que Octavio vaya sumando. **Antes de empezar, leé** `docs/BITACORA.md` (últimas 20 líneas), `docs/ORQUESTADOR.md` §0 y §6, `docs/decisiones.md` y el bloque `DATOS` de `docs/tablero/visual.html`, y contale a Facundo en 5 líneas dónde está el trabajo hoy. El trabajo de video de Octavio está en la rama `claude/aprovecho-video` (la integración ya lo incluye).

## 5. Las aplicaciones que usamos (explicalas una por una cuando haga falta)
| Aplicación | Para qué | Cómo se conecta | Costo / estado |
|---|---|---|---|
| **Remotion** | Monta los videos con código (transiciones, pantallas, subtítulos) | Ya está en `video/`; lo corro yo | Gratis. Nada que conectar |
| **ElevenLabs** | Voz en off y música | Conector (ver §6) | El plan gratis de Octavio se quedó sin créditos; una voz sale ~1.000 créditos |
| **Higgsfield** | Genera clips de video a partir de fotos (Kling, Gemini Omni, Seedance) | Conector (ver §6) | De pago por créditos; hay prueba gratis de 3 días con 100 créditos (**pide tarjeta y se cobra USD 49 si no se cancela**) |
| **Google AI Studio (Gemini Omni)** | Alternativa para generar clips | Clave API (formulario seguro, ver §6) | Pago por segundo de video (~USD 0,10–0,15/s según calidad) |
| **HeyGen** | Presentadores con avatar | — | No sirve para tomas de ambiente; solo la voz, quizás |
Las **fotos base** para las tomas con personas están en `video/01-onboarding/fotos-base/` (Smart e Intelligence con balanza + cámara, Base con celular, apertura). Octavio ya las validó.

## 6. Cómo conectar una aplicación (guialo paso a paso)
**Un conector** es un permiso para que yo use una aplicación (por ejemplo Higgsfield) por vos, con tu cuenta. Cada persona conecta con su propia cuenta.
1. Antes de conectar nada, **preguntale a Octavio con qué cuenta y créditos** se va a generar (los créditos de Octavio son de Octavio).
2. Para los pasos exactos y actuales, **leé la documentación del entorno** con la herramienta `read_documentation` (tema `connectors.add`), porque las pantallas cambian.
3. En general: en claude.ai → **Configuración → Conectores** → buscar el nombre (Higgsfield, ElevenLabs) → **Conectar** → iniciar sesión con la cuenta de esa aplicación → volver a la sesión. Si no aparece, abrir una sesión nueva sobre el mismo repo.
4. Para una **clave API** (por ejemplo Google): **nunca** pegarla en el chat. Abrí el formulario seguro con `request_credential` para que la cargue ahí. Yo no la veo.
5. Cuando termine, probá la conexión con algo gratis (por ejemplo consultar créditos) y contale el resultado.

## 7. Reglas de plata y permisos (innegociables)
- **No generes nada que cueste** (voz, imágenes, video) ni crees cuentas o proyectos externos sin **OK explícito de Octavio**. Pedile validación con alcance y costo estimado.
- **Nada se publica** hacia afuera sin su OK.
- Usá el **logo oficial** (`docs/marca/logo-oficial/`), no el de la propuesta v1 (D-026). No menciones el 75% (D-031). Evitá el "AI slop" (CLAUDE.md §9.10).
- Después de **cada cambio**: tablero + bitácora + commit + push a tu rama (CLAUDE.md §0). Contale a Facundo en una línea qué subiste.

## 8. Primer paso
Preguntale a Facundo: **"¿Con cuál de los 4 videos querés arrancar?"** y, mientras tanto, ofrecele mirar juntos el corte actual del onboarding (`video/salidas/onboarding.mp4`).
