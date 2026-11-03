# 07 · Operaciones y tecnología

> Fuente: sección 14 del plan. Imágenes en `imagenes/14-*.jpg` y mockups en `imagenes/11-*.jpg`.

## 14.1 Cadena de valor

APROVECHO no produce, compra ni almacena alimentos. La cadena empieza cuando ya existe el excedente y termina cuando se convierte en una venta y en información.

**Actividades primarias**
1. **Captura del excedente:** el comercio lo registra con foto (Base) o con foto y peso (estación).
2. **Armado del pack:** la IA propone cantidad, tamaño, precio y horario; el comercio completa el checklist y confirma.
3. **Publicación y venta:** el pack aparece en el mapa y el consumidor lo paga en la app.
4. **Retiro:** el consumidor lo busca en el local y el comercio escanea el QR. No hay envíos.
5. **Medición:** cada venta suma datos al dashboard y a los reportes.

**Actividades de apoyo:** tecnología (apps, vision recognition, motor de packs, datos en la nube); componentes físicos (estaciones y bolsas biodegradables); gestión de comercios (alta, verificación, instalación, capacitación y soporte por WhatsApp); proveedores (Mercado Pago, Google Maps, Systel, Samsung y bolsas); analistas (validan los informes de Intelligence).

**Dos valores:** con la venta, el comercio recupera plata y el consumidor ahorra; con el dato, el comercio sabe cuánto le sobra y puede producir lo justo.

## 14.2 Esquema de la solución

Dos interfaces conectadas a una misma plataforma: **comercio** (registrar, revisar, publicar y validar retiros) y **consumidor** (descubrir, reservar, pagar y retirar). Hay además un **dashboard web** y un **panel interno** para el equipo.

Flujo resumido: **Comercio** (registra lo que sobró, confirma los packs, valida el retiro y mira sus resultados) → **Plataforma** (reconoce la comida, propone los packs, muestra las ofertas, cobra, crea el QR y guarda todo) → **Consumidor** (encuentra packs cerca, paga en la app, retira en el local y ve cuánto ahorró).

### App de comercios: pantallas

| Sección | Qué se hace y cómo |
|---|---|
| **Registro del comercio** | Crea la cuenta con los datos del local (nombre, dirección, CUIT, rubro), elige el plan y sube la **habilitación municipal** y el **carnet de manipulador**. APROVECHO verifica antes de activar |
| **Configuración del local** | Carga su menú con productos, categorías, precios y franjas de retiro (editable) |
| **Cargar excedente** | **Botón principal del inicio.** En Base abre la cámara; en Smart e Intelligence se apoya en la balanza, que registra el peso, y la tablet saca la foto sola |
| **Propuesta de packs** | Muestra categoría reconocida, peso (kg), cantidad de packs, tamaño, precio con 50% de descuento y horario. Todo editable. El empleado confirma alérgenos o sin TACC y toca **"Publicar"** |
| **Mis packs** | Packs del día con estado **disponible, reservado o retirado**. Permite eliminar un pack que ya no esté en condiciones |
| **Retiros** | Reservas del día con nombre y horario. Al llegar el cliente: **"Escanear QR"** y la venta queda cerrada |
| **Destino del excedente** (Intelligence) | Al final del día marca qué pasó con lo no vendido: reutilizado, donado o descartado |
| **Dashboard** | Packs recuperados, ventas, ingreso recuperado (ya sin comisión), kilos, impacto ambiental y Score. Smart e Intelligence suman reportes **descargables** |
| **Soporte** | Acceso directo al chat por WhatsApp |

### App de consumidores: pantallas

| Sección | Qué se hace y cómo |
|---|---|
| **Registro** | Cuenta con mail o Google; acepta compartir su ubicación |
| **Inicio** | Tipos de comercio, categorías, promociones y filtro por condición alimentaria (**sin TACC, vegetariano, vegano**) |
| **Mapa y lista** | Comercios cercanos con packs disponibles, en un mapa o en una lista ordenada por distancia |
| **Detalle del pack** | Comercio, precio original y con descuento, tipo de alimentos, dulce o salado, cantidad aproximada, horario de retiro, calificación del local, estimación nutricional orientativa y breve descripción |
| **Reserva y pago** | Botón **"Reservar"**; paga en la app con Mercado Pago o tarjeta y el pack queda a su nombre |
| **Mis reservas** | QR de cada reserva activa, dirección y horario. Después del retiro, **calificar al comercio** |
| **Mi perfil** | Packs rescatados, plata ahorrada e impacto (CO₂e) acumulados, configuración y medios de pago |
| **Avisos** (previstos) | Notificaciones cuando aparece un pack cerca o en un comercio favorito |

