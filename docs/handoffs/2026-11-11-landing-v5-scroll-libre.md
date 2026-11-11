# Handoff · Landing v5 · Volver sin repetir los recorridos

- **Fecha:** 2026-11-11
- **Firma:** `codex-octi-landing`
- **Rama:** `codex/aprovecho-landing`, continuación de `c601319`.

## Cambios pedidos por Octavio

- Barra de progreso en el borde izquierdo (`left: 0`), más angosta y con margen reservado en las imágenes/textos móviles.
- Eliminar por completo el botón del menú y su panel duplicado. Los enlaces quedan expuestos; se agregó Planes. En anchos menores de 1000 px se muestran en una segunda fila desplazable, manteniendo el acceso por teclado y sin desborde de la página.
- Cada plan mantiene su recorrido reversible mientras no se termine. Al salir por el final, conserva la última imagen, elimina su pin y el espacio artificial y compensa el scroll para no desplazar visualmente el contenido. Desde entonces, subir es scroll normal y no reproduce las etapas hacia atrás.
- El estado de finalización es independiente por plan y dura la visita actual, incluyendo cambios de pestaña y de tamaño. Recargar la página inicia una visita nueva.
- En celular, al terminar de leer el último paso se conserva la imagen final y el teléfono deja de ser sticky; el resto queda en flujo normal. No se bloquea el scroll nativo.
- Confirmado nuevamente en el HTML generado: `#datos` está dentro de `#quienes-somos`, la calculadora no aparece y `#alta` precede a `#preguntas`, que es el último bloque de la vista principal.

## Versiones y fuentes

El enlace de Claude compartido antes seguía mostrando la versión anterior y NO refleja automáticamente esta rama. No se publicó una nueva web ni se actualizó ese artifact.

Editar `landing/src/v5/` y reconstruir con `python3 landing/src/build_v5.py`. Los tres archivos generados se reconstruyeron sin edición manual; la v4 no cambió.

## Pruebas

- Regresión guardada en `landing/src/v5/tests/plan-scroll.cjs`: comprobar estructura, retiro del menú/calculadora, retroceso antes del final, liberación al terminar Base/Smart/Intelligence, continuidad visual (desvío menor de 5 px), última imagen/paso conservados y persistencia al cambiar pestaña o pasar de escritorio a móvil y volver.
- Comando ejecutado en esta máquina (servidor de `landing/` en puerto 8766):

```sh
NODE_PATH=/workspace/aprovecho-cloud-setup/browser/node_modules node landing/src/v5/tests/plan-scroll.cjs
```

El test requiere Playwright y Chromium. Admite `LANDING_TEST_URL` y `CHROMIUM_PATH` para otro servidor o navegador local; Playwright se instaló fuera del repo.

- Pruebas funcionales en Chromium a 1440×900, 1024×768, 768×1024 y 390×844; adicionalmente movimiento reducido a 390×844. Sin errores JS ni desborde horizontal en esas pruebas.
- Prueba adicional de finalización nativa en 390 y 768 px: los tres planes conservan el último paso al subir.
- Capturas revisadas: `/tmp/completed-smart.png`, `/tmp/native-390-base.png`, además de las restantes `/tmp/completed-*.png` y `/tmp/native-*.png`.
- `git diff --check`, validación de sintaxis JS y reconstrucción correctos.

## Pendientes

- Recordar reubicar «Cuánto te queda» cuando Octavio defina dónde. Su fuente retirada está en `landing/src/v5/partials/cuenta-pendiente.html`.
- Publicación y enlace actualizado siguen pendientes; no usar el artifact viejo para verificar estos cambios.
- Sin generaciones externas ni servicios pagos. No se afirma validación en Safari/WebKit ni un puntaje Lighthouse nuevo.
