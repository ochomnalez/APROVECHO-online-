# APROVECHO Score y niveles del consumidor

> **PROPUESTA** de UX (cierra B4 y B5 de `docs/fuente/09`). Nada de esto está en el plan: necesita OK del usuario antes de publicarse. Valores de ejemplo.

## 1. APROVECHO Score del comercio (0–100)

**Principio (15.5):** premia **reducir el excedente y cumplir**, no vender más. Vender muchos packs no suma puntos por sí solo.

| Componente | Peso | Cómo se mide | Disponible en |
|---|---|---|---|
| **Cumplimiento** | 40 | Reservas entregadas con QR ÷ reservas totales (últimos 30 días). Cada "sin pack" o pack eliminado con reserva activa resta fuerte | Todos |
| **Reducción del excedente** | 30 | Tendencia del excedente por día de operación frente al propio promedio de las 4 semanas anteriores (menos es mejor) | Base: **proxy** por packs cargados (Estimado). Smart/Intelligence: kg medidos |
| **Calidad** | 15 | Calificación promedio y reportes de "mal estado" (cada reporte confirmado resta) | Todos |
| **Transparencia** | 15 | Checklist completo en el 100% de las publicaciones; alérgenos informados; datos cargados a tiempo | Todos |

- **No suma:** cantidad de packs vendidos, ingresos, comisión generada.
- **Etiqueta:** en Base, el componente de excedente se muestra "Estimado"; en Smart/Intelligence, "Medido".
- **Arranque:** primeras 4 semanas "Calibrando" (sin ranking), para no castigar a quien recién empieza.
- **Efectos:** el Score alimenta el ranking del barrio y "Comercio del mes". Un "sin pack" lo baja; si se repite, suspensión (14.4).
- **Anti-trampa:** el kg de excedente base no se puede "bajar" cargando menos fotos: la baja solo cuenta si el cumplimiento se mantiene ≥ 90%. **SUPUESTO** de diseño.

**Limitación honesta:** en Base el excedente real no se mide (solo lo publicado). Por eso el peso de ese componente es 30 y no más, y se comunica como estimación. **PREGUNTA al usuario/CTO:** ¿se puede pedir al comercio, una vez por semana, un "¿cuánto tiraste hoy?" simple para mejorar el proxy?

## 2. "Comercio del mes" (B5)
- Por barrio y mes. Elegibles: Score ≥ 80, mínimo 20 retiros y 0 reportes confirmados. Gana el de **mayor mejora del Score** (no el de más ventas). **PROPUESTA**, frecuencia mensual.

## 3. Niveles del consumidor (B5)

Se suben por **packs retirados con QR validado** (acumulados). Los nombres son provisorios (los define Marca).

| Nivel | Packs retirados | Qué desbloquea (sin costo monetario) |
|---|---|---|
| 1 · Nuevo | 0 | Bienvenida |
| 2 · Vecino | 3 | Insignia y racha semanal |
| 3 · Habitual | 10 | Acceso anticipado a packs de comercios favoritos |
| 4 · Referente | 25 | Insignia visible en el ranking del barrio |
| 5 · Embajador | 50 | Invitaciones a probar funciones nuevas |

- **Descuentos extra no se prometen** hasta definir A3 (beneficio de bienvenida) y su costo. Los referidos del plan (10% para ambos, 10 packs → 1 gratis) se comunican por separado, no como nivel.
- Calificar y reportar no suman niveles (evita incentivar reservar y no retirar).
- Si el consumidor no retira, **no pierde el nivel** pero no suma ese pack (no se castiga con humillación; se ve en el copy).
- El perfil muestra el nivel, el progreso al siguiente y los datos "Estimado".

## 4. Desafíos entre barrios (B5)
- Mensual. Métrica: **packs retirados por usuario activo** del barrio (normalizado para no premiar barrios grandes). Premio simbólico: insignia y mención. **PROPUESTA**; fuera del prototipo.

## 5. Preguntas abiertas
1. ¿Se aprueban los pesos 40/30/15/15?
2. ¿Los niveles muestran beneficios solo simbólicos o hay un presupuesto de descuentos?
3. ¿El Score es visible para el consumidor en el detalle del pack? (hoy se ve la calificación ★; el Score quedaría solo en el ranking.)
