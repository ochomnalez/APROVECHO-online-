# Otros costos variables: impuestos y estaciones (justificación)

Firma: claude-octi-lider · consulta: 11/11/2026
Base: planilla (impuestos 6,2 %; estación Smart USD 15 por mes; estación Intelligence USD 45 por mes) y entregable (sección 16.2).

## 1. Impuestos sobre lo que cobramos: 6,2 %

El modelo lo aplica sobre los ingresos totales (comisión + abonos).

| Parte | Valor | Qué encontré | Fuente | Estado |
|---|---|---|---|---|
| Ingresos Brutos | 5 % | CABA 2026: 5,5 % para gestión de cobros y pagos digitales; 3 % o 5 % para comercio electrónico según facturación; 3 % la alícuota general. Provincia de Buenos Aires: la alícuota está en la Resolución Normativa ARBA 16/2026 (cuadro de actividades), no pude abrirla | CABA: https://www.derechoenzapatillas.com/2026/codigo-fiscal-y-ley-impositiva-caba-2026/ · PBA: https://www.arba.gov.ar | Parcial |
| Débitos y créditos | 1,2 % (6 por mil en cada débito y cada crédito) | Ley 25.413 y decretos reglamentarios | https://www.argentina.gob.ar/normativa/nacional/ley-25413-66533/texto/1000 | Parcial (falta confirmar que siga igual en 2026) |

Para justificar:
- **El 5 % está entre dos valores de CABA** (3 % y 5,5 %). Las zonas de lanzamiento son CABA, Tigre, San Isidro y Pilar: tres están en provincia de Buenos Aires. Si la empresa vende en más de una jurisdicción, el impuesto se reparte entre ellas (Convenio Multilateral). Esto no lo verifiqué: hay que preguntarle al contador qué alícuota le toca a la actividad "intermediación por comisión".
- **El 1,2 % no es del todo un costo.** Un porcentaje de ese impuesto se puede descontar del impuesto a las Ganancias: el 33 % en general, el 60 % para algunas pymes medianas y el 100 % para micro y pequeñas con certificado MiPyME (el 100 % estaba extendido hasta el 31/12/2025 y no pude confirmar si siguió). Fuente: https://www.arca.gob.ar/creditosyDebitos/casos-especiales/computo-en-ganancias.asp (leída en el buscador, la página no la abrí). El modelo no descuenta nada, así que es prudente.
- **A quién se le cobra:** como Mercado Pago reparte el 75/25 directamente, a APROVECHO le llega solo su parte. Por eso tiene sentido aplicar el 6,2 % a lo que cobra APROVECHO y no al total del pack. Está dicho en 13.x / sección de pagos del entregable.
- **IVA:** no está en el 6,2 %. Si las comisiones y los abonos llevan IVA, hay que decirlo (ya estaba como A8 en `docs/fuente/09`).

## 2. Estación Smart: USD 15 por mes ("conectividad y soporte")

El entregable no desglosa el USD 15. Una forma de justificarlo, con precios que encontré (en pesos al dólar de 1.530):

| Parte | Cuánto | Fuente | Estado |
|---|---|---|---|
| Datos móviles para la tablet (SIM) | ARS 10.300 (6 GB) a 13.000 (12 GB) por mes = USD 6,7 a 8,5 | iProfesional, planes prepagos Tuenti: https://www.iprofesional.com/servicios/447190-ni-claro-ni-personal-cual-es-empresa-celular-mas-barata-argentina-2026 | Parcial: es prepago de celular, no un plan para tablet; verificar en el operador |
| Bloqueo de la tablet para que solo abra APROVECHO (kiosco) y control a distancia | USD 2 a 3,20 por equipo por mes. Hexnode: de USD 2,20 (Pro) a USD 3,20 (Enterprise, con kiosco avanzado); Scalefusion desde USD 2 (mínimo 10 equipos) | https://www.hexnode.com/blogs/how-much-does-kiosk-management-software-cost/ y https://blog.scalefusion.com/mdm-pricing/ | Parcial: precios de terceros; verificar en cada página |
| Soporte | El resto: USD 3,3 a 6,3 | — | Supuesto |

Suma de lo que sí tiene fuente: USD 8,7 a 11,7. El resto hasta 15 es soporte y quedan USD 3 a 6, que no tienen fuente: hay que decir que es supuesto.

Ojo con dos cosas:
- **Doble conteo posible:** el soporte técnico ya aparece como "Equipo de Soporte" (USD 1.000 por mes por persona) en los fijos. Si el USD 15 incluye horas de soporte, se cuenta dos veces. Conviene dejarlo como "conectividad y control del equipo" y no como soporte.
- **Reposición de equipos:** si un equipo falla, se reemplaza (13.x / riesgo 8). Eso ya está en las inversiones (las estaciones se compran de nuevo cada año), no va en el USD 15.
- Si el comercio pone su wifi, la SIM no hace falta y el costo baja a USD 2 a 3.

## 3. Estación Intelligence: USD 45 por mes (15 + 30 de procesamiento)

El entregable dice "USD 30 para procesar los análisis y las predicciones". No hay fuente. Una forma de chequearlo:

- Procesar una foto cuesta entre USD 0,003 y 0,005 (cuenta de `servicio-nube-equipo-y-costos-por-pack.md`, con precios de Google).
- Con USD 30 por mes se pueden procesar **entre 5.500 y 11.000 fotos por mes** (180 a 370 por día), si todo el gasto fuera lectura de fotos.
- Una sucursal con balanza y cámara que pesa unas 100 cosas por día usa unos USD 9 a 15 por mes. El resto cubriría guardar datos y calcular recomendaciones y predicciones.

Lo que hay que decir: la cantidad de pesadas por día es un supuesto del equipo. Es un valor razonable pero no hay fuente. Se puede reemplazar con datos del piloto de 2027.

**Ojo:** Smart también pesa y saca fotos de todo el excedente (según el entregable), pero el modelo no le asigna costo de procesamiento. Podría quedar corto o hay que aclarar que Smart lee menos fotos.

## Resumen para poner en el texto

| Línea | Fuente que se puede citar | Queda como supuesto |
|---|---|---|
| Ingresos Brutos 5 % | Ley Impositiva CABA 2026 (3 % a 5,5 %) y RN ARBA 16/2026 | Qué alícuota exacta le toca |
| Débitos y créditos 1,2 % | Ley 25.413 | Que no se descuente de Ganancias |
| Smart USD 15 | Plan de datos (iProfesional) y MDM (Hexnode, Scalefusion): USD 9 a 12 | USD 3 a 6 restantes |
| Intelligence +USD 30 | Precio por foto (Google) | Pesadas por día y qué cubre lo demás |