Barra inferior en el mockup: **Inicio · Mapa · Reservas · Perfil**. Pantalla de perfil "Tu impacto": "Ahorraste en total $… (ARS)", "N packs rescatados — comprados y retirados", "Huella asociada ≈ N kg CO₂e [Estimado]" y "Ver mis compras".

### Pantallas de dashboard en los mockups

- **Base, "Tu resumen":** tarjetas de Ingreso recuperado (después de la comisión), Packs recuperados (vendidos y retirados con QR) y APROVECHO Score (barra); desglose ventas → comisión (25%) → para tu comercio; Alimento recuperado ≈ kg [Estimado, por foto]; Huella asociada ≈ kg CO₂e [Estimado, factor FAO 2,53]; aviso "Los datos de alimento e impacto son estimados".
- **Smart, "Resumen del comercio: Medí y entendé tus excedentes":** pestañas Resumen, Evolución, Categorías, Ingresos, Impacto y Score. Tarjetas: excedente generado, alimento recuperado [Medido], sin recuperar y tasa de recuperación. Gráfico de evolución (generado vs. recuperado), excedente por categoría (panificados, pastelería, sándwiches), resultado económico (ingresos recuperados, valor sin recuperar [Estimado]) y huella. Botón "Descargar reporte".
- **Intelligence, vista corporativa:** menú lateral Resumen, Sucursales, Predicciones, Demanda, Impacto, Integraciones y Soporte. "Predicciones: Anticipá excedentes y decidí con tiempo"; gráfico "Riesgo de excedente al cierre" (observado vs. proyectado); "Acciones sugeridas" (revisar la producción del turno, anticipar la publicación de packs); "Comparación entre sucursales" (riesgo alto, medio o bajo por categoría); "Fuentes de información" (inventario, ventas, marketplace); aviso "Predicciones orientativas. Revisión por analistas y validación del comercio".
- **Intelligence en el escritorio:** "Sistema de inventarios: Conectado"; "Productos por vencer"; "Packs sugeridos" (Pack desayuno, Pack almacén) con botones "Revisar" y "Confirmar y publicar".

## 14.3 Plataforma y componentes

**Componentes digitales**

| Componente | Función |
|---|---|
| Gestión de comercios y usuarios | Perfiles, locales, horarios, planes y preferencias |
| Captura y reconocimiento | Recibe la imagen e identifica el alimento y la cantidad con vision recognition |
| Motor de IA de packs | Convierte el excedente en una propuesta de packs, peso, precio y horario |
| Marketplace B2C | Publica los packs y los muestra por cercanía y disponibilidad |
| Geolocalización | Ubica comercios y consumidores |
| Pagos digitales | Cobro mediante un proveedor externo |
| QR de retiro | Valida la entrega y cierra la operación |
| Base de datos | Packs, ventas, retiros, excedentes y métricas históricas |
| Analytics y dashboards | Reportes y, en Intelligence, patrones y recomendaciones |

**Componentes físicos**
- Base: nada; el celular del comercio y el del consumidor.
- **Estación (Smart e Intelligence):** balanza Systel Croma de 31 kg, tablet Samsung Galaxy Tab A9 (solo APROVECHO), brazo de soporte, cable y hub USB-C. **Costo: USD 523** (balanza 215, tablet 196, cable 43, hub 29, soporte unos 40). Intelligence usa una o más por sucursal; los envasados entran desde el inventario.
- **Packaging:** bolsas biodegradables con la marca, de un proveedor externo. **El primer lote es gratis con el alta.**

## 14.4 Flujo de operación y logística

**Operación de punta a punta**: 1 Foto → 2 Análisis → 3 Propuesta → **4 Checklist** → 5 Publicación → 6 Compra → **7 Retiro** → 8 Liquidación (75/25) → 9 Registro (dashboard y calificación). Los pasos 4 y 7 son los que **no pueden fallar**.

**Checklist obligatorio antes de publicar:** el producto es del día, se respetó la cadena de frío y los alérgenos y restricciones están informados. Sin checklist no se publica, porque "si el pack no está o no cumple, el consumidor no vuelve".

**Onboarding del comercio**
1. **Contacto:** landing de alta, recomendación de otro comerciante o, en Smart e Intelligence, el equipo comercial.
2. **Registro:** nombre, dirección, CUIT y rubro; elige el plan y conecta Mercado Pago o tarjeta para cobrar.
3. **Verificación:** habilitación municipal y carnet de manipulador; APROVECHO revisa y aprueba.
4. **Configuración:** categorías, precio habitual de cada una y franjas de retiro.
5. **Arranque:** capacitación corta (video), primer lote de bolsas, sticker de vidriera y cartel de caja con QR.
6. **Instalación** (solo Smart e Intelligence): estación y, en Intelligence, conexión del inventario.
7. **Primera publicación acompañada** por el equipo, para que salga bien.

