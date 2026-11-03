# 09 · Revisión crítica: inconsistencias, errores, huecos y preguntas abiertas

> Revisión del agente líder (2026-11-03) después de leer completos los dos PDF y el Excel.
> **Regla:** antes de usar un número o una promesa del plan en una pieza pública (landing, app, video), revisá esta lista.
> Estado de cada punto: `ABIERTO` (sin decisión), `DECIDIDO` (ver `docs/decisiones.md`) o `NO APLICA`.

## A. Marca y comunicación (impacto alto en landing y video)

| # | Tema | Detalle | Por qué importa | Estado |
|---|---|---|---|---|
| A1 | **Nombre muy parecido a un competidor directo** | "APROVECHO" y **"Buen Provecho"** (que opera en CABA desde fines de 2024) comparten raíz, sonido y sentido | Confusión de los usuarios, búsquedas cruzadas en las tiendas de apps y **riesgo de oposición al registrar la marca** (INPI). Hay que verificar registro, dominio y usuarios de redes antes de invertir en identidad | ABIERTO |
| A2 | **Comisión del 25% vs. lo que acepta el mercado** | La encuesta del plan: con 10% acepta el 62,3%, con 15% el 38,9%, con 20% el 20,8%, y más arriba aumenta el rechazo. **Buen Provecho cobra 10% + IVA**. El plan fija 25% | La landing B2B tiene que comunicar la comisión (13.1). Si queda en 25%, el mensaje debe apoyarse en "te quedás con el 75%" y "solo pagás cuando vendés". Cambiarla mueve mucho los economics: la comisión es el 48% de los ingresos de 2027 | ABIERTO |
| A3 | **Beneficio de bienvenida no definido** | El mockup de la activación universitaria dice "50% OFF en tu primera compra" (¿encima del 50% del pack?). El plan solo define el 10% por referido y 10 packs → 1 gratis | Prometer algo no modelado en los costos. Definirlo antes de usarlo | ABIERTO |
| A4 | **Identidad visual inconsistente** | Detalle en `docs/marca/marca-actual.md`: wordmark serif en la portada y Montserrat en el manual; marca con hoja en gráficos y ecosistema; el mockup del manual dice "PROVECHO" y "2024"; logo raster generado con IA | Base débil para una marca "muy profesional" | ABIERTO |
| A5 | "Micro-influencer" con 5,6 M de seguidores | Rocío Strat (@lachicadelbrunch) figura como micro-influencer, pero es una macro o mega influencer | Costo y estrategia distintos | ABIERTO |
| A6 | Evidencia de muestra chica | Encuesta B2C de **77 respuestas**; la muestra B2B no se informa. El resumen ejecutivo dice que APROVECHO "validó su solución" | En piezas públicas, no sobreafirmar: hablar de "interés" o "señales", no de validación | ABIERTO |
| A7 | **"Te quedás con el 75%" puede leerse mal** (agregado por marca, 2026-11-04) | El 75% es del **precio del pack** (ya con 50% de descuento): sobre el valor de mostrador, el comercio recupera el 37,5%. Ej.: contenido de ARS 12.200 → pack ARS 6.100 → comercio ARS 4.575 | Para no parecer engañoso, la landing lo aclara en la FAQ con un ejemplo | ABIERTO |
| A8 | **Precios en USD sin aclarar IVA ni moneda de facturación** (agregado por marca) | El plan da USD 300 y USD 800/mes sin decir si incluyen IVA ni si se cobran en pesos | La landing muestra precios: confirmar con el CFO | ABIERTO |

## B. Producto (impacto en la app)

| # | Tema | Contradicción | Estado |
|---|---|---|---|
| B1 | **Registro del destino del excedente** (donado, descartado, reutilizado) | 11.1.2 y la matriz 11.4 lo ponen en **Smart**; la tabla de funcionalidades 11.3 y la pantalla "Destino del excedente" (14.2) lo ponen **solo en Intelligence** | ABIERTO |
| B2 | **¿El consumidor ve la huella hídrica?** | Sí según 9.2 y 13.1 ("CO₂e y agua"); no según 11.2 y la pantalla "Mi perfil" (14.2), que solo muestran CO₂e. En la tabla 11.3 la huella hídrica es solo de Intelligence | ABIERTO |
| B3 | **Factor de CO₂e** | El texto usa **2,53 kg CO₂e/kg**; el mockup del dashboard Smart dice "Factor FAO: 2 kg CO₂e/kg" | Usar 2,53 (texto). ABIERTO |
| B4 | **APROVECHO Score sin fórmula** | El plan dice que "es explicado más adelante" y nunca lo define. Pistas: baja si el comercio no tiene el pack (14.4), **premia a quien reduce el excedente y no a quien vende más** (15.5), alimenta el ranking de la zona y el "Comercio del mes" | Hay que diseñarlo. ABIERTO |
| B5 | **Niveles del usuario, desafíos entre barrios y "Comercio del mes"** | Mencionados sin reglas: umbrales, beneficios, frecuencia | ABIERTO |
| B6 | Checklist | El texto pide "producto del día y alérgenos"; el diagrama 14.4 agrega **cadena de frío** | Incluir los tres. ABIERTO |
| B7 | Números de los mockups | "Tu impacto": $250.000 ARS ahorrados con 98 packs (unos ARS 2.550 por pack) no cuadra con un pack de USD 3,99 (ARS 6.105). Base y la app del consumidor repiten 98 packs y 240 kg CO₂e. Son "datos de ejemplo" | No reutilizar esos números. ABIERTO |
| B8 | Alcance del MVP | El roadmap tecnológico arranca con visual recognition, pagos, QR y geolocalización. Para una demo hay que definir qué se simula (por ejemplo, el reconocimiento de imágenes) y qué funciona de verdad | ABIERTO |

