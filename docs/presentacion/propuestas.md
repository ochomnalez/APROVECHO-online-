# Presentación de tesis (20 min) — 5 propuestas

Firma: claude-octi-presentacion · Estado: **solo propuestas, sin construir, 0 créditos gastados.**

## Base común (vale para cualquiera de las 5)

- **Un solo HTML** que se abre en el navegador, a pantalla completa. Sin PowerPoint.
- **Video de onboarding** (`video/salidas/onboarding-v6.mp4`, 1:31) incrustado, sin conexión a internet.
- **App funcionando adentro** (iframe del prototipo), se puede tocar en vivo.
- **Todos los números en un único archivo `datos.json`.** Si cambia el economics, se cambia ahí y toda la presentación se actualiza (separando siempre *medido* de *estimado*).
- **Modo orador:** reloj de 20 min, aviso si vas atrasado, notas, teclado/clicker. **Plan B:** versión grabada en video por si falla la compu o el WiFi.
- Animaciones: GSAP + SVG + canvas (motion graphics a medida, sin plantillas). Tipografía y paleta de la marca; nada de "AI slop" (CLAUDE.md §9.10).

## Propuesta 1 — «El Recorrido» (cámara que viaja por un mapa)
Un solo lienzo enorme: un barrio dibujado. La cámara viaja de la panadería → la bolsa → el consumidor → el panel del comercio. Cada parada es un capítulo; el zoom es la transición. El video y la app viven como "pantallas" dentro del mapa.
- **Impacto:** muy cinematográfica, se entiende la cadena de valor de un vistazo.
- **Riesgo:** si abusás del zoom marea; hay que cuidar el ritmo. Difícil de reordenar si cambia el guion.

## Propuesta 2 — «El Teléfono es el escenario» (la app como protagonista)
Un celular y una tablet gigantes en el centro. La presentación se cuenta *desde la app*: cada capítulo es un estado de la app real (publicar pack → reservar → retirar → ver métricas). Los datos del plan aparecen alrededor como anotaciones animadas.
- **Extra de alto impacto:** QR en pantalla → el jurado abre la app en su celular y compra un pack en vivo.
- **Impacto:** la demo *es* la presentación; muy difícil de olvidar.
- **Riesgo:** depende de que el prototipo esté estable; necesita Plan B.

## Propuesta 3 — «Un día de comercio» (línea de tiempo con reloj)
La pantalla es un reloj de 7:00 a 22:00. Mientras avanza, el mostrador de una panadería se va llenando y vaciando; a las 18:00 aparece el excedente y entra APROVECHO. El orador controla la hora con un deslizador. Cada hito del reloj abre un capítulo (problema, solución, modelo, impacto).
- **Impacto:** el desperdicio se *ve* nacer; muy didáctico, ideal para tesis.
- **Riesgo:** exige ilustrar el mostrador (SVG a medida); más trabajo de arte.

## Propuesta 4 — «El Simulador» (presentación que se puede mover en vivo)
El corazón son sliders: % de packs vendidos, precio, cantidad de comercios, plan (Base/Smart/Intelligence). Los gráficos del economics se recalculan en pantalla. Respondés preguntas del jurado ("¿y si vendés solo el 40%?") moviendo un control.
- **Impacto:** demuestra dominio del modelo; perfecta mientras el economics aún cambia.
- **Riesgo:** hay que validar las fórmulas contra el Excel; si no, es un error público.

## Propuesta 5 — «El Diario» (editorial: portada, notas, fotos reales)
Formato de diario/revista: la presentación es una portada que se "da vuelta" por secciones (El problema, La solución, La plata, El impacto). Fotos reales, tipografía editorial, recortes y datos como infografías animadas. Video y app aparecen como "notas multimedia".
- **Impacto:** identidad muy distinta a cualquier presentación; muy de marca humana y cercana.
- **Riesgo:** la menos interactiva de las cinco; la app queda más "pegada".

## Mi recomendación

**Híbrido: P2 como columna vertebral + P4 para la parte económica + toques de P3 (reloj) en el problema.**
Razón: la demo en vivo y los números movibles son lo que más convence a un jurado; lo demás es envoltura.

## Guion de tiempos (20 min) sobre el híbrido

| Min | Bloque | Qué se ve |
|---|---|---|
| 0–2 | Gancho + problema | Reloj del día de la panadería, excedente que nace (medido vs. estimado) |
| 2–4 | Solución | Pack a 50%, retiro en local, cómo funciona |
| 4–6 | Video onboarding | Video 1:31 en pantalla grande |
| 6–11 | Demo de la app (en vivo) | Publicar → reservar → retirar; QR para que el jurado pruebe |
| 11–15 | Modelo y economics | Simulador con sliders (planes Base / Smart / Intelligence) |
| 15–17 | Impacto | Datos medidos y estimados, sin exagerar |
| 17–18 | Próximos pasos | Hoja de ruta |
| 18–20 | Cierre + reserva | Cierre fuerte; 2 min de colchón |

## Qué necesito de vos para pasar a construir

1. ¿Cuál propuesta (o híbrido) elegís?
2. ¿Dónde se presenta (proyector 16:9, qué compu, hay internet)? Define el Plan B.
3. ¿Quién orador/es: una persona o dos? (cambia el modo orador).
4. ¿Formato académico obligatorio (portada con facultad, índice, bibliografía)?
5. Cuándo se cierra el economics, para fijar `datos.json`.
6. Estimación de armado: base + 1 capítulo de muestra = una sesión mediana; completo = 2–3 sesiones. **No usa créditos de imagen/video/voz** salvo que pidas generar fotos nuevas (consulto antes).
