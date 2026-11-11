# Links confirmados y valor

Firma: claude-octi-lider · consulta: 11/11/2026
"Queda" = el equipo decidió dejarlo como fuente del trabajo. La columna Observaciones dice lo que encontré yo y no cierra.

| Costo o dato | Valor que queda | Link | Estado | Observaciones |
|---|---|---|---|---|
| Mercado Pago por pack | **6,29 % + IVA** (cobro al instante) = USD 0,251 por pack (sin IVA) | https://www.mercadopago.com.ar/ayuda/26748 | Queda | El documento usa 3,39 % (USD 0,135), que en esa misma página es la comisión con liberación a 18 días. Hay que cambiar el número en 16.2 o aclarar que se cobra a 18 días. Con 6,29 % el costo por pack sube de 0,33 a 0,45 y lo que deja cada pack baja de 0,61 a 0,49. Además dice "+ IVA" |
| Too Good To Go: comidas | 121.686.720 (2023) | https://www.toogoodtogo.com/it/impact-report-2023 | Queda | La cifra sale del informe 2023 |
| Too Good To Go: comercios (200.000) | 200.000 | https://retailtimes.co.uk/?p=119867 | Queda | No encontré el total de comercios. Esa nota solo dice que en 2023 sumó 72.000 comercios nuevos. El 200.000 queda como estimación |
| Too Good To Go: 156 M comidas y 120 M usuarios | 156 M y 120 M (2025) | https://vakbladvoedingsindustrie.nl/en/article/too-good-to-go-saves-more-than-156-million-meals | Queda | Inconsistencia: los 608 packs usan datos de 2023 y los 1,3 packs por usuario, de 2025. Mezcla de años. Informe 2024: 135.451.474 comidas y más de 100 M de usuarios |
| Chile: costo por mil impresiones | USD 5,20 (2029) | Sin link | Queda | Está en 13.8, no en economics. La cita [2] del texto apunta a otra cosa (mayores de 18 años, INDEC). No encontré ninguna fuente con ese número: solo blogs con USD 3 a 12 para Latinoamérica |
| Dólar | ARS 1.530 (Banco Nación, 16/09/2026) | Sin link (nota 14) | Queda | Falta link o captura |
| Supabase | USD 25 por mes (plan Pro) | https://supabase.io/pricing | Queda | Falta captura de la página oficial |
| Pérdidas contra ganancias | Se restan hasta 5 años (Ley 20.628, art. 25) | https://siap.blogdelcontador.com.ar/normativa/ley-20-628-t-o-2019-articulo-25-compensacion-de-quebrantos-con-ganancias/ | Queda | El modelo no las resta. Ver `revision-economics.md` |
| Escala de Ganancias | 25 % a 35 % (Ley 27.630) | https://www.argentina.gob.ar/normativa/nacional/norma-472/texto | Queda | Sin abrir; confirmar que sea la norma. El modelo usa 35 % fijo |

## Segunda ronda (11/11/2026): costos que no tenían fuente

| Costo o dato | Valor del modelo | Lo que encontré | Link | Estado | Observaciones |
|---|---|---|---|---|---|
| Vercel | USD 20 por mes | USD 20 por usuario por mes (plan Pro) | https://vercel.com/pricing | Queda | Es por usuario: con más de una persona, sube. Más consumo aparte |
| n8n | EUR 20 por mes | EUR 20 por mes pagando todo el año; EUR 24 si se paga mes a mes (2.500 ejecuciones) | https://n8n.io/pricing | Parcial | Fuentes de terceros; falta abrir la página oficial. Si se paga mes a mes, el costo es 24 |
| Ingresos Brutos | 5 % | CABA 2026: 5,5 % para gestión de cobros y pagos digitales; 3 % o 5 % para comercio electrónico según facturación; 3 % la alícuota general | https://www.derechoenzapatillas.com/2026/codigo-fiscal-y-ley-impositiva-caba-2026/ | Parcial | Blog, no la ley. No pude confirmar qué rubro le toca a APROVECHO. El 5 % puede quedar corto si es el 5,5 %. Consultar al contador y citar la Ley Impositiva 2026 |
| Débitos y créditos | 1,2 % | 6 por mil en cada débito y 6 por mil en cada crédito = 1,2 % (Ley 25.413 y decretos 380/01 y 969/01) | https://www.argentina.gob.ar/normativa/nacional/ley-25413-66533/texto/1000 | Parcial | No pude confirmar que siga vigente en 2026. Se cobra sobre todo el dinero que pasa por la cuenta, no solo sobre lo que cobra APROVECHO |
| Sueldo ejecutivo de cuentas | USD 1.850 por mes | Guía Salarial 2026 de Michael Page: ejecutivo de grandes cuentas entre ARS 4,5 y 7 millones brutos por mes (USD 2.941 a 4.575 al dólar de 1.530), sin comisiones | Sin link (abrir la guía de Michael Page) | Parcial | El modelo está por debajo del rango. Tampoco dice si USD 1.850 incluye cargas sociales |
| Sueldo analista | USD 1.850 por mes | Levels.fyi: analista de datos en Argentina, ARS 23,2 millones de compensación total mediana (no aclara si es por año) | https://www.levels.fyi/es-AR/t/data-analyst/locations/argentina | Parcial | Falta aclarar si es mensual o anual |