## C. Números y cálculos

| # | Tema | Detalle | Estado |
|---|---|---|---|
| C1 | **Umbrales de Smart e Intelligence mal calculados** | USD 300 / 25% = **1.200** (no 1.150) y USD 800 / 25% = **3.200** (no 3.100). La "comprobación" del anexo es incorrecta: 25% de 1.150 = 287,5, no 300; 25% de 3.100 = 775, que es **menos** que el abono de 800 | ABIERTO |
| C2 | **Justificación de Smart con supuestos distintos** | Usa 59 packs por mes (706 por año) a USD 3,92, pero el resto del plan usa 608 packs por año de capacidad, USD 3,99 y 119 packs por año por comercio. El origen de 706 no se explica | ABIERTO |
| C3 | **Lógica del SOM B2B mezclada** | La tabla aplica 8,4% sobre los 6.260 comercios de la zona y da 525, pero el texto dice "1 de cada 5" de los 2.560 interesados (20,5%). Aplicar 8,4% sobre los 2.560 daría 215 | ABIERTO |
| C4 | **TAM B2B y B2C en dólares no son comparables** | El B2B es **comisión** potencial (25% de las ventas); el B2C es el **gasto total** del consumidor (100%). No se pueden sumar ni presentar como equivalentes | ABIERTO |
| C5 | **Ingresos 2027 sobrestimados** | Los abonos de 2027 cuentan 12 meses, pero Smart arranca en el Q2 y Intelligence en el Q3 (y son pilotos). Con 9 y 6 meses, los abonos serían unos USD 23.100 en lugar de 37.200, y el ingreso de 2027 unos USD 57.100 en lugar de 71.236. Estimación del líder | ABIERTO |
| C6 | **Posible error en la fórmula de estaciones (Excel)** | La hoja Inversiones multiplica USD 523 por el **total** de clientes Smart + Intelligence del año siguiente, no por las **instalaciones nuevas**. Resultado: compra 7 + 24 + 54 + 77 + 102 = **264 estaciones para 102 clientes**. Con instalaciones nuevas (7, 17, 30, 23, 25) la inversión en estaciones sería **USD 53.346 en lugar de 138.072**. Recalculado con el mismo modelo (la réplica da exactamente los valores del Excel): inversión total **USD 114.346** (vs. 199.072), financiamiento necesario **USD 96.398** (vs. 112.611), payback **3,4 años** (vs. 3,9), **VAN USD 48.978** (vs. 17.004) y **TIR 50,0%** (vs. 36,7%). Salvo que la intención fuera renovar todas las estaciones cada año, lo que el plan no dice. **A confirmar con el CFO** | ABIERTO |
| C7 | Supuestos centrales sin validar | Precio del pack USD 3,99 y 1,3 packs por usuario (Too Good To Go global, sin comparar con precios locales de Cheaf o Buen Provecho); bajas del 30%; market share hasta 30%. El plan lo reconoce | Informativo |
| C8 | Datos de Too Good To Go de distintas fuentes | "180.000 comercios" (actual) y "más de 200.000 comercios" (2023, usado para los 608 packs) | Menor |

## D. Huecos y errores de redacción del documento

- **13.2 Plan de ventas digital y físico:** solo tiene el título.
- **8.3 Equipo ampliado:** dice "(Falta especificar al equipo de aprovecho completo)".
- **Referencias cruzadas rotas:** "punto 11.6 (Precios)" es la 11.5; "sección 10 Productos y Servicios" (precio del kit) está en la 16.3; "punto 6c" es la 6.3.
- **Erratas:** "registrar el precio real" (11.1.2) debería decir peso real; "AROVECHO base" en el índice; el índice empieza en la sección 3.
- **Mockups con errores:** "MANUAL DE MARCA BÁSICO - PROVECHO", "DESARROLLO DE IDENTIDAD - PROVECHO - 2024".

## E. Preguntas abiertas al usuario (bloquean decisiones)

1. **Landing:** el plan la define como **landing B2B de alta de comercios Base** ("que un comercio se sume solo, sin reunión"). ¿Ese es el objetivo, o también tiene que captar consumidores (lista de espera), presentar el proyecto a la facultad o al jurado, o atraer inversores?
2. **App:** ¿prototipo navegable para mostrar (demo) o MVP funcional (el plan menciona Supabase, Vercel, N8N y Firebase)? ¿App del consumidor, del comercio o ambas? ¿Web/PWA o nativa?
3. **Video:** ¿para quién (jurado o profesores, inversores, consumidores, comercios), cuánto dura, en qué formato y para qué fecha?
4. **Marca:** ¿el logo actual se profesionaliza (vectorizar y ordenar) o se rediseña? ¿El nombre está cerrado? ¿Registraron marca, dominio o redes?
5. **Comisión:** ¿se comunica el 25% o se revisa (A2)?
6. **Plazos:** ¿hay fechas de entrega o presentación?
7. **Material real:** ¿hay fotos propias, comercios interesados o datos de prueba?
8. **Validación interna:** ¿quién del equipo aprueba cada cosa (por ejemplo, Lola, como CMO, la marca)?
