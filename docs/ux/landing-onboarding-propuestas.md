# Onboarding de la landing · 3 conceptos (D-038)

> Firma: `claude-octi-qa` · 2026-11-09 · Prototipos funcionales en `docs/ux/onboarding-prototipos/` (abrir el `.html` en el navegador; con servidor local si hace falta: `python3 -m http.server` desde la raíz y entrar a `/docs/ux/onboarding-prototipos/`). Capturas en `docs/qa/capturas/onboarding/`.

## Los 7 pasos (de `docs/fuente/07`, Onboarding)

| # | Paso | Texto en pantalla (≤ 8 palabras) |
|---|---|---|
| 1 | Contacto | Escribinos o sumate desde la web. |
| 2 | Registro | Cargá tus datos y elegí tu plan. |
| 3 | Verificación | Revisamos habilitación y carnet. |
| 4 | Configuración | Categorías, precios y horarios. |
| 5 | Arranque | Bolsas, sticker y cartel con QR. |
| 6 | Instalación (*solo Smart e Intelligence*) | Balanza, tablet y cámara en tu mostrador. |
| 7 | Primera publicación | Publicamos juntos tu primer pack. |

Reglas que respetan los tres: sin "75%" (D-031), sin tiempos prometidos ("en 2 minutos" es SUPUESTO), el 0,42 kg de la balanza se rotula **Medido** y es dato de ejemplo, no un resultado real. El paso 6 siempre aparece marcado como opcional por plan.

## Concepto A · «El mostrador que se arma»
**Idea:** una sola ilustración (un mostrador de comercio, vista frontal) a pantalla fija. Cada paso del scroll le suma una pieza: celular → formulario → sello de verificación (se dibuja el tilde) → categorías → bolsas, cartel QR y sticker en la vidriera → balanza + tablet + cámara → primer pack que aparece como notificación. Al terminar, el local está completo: es la metáfora de "armamos tu comercio".

**Storyboard por scroll** (escenario fijo, ~760 vh de recorrido)
1. Mostrador vacío → entra el celular con un mensaje. *«Escribinos o sumate desde la web.»*
2. Aparece el formulario con los 3 planes. *«Cargá tus datos y elegí tu plan.»*
3. El sello se dibuja y el tilde se traza. *«Revisamos habilitación y carnet.»*
4. Tres categorías con precio y horario. *«Categorías, precios y horarios.»*
5. Bolsas sobre la mesada, cartel QR, sticker en la ventana. *«Bolsas, sticker y cartel con QR.»*
6. Balanza, tablet con "0,42 kg", cámara. Etiqueta "Solo Smart e Intelligence". **Entra video:** `G-smart.mp4` (estación real) en un recuadro. *«Balanza, tablet y cámara en tu mostrador.»*
7. Notificación de pack publicado. **Video:** `D-base.mp4` (publicar desde el celu). *«Publicamos juntos tu primer pack.»*

**Mobile:** la ilustración arriba (ancho completo), número + título + frase debajo, barra de 7 tramos. El recuadro de video se achica a 44 %. Probado a 390 px sin scroll horizontal.
**Recursos:** SVG inline + ~60 líneas de JS (progreso de scroll → opacidad/desplazamiento) + 2 clips. Nada de librerías.
**Esfuerzo:** medio (1 día para pulir ilustración y sumar Intelligence). **Riesgos:** la ilustración tiene que dibujarse con oficio (hoy es esquemática); el recuadro de video tapa parte de la escena en mobile en el paso 7; requiere pasos extra para Intelligence si se quiere mostrar la conexión de inventario.
**Fortaleza:** cumple al pie de la letra "hecho en código" y funciona sin video; liviano. **Debilidad:** es la más "diagrama": menos calidez humana.

## Concepto B · «La ruta de 7 paradas»
**Idea:** el scroll vertical mueve una ruta **horizontal**. Una bolsa de APROVECHO viaja por una línea punteada que se va pintando en corte (naranja tostado) y se detiene en 7 paradas. Cada parada es una tarjeta con su ilustración o clip. La parada 6 es una **bifurcación** marcada "Solo Smart e Intelligence". Termina en la parada 7: la primera venta.

**Storyboard por scroll** (~640 vh)
1–4. Tarjetas con ícono dibujado (celular, formulario, sello, categorías); la activa se agranda y las demás se apagan. Frase corta debajo de cada una.
5. Tarjeta con **clip `H-apertura.mp4`** (celu en el mostrador). *«Bolsas, sticker y cartel con QR.»*
6. Tarjeta con **clip `G-smart.mp4`** y chip "Solo Smart e Intelligence". *«Balanza, tablet y cámara en tu mostrador.»*
7. Tarjeta con **clip `D-base.mp4`**. *«Publicamos juntos tu primer pack.»*

