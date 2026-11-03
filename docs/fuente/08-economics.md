# 08 · Economics (proyección 2027–2031)

> Fuente: sección 16 del plan y Excel `originales/ECONOMICS-APROVECHO.xlsx` (8 hojas: Costos, TAM SAM SOM B2B, TAM SAM SOM B2C, Modelo de demanda, Inversiones, EERR y flujo de fondos, LTV y CAC, Gráficos). Volcado de celdas y fórmulas en `texto-original/economics-celdas-y-formulas.txt`.
> Alcance: **solo Argentina, en USD**. La expansión internacional del roadmap **no está incluida** y necesitaría su propio financiamiento. Son números preliminares; cuando falta un dato real se usa un supuesto del equipo.

## Supuestos principales

| Supuesto | Valor | Origen |
|---|---|---|
| Precio promedio del pack | USD 3,99 | Too Good To Go |
| Comisión | 25% (75% para el comercio) | Plan |
| Packs por usuario por año | 1,3 | Too Good To Go (156 M de comidas / 120 M de usuarios) |
| Capacidad por comercio | 608 packs/año | Too Good To Go (121,7 M / 200.000 comercios) |
| Bajas (churn) | 30% anual de comercios y usuarios; 15% Smart y 10% Intelligence en el cálculo del LTV | Supuesto del equipo, a medir en 2027 |
| Tipo de cambio | ARS 1.530 por USD | BNA, 16/09/2026 |
| Impuestos sobre lo cobrado | 6,2% (IIBB 5% + débitos y créditos 1,2%) | Plan |
| Impuesto a las Ganancias | 35% desde que hay resultado positivo (2029) | Plan |
| WACC | 30% | Excel |
| Amortización | 3 años por inversión | Excel |

## 16.1 Demanda y ventas

| Paso | Comercios | Usuarios |
|---|---|---|
| TAM LatAm | 2.365.746 | 336.800.000 |
| SAM Argentina | 70.126 | 23.600.000 |
| Zona de lanzamiento | 6.260 | 4.096.741 habitantes |
| Filtros de la encuesta | 4.025 con sobrante 3 días/semana (64,3%) → 2.560 dispuestos a probar (63,6%) | 3.007.008 mayores de 18 (73,4%) → 2.104.906 con billetera (70%) → 848.277 comprarían con 50% off (40,3%) |
| **Mercado inicial posible** | **2.560** | **848.277** |
| **SOM 2027** | **525** | **26.247** |

- Desde 2028 el "mercado inicial posible" suma las ciudades del roadmap, con un factor de (1 + 8.748.045 / 4.096.741): comercios **8.027**, usuarios **2.659.660**.
- **Market share sobre el mercado inicial posible:** comercios 20,5% (2027) → 15,0% → 26,0% → 28,6% → 30,0% (2031); usuarios 3,1% → 2,6% → 5,6% → 7,5% → 9,0%. Sobre el SAM, en 2031: 3,4% de los comercios y 1,0% de los usuarios. En 2028 baja porque entran ciudades nuevas todavía sin clientes.

### Clientes al cierre de cada año

| | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|---|
| Comercios activos | 525 | 1.201 | 2.083 | 2.299 | 2.408 |
| Comercios que se van (30%) | 0 | 158 | 360 | 625 | 690 |
| Comercios nuevos | 525 | 834 | 1.242 | 841 | 799 |
| Usuarios activos | 26.247 | 70.437 | 149.949 | 198.900 | 238.795 |
| Usuarios que se van (30%) | 0 | 7.874 | 21.131 | 44.985 | 59.670 |
| Usuarios nuevos | 26.247 | 52.064 | 100.643 | 93.936 | 99.565 |
| Clientes Smart | 5 | 18 | 42 | 57 | 72 |
| Sucursales Intelligence | 2 | 6 | 12 | 20 | 30 |
| Instalaciones nuevas | 7 | 17 | 30 | 23 | 25 |

Los comercios y usuarios activos de 2028 a 2031, y los clientes Smart e Intelligence de todos los años, son **valores cargados a mano** en el Excel (supuestos), no calculados.

### Ventas e ingresos (USD)

| | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|---|
| Packs vendidos (usuarios × 1,3) | 34.121 | 91.568 | 194.934 | 258.570 | 310.434 |
| Comisión por packs (25% de USD 3,99) | 34.036 | 91.339 | 194.446 | 257.924 | 309.657 |
| Abonos Smart (USD 300 × 12) | 18.000 | 64.800 | 151.200 | 205.200 | 259.200 |
| Abonos Intelligence (USD 800 × 12) | 19.200 | 57.600 | 115.200 | 192.000 | 288.000 |
| **Total de ingresos** | **71.236** | **213.739** | **460.846** | **655.124** | **856.857** |
| Parte que viene de abonos | 52% | 57% | 58% | 61% | 64% |
| Uso de la capacidad de los comercios | 10,7% | 12,5% | 15,4% | 18,5% | 21,2% |

