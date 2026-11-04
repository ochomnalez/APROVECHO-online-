# Pantallas de Aprovecho (app v3.2)

Referencia visual de **todas** las pantallas de la app, tal como se ven hoy: una imagen por pantalla y por estado.
Sirve de ejemplo para rehacer o continuar la app. Las capturas son de la app real (no son maquetas) y los datos
son simulados.

- **App en vivo, para tocarla:** https://ochomnalez.github.io/aprovecho-app/ (se instala en el celular desde el navegador).
- **Formato:** 390 × 844 px de pantalla (un iPhone), exportadas a 2x → 780 × 1688 px. Solo es móvil: en una pantalla grande
  se ve la misma columna centrada, de 480 px como máximo.
- **Hojas de contactos:** `00-hoja-cliente-*.jpg` y `00-hoja-local-*.jpg` juntan 14 pantallas por imagen para verlas de un vistazo.
- **Nombres:** `NN-lado-pantalla.jpg`. El número sigue el orden del recorrido.

## Qué es la app

Aprovecho conecta comercios gastronómicos que terminan el día con excedente (panaderías, cafés, rotiserías) con personas
que lo compran como **packs sorpresa** a mitad de precio y lo retiran en el local con un QR. Tiene **dos lados en la misma app**:
el **cliente** (descubre, reserva, paga, retira, califica) y el **local** (publica lo que sobró sacando una foto, valida los
retiros y mira sus números). En la demo se pasa de un lado al otro desde el botón "Demo".

El local tiene tres planes que cambian lo que ve: **Básico** (publica con una foto del celular), **Smart** (suma una
balanza conectada que mide el excedente por peso) e **Intelligence** (suma una estación automática de cámara y balanza y un
panel con sugerencias para desperdiciar menos). La IA de reconocimiento, los pagos y los datos de ejemplo están simulados.

## Navegación

| Lado | Barra de abajo (flotante) | Botón circular |
|---|---|---|
| Cliente | Inicio · Mapa · Reservas · Perfil | Buscar |
| Local, plan Básico o Smart | Hoy · Retiros · Impacto · Cuenta | Publicar con una foto |
| Local, plan Intelligence | Hoy · Retiros · Intelligence · Cuenta | Publicar con una foto |

Entre las secciones de la barra también se pasa **deslizando de costado**. Las pantallas internas (detalle de pack, pago, cámara,
etc.) no tienen barra de abajo y se cierran con la flecha de arriba. Las **hojas** son paneles que suben desde abajo.

**Recorrido del cliente:** bienvenida → ubicación → inicio → (buscar / categoría / local / mapa) → detalle del pack → pago →
reserva con QR → retiro en el local → calificar.
**Recorrido del local:** alta (plan → carta → datos del local) → Hoy → sacar foto → la IA analiza → (duda) → revisar y publicar →
publicado → retiros (escanear el QR del cliente). Con Smart/Intelligence: balanza o estación → "para vender" o "a la basura" (con motivo).

## Sistema visual

- **Color de marca:** verde `#2F6B34` (oscuro `#255629`, más oscuro `#1B4020`, vivo `#3A8A42`); fondos de verde claro `#F0F6EC`, `#E0EDD8`, `#C6DCB8`.
  Acentos: horno `#C2551E` (avisos, poco tiempo), oro `#F0A21A` (etiquetas de descuento), rojo `#D23B30` (eliminar), azul `#2563EB` (tu ubicación).
- **Neutros:** tinta `#141A15` (texto), `#3F4A42` (texto secundario), gris `#6E7A71`, línea `#E6EAE4`; fondos `#FFFFFF`, `#F5F6F3` (pantallas del local), `#ECEFEA`.
- **Tipografía:** la del sistema (San Francisco en iPhone, Roboto en Android). Montserrat solo en el logo. Títulos de 26 a 32 px en negrita con
  interlineado ajustado; texto de 15 a 16 px; datos chicos de 12 a 13 px. Los números van con cifras de ancho fijo.
