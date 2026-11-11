# Revisión de economics (borrador de trabajo)

Firma: claude-octi-lider · 2026-11-11
Base: los 8 archivos de Facundo (`Facundo Cambios/APROVECHO_Economics_CSVs/`) comparados con el Excel original (`docs/fuente/originales/ECONOMICS-APROVECHO.xlsx`).

**Importante:** esto es una nota interna de revisión, no el entregable. Lo que se entregue al profesor lo tiene que rehacer, entender y firmar el equipo con sus propias palabras. Yo no preparo nada para ocultar que se usó una IA; si la cátedra pide avisar el uso de IA, hay que avisarlo.

## 1. Qué cambió Facundo (CSV vs. Excel original)

| Cosa | Excel original | Facundo |
|---|---|---|
| Marketing 2027 | 16.000 | 58.100 (sin desglose en los archivos) |
| Marketing 2028–2031 | 18.000 / 12.000 / 12.000 / 12.000 | iguales |
| Nube y herramientas | 150 por mes en 2027 (1.800) | mismos totales, pero con nota: Supabase USD 25, Vercel USD 20, n8n EUR 20 |
| Fijos 2027 | 22.600 | 64.700 |
| EBITDA 2027 | −2.429 | −44.529 |
| Resultado neto 2027 | −13.983 | −56.083 |
| VAN | 17.004 | −15.381 |
| TIR | 36,7 % | 25,0 % |
| Payback | 3,9 años | 4,2 años |

Los 58.100 son el "nuevo plan comercial". **No dice de dónde sale cada parte.** Hay que armar el desglose (punto 4).

## 2. Errores o cosas mal aplicadas (ordenadas por importancia)

1. **Los aportes de capital quedaron viejos.** La hoja dice 34.661 / 31.981 / 45.969, que eran los del Excel anterior. Con los costos nuevos el flujo libre acumulado llega a **−154.711** al final de 2028. O sea, hace falta juntar unos **USD 154.700**, no 112.611. Por eso la caja de 2027 da −42.100 y la de 2028 da 0,37: no cierra.
2. **Impuesto a las Ganancias sin descontar las pérdidas.** El modelo cobra 35 % en 2029 sobre todo el resultado de ese año. Pero 2027 y 2028 dan pérdida (−95.214 en total) y la ley deja restar las pérdidas de hasta 5 años después de las ganancias (Ley 20.628, art. 25; resolución ARCA, fuente en el punto 3). Si se resta, en 2029 no se paga nada y en 2030 se paga menos. Cálculo mío con los números de Facundo (tasa 35 % como en el plan):

| | Como está | Restando pérdidas |
|---|---|---|
| Impuesto 2029 | 22.281 | 0 |
| Impuesto 2030 | 63.258 | 52.214 |
| VAN (30 %) | −15.381 | −1.373 |
| TIR | 25,0 % | 29,6 % |
| Payback | 4,16 años | 4,01 años |

