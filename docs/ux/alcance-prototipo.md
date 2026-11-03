# Alcance del prototipo de app (UX)

> Rol UX · 2026-11-03 · D-006: es un **prototipo navegable**, no un MVP. Wireframes en `wireframes/index.html`.

## Criterio
La demo tiene que mostrar el **ciclo completo en 3 minutos**: foto → propuesta de la IA → checklist → publicar → reservar → QR → retiro → dato/impacto. Todo lo demás se simula o queda afuera. Prioridad: lo que cuenta la historia del plan (publicar en <1 min, ventana de retiro visible, transparencia Estimado/Medido).

## Cómo se arranca
Pantalla inicial: **"Soy consumidor / Soy comercio"** (selector solo de la demo; en producción serían apps/cuentas distintas). Un botón "Reiniciar demo" fuera del marco de la app.

## Qué funciona y qué se simula

| Capacidad | En el prototipo | Nota |
|---|---|---|
| Navegación y estados de los packs | **Real** (estado en el cliente) | Un pack pasa de disponible → reservado → retirado entre las dos vistas |
| Registro / login | Simulado (un toque) | Sin cuentas reales |
| Mapa | **Placeholder** o mapa estático con pines | Geolocalización real queda para después (B8) |
| Foto del excedente | **Simulada**: foto de ejemplo precargada | D-006: fotos reales después |
| Reconocimiento y propuesta de la IA | **Simulado** con datos fijos, siempre editable | Etiqueta "Estimado" |
| Pago (Mercado Pago) | Simulado, con camino de **pago fallido** | Sin cobro real |
| QR de retiro | QR de ejemplo; "escanear" = botón | |
| Notificaciones | Fuera | Solo se muestra un aviso en pantalla |
| Score y niveles | Reglas propuestas, **valores de ejemplo** | Ver `score-y-niveles.md` |

## Consumidor (8 pantallas base + 5 de soporte)
1. Bienvenida y registro simple (`c01`)
2. Inicio: categorías y filtros sin TACC / vegetariano / vegano (`c02`)
3. Mapa y lista (`c03`)
4. Detalle del pack: **ventana de retiro destacada antes de reservar**, alérgenos "confirmado por el comercio", nutrición "Estimado" (`c04`)
5. Reservar y pagar, simulado (`c05`, `c06` pago fallido)
6. Mis reservas con QR; cancelar (`c07`, `c07b`); comercio sin pack (`c07c`)
7. Retiro y calificación (`c08`); reportar mal estado (`c08b`)
8. Perfil "Tu impacto": ahorro, packs, CO₂e estimado y nivel (`c09`)
Soporte: estados vacío/cargando/error (`c11`).

## Comercio · Base (8 pantallas base + soporte)
1. Inicio con botón principal "Cargar excedente" (`m01`)
2. Cargar excedente, foto simulada (`m02`, `m02b` analizando, `m02c` error)
3. Propuesta de la IA, editable, con "Estimado" (`m03`)
4. Checklist D-014: producto del día + cadena de frío + alérgenos (`m04`)
5. Publicar (`m05`)
6. Mis packs: disponible / reservado / retirado; eliminar (`m06`, `m06b`)
7. Retiros: escanear QR simulado; QR inválido; no retiró (`m07`, `m07b-e`)
8. Dashboard Base (`m08`); estados (`m09`)

## Opcionales (estáticas)
- **Smart:** estación con peso real [Medido] y destino de lo no recuperado, según D-012 (`m10`).
- **Intelligence:** dashboard corporativo con predicción y comparación entre sucursales (`m11`).

## Fuera del prototipo
Alta del comercio con documentos (la cubre la landing), configuración del menú y precios habituales, panel interno, onboarding en video, CRM, pagos y liquidación 75/25 reales, avisos push, referidos, desafíos entre barrios, ranking del barrio, huella hídrica (solo Intelligence, D-013), reportes descargables.

## Principios aplicados
- **Estimado vs. Medido** en cada cifra de impacto o alimento.
- **La IA propone, la persona confirma**: todos los campos de la propuesta son editables.
- **Alérgenos: siempre los confirma el comercio**; en el detalle se ve "Confirmado por el comercio".
- **Publicar en <1 min**: 4 toques desde la foto (foto → propuesta → checklist → publicar).
- **Ventana de retiro visible antes de comprar** (H4, H16: franja clave 17–21 h).
- **Accesibilidad:** áreas táctiles ≥ 44 px, texto ≥ 13 px, estado nunca solo por color (se usa etiqueta de texto).
- **Datos de ejemplo (D-015):** pack USD 3,99 ≈ **$6.100**, valor original ≈ **$12.200**; comisión 25%; CO₂e = kg × 2,53 (D-013). No se reusan los números de los mockups.

## Supuestos míos (no están en la fuente)
- **SUPUESTO:** pack de ≈ 1 kg (el plan da el ejemplo de 4 unidades, no el peso por pack). Solo para los datos de ejemplo del perfil y el dashboard.
- **SUPUESTO:** nombres "Panadería Ejemplo", "Sofía (ejemplo)" y direcciones ficticias.
- **SUPUESTO:** la cancelación se calcula contra el **inicio** de la ventana de retiro (el plan dice "2 h antes del horario de retiro").
- **SUPUESTO:** "Quedan N" packs visibles en la tarjeta (stock), útil para urgencia sin exagerar.