- **Forma:** esquinas redondeadas (botones 16 px, tarjetas 18 a 24 px, hojas 26 px arriba, chips y barra de abajo totalmente redondos). Márgenes laterales de 18 px.
  Sombras suaves y casi siempre un filo de 1 px en vez de bordes duros.
- **Componentes que se repiten:** tarjeta de pack (foto de la categoría con el descuento, logo del local superpuesto, precio verde y precio anterior tachado),
  tarjeta de local (logo redondeado), chips de filtro, selector segmentado, lista con íconos en cajitas verdes, hoja inferior con manija,
  botón principal verde de 52 px, botón secundario verde claro, aviso con ícono, estado vacío con círculo e ícono.
- **Ilustraciones:** dibujadas a mano en vectores (medialuna, pan, torta, sándwich, vianda, etc.), no hay fotos. Cada categoría tiene su color de fondo.
- **Movimiento:** transiciones entre pantallas que deslizan, números que cuentan al aparecer, carrusel de promos que avanza solo, resaltado de la barra de abajo que
  viaja de una pestaña a otra, brillo de colores alrededor de la foto mientras la IA analiza.

## Qué incluyen y qué no estas capturas

Incluyen cada pantalla, sus variantes por plan, las hojas principales y los pasos del flujo de publicación. **No incluyen:** una versión de computadora (no existe),
los estados de error de red, ni las versiones anteriores de la app (v1 y v2).
**Ojo con tres capturas:** *Escanear* sale con la cámara negra porque se sacó desde una computadora; *Equipos* muestra modelos 3D ilustrativos (todavía no hay proveedor
de equipos elegido); *Analizando* y *Cargando* son instantes de una animación.

## Índice