## Siguen sin fuente
- Soporte (USD 1.000 por mes): no encontré dato de sueldo.
- Balanza (USD 215), tablet (196), cable, hub, soporte: no hay precios argentinos a la vista; hay que entrar a Mercado Libre Argentina y copiar el link.
- Bolsas (ARS 330), sticker (ARS 6.000), envío (USD 4), vendedor de calle (USD 27), instalación (USD 150): son presupuestos de proveedores; hay que pedirlos.
- Visión por foto (USD 0,01), nube por pack, estación (USD 15 y 45), administración, plataforma e inversiones, marketing 2027: precios de herramientas o presupuestos.

## Comercio nuevo (USD 29,49): de dónde sale cada precio (11/11/2026)

| Dato | Valor | Fuente en el entregable | Referencia que encontré | Estado |
|---|---|---|---|---|
| Bolsas del primer lote | 100 | Ninguna: 13 y 14 dicen "primer lote" sin la cantidad; el 100 aparece solo en 16.2 | — | Supuesto del equipo |
| Precio de cada bolsa | ARS 330 | Ninguna | Mercado Libre Argentina: bolsa kraft con asa, 100 unidades a ARS 26.190 (ARS 262 cada una; no es compostable ni lleva logo; publicación de 2025). Falta el link exacto | Parcial: el 330 es razonable pero hay que pedir presupuesto de bolsa compostable con logo (por ejemplo a Conciencia Circular) |
| Sticker de vidriera con QR | ARS 6.000 | Ninguna | No encontré precios en pesos | Sin fuente: pedir presupuesto a una imprenta |
| Envío del kit | USD 4 | Ninguna | Comparador de envíos (junio 2026): 2 kg por Correo Argentino de CABA a Córdoba, ARS 7.000 a 9.800 (USD 4,6 a 6,4). No es dentro del AMBA. https://servidos.ar/comparador-envios | Parcial: USD 4 queda algo bajo; cotizar en MiCorreo y Andreani |
| Dólar | ARS 1.530 | Nota 14 (Banco Nación, 16/09/2026) | — | Con fuente |

## A quién preguntarle: costo de usuario nuevo y de instalación (11/11/2026)

Equipo según el entregable (sección de equipo fundador): Catalina Rebolo (CEO), Facundo Beumont (CTO), Lola Baldini (CMO), Octavio Chomnalez (CFO).

| Dato | Dónde está en el entregable | A quién preguntarle |
|---|---|---|
| USD 1 por instalación de la app | 13.8 (tabla de KPI "costo por instalación: USD 1 o menos" y nota del presupuesto: promedio en Latinoamérica USD 0,34 a 0,50) y 16.2 | Marketing (Lola): de dónde sale el 0,34–0,50 |
| 60 % de las instalaciones se registran | 13.8 (KPI) y 16.2 ("6 de cada 10") | Marketing (Lola): es una meta, falta el dato que la respalda |
| 15 % llega por referidos | 13.8 (KPI) y 16.2 | Marketing (Lola) |
| 10 % de descuento al referido | 13.1 (Loops de recomendación, Referidos B2C) y 16.2 | Marketing (Lola): quién lo recibe |
| 35 % llega por publicidad paga | Solo en 16.2 | Quien armó economics (CFO/CTO) y Marketing |
| Precio del pack USD 3,99 | 16.1 y 16.2 (sección de precios, 11) | Quien armó economics |
| Bolsas (100 y ARS 330), sticker (ARS 6.000), envío (USD 4) | Solo en 16.2 | Quien armó economics; los presupuestos de proveedores los consigue Operaciones |
| Instalación USD 150 | 16.2 y 16.4 (CAC de Smart e Intelligence); el proceso está en 14 ("arma y configura cada kit, lo instala") | CTO (Facundo): cuánto lleva armar e instalar, quién lo hace |

