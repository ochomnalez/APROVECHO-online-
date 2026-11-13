// Fotografías locales en formato 4:3 y cajas de detección simuladas en coordenadas 400 × 300.
const ANCHO = 400;
const ALTO = 300;
const ruta = nombre => `./img/fotos/${nombre}.webp`;
const caja = (producto, x, y, w, h) => ({ producto, x, y, w, h });

const CATALOGO = {
  facturas: { nombre: 'Facturas surtidas', cajas: [
    caja('medialuna', 53, 4, 129, 91),
    caja('medialuna', 101, 96, 109, 79),
    caja('medialuna', 220, 49, 99, 91),
    caja('medialuna', 262, 128, 138, 72),
    caja('medialuna', 255, 222, 145, 78),
    caja('factura', 0, 72, 90, 96),
    caja('factura', 62, 201, 177, 99),
  ] },
  medialunas: { nombre: 'Medialunas', cajas: [caja('medialuna', 12, 35, 376, 252)] },
  pan: { nombre: 'Pan de campo', cajas: [caja('pan', 4, 2, 392, 296)] },
  sandwiches: { nombre: 'Sándwiches', cajas: [caja('miga', 41, 16, 260, 260)] },
  empanadas: { nombre: 'Empanadas', cajas: [caja('empanada', 8, 100, 382, 162)] },
  torta: { nombre: 'Torta de chocolate', cajas: [caja('torta', 127, 53, 191, 206)] },
};

export const MUESTRAS = Object.keys(CATALOGO);
export const nombreMuestra = id => CATALOGO[id]?.nombre || id;

export function foto(id) {
  const muestra = id === 'grasa' ? 'medialunas' : id;
  const item = CATALOGO[muestra] || CATALOGO.facturas;
  return { ...item, src: ruta(CATALOGO[muestra] ? muestra : 'facturas') };
}

export function fotoSvg(id) {
  return `<svg viewBox="0 0 ${ANCHO} ${ALTO}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="${foto(id).src}" width="${ANCHO}" height="${ALTO}"/></svg>`;
}

export function cajaPct({ x, y, w, h }) {
  const horizontal = n => (n / ANCHO * 100).toFixed(2);
  const vertical = n => (n / ALTO * 100).toFixed(2);
  return `left:${horizontal(x)}%;top:${vertical(y)}%;width:${horizontal(w)}%;height:${vertical(h)}%`;
}

const FOTOS_COMERCIO = {
  c1: 'facturas', c2: 'pollo-crocante', c3: 'torta', c4: 'hamburguesa',
  c5: 'verduleria', c6: 'hamburguesa', c7: 'plato-del-dia', c8: 'pan',
};
const FOTOS_CATEGORIA = {
  Panificados:'pan', Pastelería:'torta', Sándwiches:'sandwiches', Viandas:'ensalada',
  'Sin TACC':'ensalada', Vegano:'verduleria', agotan:'empanadas', mejores:'pizza',
};
export function fotoComercio(comercioId,categoria,tam,productoId) {
  const productos={medialuna:'medialunas',grasa:'medialunas',factura:'facturas',pan:'pan',miga:'sandwiches',empanada:'empanadas',torta:'torta',ricota:'tarta',budin:'torta',salvado:'pan'};
  if(productos[productoId]) return ruta(productos[productoId]);
  if(comercioId==='c5' && tam==='chico') return ruta('ensalada');
  return ruta(FOTOS_COMERCIO[comercioId] || FOTOS_CATEGORIA[categoria] || 'ensalada');
}
export const fotoCategoria = categoria => ruta(FOTOS_CATEGORIA[categoria] || 'ensalada');
