// Inventario de envasados de Intelligence. El archivo se procesa en este navegador.
import { ahora, S } from './store.js';
import { isoDia, sumarDias } from './util.js';
import { SUCURSALES } from './intel.js';

const COLUMNAS = ['sucursal', 'producto', 'cantidad', 'vencimiento', 'precio_unitario'];

export function leerInventario(texto) {
  const lineas = texto.replace(/^\uFEFF/, '').trim().split(/\r?\n/).filter(linea => linea.trim());
  if (!lineas.length) throw new Error('El CSV está vacío.');
  const separador = lineas[0].includes(';') ? ';' : ',';
  const celdas = linea => {
    const valores = [];
    let valor = '';
    let entreComillas = false;
    for (let i = 0; i < linea.length; i++) {
      const letra = linea[i];
      if (letra === '"') {
        if (entreComillas && linea[i + 1] === '"') { valor += '"'; i++; }
        else entreComillas = !entreComillas;
      } else if (letra === separador && !entreComillas) {
        valores.push(valor.trim());
        valor = '';
      } else valor += letra;
    }
    if (entreComillas) throw new Error('Hay una celda con comillas sin cerrar.');
    return [...valores, valor.trim()];
  };
  if (celdas(lineas[0]).map(valor => valor.toLowerCase()).join(',') !== COLUMNAS.join(',')) {
    throw new Error('Revisá el encabezado del CSV y el orden de las columnas.');
  }
  if (lineas.length > 501) throw new Error('El archivo admite hasta 500 productos.');
  return lineas.slice(1).map((linea, indice) => {
    const valores = celdas(linea);
    const [sucursal, titulo, unidades, vencimiento, precio] = valores;
    const cantidad = Number(unidades);
    const precioUnitario = Number(precio?.replace(',', '.'));
    const fecha = new Date(vencimiento + 'T00:00:00Z');
    const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(vencimiento) && Number.isFinite(+fecha)
      && fecha.toISOString().slice(0, 10) === vencimiento;
    if (valores.length !== COLUMNAS.length || !SUCURSALES.some(s => s.id === sucursal)
      || !titulo || !Number.isSafeInteger(cantidad) || cantidad < 1 || !fechaValida
      || !Number.isFinite(precioUnitario) || precioUnitario <= 0) {
      throw new Error('Revisá la sucursal, el producto, la cantidad, la fecha y el precio en la fila ' + (indice + 2) + '.');
    }
    return { sucursal, titulo, cantidad, vencimiento, precioUnitario };
  });
}

export function verInventario(sucursal = S.sucursal) {
  const hoy = isoDia(ahora());
  const cerca = isoDia(sumarDias(ahora(), 3));
  const demo = [
    { sucursal: 'olivos', titulo: 'Yogures naturales', cantidad: 8, vencimiento: isoDia(sumarDias(ahora(), 1)), precioUnitario: 3050 },
    { sucursal: 'sanisidro', titulo: 'Galletitas de avena', cantidad: 4, vencimiento: isoDia(sumarDias(ahora(), 2)), precioUnitario: 6100 },
    { sucursal: 'martinez', titulo: 'Granola envasada', cantidad: 4, vencimiento: isoDia(sumarDias(ahora(), 5)), precioUnitario: 6100 },
  ];
  return (S.inventario ?? demo)
    .map((fila, indice) => ({ ...fila, indice, estado: fila.vencimiento < hoy ? 'Vencido' : fila.vencimiento <= cerca ? 'Por vencer' : 'Vigente' }))
    .filter(fila => sucursal === 'todas' || fila.sucursal === sucursal)
    .sort((a, b) => a.vencimiento.localeCompare(b.vencimiento));
}
