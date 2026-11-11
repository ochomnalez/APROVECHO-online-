# Auditoría del Excel (Octavio_ECONOMICS.xlsx) · 11/11/2026

Firma: claude-octi-lider. Revisé las 8 hojas, todas las fórmulas y los 18 gráficos.

## Errores que cambian el resultado

1. **Sueldos de personal sin multiplicar por 12** (Costos D39:H41). La fórmula es `=$L$35*D57` (sueldo por mes × cantidad), no por año. Ejecutivos, analistas y soporte quedan en 1/12 de su costo. Corrigiéndolo (probado con una copia): fijos 2028 pasan de 31.368 a 96.818; EBITDA 2028 de +418 a −65.032; VAN de +38.863 a −85.239; TIR de 40,8 % a 8,2 %; payback de 3,7 a 4,7 años; plata a conseguir de 150.949 a 243.349.
2. **Cantidades de personal que ya no coinciden con el entregable.** 2027 tiene 1 ejecutivo y 1 soporte (el entregable dice que en 2027 no hay personal pago); analistas 2 desde 2028 (el entregable dice 0,5).
3. **Sueldos cargados distintos en cada lugar.** L35:L37 = 1.750, 1.750 y 700; las etiquetas dicen 1.850 y 1.000; LTV y CAC (E9, F9) usa 1.850 fijo; el vendedor de calle usa 1.350 (D9).
4. **Intelligence (C12) sigue en `=15+30`** pero la etiqueta dice "20 + 25", y Smart (C11) está en 10 (la etiqueta de Intelligence sugiere 20). Si Smart es 10, Intelligence debería ser 35; si Smart es 20, 45.
5. **Supabase (fila 34 y 48).** La cantidad crece con `(nuevos − nuevos del año anterior) ÷ nuevos del año actual`, que no es crecimiento (el denominador debe ser el año anterior; da 49,6 % en vez de 98 % en 2028), usa usuarios nuevos y no activos, y da suscripciones fraccionarias (1,5; 2,2). En 2030 el crecimiento es negativo y baja el costo.
6. **Filas de cantidad que no se usan.** Vercel (49), n8n (50) y Codex (52) tienen cantidades, pero las fórmulas (35, 36, 37) las ignoran. Google Workspace (51) cuenta 1 o 2 personas aunque el equipo tiene 4 fundadores más los empleados.
7. **Amortizaciones desfasadas.** En Inversiones cada compra empieza a amortizarse el mismo año; el EERR toma cada columna con un año de corrimiento (2027 usa la columna 2026). La columna 2031 (35.539) nunca se usa. Además las estaciones se compran de nuevo cada año (D-025) pero se amortizan en 3 años.
8. **Ingresos medidos al cierre del año.** Packs = usuarios al cierre × 1,3; abonos = clientes al cierre × 12 meses. Sobrestima 2027 (Smart e Intelligence son pilotos que arrancan a mitad de año) y los años de más crecimiento. LTV, en cambio, usa el promedio de comercios (C3).
9. **Instalaciones nuevas sin bajas** (Modelo de demanda fila 15): solo cuenta el aumento neto, pero LTV supone bajas de 15 % y 10 %.
10. **Caja con fórmulas distintas por columna** (EERR filas 35 y 36): D36 `=D35+C36`, F35 es 0 escrito a mano, F36 `=F33`. Hoy da bien por casualidad (todo cae a ~0). Los aportes de capital (fila 32) están escritos a mano y no se actualizan.
11. **CAC del usuario (0,64)** no incluye el marketing fijo (58.100 en 2027); con todo el presupuesto de usuarios son unos USD 2,65. **CAC del comercio Base** suma `0,5 × 1.350 × 12 ÷ 300` = 27 sin fuente ni explicación.
12. **Marketing.** D42 suma `+100` sin explicación (relleno para llegar a 58.100). 2028 es 18.000 (1.500 × 12) y el entregable (13.8) dice unos 54.000.
13. **Impuesto a las Ganancias** sin restar las pérdidas de 2027 y 2028, y tasa fija de 35 %.
14. **Gráfico roto:** "Costos fijos por concepto" tiene una serie con `#REF!`.

## Etiquetas y datos desactualizados
- Costos B3 dice "3,39 %" y el valor es 6,29 %; C10 está en 6,2 % (la decisión era 6 %).
- L33 "google cloude" es en realidad Workspace (y su link también). B35 "Vercel (dominio web)": es el hosting. B36 "N8N (integración de IA)": es automatización.
- B2B "Zona de lanzamiento (CABA, V. López, San Isidro, Pilar)": el entregable dice Tigre.
- Inversiones C11: Play Store USD 25 en 2026; Apple (USD 99) aparece en Costos desde 2027 pero no en 2026.
- Visión por foto: 0,015 (antes 0,01).

## Demanda y mercado
- SOM B2B: la fórmula toma 8,4 % de la zona (525), pero el entregable también habla de "1 de cada 5" de los 2.560 interesados (20,5 %).
- SOM B2C 26.247 está escrito a mano; 1,25 % de 2.104.906 sería 26.311. Es "se descargan la app", pero después se trata como usuarios activos que compran 1,3 packs.
- Clientes 2028 a 2031 escritos a mano; mercado de 2028 en adelante escala por población (8.748.045 / 4.096.741), sin fuente en la hoja.
- 1,3 packs por usuario sale de usuarios registrados de Too Good To Go, no de activos.

## LTV y punto de equilibrio
- LTV sin descontar; tope de 5 años (Smart a 15 % de bajas daría 6,7).
- Smart suma los packs de un comercio Base (118,7) además del abono.
- Punto de equilibrio trata la adquisición como costo fijo y no incluye amortizaciones.
- VAN con tasa de 30 % sin fuente.
