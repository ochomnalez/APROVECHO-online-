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

## 2. Estación Smart: costo de inteligencia artificial

La idea: la estación Smart tiene un asistente de inteligencia artificial que ayuda a controlar la tablet y a dar asistencia cuando algo falla. Para ponerle precio se toma lo que cuesta un servicio de ese tipo por mes, como estimación.

| Referencia | Precio | Link |
|---|---|---|
| Plan individual de Claude (Pro) | USD 20 por mes (USD 17 por mes pagando el año) | https://claude.com/pricing |
| Plan de equipo de Claude, puesto estándar | USD 25 por mes (USD 20 pagando el año) | https://claude.com/pricing |

Estimación para la planilla: **USD 20 por mes** por estación Smart (hoy la planilla tiene USD 15; sube USD 5).

Aclaración que conviene saber: los planes de arriba son para que una persona use el asistente. Cuando una empresa lo mete dentro de su propio producto, se paga por uso con la API. Los planes sirven acá como referencia de precio. Cuenta con la API para ver si USD 20 alcanza (los supuestos son míos):
- 300 consultas por mes, cada una con 2.000 unidades de entrada y 500 de salida.
- Modelo chico (Claude Haiku 5.5, USD 0,10 por millón de entrada y USD 0,50 por millón de salida): USD 0,14 por mes.
- Modelo mediano (Claude Sonnet 5.5, USD 2 y USD 10): USD 2,70 por mes.
- Precios: https://platform.claude.com/docs/en/about-claude/pricing

Los USD 20 quedan muy por arriba del gasto estimado. Es prudente.

## 3. Estación Intelligence: costo de inteligencia artificial

Lo mismo que Smart (el asistente de la tablet) más lo que procesa la inteligencia artificial para las predicciones, los avisos y las recomendaciones.

| Parte | Estimación por mes | Cómo sale |
|---|---|---|
| Asistente de la tablet (igual que Smart) | USD 20 | Referencia de precio del plan |
| Predicciones, avisos y recomendaciones | USD 25 | Supuesto de la planilla (hoy son USD 30 de "procesamiento"); abajo la cuenta de control |
| **Total** | **USD 45** | Igual que ahora |

Cuenta de control con la API (supuestos míos): 1 informe por día de 30.000 unidades de entrada y 3.000 de salida, y 20 avisos por día de 2.000 de entrada y 300 de salida.
- Modelo chico (Haiku 5.5): USD 0,34 por mes.
- Modelo mediano (Sonnet 5.5): USD 6,90 por mes.

Los USD 25 también quedan por arriba. Se puede decir que es un margen para sucursales con mucho movimiento y para usar el modelo más caro cuando haga falta.

## Cambios que implican en la planilla

| Línea | Antes | Ahora |
|---|---|---|
| Impuestos | 6,2 % | 6 % |
| Estación Smart por mes | USD 15 (conectividad y soporte) | USD 20 (inteligencia artificial) |
| Estación Intelligence por mes | USD 45 (15 + 30 de procesamiento) | USD 45 (20 + 25 de inteligencia artificial) |

Efecto sobre los costos de 2031 (72 clientes Smart): sube USD 4.320 por año. Intelligence no cambia.

## Para revisar
- La conectividad (SIM o wifi) y el bloqueo de la tablet ya no están en el costo. Si se saca la conectividad, hay que decir que el comercio pone su wifi.
- Soporte técnico: ya aparece como "Equipo de Soporte" en los costos fijos; con este cambio no se cuenta dos veces.