**Logística**
- **Packs:** sin envío; el consumidor retira.
- **Packaging:** el proveedor produce y guarda (APROVECHO no tiene stock). Primer lote en el alta, o enviado por el proveedor si el comercio se sumó por la landing. La reposición la compra el comercio directo al proveedor al precio negociado por APROVECHO; **la app avisa cuándo conviene reponer**.
- **Estaciones:** compra en volumen, armado, configuración, instalación, retiro si el comercio deja el plan y reemplazo si falla.
- **Plata:** Mercado Pago o tarjeta; se reparte 75% al comercio y 25% a APROVECHO.

**Contingencias** (todo queda registrado como incidencia)

| Situación | Qué se hace |
|---|---|
| El consumidor cancela | Hasta **2 h antes** del horario de retiro se devuelve la plata; después no |
| El consumidor no retira | Se cobra igual; el comercio puede republicarlo, usarlo o donarlo, y lo marca en la app |
| El comercio no tiene el pack | Devolución total; aviso al comercio y **baja su Score**; si se repite, se suspende la cuenta |
| El pack llega en mal estado | El consumidor reporta con foto y se le devuelve la plata; APROVECHO revisa y, si se repite, suspende |
| Falla el pago | No se genera la reserva ni el QR; se puede reintentar |
| Falla la estación | Se sigue cargando con el celular, como en Base, hasta la reparación |
| Reclamo por alérgenos o salud | Soporte atiende en el momento; los alérgenos los confirma el comercio y la responsabilidad es suya (términos y condiciones) |

## 14.5 Tecnología

| Tecnología | Para qué | Plan | Propia o de terceros |
|---|---|---|---|
| Apps (comercio y consumidor) y dashboard web | Interfaz de uso | Todos | Propia |
| Vision recognition | Reconoce el alimento y estima la cantidad desde la foto | Todos | **Propia, sobre un modelo existente** |
| Motor de IA de packs | Propone cantidad, peso, precio y horario | Todos | Propia |
| Estación de medición | Peso real | Smart e Intelligence | Kit propio con Systel y Samsung |
| Pagos (Mercado Pago y tarjeta) | Cobra, reparte 75/25 y hace devoluciones | Todos | Terceros |
| Mapas (Google Maps Platform) | Packs cercanos | Todos | Terceros |
| QR de retiro | Confirma la entrega y cierra la venta | Todos | Propia |
| **Supabase** | Backend | Todos | Terceros |
| **Vercel** | Despliegue del sitio web | Todos | Terceros |
| **N8N** | Automatización de flujos de la app | Todos | — |
| Base nutricional | Estimación nutricional orientativa (FoodData Central, USDA, API gratuita) | Todos | Propia con datos reales del negocio |
| Dashboard y reportes | Resultados y evolución | Todos (más completo en Smart e Intelligence) | Propia |
| Recomendación y predicción | Patrones y cuánto producir | Intelligence | Propia |

- **Vision recognition:** parte de un modelo existente ajustado al negocio. Puede equivocarse, así que siempre es una propuesta que una persona confirma; **cada corrección se guarda y mejora el modelo**. En Smart e Intelligence el peso real afina la propuesta.
- **Nutrición:** se cruza el alimento y el peso con FoodData Central y se muestra como aproximado. **Los alérgenos nunca los decide la IA.**

**Herramientas internas:** Google Cloud (servidores, base de datos y fotos); **CRM propio** dentro del panel interno, solo para administradores (seguimiento desde el contacto hasta el alta y las grandes cuentas); WhatsApp Business (soporte); **Firebase** (notificaciones: packs cerca, reservas nuevas y recordatorios de retiro); **panel interno** (verificar documentos, incidencias, comercios suspendidos, estaciones instaladas y seguimiento de clientes).

**Analítica de Intelligence:** datos de cada operación → patrones → recomendaciones → predicción. Primero se muestra qué sobra, cuánto, cuándo y dónde; después se comparan períodos y sucursales; las recomendaciones y la predicción llegan cuando hay historial suficiente, porque "sin datos de calidad un modelo predictivo no sirve". Las comparaciones con otras empresas siempre son anónimas.

**Integraciones:** inventario por **Excel o CSV** subido al panel y después por **API** cuando el cliente lo pide (prevista para 2030). La integración con sistemas de caja (POS) o de gestión (ERP) no está en el lanzamiento.
