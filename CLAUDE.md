# APROVECHO — Reglas de trabajo para todos los agentes

Este archivo lo lee **cada sesión/agente al arrancar**. Define el proyecto, la fuente de verdad y cómo trabajamos.

## 1. El proyecto

APROVECHO es un emprendimiento (Universidad Austral, materia Emprendimientos 2026) que conecta comercios de comida que tienen excedentes aptos para consumo con consumidores cercanos que los compran en **packs a 50% de descuento** y los retiran en el local. Además usa los datos de cada operación para ayudar al comercio a **medir, entender y reducir** su desperdicio (planes Base, Smart e Intelligence).

Metas digitales de este repositorio (tres frentes separados):

1. **Landing page**
2. **Aplicación**
3. **Video de presentación**

## 2. Fuente de verdad

- Toda la información del negocio sale del **plan de negocios "APROVECHO – Entregable 3" (noviembre 2026)** y del **Excel "ECONOMICS – APROVECHO"**.
- El extracto organizado está en `docs/fuente/`. **Leé el extracto, no los originales**, salvo que necesites verificar una cita exacta (`docs/fuente/texto-original/`).
- **No inventes datos.** Si algo no está en la fuente, marcalo como `SUPUESTO` y anotalo en `docs/fuente/09-inconsistencias-y-preguntas.md` o preguntá.
- Antes de usar un número en una pieza pública (landing, video, app), revisá `docs/fuente/09-inconsistencias-y-preguntas.md`: hay números del plan con errores conocidos.
- Principio heredado del plan: **separar siempre lo medido de lo estimado** y no exagerar el impacto.

## 3. Orden de lectura al arrancar una sesión

1. `CLAUDE.md` (este archivo)
2. `docs/ESTADO.md`: qué está hecho, qué sigue y quién hace qué
3. `docs/fuente/01-resumen-ejecutivo.md`
4. Los archivos de `docs/fuente/` de tu rol (ver tabla abajo)
5. `docs/decisiones.md`: decisiones ya validadas, que no se discuten de nuevo
6. Los últimos handoffs en `docs/handoffs/` relacionados con tu trabajo

| Rol | Leer además del resumen |
|---|---|
| Marketing y estrategia de marca | 02, 03, 04, 05, 06, `docs/marca/marca-actual.md` |
| Identidad visual / UI | 04, 06 (branding), `docs/marca/marca-actual.md`, imágenes en `docs/fuente/imagenes/` |
| UX | 03, 04, 07 |
| Desarrollo web (landing) | 04, 06, entregables de marca y UX |
| Desarrollo de app | 04, 07, 08 (supuestos de negocio), entregables de marca y UX |
| Guion y video | 01, 03, 04, 06, entregables de marca |

## 4. Organización del repositorio

```
CLAUDE.md                 reglas (este archivo)
docs/ESTADO.md            tablero: etapas, sesiones, pendientes, preguntas al usuario
docs/decisiones.md        registro de decisiones validadas
docs/handoffs/            un archivo por bloque de trabajo terminado
docs/fuente/              extracto del plan + originales + imágenes
docs/marca/               identidad: estado actual, estrategia, guía de marca
docs/marketing/           posicionamiento, mensajes, contenidos
docs/ux/                  flujos, arquitectura de información, wireframes
landing/                  código de la landing
app/                      código de la aplicación
video/                    ideas, guion, storyboard, assets
```

Cada rol trabaja **solo en sus carpetas**. Si necesitás cambiar algo de otro rol, dejalo como pedido en tu handoff o en `docs/ESTADO.md`.

## 5. Cómo reportar (obligatorio)

Al terminar cada bloque de trabajo:

1. Crear `docs/handoffs/AAAA-MM-DD-<rol>-<tema>.md` con la plantilla `docs/handoffs/_plantilla.md`
2. Actualizar tu fila en `docs/ESTADO.md`
3. Commit y push

Mensajes de commit en español, con prefijo del rol, por ejemplo: `marca: propuesta de paleta v1`, `landing: estructura inicial`.

## 6. Créditos y validaciones

- Leé solo lo que necesitás; preferí el extracto a los originales y no abras imágenes sin motivo.
- **Pedí validación al usuario antes de** generar imágenes, videos o voces (Higgsfield, ElevenLabs), hacer investigación profunda, crear proyectos en servicios externos (Supabase, Vercel, etc.) o hacer cualquier tarea larga. Incluí una estimación de costo y alcance.
- Nada se publica ni se comparte hacia afuera sin OK explícito del usuario.

## 7. Idioma y tono

- Documentos internos en español.
- Textos para el público: español rioplatense con voseo ("Encontrá", "Sumá tu comercio").
- Tono de marca según el plan: **B2C** cercano, simple y con humor; **B2B** profesional y concreto. El desperdicio se comunica como oportunidad, no desde la culpa.

## 8. Git

- No pushear a `main` sin autorización del usuario.
- Cada sesión trabaja en la rama que le asigna el líder (ver `docs/ESTADO.md`).
- Nunca reescribir el historial de una rama compartida.
