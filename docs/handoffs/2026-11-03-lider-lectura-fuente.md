# Handoff · líder · lectura de la fuente y armado del repositorio

- **Fecha:** 2026-11-03
- **Agente / sesión:** líder / orquestador
- **Rama:** `claude/gallant-planck-ps6te6`

## Qué hice

- Leí **completos** los dos PDF del plan "Entregable 3" (páginas 1–66 y 67–132): todo el texto y las 54 imágenes útiles (gráficos de encuestas, mockups de app y dashboards, piezas de marca, mapas competitivos, FODA, Porter, riesgos, normas, canvas y cadena de valor).
- Leí el Excel de Economics completo: 8 hojas, todas las celdas y fórmulas. Encontré que el VAN, la TIR y el payback solo están en el Excel.
- Armé el extracto organizado por temas en `docs/fuente/` (01 a 08), para que cada agente lea solo lo de su rol.
- Hice una revisión crítica en `docs/fuente/09-inconsistencias-y-preguntas.md`: 22 inconsistencias o errores (marca, producto y números), los huecos del documento y 8 preguntas abiertas.
- Documenté la marca existente y sus problemas en `docs/marca/marca-actual.md`.
- Escribí `CLAUDE.md` (reglas para agentes), este tablero (`docs/ESTADO.md`), el registro de decisiones y la plantilla de handoff.

## Hallazgos más importantes

1. **Ya hay una base de marca** (badge circular, paleta de 4 colores, Montserrat + Open Sans), pero es un mockup generado con IA: logo raster de baja resolución, inconsistencias tipográficas y errores ("PROVECHO", "2024").
2. **El nombre se parece mucho a "Buen Provecho"**, competidor directo en CABA (riesgo de confusión y de registro de marca).
3. **La comisión del 25% es 2,5 veces la de Buen Provecho (10% + IVA)**, y la propia encuesta muestra rechazo por encima del 20%. Es un punto delicado para la landing B2B.
4. Hay contradicciones de producto (destino del excedente: ¿Smart o Intelligence?; huella hídrica para el consumidor; factor de CO₂e 2,53 vs. 2) y el **APROVECHO Score no tiene fórmula**.
5. **Posible error en el Excel:** las estaciones se compran sobre el total de clientes y no sobre las altas (264 estaciones para 102 clientes). Corregido: inversión USD 114.346 (no 199.072), financiamiento USD 96.398 (no 112.611), VAN USD 48.978 (no 17.004), TIR 50% (no 36,7%) y payback 3,4 años (no 3,9). A confirmar con el CFO.
6. El plan define la landing como **B2B de alta de comercios Base**. Hay que confirmar si ese es el objetivo.

## Pendientes y bloqueos

- Validación del extracto y respuestas a las preguntas de la sección E del archivo 09.
- Definir el esquema de sesiones y ramas.

## Qué necesita el próximo agente (marca y marketing)

- Leer `CLAUDE.md`, `docs/ESTADO.md`, `docs/fuente/01` a `06`, `09` y `docs/marca/marca-actual.md`.
- Resolver primero A1 (nombre) y A2 (comisión) con el usuario, o dejarlos como riesgos explícitos.