3. **Tasa del 35 % fija.** Para sociedades hoy hay una escala de 25 %, 30 % y 35 % según cuánto se gana (ley 27.630). Con las ganancias de este modelo caería en el tramo más alto, así que 35 % sirve, pero hay que decir por qué.
4. **Posible doble conteo de la publicidad.** El costo de conseguir un usuario (USD 0,64) ya incluye la publicidad paga (USD 1 por instalación). Si los 58.100 de marketing también incluyen pauta, se está contando dos veces. Hay que separar: pauta (va en adquisición) vs. todo lo demás (va en fijos).
5. **Ingresos 2027 con 12 meses de abonos** aunque Smart e Intelligence arrancan a mitad de año y son pilotos (ya estaba anotado como C5 en `docs/fuente/09`). Pasa de 71.236 a unos 57.100 si se cuentan 9 y 6 meses.
6. **Estaciones: se compran todas de nuevo cada año** (decisión D-025 del CFO) pero se amortizan en 3 años. Si se reemplazan cada año, se amortizan en 1. Una de las dos cosas está mal.
7. **El VAN y la TIR con año 0 = 2026 y flujos al final de cada año.** Está bien como convención, pero hay que escribirla. El WACC de 30 % no tiene fuente: hay que decir cómo se eligió (por ejemplo, tasa de plazo fijo o bonos en pesos más un recargo por riesgo).
8. **LTV sin descontar.** Suma márgenes de 3,3 a 5 años como si valieran lo mismo hoy. Con un descuento del 30 % anual el LTV baja bastante. Además el LTV de Smart usa 5 años cuando la baja anual que ellos mismos asumen es 15 %: 1/0,15 = 6,7, y lo cortaron en 5. Está bien cortar, pero hay que decirlo.
9. **El CAC de Smart e Intelligence cuenta 1 y 3 meses del ejecutivo.** No hay dato que lo respalde (es un supuesto).
10. **Archivo 05 (amortizaciones):** las filas están corridas un año (muestra 11.554 en 2026). Los totales del Estado de Resultados sí están bien (11.554 en 2027, etc.). Solo hay que acomodar la tabla.
11. **Comisión de Mercado Pago 3,39 %.** Es una cifra que aparece en notas de prensa sobre lo que cobraba a los comercios; hoy hay tarifas distintas según cómo pague el cliente (QR con saldo ≈ 0,8 % + IVA, tarjeta de crédito entre 4,19 % y 5,99 % + IVA). Ver fuentes. Conviene decir qué mezcla de pagos se supone.
12. **IVA.** Nadie dice si los USD 300 / 800 y la comisión llevan IVA (ya estaba como A8). Si no lo llevan, a APROVECHO le queda un 17 % menos.
13. **Débitos y créditos (1,2 %)** se aplica sobre lo que cobra APROVECHO (la comisión), pero el impuesto pasa por todo el dinero que mueve la cuenta, incluida la parte del comercio. Hay que revisarlo con el contador.

## 3. Fuentes de cada costo

Estado: **Verificado** = lo encontré en una página; **Parcial** = hay datos pero no coinciden; **Sin fuente** = hay que conseguirla antes de entregar.

| Costo | Valor en el modelo | Fuente | Estado |
|---|---|---|---|
| Precio del pack | USD 3,99 | Promedio de Too Good To Go (ver plan, sección 16) | Parcial: falta precio local (Cheaf, Buen Provecho) |
| Packs por usuario | 1,3 por año | TGTG: 156 M comidas / 120 M usuarios (plan) | Parcial: el informe 2024 habla de 135,5 M comidas y más de 100 M usuarios; hay que recalcular |
| Packs por comercio | 608 por año | TGTG 2023: 121.686.720 comidas / 200.000 comercios | Verificado (comidas); comercios, a confirmar |
| Mercado Pago | 3,39 % | iProfesional (nota sobre BCRA y comisiones); tarifas actuales en la página de Mercado Pago | Parcial |
| Supabase | USD 25 por mes | Página de precios de Supabase | Verificado |
| Vercel | USD 20 por mes | Página de precios de Vercel | Sin fuente (no la pude abrir) |
| n8n | EUR 20 por mes | Página de precios de n8n | Sin fuente (no la pude abrir) |
| Visión por foto | USD 0,01 por foto | Precio de la API que se use (Gemini u otra) | Sin fuente |
| Impuestos 6,2 % | IIBB 5 % + 1,2 % | Código Fiscal CABA / alícuota de IIBB para la actividad | Sin fuente |
| Ganancias | 35 % | Ley 27.630 (escala 25–35 %) | Parcial |
| Quebrantos | no se usan | Ley 20.628 art. 25, resolución ARCA | Verificado |
| Tipo de cambio | ARS 1.530 | Banco Nación, 16/09/2026 | Sin fuente en el repo (guardar captura) |
| Bolsas | ARS 330 | Presupuesto de proveedor | Sin fuente |
| Sticker | ARS 6.000 | Presupuesto de imprenta | Sin fuente |
| Sueldos | USD 1.850 y 1.000 por mes | Guía salarial o aviso de empleo | Sin fuente |
| Influencers | no están en el modelo | Coderhouse: micro entre USD 150 y 600 por publicación; nano ARS 30.000–80.000. Influee: desde USD 82 | Parcial |
| Estación (USD 523) | balanza, tablet, cable, hub, soporte | Links de cada pieza | Sin fuente |
| Inversiones de plataforma | 18.000 / 8.000 / 2.500 / 2.500 | Presupuestos | "Estimaciones del equipo": pedir al menos 2 presupuestos o decir que es un supuesto |

