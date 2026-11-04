# Brief · Ajustes de identidad (después de la devolución del usuario)

- **Rol:** diseñador/a de marca e interfaces.
- **Rama:** `claude/aprovecho-identidad` o `codex/aprovecho-identidad` · PR contra `claude/gallant-planck-ps6te6`.
- **Entrega:** jueves 5/11, 18:00 (hora de Argentina).

## Contexto

- El usuario decidió que **el logo queda como estaba** (D-026). El sello original está en `docs/marca/logo-oficial/aprovecho-logo-sello-original.webp` (1254 px). El logo con medialuna de la v1 **no se usa** (queda archivado).
- Pidió **cero "AI slop"** (CLAUDE.md §9.10). La propuesta anterior usaba Inter, que es justo la tipografía típica de IA.
- Se mantienen el acento **corteza** (D-017) y el resto de los tokens, salvo lo que se indica abajo.

## Tareas

1. **Logo oficial en todo el sistema:**
   - Exportar el sello en PNG de 64, 128, 256, 512 y 1024 px.
   - Favicon e ícono de app **derivados del sello sin cambiar su diseño** (por ejemplo, un recorte del centro).
   - Mover el logo con medialuna a `docs/marca/logo/archivo-v1/`.
2. **Tipografía:** proponé **3 combinaciones** con carácter, todas de Google Fonts, que armonicen con las letras redondeadas y en negrita del sello. Prohibidas: Inter, Space Grotesk, Poppins, Roboto y Montserrat como protagonista.
   - Mostralas en `docs/marca/tipografia-opciones.html` con un título, un párrafo, un botón y un número grande cada una.
   - Recomendá una.
3. **Actualizar** `tokens.css`, `tokens.json`, `componentes.html` y la guía con el logo oficial y la tipografía recomendada (marcada "a confirmar").
4. **Revisar contra el "AI slop"** todo lo que entregaste: íconos, sombras y layouts de plantilla.

## Cierre

Handoff, fila en `docs/ESTADO.md`, línea en `docs/BITACORA.md` y push. Las decisiones que propongas van como `PROPUESTA-identidad-N`.