**Mobile:** misma mecánica; tarjetas al 78 % del ancho (se ve la siguiente asomando, invita a seguir). Contador "n / 7" arriba. Sin overflow.
**Recursos:** SVG + JS (translateX por progreso) + 3 clips.
**Esfuerzo:** bajo-medio. **Riesgos:** el movimiento horizontal guiado por scroll vertical desorienta a algunas personas si no hay indicio claro (lo da la ruta y el contador); en pantallas bajas las tarjetas con video quedan apretadas.
**Fortaleza:** la más fácil de escanear y de mantener (agregar un paso = agregar una tarjeta); el "viaje de la bolsa" es una imagen de marca propia. **Debilidad:** menos "magia" que A; el video es protagonista solo en 3 de 7.

## Concepto C · «El video que avanza con vos»
**Idea:** el contenido principal **es el video real**. Una ventana fija (sticky) muestra los clips con crossfade mientras, al costado, pasan los 7 pasos con numeral enorme. Sobre el video aparecen chips de dato: "Verificado", **"Medido · 0,42 kg"** (cuenta como una balanza), "Pack publicado". Una barra de 7 tramos marca el avance.

**Storyboard** (scroll nativo, sin altura artificial; cada paso ocupa ~78 vh)
1–3. `H-apertura.mp4` (celular abriendo la app). Chip "Verificado" en el 3.
4. `F-apertura.mp4` (foto del producto/carta: D-035). *«Categorías, precios y horarios.»*
5. Foto aprobada `estacion-balanza-tablet.jpg` con zoom lento. *«Bolsas, sticker y cartel con QR.»*
6. `G-smart.mp4` + chip **Medido · 0,42 kg**. Etiqueta "Solo Smart e Intelligence".
7. `D-base.mp4` + chip "Pack publicado".

**Mobile:** la ventana de video queda fija arriba (16:9) y los pasos pasan debajo. Probado a 390 px.
**Recursos:** 4 clips (ya generados, comprimidos a ~0,2 MB en `onboarding-prototipos/media/`) + 1 foto + ~50 líneas de JS (IntersectionObserver). Sin SVG propio.
**Esfuerzo:** el más bajo. **Riesgos:** depende 100 % de la calidad de las tomas (hay un glitch ya resuelto en G, 2,0–3,4 s); las tomas son generadas con IA: hay que decidir si se comunican como "ilustrativas"; varios pasos (1–3) comparten el mismo clip, se nota la repetición; mala conexión = poster estático.
**Fortaleza:** es la más humana y la más rápida de construir; mira a personas reales usando la herramienta. **Debilidad:** **no cumple "hecho en código"** como pidió D-038 (solo el chip y la mecánica lo son).

## Comparación

| | A · Mostrador | B · Ruta | C · Video |
|---|---|---|---|
| Se arma "en código" (D-038) | Sí, 100 % | Sí + 3 clips | Parcial |
| Mucho gráfico / poco texto | Sí | Sí | Sí |
| Rol del video | Apoyo (pasos 6 y 7) | Tarjetas 5 a 7 | Protagonista |
| Calidez humana | Baja | Media | Alta |
| Mantenimiento | Medio | **Fácil** | Fácil |
| Peso aprox. | < 100 KB + 0,6 MB video | ~0,8 MB video | ~0,9 MB video + foto |
| Esfuerzo | Medio | Bajo-medio | Bajo |

## Recomendación
**Híbrido A + C, empezando por A.** A cumple D-038 al pie de la letra y es el diferencial de marca ("tu mostrador se arma"). Los clips de C resuelven lo que A no tiene: personas reales. Concretamente: **construir A, y en los pasos 6 y 7 sumar el recuadro de video de C** (ya está así en el prototipo). Si el tiempo aprieta (entrega 12/11), **B es la mejor opción de respaldo**: la más simple y robusta.
Antes de construir hace falta que **Octavio decida**: (1) A, B, C o el híbrido; (2) si las tomas con personas (generadas con IA) pueden verse en la landing y cómo se rotulan; (3) si hay que mostrar Intelligence en el paso 6.

## Recursos y accesibilidad (todos los conceptos)
- Clips comprimidos listos para usar: `docs/ux/onboarding-prototipos/media/` (960 px, sin audio, `preload="none"`, poster).
- `prefers-reduced-motion`: el prototipo pasa a modo estático (todo visible, apilado, sin pinned ni autoplay). Hay una lista de texto real para lectores de pantalla (el SVG lleva `aria-label`).
- Pendientes para la landing real: foco visible en cualquier control, el recuadro de video debe poder pausarse (WCAG 2.2.2), `lang="es-AR"`, y probar Lighthouse (los clips con `preload="none"` no pesan en la carga).

## Nota de QA sobre los prototipos
No son para producción: la ilustración de A es esquemática y debe dibujarse con más oficio; las fuentes se cargan de Google Fonts vía `tokens.css` (sin conexión cae a la tipografía de sistema).