| # | Imagen | Ruta | Estado de la demo | Qué muestra |
|---|---|---|---|---|
| | **LADO CLIENTE** | | | |
| 01 | `01-cliente-bienvenida.jpg` | `/bienvenida` | sin sesión (primer arranque) | Primera pantalla de la app. Presenta Aprovecho y ofrece entrar como cliente o como comercio, e instalar la app. |
| 02 | `02-cliente-splash.jpg` | `/bienvenida` | sin sesión (primer arranque) | Pantalla de arranque: fondo verde con el isotipo blanco. Aparece menos de un segundo al abrir la app. |
| 03 | `03-cliente-ubicacion.jpg` | `/c/ubicacion` | cliente, zona Olivos | Pide la ubicación para ordenar los packs por distancia. Dos salidas: usar el GPS o elegir una zona a mano. |
| 04 | `04-cliente-inicio-cargando.jpg` | `/c/inicio` | cliente, zona Olivos | Inicio mientras carga: bloques grises (skeleton) con la forma del contenido final. Dura unos 650 ms la primera vez. |
| 05 | `05-cliente-inicio.jpg` | `/c/inicio` | cliente, zona Olivos | Inicio del cliente, al estilo de las apps de delivery: zona y avatar arriba, buscador fijo, categorías grandes y chicas, carrusel de promociones que avanza solo, fila "Cerca tuyo". Barra de abajo con 4 secciones y botón circular de búsqueda. |
| 06 | `06-cliente-inicio-scroll.jpg` | `/c/inicio` | cliente, zona Olivos | El mismo Inicio más abajo: "Se agotan pronto" y "Los mejor puntuados" con tarjetas de pack anchas; el buscador queda fijo arriba. |
| 07 | `07-cliente-buscar.jpg` | `/c/buscar` | cliente, zona Olivos | Búsqueda sin texto: sugerencias para empezar. |
| 08 | `08-cliente-buscar-resultados.jpg` | `/c/buscar` | cliente, zona Olivos | Búsqueda con el texto "pan": locales y packs que coinciden. |
| 09 | `09-cliente-lista-categoria.jpg` | `/c/lista/Panificados` | cliente, zona Olivos | Lista de una categoría (Panificados): todos los packs de esa categoría, con orden y filtros. |
| 10 | `10-cliente-local.jpg` | `/c/local/c1` | cliente, zona Olivos | Perfil de un local: portada con su color, logo, puntaje, horario de retiro, botón "Ir" a Google Maps y sus packs de hoy. |
| 11 | `11-cliente-mapa.jpg` | `/c/mapa` | cliente, zona Olivos | Mapa real (OpenStreetMap) con pines de precio, buscador y filtros rápidos arriba y una hoja inferior con la lista de packs cerca. |
| 12 | `12-cliente-mapa-hoja-alta.jpg` | `/c/mapa` | cliente, zona Olivos | La hoja de packs del mapa estirada hacia arriba (hay tres alturas: baja, media y alta). Se arrastra o se toca la manija. |
| 13 | `13-cliente-mapa-filtros.jpg` | `/c/mapa` | cliente, zona Olivos | Hoja de filtros del mapa: tamaño, condición alimentaria, categoría y distancia, con el contador de resultados en el botón. |
| 14 | `14-cliente-pack.jpg` | `/c/pack/ps0` | cliente, zona Olivos | Detalle de un pack: foto grande de la categoría con el descuento, hoja blanca con el local, precio y ahorro, lista de datos (retiro, tamaño, distancia), qué puede traer y nutrición estimada. Barra superior que se vuelve sólida al bajar y botón "Reservar" con el total. |
| 15 | `15-cliente-pack-scroll.jpg` | `/c/pack/ps0` | cliente, zona Olivos | El mismo detalle de pack al final: nutrición estimada en una tira y la aclaración de que es una estimación; barra superior ya sólida. |
| 16 | `16-cliente-pago.jpg` | `/c/pago/ps0` | cliente, zona Olivos | Pago simulado: resumen del pack, cantidad, medio de pago y botón para confirmar. |
| 17 | `17-cliente-reserva-qr.jpg` | `/c/reserva/rdemo` | cliente con una reserva activa | Reserva confirmada: código QR y código de 4 letras para mostrar en el mostrador, con los datos del retiro. |
| 18 | `18-cliente-reservas-activas.jpg` | `/c/reservas` | cliente con una reserva activa y otra ya retirada y sin calificar | Mis reservas, pestaña "Activas": las que están por retirar. |
| 19 | `19-cliente-reservas-anteriores.jpg` | `/c/reservas` | cliente con una reserva activa y otra ya retirada y sin calificar | Mis reservas, pestaña "Anteriores": las ya retiradas, con acceso a calificar. |
| 20 | `20-cliente-calificar.jpg` | `/c/calificar/rret` | cliente con una reserva activa y otra ya retirada y sin calificar | Calificar un retiro: estrellas, etiquetas rápidas y comentario opcional. |
| 21 | `21-cliente-perfil.jpg` | `/c/perfil` | cliente, zona Olivos | Perfil: nivel y estadísticas de impacto del consumidor (packs rescatados, CO₂ evitado, ahorro), niveles y ajustes. |
| 22 | `22-cliente-perfil-scroll.jpg` | `/c/perfil` | cliente, zona Olivos | El mismo Perfil más abajo: ajustes (nombre, zona, compartir la app, pasar al modo local) y reiniciar la demo. |
| 23 | `23-cliente-hoja-demo-cliente.jpg` | `/c/inicio` | cliente, zona Olivos | Hoja del botón "Demo" del cliente: pasar al modo local, cambiar de zona o reiniciar la demo. Solo existe en la demo. |
| 24 | `24-cliente-hoja-zona.jpg` | `/c/inicio` | cliente, zona Olivos | Hoja para elegir la zona a mano. |
| | **LADO LOCAL (comercio)** | | | |
| 25 | `25-local-alta-plan.jpg` | `/b/plan` | local La Espiga, plan Intelligence | Alta del local, paso 1 de 3: elegir el plan (Básico, Smart o Intelligence) con su frase de venta y precio de ejemplo. |
| 26 | `26-local-alta-carta.jpg` | `/b/carta` | local La Espiga, plan Intelligence | Alta del local, paso 2 de 3: la carta de productos (precio y peso por unidad), que la app lee a partir de una foto. |
| 27 | `27-local-alta-local.jpg` | `/b/local` | local La Espiga, plan Intelligence | Alta del local, paso 3 de 3: nombre, hora de cierre, descuento por defecto y qué condiciones alimentarias puede ofrecer. |
| 28 | `28-local-hoy-basico.jpg` | `/b/hoy` | local La Espiga, plan Básico | Hoy del local con el plan Básico: límite para publicar con cuenta regresiva, botón "Sacar foto", resumen del día y packs publicados. Sin tarjeta de equipo. |
| 29 | `29-local-hoy-smart.jpg` | `/b/hoy` | local La Espiga, plan Smart | Hoy con el plan Smart: suma la tarjeta de la balanza conectada. |
| 30 | `30-local-hoy-intelligence.jpg` | `/b/hoy` | local La Espiga, plan Intelligence | Hoy con el plan Intelligence: suma la estación automática y la tarjeta de sugerencias nuevas. |
| 31 | `31-local-hoy-scroll.jpg` | `/b/hoy` | local La Espiga, plan Intelligence | Hoy más abajo: la lista "Tus packs de hoy"; cada uno abre sus opciones. |
| 32 | `32-local-camara.jpg` | `/b/camara` | local La Espiga, plan Intelligence | Publicar con una foto: tomar la foto, elegirla de la galería o probar con fotos de muestra (la IA está simulada). |
| 33 | `33-local-analizando.jpg` | `/b/camara` | local La Espiga, plan Intelligence | La IA analizando la foto, a mitad de camino: pantalla oscura con brillo de colores alrededor (estilo asistente), cajas de detección sobre la foto y los cuatro pasos (reconocer, contar, cruzar con la carta, armar packs). |
| 34 | `34-local-duda.jpg` | `/b/camara` | local La Espiga, plan Intelligence | Cuando la IA no está segura: pregunta qué es, con opciones ordenadas por probabilidad y el ajuste de cantidad. |
| 35 | `35-local-revisar.jpg` | `/b/camara` | local La Espiga, plan Intelligence | Revisá y publicá: los packs que armó la IA (tamaño, cantidad, precio), ventana de retiro, condiciones alimentarias y botón para publicar. |
| 36 | `36-local-revisar-con-duda.jpg` | `/b/camara` | local La Espiga, plan Intelligence | Revisá y publicá cuando la IA duda de la cantidad: marca el dato dudoso y pide confirmarlo antes de publicar. |
| 37 | `37-local-publicado.jpg` | `/b/camara` | local La Espiga, plan Intelligence | Publicado: confirmación con el resumen (packs, plata potencial, kilos y segundos desde la foto). |
| 38 | `38-local-estacion-vacia.jpg` | `/b/estacion` | local La Espiga, plan Smart | Balanza conectada / estación (Smart e Intelligence), lista para pesar. En la demo se simula el pesaje con un botón. |
| 39 | `39-local-estacion-pesando.jpg` | `/b/estacion` | local La Espiga, plan Smart | La balanza con algo encima: peso, qué reconoció y los botones "Para vender" y "A la basura". |
| 40 | `40-local-merma.jpg` | `/b/estacion` | local La Espiga, plan Smart | A la basura: pide el motivo (sobró de producción, venció, se rompió, etc.) para que el dato de la merma sirva. |
| 41 | `41-local-retiros-pendientes.jpg` | `/b/retiros` | local La Espiga, plan Intelligence, con un retiro pendiente | Retiros: escanear el QR del cliente, escribir su código de 4 letras y la lista de lo que falta retirar. |
| 42 | `42-local-retiros-vacio.jpg` | `/b/retiros` | local La Espiga, plan Intelligence | Retiros sin pendientes: estado vacío. |
| 43 | `43-local-escanear.jpg` | `/b/escanear` | local La Espiga, plan Intelligence | Escanear el QR del cliente con la cámara. En esta captura no hay cámara (compu), así que muestra el aviso y la alternativa de escribir el código. |
| 44 | `44-local-impacto-semana.jpg` | `/b/impacto` | local La Espiga, plan Smart | Impacto, vista Semana: plata recuperada, kilos rescatados por día, CO₂ evitado, porcentaje vendido y cuánto se tiró y por qué. Botón para descargar. |
| 45 | `45-local-impacto-mes.jpg` | `/b/impacto` | local La Espiga, plan Smart | Impacto, vista Mes. |
| 46 | `46-local-reporte.jpg` | `/b/reporte` | local La Espiga, plan Smart | Descargar el reporte: período, formato (Excel o PDF) y secciones a incluir. Genera el archivo en el propio teléfono. |
| 47 | `47-local-cuenta-basico.jpg` | `/b/cuenta` | local La Espiga, plan Básico | Cuenta con el plan Básico: qué incluye, invitación a pasar a Smart, lista (carta, datos del local, equipos, reporte) y el modo demo para cambiar de plan. |
| 48 | `48-local-cuenta-smart.jpg` | `/b/cuenta` | local La Espiga, plan Smart | Cuenta con el plan Smart: suma el ítem de la balanza conectada. |
| 49 | `49-local-cuenta-intelligence.jpg` | `/b/cuenta` | local La Espiga, plan Intelligence | Cuenta con el plan Intelligence. |
| 50 | `50-local-equipos-balanza.jpg` | `/b/equipos` | local La Espiga, plan Smart | Equipos de cada plan: visor 360° de la balanza conectada (plan Smart). Se gira con el dedo; el selector pasa a la estación automática. Modelo 3D ilustrativo. |
| 51 | `51-local-equipos-estacion.jpg` | `/b/equipos` | local La Espiga, plan Intelligence | Equipos de cada plan: visor 360° de la estación automática de cámara y balanza (plan Intelligence). |
| 52 | `52-local-intel-resumen.jpg` | `/b/intel` | local La Espiga, plan Intelligence | Intelligence, pestaña Resumen: porcentaje de lo producido que terminó en la basura, evolución semanal, costo evitado, kilos y la sugerencia destacada. |
| 53 | `53-local-intel-sugerencias.jpg` | `/b/intel` | local La Espiga, plan Intelligence | Intelligence, pestaña Sugerencias: recomendaciones de producción, ventas y precios, con filtro por tipo. |
| 54 | `54-local-intel-datos.jpg` | `/b/intel` | local La Espiga, plan Intelligence | Intelligence, pestaña Datos: cuándo se reservan los packs, qué tamaño se vende más, zonas de los clientes y momento del mes. |
| 55 | `55-local-intel-sucursales.jpg` | `/b/intel` | local La Espiga, plan Intelligence | Intelligence, pestaña Sucursales: ranking de desperdicio en porcentaje (no en kilos) y la mayor diferencia entre sucursales. |
| 56 | `56-local-sugerencia-detalle.jpg` | `/b/intel` | local La Espiga, plan Intelligence | Detalle de una sugerencia: qué hacer, por qué, evidencia con gráfico, valor estimado, confianza y botones para aplicarla o descartarla. |
| 57 | `57-local-hoja-plan-demo.jpg` | `/b/hoy` | local La Espiga, plan Intelligence | Hoja para cambiar el plan de la demo (Básico, Smart, Intelligence) con lo que incluye cada uno, y pasar al modo cliente. |
| 58 | `58-local-hoja-ver-planes.jpg` | `/b/cuenta` | local La Espiga, plan Básico | Hoja "Ver qué incluye" desde Cuenta: comparación de los planes. |
| 59 | `59-local-hoja-carta.jpg` | `/b/cuenta` | local La Espiga, plan Intelligence | Hoja con la carta de productos del local; tocar uno permite cambiar el precio. |
| 60 | `60-local-hoja-opciones-pack.jpg` | `/b/hoy` | local La Espiga, plan Intelligence | Hoja de opciones de un pack publicado: cambiar cantidad, precio, condiciones o quitarlo. |
| 61 | `61-local-hoja-sucursal.jpg` | `/b/intel` | local La Espiga, plan Intelligence | Hoja para elegir qué sucursal mirar en Intelligence. |
