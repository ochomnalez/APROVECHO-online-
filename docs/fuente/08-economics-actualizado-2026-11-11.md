# Economics actualizado · 2026-11-11

Fuente principal proporcionada por Octavio: `originales/ECONOMICS-APROVECHO-actualizado-2026-11-11.xlsx` (archivo adjunto original `33333333333.xlsx`). Esta versión prevalece para la actualización de Inversores v5 frente al extracto anterior `08-economics.md`; no se modifican los datos históricos de esa versión ni la landing v4.

Son **proyecciones para Argentina en USD**, no resultados. Se usan las celdas calculadas guardadas en el Excel. No se modificaron fórmulas ni supuestos del libro.

## Resultados y proyección

| USD, salvo indicación | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---:|---:|---:|---:|---:|
| Ingresos | 71.236 | 213.739 | 460.846 | 655.124 | 856.857 |
| Costos operativos | 122.605 | 233.177 | 356.948 | 400.789 | 468.785 |
| EBITDA | −51.369 | −19.438 | 103.899 | 254.335 | 388.072 |
| Resultado neto | −62.931 | −40.851 | 47.497 | 142.337 | 223.028 |

Costos operativos = variables + adquisición + fijos + sueldos de fundadores. No incluyen amortizaciones, Ganancias ni inversiones. Corresponden a las filas 5, 8, 9 y 10 del EERR. La diferencia con los ingresos coincide con EBITDA.

| FCF acumulado (USD) | 2026 | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---:|---:|---:|---:|---:|---:|
| Acumulado | −34.686 | −115.607 | −163.287 | −133.234 | −13.889 | 254.092 |

- Necesidad de financiamiento: USD 163.287 (déficit acumulado máximo en 2028, antes de aportes). Los aportes redondeados de 2026–2028 también suman USD 163.287.
- Inversión total 2026–2031: USD 199.097; inicial 2026: USD 34.686.
- Payback: 4,0518 años desde 2026, durante 2031; se muestra 4,1 años.
- VAN: USD 2.494; TIR: 30,7%; WACC: 30%.
- Equilibrio operativo: ingresos superan el punto de equilibrio desde 2029.
- Contribución por pack: USD 0,502584 (se muestra USD 0,50), antes de adquisición, fijos y sueldos. Margen de contribución global: 71,2% → 75,8%.

## Unit economics

| Segmento | LTV USD | CAC USD | LTV/CAC | Meses de recuperación |
|---|---:|---:|---:|---:|
| Usuario | 2.18 | 0.64 | 3.39 | 11.81 |
| Comercio Base | 198.88 | 69.67 | 2.85 | 14.01 |
| Smart | 16762.33 | 1773.00 | 9.45 | 6.35 |
| Intelligence | 43102.33 | 3973.00 | 10.85 | 5.53 |

Permanencia 3,333 años en usuario y Base (bajas del 30%); máximo de 5 años en Smart e Intelligence (15% y 10% de bajas). Se conservan los CAC completos de las celdas C9:F9, incluidos sus componentes de comercialización e instalación; no se sustituyen por los costos directos de alta.

## Sensibilidad

| Escenario (uno a la vez) | VAN USD | TIR |
|---|---:|---:|
| Usuarios activos: −10% | −2.444 | 29,3% |
| Bajas anuales: 40% | −10.846 | 26,8% |
| Usuarios por publicidad paga: 45% | −17.436 | 25,0% |

## Supuestos y trazabilidad

- Precio de pack USD 3,99; comisión 25%; 1,3 packs/usuario/año; bajas generales 30%.
- IIBB 4% + débitos y créditos 1,2% = 5,2% sobre lo cobrado (reemplaza el 6,2% antiguo); Ganancias 35%; ARS 1.530/USD.
- Smart USD 300/mes; Intelligence USD 800/mes/sucursal. El libro sigue computando 12 meses de abonos en 2027: se conserva la aclaración de que no prorratea los pilotos del roadmap.
- Marketing 2027: USD 58.100. Sueldos de fundadores: cero en 2027; USD 48.000 anuales desde 2028.
- Inversión inicial incluye USD 3.661 de estaciones y USD 25 de alta en Play Store, además de los cuatro rubros existentes. Se conserva el supuesto de renovación anual de estaciones y el cronograma de amortización del libro, sin corregirlos por cuenta propia.
- TAM/SAM/SOM y cantidades de clientes proyectados permanecen iguales. Se retiran los importes de mercado potencial en dólares del contenido anterior porque el nuevo libro presenta esos mercados en cantidades de comercios/personas; no se inventan nuevos importes.
- Encuestas, contexto ambiental, equipo y roadmap se conservan; no son actualizados por el Excel.
- Google Doc indicado por el usuario: lectura Docs rechazada con 403 PERMISSION_DENIED y Drive con 404; no se atribuye ninguna lectura ni dato nuevo a ese documento. El usuario indicó que el Excel es la fuente más completa y primaria, por lo que no bloquea el trabajo.
- Snapshot de cifras y referencias exactas de celdas: `landing/src/v5/investor-economics.json`. El SHA-256 del libro está en ese archivo. Se verificaron independientemente las identidades de EBITDA, FCF acumulado, VAN, TIR y payback.