## Costos fijos de personal, marketing y administración: de dónde sale cada fila (11/11/2026)

| Fila | Cuenta | Dónde está en el entregable | Fuente |
|---|---|---|---|
| Ejecutivos de cuenta | personas × USD 1.850 × 12: 0, 1, 1, 2, 2 (2027 a 2031) | 16.2 | Sin fuente de las cantidades ni del sueldo. Michael Page 2026: ejecutivo de grandes cuentas ARS 4,5 a 7 millones brutos (USD 2.941 a 4.575) |
| Analistas de Intelligence | personas × USD 1.850 × 12: 0, 0,5, 1, 1, 2 | 16.2 | Sin fuente |
| Equipo de soporte | personas × USD 1.000 × 12: 0, 1, 3, 5, 8 | 16.2 | Sin fuente |
| Marketing | 2027: USD 75.000 − 16.900 = 58.100; 2028: 18.000 (1.500 × 12); 2029 a 2031: 12.000 (1.000 × 12) | 13.8 y 16.2 | 2028 no coincide con 13.8 (USD 54.000) |
| Administración | USD 400, 500, 600, 700 y 800 por mes × 12 | 16.2 | Sin fuente |
| Sueldo de los 4 fundadores | 4 × USD 1.000 × 12, desde 2028 | 16.2 | Decisión del equipo |

Relación implícita entre personas y clientes (calculada con los números del modelo; no está escrita en el entregable):

| | 2028 | 2029 | 2030 | 2031 |
|---|---|---|---|---|
| Clientes Smart e Intelligence por ejecutivo | 24 | 54 | 39 | 51 |
| Sucursales Intelligence por analista | 12 | 12 | 20 | 15 |
| Usuarios activos por persona de soporte | 70.437 | 49.983 | 39.780 | 29.849 |

Las cantidades de personal se cargaron a mano año por año, sin una regla fija.

## Administración (contador, legales, seguros y banco): cómo justificarla (11/11/2026)

Hoy: USD 400, 500, 600, 700 y 800 por mes (4.800 a 9.600 por año). Sin fuente ni desglose.

| Parte | Qué encontré | Fuente | Estado |
|---|---|---|---|
| Contador | Abono mensual de una pyme con IVA, Ganancias y sueldos: ARS 120.000 a 250.000 por mes (USD 78 a 163 al dólar de 1.530) | https://cuantomecuesta.com/ar/contador/ (sitio de terceros) | Parcial: usar el honorario sugerido del Consejo Profesional de la jurisdicción o 2 o 3 presupuestos |
| Liquidación de sueldos | Honorario del Consejo Profesional de Córdoba, Disposición 31/26: ARS 2.559,76 (falta confirmar si es por empleado y por mes) | https://web.cpcecba.org.ar/wp-content/uploads/2026/09/Dis31-26-Honorarios-Ley-7626-003.pdf | Parcial |
| Banco | Macro, mantenimiento de cuenta corriente: ARS 31.278,50 por mes al 01/06/2026 (USD 20). Galicia y Santander: sin monto | https://www.macro.com.ar/comisiones-nyp | Parcial |
| Registro de marca (una sola vez) | 100 UMAPI por clase; Resolución INPI 75/2026: 1 UMAPI = ARS 360, o sea ARS 36.000 (USD 23,5) por clase. Hay otras cifras distintas | https://www.argentina.gob.ar/normativa/nacional/norma-424092/texto | Parcial. Ya está dentro de "Constitución, marca y asesoría bromatológica" (USD 2.500 de 2026) |
| Seguros | No encontré precios. La responsabilidad civil no es obligatoria para esta actividad | https://www.cronista.com/pyme/negocios-pyme/los-seguros-obligatorios-y-las-polizas-que-conviene-tener-para-resguardar-la-operatoria-pyme | Sin fuente: pedir cotización |
| Legales recurrentes | Sin datos | — | Sin fuente: pedir presupuesto |
