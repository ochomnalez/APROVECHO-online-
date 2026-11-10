# Brief · Sección de inversores (landing)

> Firma: `claude-octi-lider` · 2026-11-10 · Pedido de Octavio: **mostrar los datos financieros** y armar la sección de inversores tomando como referencia páginas de relación con inversores de empresas globales (Mercado Libre, Amazon). **Todo dato sale del entregable** (`docs/fuente/08-economics.md` y el Excel). Nada inventado.

## Qué copiamos de las referencias (patrones, no diseño)

| Referencia | Patrón que sirve | Cómo lo adaptamos |
|---|---|---|
| **Mercado Libre** (investor.mercadolibre.com) | Portada con una frase de tesis + 3 accesos rápidos; "Investor presentation" como relato web con un gráfico por tema; **cifras grandes** con una línea de contexto; diagrama del ecosistema; contacto al pie | Tesis en una frase; accesos "Números · Modelo · Documentos"; cada bloque = 1 idea + 1 gráfico propio; diagrama del modelo (comercio ↔ consumidor ↔ medición) |
| **Amazon** (ir.aboutamazon.com) | **Hub con navegación propia** (resultados, reportes, preguntas frecuentes, equipo/gobierno, contacto); documentos descargables; pie con aviso legal | Sub-navegación interna de la sección; FAQ de inversores; equipo; descargas; aviso de proyecciones |
| Prácticas comunes de IR | Aviso de *forward-looking statements*; tabla anual + gráfico; definiciones de métricas; "Contacto inversores" | Aviso "Proyecciones preliminares" visible; tablas 2027–2031; glosario corto; formulario "Pedí información" |

Se mantiene **D-032: va dentro de la landing** (no es otra web), pero como un **hub/panel propio** con sub-navegación (encaja con la nueva estructura sin scroll largo). Si Octavio quiere una URL aparte, se cambia después.

## Estructura propuesta del hub

1. **Tesis** (I-1) · una frase + 3–4 cifras grandes (USD 0,61 por pack · 75–78% de margen de contribución · LTV/CAC 4 a 7 · equilibrio 2029).
2. **Mercado** (I-2) · TAM/SAM/SOM, B2B y B2C separados (nunca sumados, C4). Embudo visual.
3. **Modelo** (I-3) · comisión 25% + abonos Smart/Intelligence; diagrama.
4. **Números** · lo nuevo, ver abajo.
5. **Validación** (I-4) · encuestas, con el aviso de muestra chica.
6. **Roadmap** (I-5).
7. **Equipo** (I-7) · Catalina Rebolo (CEO), Facundo Beumont (CTO), Lola Baldini (CMO), Octavio Chomnalez (CFO). Sin fotos ni background hasta que Octavio los pase.
8. **Preguntas de inversores** · ej. ¿cuánto necesitan?, ¿en qué se usa?, ¿cuándo se recupera?, ¿qué riesgos hay? (respuestas solo con datos del plan).
9. **Documentos y contacto** (I-8) · "Pedí información" (formulario simulado) + descarga del resumen cuando exista.

## Bloque "Números" (D-025: se mantienen los del Excel)

**Aviso fijo arriba:** *Proyecciones preliminares. Solo Argentina, en USD. Son supuestos del equipo a validar con datos reales desde 2027. No son resultados.*

Datos permitidos (de `docs/fuente/08-economics.md`):

- **Tabla anual 2027–2031:** comercios activos (525 · 1.201 · 2.083 · 2.299 · 2.408), usuarios activos (26.247 · 70.437 · 149.949 · 198.900 · 238.795), packs vendidos (34.121 · 91.568 · 194.934 · 258.570 · 310.434), ingresos totales (71.236 · 213.739 · 460.846 · 655.124 · 856.857), % de ingresos por abonos (52 · 57 · 58 · 61 · 64), costos totales (73.665 · 231.466 · 366.367 · 439.033 · 541.229), EBITDA (−2.429 · −17.727 · 94.479 · 216.091 · 315.629), resultado neto (−13.983 · −39.131 · 41.379 · 117.478 · 175.939).
- **Gráficos** (SVG propios, accesibles, con tabla equivalente): ingresos vs. costos por año; composición de ingresos (comisión / Smart / Intelligence); flujo de caja libre acumulado (−34.661 · −66.642 · −112.611 · −88.684 · +5.803 · +226.696).
- **Necesidad de financiamiento:** **USD 112.611** entre 2026 y 2028 (34.661 · 31.981 · 45.969); inversión total 2026–2031 **USD 199.072**; **payback 3,9 años**; **VAN USD 17.004** (WACC 30%); **TIR 36,7%**.
- **Uso de fondos:** plataforma (apps, backend, pagos, QR, mapas) 18.000; reconocimiento de foto y armado de packs 8.000; diseño 2.500; constitución, marca y asesoría bromatológica 2.500; módulos Smart/Intelligence y estaciones según año (tabla 16.3).
- **Unit economics:** margen por pack USD 0,61; LTV/CAC usuario 4,1 · comercio Base 4,2 · Smart 6,5 · Intelligence 6,9; meses para recuperar el CAC 9,8 / 9,4 / 9,3 / 8,7.
- **Supuestos visibles:** pack USD 3,99, 1,3 packs por usuario por año, bajas 30%, tipo de cambio ARS 1.530/USD, impuestos 6,2%, Ganancias 35%, WACC 30%.

**Notas al pie obligatorias (honestidad, §2 de CLAUDE.md):**
- **C5:** los abonos de 2027 cuentan 12 meses aunque Smart arranca en Q2 y Intelligence en Q3 (pilotos): el ingreso 2027 real sería menor (estimación del equipo: ≈ USD 57.100). Mostrar el dato del Excel con esta nota.
- **C6 / D-025:** la inversión supone renovar las estaciones cada año (decisión del CFO).
- **C7:** precio del pack y packs por usuario vienen de Too Good To Go (referencia global); bajas y market share son supuestos a medir.
- Crecimiento de comercios/usuarios 2028–2031 y clientes Smart/Intelligence: **valores cargados a mano** en el Excel (supuestos).

**No mostrar** (C1): umbrales USD 1.150 / 3.100.
**No mezclar** TAM B2B (comisión) con TAM B2C (gasto): cada uno rotulado.
Etiquetas **Proyectado** vs **Medido** en cada cifra (hoy todo es proyectado o de encuesta; no hay resultados reales).

## Diseño

- Fondo blanco, tipografía Bricolage Grotesque + DM Sans, verde bosque de acento (como el resto de la landing v2). Cifras grandes con `font-variant-numeric: tabular-nums`.
- Cero "AI slop": sin destellos, sin gráficos de stock, sin degradés.
- Todo gráfico con alternativa en tabla; contraste AA; sin dependencia de librerías pesadas (SVG a mano o una librería mínima local).
- Formulario "Pedí información": simulado (localStorage) con el punto único `enviarLead`.
