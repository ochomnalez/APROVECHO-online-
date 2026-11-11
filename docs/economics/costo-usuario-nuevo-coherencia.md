# Costo de conseguir cada cliente: de dónde sale y si coincide con el entregable

Firma: claude-octi-lider · 2026-11-11
Base: planilla (usuario nuevo 0,64; comercio nuevo 29,49; instalación 150) contra el entregable final (13.1, 13.8, 16.1, 16.2, 16.4).

## Cómo se arma el 0,64

Fórmula de la planilla: 0,35 ÷ 0,6 + 0,15 × 3,99 × 0,10 = 0,583 + 0,060 = **0,643**.

| Dato | Valor | De dónde sale | Coincide con el entregable |
|---|---|---|---|
| 35 % de los usuarios llega por pauta paga | 35 % | No está en el entregable | **No hay fuente.** Supuesto del equipo |
| Costo por instalación | USD 1 | 13.8: meta "USD 1 o menos"; dice que en Latinoamérica el promedio es USD 0,34 a 0,50 | Sí, pero sin fuente del 0,34–0,50 |
| Instalaciones que se registran | 60 % | 13.8: meta de 60 % | Sí, es una meta (13.8 dice "se fija con el primer mes") |
| 15 % llega por referidos | 15 % | 13.8: meta de nuevos por referidos 15 % | Sí, es una meta |
| Descuento al referido | 10 % del pack (USD 0,40) | 13.1: "descuento del 10 %, absorbido por Aprovecho" | Sí, pero 13.1 no dice quién lo recibe (el que invita, el invitado o los dos). Si lo reciben los dos, el costo es 0,12 y no 0,06 |
| El otro 50 % "llega solo" | 0 | Supuesto | **No coincide** (ver abajo) |

## Lo que no coincide

1. **El 0,64 deja afuera casi todo el presupuesto de marketing de 13.8.** El presupuesto 2027 es USD 75.000: campañas de instalación 15.300, influencers 16.000, pauta de alcance 7.000, pantallas 4.000, producción 3.000, videos y tiendas 16.000, etc. El 0,64 solo recoge unos USD 16.900 (las instalaciones y los referidos). Los 58.100 restantes están en costos fijos, no en el costo de conseguir clientes. Si se reparten entre los 26.247 usuarios de 2027 (sacando los 5.500 de comercios), el costo real por usuario es **USD 2,65, no 0,64**. Con eso, LTV ÷ CAC del usuario pasa de 4,1 a **1,0**, y recuperar el costo lleva unos 40 meses, no 9,8.
2. **Promediando los 5 años da USD 0,94** (todo el costo de usuarios de 2027 a 2031 ÷ todos los usuarios nuevos). LTV ÷ CAC = 2,8, o sea queda por debajo de 3.
3. **El 50 % que "llega solo" no es gratis.** Los usuarios que llegan por influencers, pantallas, videos o el local (sticker, cartel, bolsa) están en ese 50 %, pero 13.8 les asigna USD 30.000 + 16.000. Hay que decir que parte de esa plata corresponde a ellos.
4. **Instalado no es comprador.** 16.1 dice que el SOM de 26.247 son los que **se descargan la app** (1,25 % de los adultos con billetera de la zona, igual que Buen Provecho). Pero el modelo les vende 1,3 packs por año a todos. Entre descargar y comprar hay un paso que no está medido: 13.8 dice "primeras compras a 30 días: se fija con el primer mes".
5. **La "garantía del primer pack" (1.700) no está en el modelo.** 13.8 suma 15.300 + 1.700 = 17.000 y dice que ya están en el costo de conseguir clientes (16.900). Pero la planilla cuenta 15.311 de pauta + 1.575 de referidos, no una garantía. O la garantía son los referidos (y en 13.8 los referidos también aparecen en "que vuelva y recomiende", USD 5.000: posible doble conteo), o la garantía falta.
6. **Marketing 2028.** 13.8 dice que en 2028 se gastan unos USD 54.000 (USD 8.000 por ciudad grande y 3.000 por mediana). La planilla de Facundo tiene **18.000**. Con 54.000 el costo por usuario de 2028 sube de 0,64 a 1,68.
7. **Beneficio de bienvenida.** 13.1 habla de "beneficios de bienvenida" en las activaciones presenciales. No están costeados en ningún lado (era el punto A3 de `docs/fuente/09`).

## Comercio nuevo (29,49) e instalación (150)

- **Comercio nuevo:** (100 bolsas × ARS 330 + sticker ARS 6.000) ÷ 1.530 + USD 4 de envío = 25,49 + 4 = **29,49**. Coincide con 13.1 y 14 ("el primer lote de bolsas se entrega gratis con el alta"). Falta que 13.1 también reparte **cartel de caja y flyer**; 13.8 los pone dentro del presupuesto de marketing, así que no están en este costo. Los precios en pesos no tienen fuente.
- **USD 27 del vendedor de calle:** solo está en el CAC para el LTV (56,49), no en los costos de la planilla (29,49). Y el equipo de calle no aparece en los costos fijos: en 2027 lo hacen los fundadores sin sueldo, pero desde 2028 no hay nadie pago que venda a los 800 a 1.200 comercios nuevos por año (el ejecutivo de cuentas es para Smart e Intelligence).
- **Instalación (150):** "valor de mano de obra por instalación", sin fuente. Hay que decir cuánto tarda y a cuánto la hora.

## Qué decidir

- Si el costo por usuario del LTV se calcula con todo el marketing (más honesto) o se deja solo la pauta y los referidos (como hoy). En ese caso hay que escribirlo así y aclarar que el resto es marca.
- Qué pasa con 2028 (18.000 contra 54.000).
- Qué es la garantía de 1.700.