El límite lo pone la **demanda**: en los comercios sobra capacidad; lo difícil es conseguir usuarios.

## 16.2 Costos

### Variables

| Concepto | USD | Detalle |
|---|---|---|
| Mercado Pago, por pack | 0,135 | 3,39% de USD 3,99 |
| Reconocimiento de la foto, por pack | 0,015 | USD 0,01 por foto × 1,5 fotos por pack |
| Nube, por pack | 0,01 | Fotos y datos |
| Devoluciones, por pack | 0,02 | 0,5% del precio |
| Pack gratis, por pack | 0,15 | 1 cada 10 compras; APROVECHO paga al comercio el 75% (USD 3) y se supone que se usa la mitad |
| **Total por pack** | **0,33** | |
| Impuestos sobre lo cobrado | 6,2% | |
| Estación Smart | USD 15/mes | Conectividad y soporte |
| Estación Intelligence | USD 45/mes | 15 + 30 para procesar análisis y predicciones |

**Cada pack deja USD 0,61:** comisión ≈ USD 1, menos impuestos, menos USD 0,33.

### Adquisición

- **Usuario: USD 0,64.** El 35% llega por pauta (USD 1 por instalación, 6 de cada 10 se registran: 0,35 / 0,6 = 0,58), el 15% por referidos (10% de descuento: 0,06) y el resto, solo.
- **Comercio Base: USD 29,49** (100 bolsas a ARS 330 + sticker a ARS 6.000, a ARS 1.530, + USD 4 de envío). En el CAC se suman USD 27 por el tiempo del vendedor de calle: **USD 56,49**.
- **Instalación de estación (Smart o Intelligence): USD 150.**

### Fijos (USD por año)

| | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|---|
| Nube y herramientas | 1.800 | 3.600 | 6.000 | 8.400 | 10.800 |
| Ejecutivos de cuenta (USD 1.850/mes cada uno) | 0 | 22.200 (1) | 22.200 (1) | 44.400 (2) | 44.400 (2) |
| Analistas de Intelligence (USD 1.850/mes) | 0 | 11.100 (0,5) | 22.200 (1) | 22.200 (1) | 44.400 (2) |
| Soporte (USD 1.000/mes por persona) | 0 | 12.000 (1) | 36.000 (3) | 60.000 (5) | 96.000 (8) |
| Marketing | 16.000 (1.000/mes + 4.000 de lanzamiento) | 18.000 | 12.000 | 12.000 | 12.000 |
| Administración (contador, legales, seguros, banco) | 4.800 | 6.000 | 7.200 | 8.400 | 9.600 |
| **Total costos fijos** | **22.600** | **72.900** | **105.600** | **155.400** | **217.200** |
| Sueldo de los 4 fundadores (USD 1.000/mes cada uno; incluye desarrollo y mantenimiento) | 0 | 48.000 | 48.000 | 48.000 | 48.000 |

En 2027 los fundadores no cobran y hacen el desarrollo, el soporte y la venta.

### Todos los costos (USD)

| | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|---|
| Variables | 17.651 | 49.934 | 106.909 | 146.963 | 184.677 |
| Adquisición | 33.414 | 60.632 | 105.859 | 88.669 | 91.351 |
| Fijos | 22.600 | 72.900 | 105.600 | 155.400 | 217.200 |
| Sueldo de fundadores | 0 | 48.000 | 48.000 | 48.000 | 48.000 |
| **Total** | **73.665** | **231.466** | **366.367** | **439.033** | **541.229** |
| Ingresos | 71.236 | 213.739 | 460.846 | 655.124 | 856.857 |

## 16.3 Inversiones (USD)

| | 2026 | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|---|---|
| Plataforma: apps, backend, pagos, QR y mapas | 18.000 | | | | | |
| Reconocimiento de la foto y armado de packs | 8.000 | | | | | |
| Diseño | 2.500 | | | | | |
| Constitución, marca y asesoría bromatológica | 2.500 | | | | | |
| Módulo Smart | | 9.000 | | | | |
| Módulos Intelligence | | 8.000 | | 8.000 | | |
| Conexión por API con el inventario | | | | | 5.000 | |
| Estaciones (USD 523 cada una) | 3.661 | 12.552 | 28.242 | 40.271 | 53.346 | 0 |
| **Total** | **34.661** | **29.552** | **28.242** | **48.271** | **58.346** | **0** |