Links usados:
- Mercado Pago / BCRA: https://www.iprofesional.com/finanzas/342352-comercios-mercado-libre-y-bcra-pelean-por-comisiones-de-tarjetas
- Tarifas Mercado Pago 2026 (herramienta de terceros): https://app.spomsolutions.com/herramientas/comisiones-mercado-pago-2026
- Mercado Pago QR (oficial): https://www.mercadopago.com.ar/herramientas-para-vender/cobrar-con-qr
- Supabase: https://supabase.io/pricing
- Too Good To Go, informe de impacto: https://www.toogoodtogo.com/en-ca/impact-report
- Quebrantos (ARCA): https://www.consejosalta.org.ar/wp-content/uploads/ARCA-5684.pdf
- Ley 20.628 art. 25: https://siap.blogdelcontador.com.ar/normativa/ley-20-628-t-o-2019-articulo-25-compensacion-de-quebrantos-con-ganancias/
- Influencers: https://www.coderhouse.com/ar/coderlibrary/marketing-influencers-ia-argentina y https://influee.co/ar/blog/instagram-influencer-pricing

Las páginas de terceros no son una fuente fuerte para un trabajo de facultad: antes de entregar hay que abrir cada página oficial y anotar la fecha de consulta.

## 4. Plan comercial: qué hay que costear

El plan (sección 13) nombra todo esto y **ninguno tiene precio en el documento**. Lista de lo que falta, con el dato a conseguir. No puse números inventados.

| Acción del plan | Qué hay que cotizar | Va en |
|---|---|---|
| Sticker de vidriera con QR | Precio por unidad × comercios nuevos | Adquisición de comercio (ya está: ARS 6.000) |
| Bolsas con la marca | Precio por unidad × bolsas por comercio | Adquisición de comercio (ya está) |
| Cartel de caja con QR | Imprenta | Adquisición de comercio: **falta** |
| Flyer para comercios | Imprenta por millar | Marketing: **falta** |
| Activaciones en universidades y ferias | Permiso, mesa, roll-up, personal, bonificaciones de bienvenida | Marketing: **falta** |
| Beneficio de bienvenida | Hoy el mockup dice "50 % OFF en la primera compra" y el modelo no lo costea (A3) | Adquisición de usuario: **falta** |
| Influencers (3 perfiles nombrados) | Tarifa de cada uno por publicación | Marketing: **falta** |
| Pauta georreferenciada | Costo por instalación en Argentina | Ya está como USD 1 por instalación (sin fuente) |
| Equipo de calle | Sueldo o comisión por comercio | Adquisición de comercio (USD 27, sin fuente) |
| Referidos de comercios (B2B) | Qué beneficio recibe | **Falta** |
| Pack gratis cada 10 | Ya está (0,15 por pack) | Variables |
| Calendario (Hot Sale, Día de la Madre...) | Descuento extra en esas fechas | **Falta** |

**Pregunta para Octavio y Facundo:** ¿de dónde salen los USD 58.100? Si ya tienen el desglose, pasenlo y lo cargo. Si no, hay que armarlo con las filas de arriba y que la suma dé ese número (o el que corresponda).

## 5. Qué sigue (propuesta)

1. Que Facundo pase el desglose de los 58.100.
2. Corregir los aportes de capital y recalcular caja, VAN, TIR y payback (arreglo 1).
3. Decidir si se restan las pérdidas del impuesto (arreglo 2) y escribir el motivo.
4. Conseguir las fuentes que dicen "Sin fuente" abriendo cada página oficial y anotando la fecha.
5. Decidir el criterio de las estaciones (1 o 3 años).
6. Rehacer la planilla y el texto entre el equipo, con sus palabras.
