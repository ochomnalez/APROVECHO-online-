# Nube del equipo y costos por pack

Firma: claude-octi-lider · consulta: 11/11/2026

## A. Servicio de nube para el equipo de trabajo

Qué hace falta: correo con el dominio, documentos compartidos y lugar donde guardar archivos.

| Opción | Por usuario por mes | 4 personas por año | Fuente | Observaciones |
|---|---|---|---|---|
| Google Workspace Business Starter | USD 7 pagando el año; USD 8,40 mes a mes | USD 336 (anual) o USD 403 (mensual) | https://knowledge.workspace.google.com/admin/billing/compare-flexible-and-annual-fixed-term-payment-plans?hl=es-419 y https://workspace.google.com/intl/es-419_ar/lp/business | Incluye correo, 30 GB por persona, Docs y videollamadas. Cifras de Google (documentación) y de terceros; confirmar en la página de precios |
| Microsoft 365 Business Basic | USD 7 pagando el año; USD 8,40 mes a mes (subió de USD 6 en julio 2026) | USD 336 (anual) o USD 403 (mensual) | https://costbench.com/software/communication/microsoft-365/discounts/ | Fuente de terceros; abrir la lista de Microsoft |
| Cuentas gratuitas de Google (Drive de 15 GB) | USD 0 | USD 0 | https://one.google.com/about/plans | No sirve para un equipo: sin correo propio ni control de quién ve qué |

**Lo que habría que poner:** Google Workspace, que es lo que ya usa el equipo. Lo que cambia es la cantidad de personas, porque se paga por usuario:

| | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|---|
| Personas (4 fundadores + ejecutivos + analistas + soporte; el medio analista de 2028 cuenta como 1) | 4 | 7 | 9 | 12 | 16 |
| USD por año (USD 84 por persona) | 336 | 588 | 756 | 1.008 | 1.344 |

La planilla tiene 540 fijos. Si se usa Workspace, 2027 queda en 336 y después sube.

## B. Costos por pack

| Costo | Valor del modelo | Cómo se calcula | Fuente | Estado | Observaciones |
|---|---|---|---|---|---|
| Visión artificial | USD 0,015 por pack (USD 0,01 por foto, 1,5 fotos) | Precio de la herramienta que lee la foto | Google, precios de Gemini: https://cloud.google.com/vertex-ai/generative-ai/pricing | Parcial | Google cobra 1.120 "unidades" de entrada por foto. Con USD 0,75 a 1,50 por millón de unidades y una respuesta de 500 unidades (supuesto mío), cada foto sale entre USD 0,003 y 0,005. El modelo pone 0,01: queda alto, o sea es prudente. Los precios de Google conviven con un precio de lanzamiento hasta el 31/12/2026; confirmar el vigente |
| Nube por pack | USD 0,01 | Guardar fotos y datos | Supabase: https://supabase.com/pricing | Parcial | El plan Pro incluye 100 GB de archivos y 250 GB de transferencia; después USD 0,021 por GB por mes y USD 0,09 por GB de transferencia. Con 1,5 fotos de unos 0,5 MB cada una (supuesto) y 20 vistas por pack, cada pack cuesta alrededor de USD 0,0016 (cuenta abajo). USD 0,01 es prudente |
| Devoluciones | USD 0,02 (0,5 % de USD 3,99) | 0,5 % de los packs se reintegra completo | Meta de calidad de la sección 13.8 del propio entregable ("reclamos con reintegro, menos del 0,5 % de los packs") | Es una meta, no una medición | Queda como supuesto del equipo. No encontré un dato de otra app. Revisar si Mercado Pago devuelve su comisión en un reintegro; si no, el costo es un poco más alto |
| Pack gratis | USD 0,15 | 10 packs pagos dan 1 gratis; APROVECHO le paga al comercio el 75 % (USD 2,99); la mitad se usa: 3,99 × 0,75 ÷ 10 × 0,5 | Regla: sección 13.1 del entregable. "La mitad se usa": Statista, con datos de Antavo, 49,8 % de los premios de programas de fidelidad se canjean (2023): https://statista.com/statistics/1448557/loyalty-programs-reward-redemption-rate-worldwide | Queda | Smile.io mide 13,67 % en comercios chicos (https://blog.smile.io/do-you-have-a-healthy-redemption-rate): con ese dato el costo baja. Si se canjearan todos sería USD 0,30. El 50 % es un punto medio razonable |

**Cuenta de la nube por pack (supuestos míos, sin fuente: 0,5 MB por foto y 20 vistas por pack):**
1. Peso guardado: 1,5 fotos × 0,5 MB = 0,75 MB.
2. Guardarlo un año: 0,00075 GB × USD 0,021 × 12 meses = USD 0,0002.
3. Que lo vean 20 veces: 20 × 0,75 MB = 15 MB = 0,015 GB × USD 0,09 = USD 0,0014.
4. Total: USD 0,0016 por pack. Dentro de los 100 GB y 250 GB que incluye el plan, el costo extra es cero. No incluye base de datos ni procesamiento.

**Cuentas de control:** 3,99 × 0,75 ÷ 10 × 0,5 = 0,1496. 3,99 × 0,005 = 0,0200.

## Qué falta
- Abrir la página oficial de Google (precios de Gemini) y la de Supabase y sacar captura con fecha.
- Decir en el texto cuántas fotos pesa un pack y cuántas veces se ve (los supuestos del cálculo de nube).
- Decidir si el modelo cambia de 0,015 y 0,01 a los valores calculados o los deja como margen de seguridad (la diferencia es de centavos).