- Total 2026–2031: **USD 199.072**. Ver en el archivo 09 un posible error en la fórmula de las estaciones.
- Amortización (3 años): 11.554 (2027), 21.404 (2028), 30.818 (2029), 35.355 (2030) y 44.953 (2031).
- **Financiamiento necesario: USD 112.611** (34.661 en 2026, 31.981 en 2027 y 45.969 en 2028). Desde 2029 la caja es positiva.

## 16.4 LTV vs. CAC

| | Usuario | Comercio Base | Cliente Smart | Sucursal Intelligence |
|---|---|---|---|---|
| Margen por año (USD) | 0,79 | 71,92 | 3.268,72 | 8.536,72 |
| Años que se queda (1 / bajas, máximo 5) | 3,3 | 3,3 | 5,0 | 5,0 |
| **LTV** | 2,63 | 239,74 | 16.343,61 | 42.683,61 |
| **CAC** | 0,64 | 56,49 | 2.523 | 6.223 |
| **LTV / CAC** | **4,1** | **4,2** | **6,5** | **6,9** |
| Meses para recuperar el CAC | 9,8 | 9,4 | 9,3 | 8,7 |

- Margen por pack USD 0,61. El usuario compra 1,3 packs. El comercio Base vende **119 packs por año** (promedio de 2029). Smart: abono de USD 300 menos impuestos y menos USD 15 de estación, más los packs. Intelligence: USD 800 menos impuestos y menos USD 45, más los packs.
- CAC Smart = estación (523) + instalación (150) + un mes de ejecutivo (1.850). CAC Intelligence = 523 + 150 + tres meses de ejecutivo (5.550).
- Todos superan 3. El valor de un comercio Base **depende de que haya usuarios cerca**: si la demanda no crece, casi no cubre lo que costó sumarlo.

## 16.5 Punto de equilibrio y resultados (USD)

Costos a cubrir (adquisición + fijos + fundadores) / margen de contribución (75% a 78%).

| | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|---|
| Ingresos | 71.236 | 213.739 | 460.846 | 655.124 | 856.857 |
| Contribución marginal | 53.585 | 163.805 | 353.938 | 508.160 | 672.180 |
| Margen sobre ingresos | 75,2% | 76,6% | 76,8% | 77,6% | 78,5% |
| Punto de equilibrio | 74.465 | 236.870 | 337.830 | 376.538 | 454.511 |
| Ingresos / equilibrio | 96% | 90% | **136%** | 174% | 189% |
| EBITDA | −2.429 | −17.727 | 94.479 | 216.091 | 315.629 |
| Amortizaciones | 11.554 | 21.404 | 30.818 | 35.355 | 44.953 |
| Resultado antes de impuestos | −13.983 | −39.131 | 63.661 | 180.736 | 270.676 |
| Impuesto a las Ganancias (35%) | 0 | 0 | 22.281 | 63.258 | 94.737 |
| **Resultado neto** | **−13.983** | **−39.131** | **41.379** | **117.478** | **175.939** |

### Flujo de fondos (USD)

| | 2026 | 2027 | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|---|---|
| Flujo operativo | 0 | −2.429 | −17.727 | 72.198 | 152.833 | 220.892 |
| Inversiones | 34.661 | 29.552 | 28.242 | 48.271 | 58.346 | 0 |
| **Flujo de caja libre** | **−34.661** | **−31.981** | **−45.969** | **23.927** | **94.487** | **220.892** |
| Flujo libre acumulado | −34.661 | −66.642 | −112.611 | −88.684 | 5.803 | 226.696 |
| Aportes de capital | 34.661 | 31.981 | 45.969 | 0 | 0 | 0 |
| Caja final | 0 | 0 | 0 | 23.927 | 118.414 | 339.306 |

- **Payback: 3,9 años** (el acumulado se vuelve positivo durante 2030; 2026 es el año 0).
- **VAN: USD 17.004** (WACC 30%) y **TIR: 36,7%**. Están solo en el Excel; el texto del plan no los menciona.

## 16.6 Conclusiones del plan

- **Cada venta deja plata** (USD 0,61 por pack; margen del 75% al 78%). Las pérdidas iniciales vienen de tener pocas ventas para pagar la estructura.
- **Los abonos sostienen el negocio:** Smart e Intelligence son pocos clientes (72 y 30 en 2031) pero aportan del 52% al 64% de los ingresos.
- **El crecimiento depende de supuestos a medir** (market share y bajas del 30%) con los datos de 2027.
- 2027 casi no pierde (USD −2.429 de EBITDA) porque el equipo es chico y los fundadores no cobran; recién en 2029 se gana plata.
- **Hay que conseguir USD 112.611** entre 2026 y 2028; a fines de 2030 se recupera lo invertido.
