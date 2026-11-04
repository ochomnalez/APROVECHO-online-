# Video 1 · Onboarding para comercios · "Tu comercio, con APROVECHO"

> Fase 1 (guion y storyboard, sin costo). **Pendiente de OK del usuario** antes de producir.
> Pedido del usuario (4/11): explicar **cómo se transforma el comercio con APROVECHO** y mostrar **el flujo de trabajo dentro del comercio**. Va primero.
> Se usa también en la **sección de onboarding de la landing** (después de "Sumá tu comercio", D-030).

- **Duración:** 85 s · **Formato:** 16:9 (se recorta a 9:16 para redes) · **Voz en off** rioplatense + subtítulos · **Música** instrumental suave.
- **Sin actores ni video generado con IA:** fotos/clips de stock reales + pantallas del prototipo animadas con Remotion.
- **Tono:** B2B directo, de igual a igual (plataforma de marca §4). Sin culpa, sin "salvá el planeta".
- **Fuentes:** onboarding en 7 pasos (`docs/fuente/07`, §14.4), plan Base/Smart/Intelligence (`docs/fuente/04`), encuesta B2B (`docs/fuente/03`).

## Guion escena por escena

| # | Seg. | Qué se ve | Voz en off | Texto en pantalla | Fuente visual |
|---|---|---|---|---|---|
| 1 | 0–8 | Cierre de una panadería: bandeja con medialunas y facturas que sobraron. Luz de tarde | "Al cierre, siempre sobra algo. Y lo que sobra, hoy se tira o se regala." | "35,7% tuvo excedente todos los días de la última semana" (encuesta propia) | Stock real (Pexels) |
| 2 | 8–16 | Landing → botón "Sumá tu comercio" → formulario de alta | "Sumarte es simple: cargás los datos de tu local, elegís tu plan y subís tu habilitación y tu carnet de manipulador." | "1 · Alta" · "2 · Verificación" | Landing / formulario (animado) |
| 3 | 16–24 | Carta con productos y precios; franjas de retiro; bolsa y sticker de vidriera | "Cargás tu carta y tus horarios de retiro. Te damos el primer lote de bolsas, el sticker y el cartel con QR." | "3 · Tu carta" · "4 · Arranque" | App (configuración) + `docs/marca/aplicaciones/` |
| 4 | 24–38 | Celular sobre la bandeja. La app dibuja cajas sobre cada producto: "Medialuna ×5 · Factura surtida ×2" | "Cuando sobra, sacás una foto. La app reconoce cada producto y cuenta cuántos hay." | "Estimado por IA" | `app/capturas/06-deteccion.png` |
| 5 | 38–48 | Propuesta: 3 packs, precio con 50% de descuento, retiro 19–20 h. Checklist: producto del día · cadena de frío · alérgenos. Botón "Publicar" | "Arma los packs, el precio y el horario. Vos revisás, confirmás y publicás. La decisión siempre es tuya." | "La IA propone. Vos confirmás." | App (revisar y publicar) |
| 6 | 48–60 | Un vecino reserva y paga; llega con el QR; el comercio escanea. Desglose: pack $6.100 → comisión → **$4.575 para vos** | "Un vecino reserva y paga desde la app, y lo retira con un QR. De cada venta, vos te quedás con el 75%." | "$6.100 → $4.575 para tu comercio" (D-015) | App (reserva/retiros) + stock (manos con celular) |
| 7 | 60–70 | Panel Base: ingreso recuperado, packs retirados, kilos [Estimado], Score | "Cada venta suma a tu panel: plata recuperada, kilos rescatados y tu Score." | "Medido · Estimado" (etiquetas) | `app/capturas/02-base.png` (recapturar con datos) |
| 8 | 70–80 | Escalera: Base → Smart (balanza + tablet, peso real) → Intelligence (panel de cadena: sucursales, vencimientos) | "Y si querés medir más, sumás la estación Smart. Con Intelligence, entendés por qué sobra y cuánto conviene producir." | "Base · Smart · Intelligence" | `03-smart.png`, `04-intelligence.png` |
| 9 | 80–85 | Logo oficial sobre fondo de marca | "Menos desperdicio, más aprovecho. Sumá tu comercio." | Logo + "Sumá tu comercio" + URL (a definir) | `docs/marca/logo-oficial/` |

**Texto de la voz en off (~165 palabras, ≈ 1.000 caracteres):** unir la columna "Voz en off".

## Reglas de contenido

- El único dato duro es el 35,7% (encuesta propia, con fuente en pantalla). No usar VAN, TIR ni resultados de terceros (D-019, archivo 09).
- Nunca "CO₂ evitado": si aparece, "huella asociada (estimada)".
- Sin promesas de tiempo ("en 2 minutos") ni de ahorro: no están medidos (archivo 09, A6).
- Comisión del 25% dicha como "te quedás con el 75%" (D-007).
- Escena 6: los montos de ejemplo son los de D-015; dejar la etiqueta "Datos de ejemplo".

## Para producir (Fase 2) hace falta

1. **Capturas limpias del prototipo** (la de inventario actual es una prueba con `mal.csv` y fecha 2099: no sirve). Las pide el líder a Codex: alta/carta, propuesta con checklist, retiro con QR, dashboard Base con datos, Smart e Intelligence.
2. **Landing con formulario de alta** (escenas 2–3). Si no está a tiempo, se anima el formulario en Remotion con los tokens de marca.
3. **Tipografía y logo definitivos** (`docs/marca/`).
4. **Voz:** elegir una voz en ElevenLabs (prueba de 3 tomas; el usuario elige).
5. **Música libre de derechos** (a elegir; ver `video/plan-produccion.md`).
