# Registro de decisiones

> Decisiones **validadas** no se vuelven a discutir salvo que el usuario lo pida. Las **propuestas** esperan el OK del usuario.
> Formato: `D-NNN · fecha · estado · decisión · motivo`.

| ID | Fecha | Estado | Decisión | Motivo |
|---|---|---|---|---|
| D-001 | 2026-11-03 | ✅ Validada (indicación del usuario) | La fuente de verdad del negocio es el plan **"APROVECHO – Entregable 3"** (noviembre 2026, dos PDF) más el Excel **"ECONOMICS – APROVECHO"** | El usuario los entregó como la fuente de información del emprendimiento |
| D-002 | 2026-11-03 | 🟡 Propuesta | El repositorio es la memoria compartida entre agentes: `CLAUDE.md` con reglas, `docs/ESTADO.md` como tablero, `docs/handoffs/` para reportes y este archivo para decisiones | Las sesiones no comparten memoria entre sí; sin esto cada agente tendría que releer los 132 PDF |
| D-003 | 2026-11-03 | 🟡 Propuesta | Los PDF originales (44 MB) no se suben; se suben el texto extraído, las imágenes comprimidas y el Excel | Peso del repo; el extracto alcanza para trabajar |
| D-004 | 2026-11-03 | 🟡 Propuesta | Trabajo por etapas: estrategia de marca → identidad visual y UX → landing, app y video. Solo se abren las sesiones de la etapa en curso | Las etapas dependen unas de otras; abrir todas juntas gasta créditos sin avanzar |
| D-005 | 2026-11-03 | ✅ Validada | **Landing:** objetivo principal, que **se sumen comercios** (alta B2B); además, **una sección para inversores** con información de APROVECHO | Indicación del usuario |
| D-006 | 2026-11-03 | ✅ Validada | **App:** solo un **prototipo** (no un MVP). Supabase, Vercel, dominio propio y carga de fotos reales de comida se evalúan después | Indicación del usuario |
| D-007 | 2026-11-03 | ✅ Validada | **Comisión del 25%**: se mantiene y se comunica | Indicación del usuario |
| D-008 | 2026-11-03 | ✅ Validada | **Cada sesión en su propia rama**; el líder integra | Indicación del usuario |
| D-009 | 2026-11-03 | ✅ Validada | **Videos (3):** 1 de presentación de APROVECHO (60–90 s) + 2 publicidades cortas y verticales: **comercios** y **consumidores** | Respuesta del usuario |
| D-010 | 2026-11-03 | ✅ Validada | **Entrega de todo: jueves 12/11/2026** | Respuesta del usuario |
| D-011 | 2026-11-03 | ✅ Validada | **Logo: profesionalizar el actual**. Se mantiene la idea (badge circular, verdes, slogan); se redibuja en vector, se simplifica el ícono y se arman versiones (isotipo, horizontal, monocromo, app icon, favicon) | Respuesta del usuario |
| D-012 | 2026-11-03 | 🟠 Provisoria (líder) | Para el prototipo: el **destino del excedente** se registra en **Smart e Intelligence** (archivo 09, B1) | El texto de Smart lo describe así; se confirma con el usuario en la próxima validación |
| D-013 | 2026-11-03 | 🟠 Provisoria (líder) | La app del consumidor muestra **solo CO₂e** (factor **2,53 kg CO₂e/kg**); la huella hídrica queda para Intelligence (B2, B3) | Coincide con las pantallas del plan y es lo más conservador |
| D-014 | 2026-11-03 | 🟠 Provisoria (líder) | Checklist antes de publicar: **producto del día + cadena de frío + alérgenos/sin TACC** (B6) | Suma lo del texto y lo del diagrama |
| D-015 | 2026-11-03 | 🟠 Provisoria (líder) | Datos de ejemplo coherentes: el consumidor paga **USD 3,99 ≈ ARS 6.100** (valor original ≈ ARS 12.200); no se reusan los números de los mockups (B7) | Consistencia con los economics |
| D-016 | 2026-11-04 | 🟠 Provisoria (se aplica salvo objeción) | **Arquitectura monolítica:** todo es APROVECHO; Base, Smart e Intelligence son descriptores (sin logos propios), con verbo en castellano: Recuperá · Medí · Anticipá. Los nombres en inglés se mantienen | Coherencia con el plan y comprensión sin traducir. Ver `marca/plataforma-de-marca.md` §5 |
| D-017 | 2026-11-04 | ✅ Validada | **Color:** verde bosque como base + acento cálido propio "corteza" (naranja tostado). El código medido/estimado no depende solo del color | Diferenciarse de la categoría verde + hoja (marca-actual, obs. 5) |
| D-018 | 2026-11-04 | ✅ Validada | **Ícono del logo:** medialuna integrada a la flecha circular; la medialuna es además el ícono de campaña | El ícono actual es ambiguo; pan y facturas es el excedente n.º 1 (68,8%, H7) |
| D-019 | 2026-11-04 | 🟠 Provisoria (ajustar: C6 ya está resuelto, ver D-025) | **Números públicos:** no mostrar VAN, TIR, payback, financiamiento, inversión total (C6), ingresos 2027 (C5) ni umbrales Smart/Intelligence (C1). Sí margen por pack, LTV/CAC, equilibrio 2029 e ingresos 2031 con aviso "proyecciones preliminares" | Reglas de `fuente/09`. Detalle en `marketing/landing-contenido.md` I-6 |
| D-020 | 2026-11-04 | ✅ Validada | **Videos:** 1A "La vida de una medialuna" · 2A "Una foto" · 3A "¿Qué me tocó hoy?" | Ver `marketing/conceptos-videos.md` |
| D-021 | 2026-11-03 | 🟠 Provisoria (líder) | **Herramientas:** generar en ElevenLabs (Higgsfield tiene 0 créditos); logo y piezas con texto en código (SVG/HTML); montaje de video con Remotion. Detalle en `docs/herramientas.md` | Calidad, una sola billetera y menos créditos |
| D-022 | 2026-11-03 | 🟡 Propuesta | **Codex** (ChatGPT del usuario) hace las tareas de código pesadas: prototipo, landing y Remotion. Claude hace estrategia, dirección, revisión e integración. Las sesiones nuevas de Claude van con Sonnet | Ahorrar créditos de Claude; ya se usó el 50% de la ventana de uso |
| D-023 | 2026-11-03 | 🟡 Propuesta | **Presupuesto:** USD 0 por ahora. Fotos de stock gratis o generadas con ChatGPT; voz con ElevenLabs Free. Pagar **ElevenLabs Starter (~USD 6)** solo el mes de los videos si hace falta licencia comercial. Higgsfield no | Techo del usuario: USD 10/mes |
| D-024 | 2026-11-03 | ✅ Validada | **Landing:** suma una sección chica para consumidores, "Avisame cuando llegue a mi barrio" (lista de espera) | Respuesta del usuario |
| D-025 | 2026-11-03 | ✅ Validada | **C6 no es un error:** la compra de estaciones para todos los clientes cada año es **intencional** (renovación anual). Se mantienen los números del Excel: financiamiento USD 112.611, VAN USD 17.004, TIR 36,7%, payback 3,9 años | Respuesta del CFO (usuario) |
