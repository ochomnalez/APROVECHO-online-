# Otros costos variables: impuestos y estaciones (versión simplificada)

Firma: claude-octi-lider · consulta: 11/11/2026
Decisión de Octavio (11/11): usar 6 % de impuestos como suma simplificada, y que el único costo variable de las estaciones sea de inteligencia artificial.

## 1. Impuestos sobre lo que cobramos: 6 %

Es la suma simplificada de Ingresos Brutos (5 %) y el impuesto a los débitos y créditos (1,2 %): 6,2 %, redondeado a 6 %. El modelo hoy usa 6,2 %; con 6 % los impuestos bajan 0,2 puntos (en 2031, unos USD 1.700 menos).

Fuentes oficiales:

| Impuesto | Norma | Link oficial |
|---|---|---|
| Ingresos Brutos (CABA) | Ley 6927, Ley Impositiva 2026 de la Ciudad de Buenos Aires (el cuadro de alícuotas está en el anexo) | https://boletinoficial.buenosaires.gob.ar/normativaba/norma/829857 |
| | Anexo con las alícuotas por actividad | https://documentosboletinoficial.buenosaires.gob.ar/publico/PL-LEY-LCABA-LCBA-6927-25-ANX.pdf |
| | Código Fiscal de la Ciudad (Ley 6505): define quién paga y cómo | https://imagenes.agip.gob.ar/normativa/inicio (normativa de la AGIP) |
| Débitos y créditos | Decreto 380/2001, art. 7 (texto actualizado): 6 por mil en cada débito y 6 por mil en cada crédito | https://www.argentina.gob.ar/normativa/nacional/decreto-380-2001-66561/actualizacion |
| | Ley 25.413, que crea el impuesto | https://www.argentina.gob.ar/normativa/nacional/ley-25413-66533/texto/1000 |

Para aclarar en el texto:
- La alícuota de Ingresos Brutos depende de la actividad y del tamaño de facturación. En el texto de la ley hay que buscar el código de la actividad en el anexo; no lo pude leer completo, así que el 5 % queda como valor simplificado.
- Se usa el 6 % como estimación; no se descuenta el IVA ni lo que se pueda restar del impuesto a las Ganancias. Se dice así: "estimamos un 6 % de impuestos sobre lo que cobramos".

## 2. Estación Smart: costo de inteligencia artificial (Codex)

La idea: la estación Smart usa un servicio de inteligencia artificial (Codex, de OpenAI) para controlar la tablet y dar asistencia cuando algo falla. Para ponerle precio se toma lo que cuesta ese servicio por mes, como estimación.

| Referencia | Precio | Link oficial |
|---|---|---|
| ChatGPT Plus (incluye Codex) | USD 20 por mes | https://learn.chatgpt.com/docs/pricing |
| ChatGPT Business, por usuario (incluye Codex) | USD 20 por mes pagando el año; USD 25 mes a mes (mínimo 2 usuarios) | https://learn.chatgpt.com/docs/pricing |
| ChatGPT Pro (incluye Codex, más uso) | USD 100, 200 o 500 por mes | https://learn.chatgpt.com/docs/pricing |

(La dirección https://developers.openai.com/codex/pricing redirige a esa misma página.)

Estimación para la planilla: **USD 20 por mes** por estación Smart (el precio del plan Plus). Hoy la planilla tiene USD 15; sube USD 5.

Lo que no pude confirmar: el precio por uso de la API de OpenAI (la página oficial https://openai.com/api/pricing me dio error 403). Cuando una empresa mete la herramienta dentro de su propio producto, lo normal es pagar por uso con la API y no con un plan. Falta abrir esa página para ver cuánto sería. Si me pasás los precios, hago la cuenta de control.

## 3. Estación Intelligence: costo de inteligencia artificial

Lo mismo que Smart (Codex en la tablet) más lo que procesa la inteligencia artificial para las predicciones, los avisos y las recomendaciones.

| Parte | Estimación por mes | Cómo sale |
|---|---|---|
| Asistente de la tablet (igual que Smart) | USD 20 | Precio del plan Plus |
| Predicciones, avisos y recomendaciones | USD 25 | Supuesto del equipo (hoy son USD 30 de "procesamiento") |
| **Total** | **USD 45** | Igual que ahora |

El USD 25 queda como supuesto hasta tener los precios de la API.

## Cambios que implican en la planilla

| Línea | Antes | Ahora |
|---|---|---|
| Impuestos | 6,2 % | 6 % |
| Estación Smart por mes | USD 15 (conectividad y soporte) | USD 20 (inteligencia artificial, Codex) |
| Estación Intelligence por mes | USD 45 (15 + 30 de procesamiento) | USD 45 (20 + 25 de inteligencia artificial) |

Efecto sobre los costos de 2031 (72 clientes Smart): sube USD 4.320 por año. Intelligence no cambia.

## Para revisar
- La conectividad (SIM o wifi) y el bloqueo de la tablet ya no están en el costo. Si se saca la conectividad, hay que decir que el comercio pone su wifi.
- **Codex ya está en los costos fijos** (línea "Codex", USD 480 por año = dos planes Plus). Si ahora también es el costo de cada estación, hay que aclarar cuál es cuál: el del equipo que desarrolla y mantiene la plataforma (fijo) y el del servicio que usa cada estación (variable). Si no, se cuenta dos veces.
- Soporte técnico: ya aparece como "Equipo de Soporte" en los costos fijos; con este cambio no se cuenta dos veces.
