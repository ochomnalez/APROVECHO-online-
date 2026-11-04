// Cada hito tiene un ID estable. Estados: listo, revision, en-curso o pendiente.
// "Listo" requiere un entregable verificable. Al avanzar, registrá autor y enlace.
const tablero = {
  actualizado: "2026-11-03",
  por: "Codex",
  registro: "../handoffs/2026-11-03-tablero-prioridades-y-trazabilidad.md",
  frentes: [
    {
      id: "app",
      titulo: "Aplicación",
      fase: "01 · Prioridad actual",
      resumen: "Próximo paso: cerrar el alcance y preparar el brief del prototipo.",
      hitos: [
        { id: "APP-01", titulo: "Bocetos navegables de consumidor y Base", estado: "listo", por: "Claude · UX", nota: "UX v2 integrada, con detección simulada.", enlace: "../handoffs/2026-11-05-ux-flujo-v2.md" },
        { id: "APP-02", titulo: "Cerrar el alcance y preparar el brief", estado: "pendiente", nota: "Revisar UX v2, pantallas anteriores si están disponibles y D-012 a D-015. Validar el bloque de construcción." },
        { id: "APP-03", titulo: "Completar UX de consumidor y Base", estado: "pendiente", nota: "Barra inferior, fotos reales variadas y detección de varios productos con cantidades (D-028)." },
        { id: "APP-04", titulo: "Diseñar Smart", estado: "pendiente", nota: "Tablet con balanza, destino del excedente y tasa de recuperación (D-029)." },
        { id: "APP-05", titulo: "Diseñar Intelligence", estado: "pendiente", nota: "Panel web de sucursales, inventario y vencimientos, predicción y recomendaciones (D-029)." },
        { id: "APP-06", titulo: "Construir el prototipo navegable", estado: "pendiente", nota: "Flujos de consumidor y los tres planes, con integraciones simuladas (D-006)." },
        { id: "APP-07", titulo: "Probar la demo y preparar la entrega", estado: "pendiente", nota: "Verificar flujos y distinguir datos medidos, estimados y simulados." }
      ]
    },
    {
      id: "video",
      titulo: "Videos",
      fase: "02 · Después de la app",
      resumen: "Tres conceptos aprobados. Se elige un video para producir primero.",
      hitos: [
        { id: "VID-01", titulo: "Aprobar los conceptos", estado: "listo", por: "Claude · Marca + usuario", nota: "Presentación: «La vida de una medialuna». Comercios: «Una foto». Consumidores: «¿Qué me tocó hoy?» (D-020).", enlace: "../marketing/conceptos-videos.md" },
        { id: "VID-02", titulo: "Elegir qué video va primero", estado: "pendiente", nota: "Definir alcance y presupuesto de esa pieza." },
        { id: "VID-03", titulo: "Armar brief, guion y storyboard", estado: "pendiente", nota: "Validar el plan de producción antes de generar recursos." },
        { id: "VID-04", titulo: "Producir «La vida de una medialuna»", estado: "pendiente", nota: "Video de presentación. Su turno depende de la primera elección." },
        { id: "VID-05", titulo: "Producir «Una foto»", estado: "pendiente", nota: "Publicidad para comercios. Su turno depende de la primera elección." },
        { id: "VID-06", titulo: "Producir «¿Qué me tocó hoy?»", estado: "pendiente", nota: "Publicidad para consumidores. Su turno depende de la primera elección." }
      ]
    },
    {
      id: "landing",
      titulo: "Landing",
      fase: "03 · Última prioridad",
      resumen: "Alta de comercios, sección para inversores y lista de espera por barrio.",
      hitos: [
        { id: "LAN-01", titulo: "Preparar los textos", estado: "listo", por: "Claude · Marca", nota: "Contenido base integrado.", enlace: "../marketing/landing-contenido.md" },
        { id: "LAN-02", titulo: "Ordenar las secciones", estado: "listo", por: "Claude · UX", nota: "Boceto de landing integrado.", enlace: "../handoffs/2026-11-05-ux-landing.md" },
        { id: "LAN-03", titulo: "Cerrar el contenido y el brief", estado: "pendiente", nota: "Incorporar la lista de espera (D-024) y validar cifras públicas (D-019) y onboarding (D-030)." },
        { id: "LAN-04", titulo: "Construir y probar la landing", estado: "pendiente", nota: "Probar el alta de comercios y la lista de espera. La publicación requiere OK." }
      ]
    },
    {
      id: "identidad",
      titulo: "Identidad",
      fase: "Soporte para los tres frentes",
      resumen: "Sistema visual compartido entre app, videos y landing.",
      hitos: [
        { id: "ID-01", titulo: "Integrar el sistema visual v1", estado: "listo", por: "Claude · Identidad", nota: "Tokens y componentes disponibles.", enlace: "../handoffs/2026-11-05-identidad-sistema-visual.md" },
        { id: "ID-02", titulo: "Revisar tipografía y logo vigente", estado: "revision", por: "Codex · Identidad", nota: "DM Sans y referencia al badge original. Commit bf9de31.", enlace: "https://github.com/ochomnalez/APROVECHO-online-/pull/1" },
        { id: "ID-03", titulo: "Confirmar la vectorización fiel del badge", estado: "pendiente", nota: "Se usa el badge original mientras se decide (D-026)." }
      ]
    }
  ]
};
